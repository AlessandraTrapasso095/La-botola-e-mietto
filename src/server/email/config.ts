import "server-only";

import { getServerEnvironment } from "@/server/env";

export type EmailConfiguration = {
  provider: "resend";
  apiKey: string;
  fromAddress: string;
  fromName: string;
};

export function getEmailConfiguration(): EmailConfiguration | null {
  const environment = getServerEnvironment();

  const provider = environment.EMAIL_PROVIDER?.trim().toLowerCase();

  const apiKey = environment.EMAIL_PROVIDER_API_KEY?.trim();

  const fromAddress = environment.EMAIL_FROM_ADDRESS?.trim();

  const fromName = environment.EMAIL_FROM_NAME?.trim() || "La Botola e Mietto";

  if (provider !== "resend" || !apiKey || !fromAddress) {
    return null;
  }

  return {
    provider: "resend",
    apiKey,
    fromAddress,
    fromName,
  };
}
