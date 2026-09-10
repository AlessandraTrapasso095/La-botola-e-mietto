import "server-only";

import { getStripeClient } from "@/server/stripe/client";

export type StripeCheckoutConfirmation = {
  valid: boolean;
  paid: boolean;
  orderId: string | null;
  orderNumber: string | null;
};

export async function verifyStripeCheckoutConfirmation(
  sessionId: string | null | undefined,
): Promise<StripeCheckoutConfirmation> {
  if (!sessionId?.trim()) {
    return {
      valid: false,
      paid: false,
      orderId: null,
      orderNumber: null,
    };
  }

  try {
    const session = await getStripeClient().checkout.sessions.retrieve(
      sessionId.trim(),
    );

    const orderId =
      session.metadata?.order_id ?? session.client_reference_id ?? null;

    const orderNumber = session.metadata?.order_number ?? null;

    const paid =
      session.status === "complete" && session.payment_status === "paid";

    return {
      valid: true,
      paid,
      orderId,
      orderNumber,
    };
  } catch {
    return {
      valid: false,
      paid: false,
      orderId: null,
      orderNumber: null,
    };
  }
}
