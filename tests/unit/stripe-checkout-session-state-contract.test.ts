import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("Stripe checkout previous-session state contract", () => {
  const source = readFileSync(
    resolve("src/server/stripe/order-checkout-session.ts"),
    "utf8",
  );

  it("riutilizza una Checkout Session ancora open", () => {
    expect(source).toContain(
      'if (existingSession.status === "open")',
    );
    expect(source).toContain(
      "sessionId: existingSession.id",
    );
    expect(source).toContain(
      "redirectUrl: existingSession.url",
    );
  });

  it("non crea una nuova sessione se quella precedente è complete", () => {
    expect(source).toContain(
      'if (existingSession.status === "complete")',
    );
    expect(source).toContain(
      '"Il pagamento Stripe è ancora in elaborazione. Attendi la conferma prima di riprovare."',
    );
  });

  it("distingue il caso Stripe già paid", () => {
    expect(source).toContain(
      'existingSession.payment_status === "paid"',
    );
    expect(source).toContain(
      '"Il pagamento Stripe risulta già completato. Aggiorna la pagina."',
    );
  });

  it("consente una nuova Checkout Session solo dopo expiration esplicita", () => {
    expect(source).toContain(
      'if (existingSession.status !== "expired")',
    );

    const expiredGuard = source.indexOf(
      'if (existingSession.status !== "expired")',
    );

    const sessionCreate = source.indexOf(
      "stripe.checkout.sessions.create(",
    );

    expect(expiredGuard).toBeGreaterThan(-1);
    expect(sessionCreate).toBeGreaterThan(expiredGuard);
  });

  it("non trasforma una sessione open senza URL in una seconda sessione", () => {
    expect(source).toContain(
      "La sessione di pagamento Stripe aperta non contiene un URL valido.",
    );
  });

  it("mantiene l'idempotency key legata alla precedente sessione scaduta", () => {
    expect(source).toContain(
      "`checkout-session-${order.id}-after-${previousSessionId}`",
    );
  });
});
