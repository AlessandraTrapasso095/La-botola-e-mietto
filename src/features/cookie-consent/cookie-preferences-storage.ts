import { cookieConsentConfig } from "@/config/consent";

export type CookiePreferenceChoice = "necessary-only" | "all" | "custom";

export type CookiePreferences = {
  choice: CookiePreferenceChoice;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export function serializeCookiePreferences(
  preferences: CookiePreferences,
  secure = false,
): string {
  const value = encodeURIComponent(JSON.stringify(preferences));
  const maxAgeSeconds = cookieConsentConfig.validityDays * 24 * 60 * 60;

  return [
    `${cookieConsentConfig.cookieName}=${value}`,
    `Max-Age=${maxAgeSeconds}`,
    "Path=/",
    "SameSite=Lax",
    secure ? "Secure" : null,
  ]
    .filter(Boolean)
    .join("; ");
}

export function persistCookiePreferences(
  documentTarget: Pick<Document, "cookie">,
  preferences: CookiePreferences,
): void {
  const secure = globalThis.location?.protocol === "https:";
  documentTarget.cookie = serializeCookiePreferences(preferences, secure);
}
