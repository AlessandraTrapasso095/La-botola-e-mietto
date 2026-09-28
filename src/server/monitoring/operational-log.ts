import "server-only";

export type OperationalEvent =
  | "stripe.webhook.signature_invalid"
  | "stripe.webhook.processing_failed";

export function logOperationalError(event: OperationalEvent) {
  console.error("[operational]", {
    event,
  });
}
