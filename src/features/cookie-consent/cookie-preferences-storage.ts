import { cookieConsentConfig } from "@/config/consent";

export type CookiePreferenceChoice = "necessary-only" | "all" | "custom";

export type CookiePreferences = {
  choice: CookiePreferenceChoice;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

function isCookiePreferences(value: unknown): value is CookiePreferences {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<CookiePreferences>;

  return (
    (candidate.choice === "necessary-only" ||
      candidate.choice === "all" ||
      candidate.choice === "custom") &&
    typeof candidate.preferences === "boolean" &&
    typeof candidate.analytics === "boolean" &&
    typeof candidate.marketing === "boolean" &&
    typeof candidate.updatedAt === "string"
  );
}

export function readCookiePreferences(
  cookieHeader: string,
): CookiePreferences | null {
  const serialized = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieConsentConfig.cookieName}=`))
    ?.slice(cookieConsentConfig.cookieName.length + 1);

  if (!serialized) return null;

  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(serialized));
    return isCookiePreferences(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

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
