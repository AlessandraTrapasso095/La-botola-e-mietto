import "server-only";

import { createEmailEventKey } from "@/server/email/event-key";
import { createBrandedEmailMessage } from "@/server/email/message";
import { sendTrackedEmail } from "@/server/email/send";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

type AccountRole = "customer" | "admin";

function siteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!value) {
    throw new Error("NEXT_PUBLIC_SITE_URL non configurato.");
  }

  return value.replace(/\/+$/, "");
}

async function getAccountSecurityData(userId: string) {
  const admin = createSupabaseAdminClient();

  const response = await admin
    .from("profiles")
    .select("id, email, first_name, last_name, role")
    .eq("id", userId)
    .single();

  if (response.error || !response.data?.email) {
    throw new Error(
      response.error?.message ??
        "Profilo non disponibile per la notifica di sicurezza.",
    );
  }

  return {
    id: response.data.id,
    email: response.data.email,
    firstName: response.data.first_name,
    lastName: response.data.last_name,
    role: response.data.role as AccountRole,
  };
}

function displayName(account: {
  firstName: string | null;
  lastName: string | null;
}) {
  return [account.firstName, account.lastName].filter(Boolean).join(" ");
}

export async function sendPasswordChangedEmail(
  userId: string,
  occurrenceId: string,
) {
  const account = await getAccountSecurityData(userId);

  const isAdmin = account.role === "admin";
  const name = displayName(account);

  const message = createBrandedEmailMessage({
    to: account.email,
    subject: isAdmin
      ? "Password amministratore modificata — La Botola e Mietto"
      : "Password modificata — La Botola e Mietto",
    preheader: "La password del tuo account è stata modificata",
    title: "La tua password è stata modificata",
    intro:
      `Ciao ${name || "cliente"}, ` +
      "ti confermiamo che la password del tuo account La Botola e Mietto è stata aggiornata.",
    sections: [
      {
        title: "Sicurezza account",
        content:
          "Se hai effettuato tu questa modifica, non devi fare altro.\n\n" +
          "Se invece non riconosci questa attività, ti consigliamo di reimpostare subito la password e contattarci.",
      },
    ],
    action: {
      label: isAdmin ? "Accedi all'area admin" : "Accedi al tuo account",
      href: isAdmin ? `${siteUrl()}/admin/login` : `${siteUrl()}/accedi`,
    },
    outro:
      "Per motivi di sicurezza, questa email non contiene e non mostrerà mai la tua password.",
  });

  const eventKey = createEmailEventKey({
    eventType: "auth.password_changed",
    entityId: `${account.id}:${occurrenceId}`,
    audience: isAdmin ? "admin" : "customer",
    recipient: account.email,
  });

  return sendTrackedEmail({
    eventKey,
    eventType: "auth.password_changed",
    templateKey: isAdmin
      ? "admin-password-changed"
      : "customer-password-changed",
    message,
    metadata: {
      user_id: account.id,
      role: account.role,
    },
  });
}
export async function sendAdminEmailChangeRequestedEmail({
  userId,
  newEmail,
  occurrenceId,
}: {
  userId: string;
  newEmail: string;
  occurrenceId: string;
}) {
  const account = await getAccountSecurityData(userId);

  if (account.role !== "admin") {
    throw new Error(
      "La notifica di cambio email admin richiede un amministratore.",
    );
  }

  const name = displayName(account);

  const message = createBrandedEmailMessage({
    to: account.email,
    subject: "Richiesta di modifica email — La Botola e Mietto",
    preheader: "È stata richiesta una modifica dell’indirizzo email",
    title: "È stata richiesta una modifica della tua email",
    intro:
      `Ciao ${name || "amministratore"}, ` +
      "abbiamo ricevuto una richiesta di modifica dell’indirizzo email associato al tuo account amministratore.",
    sections: [
      {
        title: "Nuovo indirizzo richiesto",
        content: newEmail,
      },
      {
        title: "Sicurezza account",
        content:
          "La modifica non sarà completata finché non verrà confermata tramite il collegamento inviato da Supabase.\n\n" +
          "Se non hai richiesto tu questa modifica, non confermare il nuovo indirizzo e proteggi immediatamente il tuo account.",
      },
    ],
    action: {
      label: "Accedi all'area admin",
      href: `${siteUrl()}/admin/login`,
    },
  });

  const eventKey = createEmailEventKey({
    eventType: "auth.email_change_requested",
    entityId: `${account.id}:${occurrenceId}`,
    audience: "admin",
    recipient: account.email,
  });

  return sendTrackedEmail({
    eventKey,
    eventType: "auth.email_change_requested",
    templateKey: "admin-email-changed",
    message,
    metadata: {
      user_id: account.id,
      old_email: account.email,
      requested_email: newEmail,
      stage: "requested",
    },
  });
}

export async function sendAdminEmailChangedEmail({
  userId,
  email,
  occurrenceId,
}: {
  userId: string;
  email: string;
  occurrenceId: string;
}) {
  const admin = createSupabaseAdminClient();

  const response = await admin
    .from("profiles")
    .select("id, first_name, last_name, role")
    .eq("id", userId)
    .single();

  if (response.error || !response.data || response.data.role !== "admin") {
    throw new Error(
      response.error?.message ??
        "Profilo amministratore non disponibile per la notifica email.",
    );
  }

  const name = [response.data.first_name, response.data.last_name]
    .filter(Boolean)
    .join(" ");

  const message = createBrandedEmailMessage({
    to: email,
    subject: "Indirizzo email modificato — La Botola e Mietto",
    preheader: "Il nuovo indirizzo email è stato confermato",
    title: "Il tuo indirizzo email è stato modificato",
    intro:
      `Ciao ${name || "amministratore"}, ` +
      "la modifica dell’indirizzo email del tuo account amministratore è stata completata.",
    sections: [
      {
        title: "Nuovo indirizzo email",
        content: email,
      },
      {
        title: "Sicurezza account",
        content:
          "Da questo momento utilizza il nuovo indirizzo email per accedere all’area amministrativa.\n\n" +
          "Se non riconosci questa modifica, reimposta immediatamente la password e contattaci.",
      },
    ],
    action: {
      label: "Accedi all'area admin",
      href: `${siteUrl()}/admin/login`,
    },
  });

  const eventKey = createEmailEventKey({
    eventType: "auth.email_changed",
    entityId: `${userId}:${occurrenceId}`,
    audience: "admin",
    recipient: email,
  });

  return sendTrackedEmail({
    eventKey,
    eventType: "auth.email_changed",
    templateKey: "admin-email-changed",
    message,
    metadata: {
      user_id: userId,
      email,
      stage: "completed",
    },
  });
}
