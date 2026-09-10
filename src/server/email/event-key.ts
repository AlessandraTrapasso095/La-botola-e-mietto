import type { EmailAudience, EmailEventType } from "@/server/email/contracts";

function sanitizePart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._:@-]+/g, "-");
}

export function createEmailEventKey({
  eventType,
  entityId,
  audience,
  recipient,
}: {
  eventType: EmailEventType;
  entityId: string;
  audience: EmailAudience;
  recipient: string;
}) {
  return [
    sanitizePart(eventType),
    sanitizePart(entityId),
    sanitizePart(audience),
    sanitizePart(recipient),
  ].join(":");
}
