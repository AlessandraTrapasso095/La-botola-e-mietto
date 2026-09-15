"use server";

import { revalidatePath } from "next/cache";

import { getServerAdminUser } from "@/server/admin/admin-user";
import {
  sendPromotionCampaign,
  type PromotionCampaignAudience,
  type PromotionCampaignResult,
} from "@/server/email/promotion";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

export type AdminMarketingRecipient = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  marketingConsent: boolean;
};

export type AdminMarketingRecipientsResult = {
  recipients: AdminMarketingRecipient[];
  totalCustomers: number;
  totalEligible: number;
};

export type SendAdminMarketingCampaignInput = {
  campaignId: string;
  subject: string;
  title: string;
  intro: string;
  content: string;
  ctaLabel?: string;
  ctaHref?: string;
  audience: PromotionCampaignAudience;
};

export type SendAdminMarketingCampaignResult = PromotionCampaignResult & {
  campaignId: string;
  status: "completed" | "completed_with_errors" | "failed";
};

export type AdminMarketingCampaignHistoryItem = {
  id: string;
  campaignId: string;
  subject: string;
  audienceMode: "all" | "selected";
  eligibleCount: number;
  sentCount: number;
  duplicateCount: number;
  failedCount: number;
  status:
    | "draft"
    | "sending"
    | "completed"
    | "completed_with_errors"
    | "failed";
  createdAt: string;
  completedAt: string | null;
};

async function requireAdmin() {
  const admin = await getServerAdminUser();

  if (!admin) {
    throw new Error("Accesso amministratore richiesto.");
  }

  return admin;
}

function escapePostgrestSearch(value: string) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("%", "\\%")
    .replaceAll("_", "\\_")
    .replaceAll(",", "\\,")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

export async function getAdminMarketingRecipients(
  search = "",
): Promise<AdminMarketingRecipientsResult> {
  await requireAdmin();

  const admin = createSupabaseAdminClient();
  const normalizedSearch = search.trim();

  let query = admin
    .from("profiles")
    .select(
      `
        id,
        email,
        first_name,
        last_name,
        phone,
        marketing_consent
      `,
      { count: "exact" },
    )
    .eq("role", "customer")
    .is("deleted_at", null)
    .order("last_name", { ascending: true })
    .order("first_name", { ascending: true });

  if (normalizedSearch) {
    const searchValue = escapePostgrestSearch(normalizedSearch);

    query = query.or(
      [
        `first_name.ilike.%${searchValue}%`,
        `last_name.ilike.%${searchValue}%`,
        `email.ilike.%${searchValue}%`,
        `phone.ilike.%${searchValue}%`,
      ].join(","),
    );
  }

  const response = await query;

  if (response.error) {
    throw new Error(
      `Impossibile caricare i destinatari marketing: ${response.error.message}`,
    );
  }

  const recipients = (response.data ?? []).flatMap((profile) => {
    const email = profile.email?.trim();

    if (!email) {
      return [];
    }

    return [
      {
        id: profile.id,
        email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        marketingConsent: profile.marketing_consent,
      },
    ];
  });

  return {
    recipients,
    totalCustomers: response.count ?? recipients.length,
    totalEligible: recipients.filter((recipient) => recipient.marketingConsent)
      .length,
  };
}

export async function getAdminMarketingCampaignHistory(): Promise<
  AdminMarketingCampaignHistoryItem[]
> {
  await requireAdmin();

  const admin = createSupabaseAdminClient();

  const response = await admin
    .from("email_marketing_campaigns")
    .select(
      `
        id,
        campaign_key,
        subject,
        audience_mode,
        eligible_count,
        sent_count,
        duplicate_count,
        failed_count,
        status,
        created_at,
        completed_at
      `,
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (response.error) {
    throw new Error(
      `Impossibile caricare lo storico campagne: ${response.error.message}`,
    );
  }

  return (response.data ?? []).map((campaign) => ({
    id: campaign.id,
    campaignId: campaign.campaign_key,
    subject: campaign.subject,
    audienceMode: campaign.audience_mode === "selected" ? "selected" : "all",
    eligibleCount: campaign.eligible_count,
    sentCount: campaign.sent_count,
    duplicateCount: campaign.duplicate_count,
    failedCount: campaign.failed_count,
    status:
      campaign.status === "draft" ||
      campaign.status === "sending" ||
      campaign.status === "completed" ||
      campaign.status === "completed_with_errors" ||
      campaign.status === "failed"
        ? campaign.status
        : "failed",
    createdAt: campaign.created_at,
    completedAt: campaign.completed_at,
  }));
}

function normalizeAudience(
  audience: PromotionCampaignAudience,
): PromotionCampaignAudience {
  if (audience.mode === "all") {
    return { mode: "all" };
  }

  return {
    mode: "selected",
    profileIds: [
      ...new Set(
        audience.profileIds
          .map((profileId) => profileId.trim())
          .filter(Boolean),
      ),
    ],
  };
}

function validateCampaignInput(input: SendAdminMarketingCampaignInput) {
  if (!input.campaignId.trim()) {
    throw new Error("Identificativo campagna obbligatorio.");
  }

  if (!input.subject.trim()) {
    throw new Error("Inserisci l’oggetto dell’email.");
  }

  if (!input.title.trim()) {
    throw new Error("Inserisci il titolo dell’email.");
  }

  if (!input.intro.trim()) {
    throw new Error("Inserisci l’introduzione dell’email.");
  }

  if (!input.content.trim()) {
    throw new Error("Inserisci il contenuto dell’email.");
  }

  if (
    input.audience.mode === "selected" &&
    input.audience.profileIds.length === 0
  ) {
    throw new Error("Seleziona almeno un destinatario.");
  }
}

function campaignStatus(
  result: PromotionCampaignResult,
): SendAdminMarketingCampaignResult["status"] {
  if (result.failed === 0) {
    return "completed";
  }

  if (result.sent > 0 || result.duplicate > 0) {
    return "completed_with_errors";
  }

  return "failed";
}

export async function sendAdminMarketingCampaign(
  input: SendAdminMarketingCampaignInput,
): Promise<SendAdminMarketingCampaignResult> {
  await requireAdmin();
  validateCampaignInput(input);

  const admin = createSupabaseAdminClient();
  const campaignId = input.campaignId.trim();
  const audience = normalizeAudience(input.audience);

  if (audience.mode === "selected" && audience.profileIds.length === 0) {
    throw new Error("Seleziona almeno un destinatario.");
  }

  const normalizedInput = {
    subject: input.subject.trim(),
    title: input.title.trim(),
    intro: input.intro.trim(),
    content: input.content.trim(),
    ctaLabel: input.ctaLabel?.trim() || undefined,
    ctaHref: input.ctaHref?.trim() || undefined,
  };

  const startedAt = new Date().toISOString();

  const campaignRecord = await admin
    .from("email_marketing_campaigns")
    .upsert(
      {
        campaign_key: campaignId,
        subject: normalizedInput.subject,
        title: normalizedInput.title,
        intro: normalizedInput.intro,
        content: normalizedInput.content,
        cta_label: normalizedInput.ctaLabel ?? null,
        cta_href: normalizedInput.ctaHref ?? null,
        audience_mode: audience.mode,
        selected_profile_ids:
          audience.mode === "selected" ? audience.profileIds : null,
        eligible_count: 0,
        sent_count: 0,
        duplicate_count: 0,
        failed_count: 0,
        status: "sending",
        started_at: startedAt,
        completed_at: null,
        updated_at: startedAt,
      },
      {
        onConflict: "campaign_key",
      },
    )
    .select("id")
    .single();

  if (campaignRecord.error) {
    throw new Error(
      `Impossibile registrare la campagna: ${campaignRecord.error.message}`,
    );
  }

  try {
    const result = await sendPromotionCampaign({
      campaignId,
      subject: normalizedInput.subject,
      title: normalizedInput.title,
      intro: normalizedInput.intro,
      content: normalizedInput.content,
      ctaLabel: normalizedInput.ctaLabel,
      ctaHref: normalizedInput.ctaHref,
      audience,
    });

    const status = campaignStatus(result);
    const completedAt = new Date().toISOString();

    const update = await admin
      .from("email_marketing_campaigns")
      .update({
        eligible_count: result.eligible,
        sent_count: result.sent,
        duplicate_count: result.duplicate,
        failed_count: result.failed,
        status,
        completed_at: completedAt,
        updated_at: completedAt,
      })
      .eq("campaign_key", campaignId);

    if (update.error) {
      console.error("[email-marketing] storico campagna non aggiornato", {
        campaignId,
        error: update.error.message,
      });
    }

    revalidatePath("/admin/email-marketing");

    return {
      campaignId,
      status,
      ...result,
    };
  } catch (error) {
    const completedAt = new Date().toISOString();

    const failureUpdate = await admin
      .from("email_marketing_campaigns")
      .update({
        status: "failed",
        completed_at: completedAt,
        updated_at: completedAt,
      })
      .eq("campaign_key", campaignId);

    if (failureUpdate.error) {
      console.error(
        "[email-marketing] impossibile marcare la campagna come fallita",
        {
          campaignId,
          error: failureUpdate.error.message,
        },
      );
    }

    revalidatePath("/admin/email-marketing");

    throw error;
  }
}
