import "server-only";

import { createEmailEventKey } from "@/server/email/event-key";
import { createBrandedEmailMessage } from "@/server/email/message";
import { sendTrackedEmail } from "@/server/email/send";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

function siteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!value) {
    throw new Error("NEXT_PUBLIC_SITE_URL non configurato.");
  }

  return value.replace(/\/+$/, "");
}

export async function sendRegistrationCompletedEmail(userId: string) {
  const admin = createSupabaseAdminClient();

  const response = await admin
    .from("profiles")
    .select("id, email, first_name, last_name, role")
    .eq("id", userId)
    .is("deleted_at", null)
    .single();

  if (response.error || !response.data?.email) {
    throw new Error(
      response.error?.message ??
        "Profilo non disponibile per la conferma registrazione.",
    );
  }

  if (response.data.role !== "customer") {
    return null;
  }

  const name = [response.data.first_name, response.data.last_name]
    .filter(Boolean)
    .join(" ");

  const message = createBrandedEmailMessage({
    to: response.data.email,
    subject: "Registrazione completata — La Botola e Mietto",
    preheader: "Il tuo account è stato attivato",
    title: "Benvenuto su La Botola e Mietto",
    intro:
      `Ciao ${name || "cliente"}, ` +
      "la registrazione del tuo account è stata completata con successo.",
    sections: [
      {
        title: "Il tuo account è attivo",
        content:
          "Da questo momento puoi accedere al tuo profilo, gestire i tuoi dati e seguire i tuoi ordini.",
      },
    ],
    action: {
      label: "Vai al tuo account",
      href: `${siteUrl()}/account`,
    },
    outro: "Grazie per aver scelto La Botola e Mietto.",
  });

  const eventKey = createEmailEventKey({
    eventType: "auth.registration_completed",
    entityId: response.data.id,
    audience: "customer",
    recipient: response.data.email,
  });

  return sendTrackedEmail({
    eventKey,
    eventType: "auth.registration_completed",
    templateKey: "customer-registration-completed",
    message,
    metadata: {
      user_id: response.data.id,
    },
  });
}
