import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("Stripe security contract", () => {
  const checkoutRoute = source(
    "src/app/api/account/checkout/stripe-session/route.ts",
  );
  const checkoutSession = source(
    "src/server/stripe/order-checkout-session.ts",
  );
  const confirmation = source(
    "src/server/stripe/checkout-confirmation.ts",
  );
  const webhookRoute = source(
    "src/app/api/stripe/webhook/route.ts",
  );
  const webhook = source("src/server/stripe/webhook.ts");
  const stripeClient = source("src/server/stripe/client.ts");
  const finalization = source(
    "supabase/migrations/0016_stripe_payment_cart_finalization.sql",
  );
  const references = source(
    "supabase/migrations/0013_stripe_order_references.sql",
  );

  it("mantiene le chiavi Stripe esclusivamente server-side", () => {
    expect(stripeClient).toContain("STRIPE_SECRET_KEY");
    expect(stripeClient).toContain('import "server-only"');
  });

  it("protegge la creazione sessione con auth e same-origin", () => {
    expect(checkoutRoute).toContain("requireSupabaseAuthMode()");
    expect(checkoutRoute).toContain("requireSameOrigin(request)");
    expect(checkoutRoute).toContain("auth.getUser()");
  });

  it("lega la sessione all'ordine dell'utente autenticato", () => {
    expect(checkoutSession).toContain('.eq("id", orderId)');
    expect(checkoutSession).toContain('.eq("profile_id", profileId)');
    expect(checkoutSession).toContain("client_reference_id: order.id");
    expect(checkoutSession).toContain("profile_id: order.profile_id");
  });

  it("verifica i totali prima e dopo la creazione Stripe", () => {
    expect(checkoutSession).toContain("calculatedPreDiscountTotal");
    expect(checkoutSession).toContain(
      "calculatedPreDiscountTotal !== expectedPreDiscountTotal",
    );
    expect(checkoutSession).toContain(
      "session.amount_total !== order.total_gross_amount_minor",
    );
  });

  it("usa idempotenza per coupon e checkout session", () => {
    expect(checkoutSession).toContain(
      "checkout-coupon-${order.id}-${discountGrossAmountMinor}",
    );
    expect(checkoutSession).toContain("checkout-session-${order.id}");
  });

  it("verifica ownership anche nella pagina di conferma", () => {
    expect(confirmation).toContain("getServerAccountUser");
    expect(confirmation).toContain('.eq("profile_id", accountUser.id)');
    expect(confirmation).toContain(
      '.eq("stripe_checkout_session_id", session.id)',
    );
  });

  it("considera pagata solo una sessione complete e paid", () => {
    expect(confirmation).toContain('session.status === "complete"');
    expect(confirmation).toContain('session.payment_status === "paid"');
  });

  it("verifica la firma webhook sul raw body", () => {
    expect(webhookRoute).toContain('request.headers.get("stripe-signature")');
    expect(webhookRoute).toContain("await request.text()");
    expect(webhookRoute).toContain("webhooks.constructEvent");
    expect(webhookRoute).toContain("STRIPE_WEBHOOK_SECRET");
  });

  it("finalizza pagamenti solo tramite RPC service-role", () => {
    expect(webhook).toContain("complete_stripe_order_payment");
    expect(webhook).toContain("fail_stripe_order_payment");
    expect(finalization).toContain("security definer");
    expect(finalization).toContain("set search_path = ''");
    expect(finalization).toContain("to service_role;");
  });

  it("impone unicità sui riferimenti Stripe dell'ordine", () => {
    expect(references).toContain(
      "orders_stripe_checkout_session_id_key",
    );
    expect(references).toContain(
      "orders_stripe_payment_intent_id_key",
    );
  });
});
