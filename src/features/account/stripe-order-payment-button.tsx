"use client";

import { useState } from "react";

import { stripeCheckoutService } from "@/services/checkout/stripe-checkout-service";

export function StripeOrderPaymentButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePayment() {
    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const session = await stripeCheckoutService.createSession(orderId);
      window.location.assign(session.redirectUrl);
    } catch (paymentError: unknown) {
      setLoading(false);

      setError(
        paymentError instanceof Error
          ? paymentError.message
          : "Non è stato possibile avviare il pagamento.",
      );
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={loading}
        onClick={handlePayment}
        className="border-accent bg-accent inline-flex min-h-12 items-center justify-center border px-7 text-sm font-semibold tracking-[var(--letter-spacing-label)] text-black uppercase disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Apertura pagamento…" : "Completa il pagamento"}
      </button>

      {error ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
