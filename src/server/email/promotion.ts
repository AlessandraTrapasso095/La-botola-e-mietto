import "server-only";

import { createEmailEventKey } from "@/server/email/event-key";
import { createBrandedEmailMessage } from "@/server/email/message";
import { sendTrackedEmail } from "@/server/email/send";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

export type PromotionCampaignAudience =
  | {
      mode: "all";
    }
  | {
      mode: "selected";
      profileIds: string[];
    };

export type PromotionCampaignInput = {
  campaignId: string;
  subject: string;
  title: string;
  intro: string;
  content: string;
  ctaLabel?: string;
  ctaHref?: string;
  audience?: PromotionCampaignAudience;
};

export type PromotionCampaignResult = {
  eligible: number;
  sent: number;
  duplicate: number;
  failed: number;
};

function siteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!value) {
    throw new Error("NEXT_PUBLIC_SITE_URL non configurato.");
  }

  return value.replace(/\/+$/, "");
}

async function getMarketingRecipients(
  audience: PromotionCampaignAudience = { mode: "all" },
) {
  const admin = createSupabaseAdminClient();

  let query = admin
    .from("profiles")
    .select("id, email, first_name, last_name")
    .eq("role", "customer")
    .eq("marketing_consent", true)
    .is("deleted_at", null);

  if (audience.mode === "selected") {
    const uniqueProfileIds = [
      ...new Set(
        audience.profileIds
          .map((profileId) => profileId.trim())
          .filter(Boolean),
      ),
    ];

    if (uniqueProfileIds.length === 0) {
      throw new Error("Seleziona almeno un destinatario.");
    }

    query = query.in("id", uniqueProfileIds);
  }

  const response = await query;

  if (response.error) {
    throw new Error(
      `Destinatari marketing non disponibili: ${response.error.message}`,
    );
  }

  const recipients = response.data.filter(
    (
      recipient,
    ): recipient is typeof recipient & {
      email: string;
    } =>
      typeof recipient.email === "string" && recipient.email.trim().length > 0,
  );

  if (audience.mode === "selected" && recipients.length === 0) {
    throw new Error(
      "Nessuno dei destinatari selezionati può ricevere comunicazioni promozionali.",
    );
  }

  return recipients;
}

function customerName(customer: {
  first_name: string | null;
  last_name: string | null;
}) {
  return [customer.first_name, customer.last_name].filter(Boolean).join(" ");
}

function normalizeCampaignId(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error("campaignId obbligatorio.");
  }

  return normalized;
}

export async function sendPromotionCampaign(
  input: PromotionCampaignInput,
): Promise<PromotionCampaignResult> {
  const campaignId = normalizeCampaignId(input.campaignId);
  const recipients = await getMarketingRecipients(
    input.audience ?? { mode: "all" },
  );

  const result: PromotionCampaignResult = {
    eligible: recipients.length,
    sent: 0,
    duplicate: 0,
    failed: 0,
  };

  for (const recipient of recipients) {
    const name = customerName(recipient);

    const message = createBrandedEmailMessage({
      to: recipient.email,
      subject: input.subject,
      preheader: input.intro,
      title: input.title,
      intro: name ? `Ciao ${name}, ${input.intro}` : input.intro,
      sections: [
        {
          title: "La Botola e Mietto",
          content: input.content,
        },
      ],
      action:
        input.ctaLabel && input.ctaHref
          ? {
              label: input.ctaLabel,
              href: input.ctaHref,
            }
          : {
              label: "Scopri la selezione",
              href: siteUrl(),
            },
      outro:
        "Ricevi questa comunicazione perché hai fornito il consenso alle comunicazioni promozionali.",
    });

    const eventKey = createEmailEventKey({
      eventType: "promotion.created",
      entityId: campaignId,
      audience: "customer",
      recipient: recipient.email,
    });

    try {
      const delivery = await sendTrackedEmail({
        eventKey,
        eventType: "promotion.created",
        templateKey: "customer-promotion",
        message,
        metadata: {
          campaign_id: campaignId,
          profile_id: recipient.id,
        },
      });

      if (delivery.duplicate) {
        result.duplicate += 1;
      } else if (delivery.sent) {
        result.sent += 1;
      }
    } catch {
      result.failed += 1;

      console.error("[email] email promozionale non inviata", {
        campaignId,
      });
    }
  }

  return result;
}
