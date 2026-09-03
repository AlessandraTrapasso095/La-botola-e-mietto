import {
  stripeCheckoutSessionInputSchema,
  stripeCheckoutSessionResultSchema,
} from "@/lib/validation/checkout";

const genericError = "Non è stato possibile avviare il pagamento Stripe.";

export const stripeCheckoutService = {
  async createSession(orderId: string) {
    const response = await fetch("/api/account/checkout/stripe-session", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(
        stripeCheckoutSessionInputSchema.parse({
          orderId,
        }),
      ),
    });

    const body: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        body &&
        typeof body === "object" &&
        "message" in body &&
        typeof body.message === "string"
          ? body.message
          : genericError;

      throw new Error(message);
    }

    const parsed = stripeCheckoutSessionResultSchema.safeParse(body);

    if (!parsed.success) {
      throw new Error(genericError);
    }

    return parsed.data;
  },
};
