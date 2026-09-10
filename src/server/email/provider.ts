import "server-only";

import { Resend } from "resend";

import type { EmailMessage, EmailSendResult } from "@/server/email/contracts";
import { getEmailConfiguration } from "@/server/email/config";

export function isEmailProviderConfigured() {
  return getEmailConfiguration() !== null;
}

export async function sendEmailMessage(
  message: EmailMessage,
): Promise<EmailSendResult> {
  const configuration = getEmailConfiguration();

  if (!configuration) {
    throw new Error("Provider email non configurato.");
  }

  const resend = new Resend(configuration.apiKey);

  const result = await resend.emails.send({
    from: `${configuration.fromName} <${configuration.fromAddress}>`,
    to: [message.to],
    subject: message.subject,
    html: message.html,
    text: message.text,
  });

  if (result.error) {
    throw new Error(result.error.message || "Invio email non riuscito.");
  }

  if (!result.data?.id) {
    throw new Error("Il provider email non ha restituito un identificativo.");
  }

  return {
    providerMessageId: result.data.id,
  };
}
