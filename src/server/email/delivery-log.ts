import "server-only";

import type {
  EmailDeliveryReservation,
  EmailDeliveryStatus,
  EmailEventType,
  EmailTemplateKey,
} from "@/server/email/contracts";
import type { Json } from "@/types/database.generated";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

export async function reserveEmailDelivery({
  eventKey,
  eventType,
  templateKey,
  recipientEmail,
  metadata = {},
}: {
  eventKey: string;
  eventType: EmailEventType;
  templateKey: EmailTemplateKey;
  recipientEmail: string;
  metadata?: Json;
}): Promise<EmailDeliveryReservation> {
  const admin = createSupabaseAdminClient();

  const existing = await admin
    .from("email_deliveries")
    .select("id, event_key, status")
    .eq("event_key", eventKey)
    .maybeSingle();

  if (existing.error) {
    throw new Error(
      `Registro email non disponibile: ${existing.error.message}`,
    );
  }

  if (existing.data) {
    return {
      id: existing.data.id,
      eventKey: existing.data.event_key,
      alreadyExists: true,
      status: existing.data.status as EmailDeliveryStatus,
    };
  }

  const inserted = await admin
    .from("email_deliveries")
    .insert({
      event_key: eventKey,
      event_type: eventType,
      template_key: templateKey,
      recipient_email: recipientEmail.trim().toLowerCase(),
      status: "pending",
      attempt_count: 0,
      metadata,
    })
    .select("id, event_key, status")
    .single();

  if (inserted.error || !inserted.data) {
    /*
     * Una chiamata concorrente potrebbe avere creato
     * la stessa event_key tra SELECT e INSERT.
     */
    const concurrent = await admin
      .from("email_deliveries")
      .select("id, event_key, status")
      .eq("event_key", eventKey)
      .maybeSingle();

    if (concurrent.data) {
      return {
        id: concurrent.data.id,
        eventKey: concurrent.data.event_key,
        alreadyExists: true,
        status: concurrent.data.status as EmailDeliveryStatus,
      };
    }

    throw new Error(
      inserted.error?.message ?? "Prenotazione email non riuscita.",
    );
  }

  return {
    id: inserted.data.id,
    eventKey: inserted.data.event_key,
    alreadyExists: false,
    status: inserted.data.status as EmailDeliveryStatus,
  };
}

export async function markEmailDeliverySent({
  deliveryId,
  providerMessageId,
}: {
  deliveryId: string;
  providerMessageId: string;
}) {
  const admin = createSupabaseAdminClient();

  const now = new Date().toISOString();

  const response = await admin
    .from("email_deliveries")
    .update({
      status: "sent",
      provider_message_id: providerMessageId,
      attempt_count: 1,
      sent_at: now,
      failed_at: null,
      last_error: null,
      updated_at: now,
    })
    .eq("id", deliveryId)
    .select("id")
    .single();

  if (response.error || !response.data) {
    throw new Error("Registrazione invio email non riuscita.");
  }
}

export async function markEmailDeliveryFailed({
  deliveryId,
  errorMessage,
}: {
  deliveryId: string;
  errorMessage: string;
}) {
  const admin = createSupabaseAdminClient();

  const now = new Date().toISOString();

  const current = await admin
    .from("email_deliveries")
    .select("attempt_count")
    .eq("id", deliveryId)
    .single();

  if (current.error || !current.data) {
    throw new Error("Registro tentativi email non disponibile.");
  }

  const response = await admin
    .from("email_deliveries")
    .update({
      status: "failed",
      attempt_count: current.data.attempt_count + 1,
      failed_at: now,
      last_error: errorMessage.slice(0, 2000),
      updated_at: now,
    })
    .eq("id", deliveryId)
    .select("id")
    .single();

  if (response.error || !response.data) {
    throw new Error("Registrazione errore email non riuscita.");
  }
}

export async function markEmailDeliverySkipped({
  deliveryId,
  reason,
}: {
  deliveryId: string;
  reason: string;
}) {
  const admin = createSupabaseAdminClient();

  const now = new Date().toISOString();

  const response = await admin
    .from("email_deliveries")
    .update({
      status: "skipped",
      last_error: reason.slice(0, 2000),
      updated_at: now,
    })
    .eq("id", deliveryId)
    .select("id")
    .single();

  if (response.error || !response.data) {
    throw new Error("Registrazione email ignorata non riuscita.");
  }
}
