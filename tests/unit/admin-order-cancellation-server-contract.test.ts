import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("contratto cancellation/refund admin", () => {
  const source = readFileSync(
    resolve("src/server/admin/resolve-order-cancellation.ts"),
    "utf8",
  );

  it("richiede sessione amministratore", () => {
    expect(source).toContain("getServerAdminUser");
    expect(source).toContain("Accesso amministratore richiesto.");
  });

  it("gestisce Stripe tramite PaymentIntent", () => {
    expect(source).toContain("stripe.paymentIntents.retrieve");
    expect(source).toContain("order.stripe_payment_intent_id");
  });

  it("usa refund Stripe idempotente", () => {
    expect(source).toContain("stripe.refunds.create");
    expect(source).toContain("admin-order-cancellation-refund-${order.id}");
  });

  it("gestisce autorizzazione Stripe tramite void", () => {
    expect(source).toContain('paymentIntent.status === "requires_capture"');
    expect(source).toContain("stripe.paymentIntents.cancel");
  });

  it("non annulla ordini spediti o consegnati", () => {
    expect(source).toContain('order.status === "shipped"');
    expect(source).toContain('order.status === "delivered"');
  });

  it("richiede riferimento manuale fuori da Stripe", () => {
    expect(source).toContain("manualRefundReference");
    expect(source).toContain(
      "Inserisci il riferimento del rimborso effettuato.",
    );
  });

  it("finalizza tramite RPC atomica", () => {
    expect(source).toContain("resolve_admin_order_cancellation");
  });
});
