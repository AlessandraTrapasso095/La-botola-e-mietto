import { ageGateConfig } from "@/config/consent";

const millisecondsPerDay = 24 * 60 * 60 * 1_000;

export function createAgeConfirmationExpiry(
  now = Date.now(),
  validityDays = ageGateConfig.validityDays,
): number {
  return now + validityDays * millisecondsPerDay;
}

export function isAgeConfirmationValueValid(
  value: string | undefined,
  now = Date.now(),
): boolean {
  if (!value) return false;

  const expiry = Number(value);

  return Number.isSafeInteger(expiry) && expiry > now;
}

export function serializeAgeConfirmation(
  now = Date.now(),
  secure = false,
): string {
  const expiry = createAgeConfirmationExpiry(now);
  const maxAgeSeconds = ageGateConfig.validityDays * 24 * 60 * 60;

  return [
    `${ageGateConfig.cookieName}=${expiry}`,
    `Max-Age=${maxAgeSeconds}`,
    "Path=/",
    "SameSite=Lax",
    secure ? "Secure" : null,
  ]
    .filter(Boolean)
    .join("; ");
}

export function persistAgeConfirmation(
  documentTarget: Pick<Document, "cookie">,
  now = Date.now(),
): void {
  const secure = globalThis.location?.protocol === "https:";
  documentTarget.cookie = serializeAgeConfirmation(now, secure);
}

export function clearAgeConfirmation(
  documentTarget: Pick<Document, "cookie">,
): void {
  const secure = globalThis.location?.protocol === "https:";
  documentTarget.cookie = [
    `${ageGateConfig.cookieName}=`,
    "Max-Age=0",
    "Path=/",
    "SameSite=Lax",
    secure ? "Secure" : null,
  ]
    .filter(Boolean)
    .join("; ");
}
