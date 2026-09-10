import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("order email integration", () => {
  const checkoutRoute = readFileSync(
    resolve("src/app/api/account/checkout/route.ts"),
    "utf8",
  );

  const stripeWebhook = readFileSync(
    resolve("src/server/stripe/webhook.ts"),
    "utf8",
  );

  const safeSend = readFileSync(
    resolve("src/server/email/safe-send.ts"),
    "utf8",
  );

  it("non invia email Stripe direttamente dal checkout", () => {
    expect(checkoutRoute).toContain('result.paymentMethod !== "stripe"');

    expect(checkoutRoute).toContain("safelySendNewOrderEmails");
  });

  it("invia il bonifico dopo la creazione ordine", () => {
    expect(checkoutRoute).toContain("result.orderId");

    expect(checkoutRoute).toContain('result.paymentMethod !== "stripe"');
  });

  it("invia Stripe solo dopo complete payment", () => {
    expect(stripeWebhook).toContain("complete_stripe_order_payment");

    expect(stripeWebhook).toContain("await safelySendNewOrderEmails(orderId)");
  });

  it("recupera order id dalla sessione Stripe", () => {
    expect(stripeWebhook).toContain("const orderId = getOrderId(session)");
  });

  it("un errore email non fa fallire ordine o pagamento", () => {
    expect(safeSend).toContain("try");

    expect(safeSend).toContain("catch");

    expect(safeSend).toContain("return null");
  });

  it("usa il servizio centralizzato nuovo ordine", () => {
    expect(safeSend).toContain("sendNewOrderEmails");
  });
});
