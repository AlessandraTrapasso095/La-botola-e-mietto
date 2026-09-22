import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("Stripe verified confirmation", () => {
  const page = readFileSync(
    resolve("src/app/(storefront)/checkout/conferma/page.tsx"),
    "utf8",
  );

  const verifier = readFileSync(
    resolve("src/server/stripe/checkout-confirmation.ts"),
    "utf8",
  );

  it("verifica session_id lato server", () => {
    expect(page).toContain("verifyStripeCheckoutConfirmation");
    expect(page).toContain("params.session_id");
    expect(verifier).toContain("checkout.sessions.retrieve");
  });

  it("richiede un utente account autenticato", () => {
    expect(verifier).toContain("getServerAccountUser");
    expect(verifier).toContain("if (!accountUser)");
    expect(verifier).toContain("return invalidConfirmation()");
  });

  it("lega i metadata Stripe all'utente autenticato", () => {
    expect(verifier).toContain("session.metadata?.profile_id");
    expect(verifier).toContain("sessionProfileId !== accountUser.id");
  });

  it("verifica la coerenza del client reference con l'ordine", () => {
    expect(verifier).toContain("session.client_reference_id");
    expect(verifier).toContain("session.client_reference_id !== orderId");
  });

  it("verifica ownership e sessione anche sul database protetto da RLS", () => {
    expect(verifier).toContain('from("orders")');
    expect(verifier).toContain('.eq("id", orderId)');
    expect(verifier).toContain('.eq("profile_id", accountUser.id)');
    expect(verifier).toContain('.eq("payment_method", "stripe")');
    expect(verifier).toContain(
      '.eq("stripe_checkout_session_id", session.id)',
    );
  });

  it("usa il numero ordine verificato dal database", () => {
    expect(verifier).toContain("orderNumber: order.order_number");
    expect(verifier).not.toContain(
      "const orderNumber = session.metadata?.order_number",
    );
  });

  it("considera pagata soltanto una sessione Stripe completa e paid", () => {
    expect(verifier).toContain('session.status === "complete"');
    expect(verifier).toContain('session.payment_status === "paid"');
  });

  it("svuota il carrello soltanto nel ramo pagato", () => {
    const unpaidStart = page.indexOf("if (!confirmation.paid)");
    const clearCartStart = page.indexOf("<StripeConfirmationCartClear />");

    expect(unpaidStart).toBeGreaterThan(-1);
    expect(clearCartStart).toBeGreaterThan(unpaidStart);

    const unpaidBranch = page.slice(unpaidStart, clearCartStart);

    expect(unpaidBranch).not.toContain("<StripeConfirmationCartClear />");
  });

  it("svuota il carrello una sola volta evitando loop React", () => {
    const clearComponent = readFileSync(
      resolve("src/features/checkout/stripe-confirmation-cart-clear.tsx"),
      "utf8",
    );

    expect(clearComponent).toContain("useRef(false)");
    expect(clearComponent).toContain("if (clearedRef.current)");
    expect(clearComponent).toContain("clearedRef.current = true");
    expect(clearComponent).toContain("clearCartAfterCheckout()");
  });

  it("non svuota il carrello per sessione non valida", () => {
    const invalidStart = page.indexOf("if (!confirmation.valid)");
    const unpaidStart = page.indexOf("if (!confirmation.paid)");

    expect(invalidStart).toBeGreaterThan(-1);
    expect(unpaidStart).toBeGreaterThan(invalidStart);

    const invalidBranch = page.slice(invalidStart, unpaidStart);

    expect(invalidBranch).not.toContain("<StripeConfirmationCartClear />");
  });
});
