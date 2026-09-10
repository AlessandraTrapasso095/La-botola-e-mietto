import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("Stripe Klarna checkout", () => {
  const sessionSource = readFileSync(
    resolve("src/server/stripe/order-checkout-session.ts"),
    "utf8",
  );

  const checkoutSource = readFileSync(
    resolve("src/features/checkout/checkout-content.tsx"),
    "utf8",
  );

  it("non forza solo la carta nella Checkout Session", () => {
    expect(sessionSource).not.toContain("payment_method_types");

    expect(sessionSource).not.toContain('["card"]');
  });

  it("lascia i metodi Stripe gestiti dal Dashboard", () => {
    expect(sessionSource).toContain("checkout.sessions.create");

    expect(sessionSource).toContain('mode: "payment"');
  });

  it("comunica Klarna nel checkout cliente", () => {
    expect(checkoutSource).toContain(
      "Carta, Google Pay, Apple Pay, Paypal o a rate con Klarna",
    );

    expect(checkoutSource).toContain("Klarna viene mostrato quando");

    expect(checkoutSource).toContain("disponibile per l’acquisto");
  });

  it("non reintroduce Satispay", () => {
    expect(checkoutSource).not.toContain('value="satispay"');
  });
});
