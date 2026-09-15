import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/server/stripe/order-checkout-session.ts"),
  "utf8",
);

describe("Stripe promotion checkout contract", () => {
  it("legge lo sconto lordo definitivo salvato sull'ordine", () => {
    expect(source).toContain("order.discount_gross_amount_minor ?? 0");

    expect(source).toContain(
      "order.total_gross_amount_minor + discountGrossAmountMinor",
    );
  });

  it("verifica che i line items corrispondano al totale precedente allo sconto", () => {
    expect(source).toContain("calculatedPreDiscountTotal");

    expect(source).toContain(
      "calculatedPreDiscountTotal !== expectedPreDiscountTotal",
    );
  });

  it("crea un coupon Stripe amount_off pari allo sconto DB", () => {
    expect(source).toContain("stripe.coupons.create");

    expect(source).toContain("amount_off: discountGrossAmountMinor");

    expect(source).toContain('duration: "once"');
  });

  it("rende idempotente la creazione del coupon tecnico Stripe", () => {
    expect(source).toContain(
      "checkout-coupon-${order.id}-${discountGrossAmountMinor}",
    );
  });

  it("applica automaticamente il coupon alla Checkout Session", () => {
    expect(source).toContain("discounts:");

    expect(source).toContain("coupon: stripeCouponId");
  });

  it("non richiede alcun coupon Stripe quando l'ordine non ha uno sconto", () => {
    expect(source).toContain("if (discountGrossAmountMinor > 0)");

    expect(source).toContain("let stripeCouponId: string | null = null");
  });

  it("propaga il promotion code nei metadata Stripe", () => {
    expect(source).toContain("promotion_code: order.promotion_code");

    expect(source).toContain(
      "discount_gross_amount_minor: String(discountGrossAmountMinor)",
    );
  });

  it("verifica il totale definitivo restituito dalla Checkout Session", () => {
    expect(source).toContain(
      "session.amount_total !== order.total_gross_amount_minor",
    );

    expect(source).toContain(
      "Il totale Stripe non coincide con il totale definitivo dell’ordine.",
    );
  });

  it("scade la sessione Stripe se il totale finale non coincide", () => {
    const amountCheck = source.indexOf(
      "session.amount_total !== order.total_gross_amount_minor",
    );

    const expireCall = source.indexOf(
      "stripe.checkout.sessions.expire(session.id)",
      amountCheck,
    );

    expect(amountCheck).toBeGreaterThan(-1);
    expect(expireCall).toBeGreaterThan(amountCheck);
  });
});
