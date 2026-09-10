import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("Stripe checkout flow", () => {
  const checkout = readFileSync(
    resolve("src/features/checkout/checkout-content.tsx"),
    "utf8",
  );

  const confirmation = readFileSync(
    resolve("src/app/(storefront)/checkout/conferma/page.tsx"),
    "utf8",
  );

  const clearCart = readFileSync(
    resolve("src/features/checkout/stripe-confirmation-cart-clear.tsx"),
    "utf8",
  );

  it("non usa più stripeRedirectFailed", () => {
    expect(checkout).not.toContain("stripeRedirectFailed");
  });

  it("in caso di errore Stripe mostra un errore e interrompe il flusso", () => {
    const catchStart = checkout.indexOf("catch (stripeError: unknown)");

    const bankTransferStart = checkout.indexOf(
      'if (result.paymentMethod === "bank_transfer")',
      catchStart,
    );

    expect(catchStart).toBeGreaterThan(-1);
    expect(bankTransferStart).toBeGreaterThan(catchStart);

    const stripeErrorFlow = checkout.slice(catchStart, bankTransferStart);

    expect(stripeErrorFlow).toContain("setRedirectingToPayment(false)");

    expect(stripeErrorFlow).toContain("setError(");

    expect(stripeErrorFlow).toContain("return;");

    expect(stripeErrorFlow).not.toContain("setCompletedOrder");

    expect(stripeErrorFlow).not.toContain("clearCartAfterCheckout");
  });

  it("redirecta soltanto dopo aver creato la sessione Stripe", () => {
    expect(checkout).toContain("stripeCheckoutService.createSession");

    expect(checkout).toContain(
      "window.location.assign(stripeSession.redirectUrl)",
    );
  });

  it("mantiene il clear cart nella conferma Stripe", () => {
    expect(confirmation).toContain("<StripeConfirmationCartClear />");

    expect(clearCart).toContain("clearCartAfterCheckout");
  });
});
