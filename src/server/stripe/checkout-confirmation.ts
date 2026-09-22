import "server-only";

import { getServerAccountUser } from "@/server/auth/account-user";
import { createSupabaseServerClient } from "@/server/supabase";
import { getStripeClient } from "@/server/stripe/client";

export type StripeCheckoutConfirmation = {
  valid: boolean;
  paid: boolean;
  orderId: string | null;
  orderNumber: string | null;
};

function invalidConfirmation(): StripeCheckoutConfirmation {
  return {
    valid: false,
    paid: false,
    orderId: null,
    orderNumber: null,
  };
}

export async function verifyStripeCheckoutConfirmation(
  sessionId: string | null | undefined,
): Promise<StripeCheckoutConfirmation> {
  const normalizedSessionId = sessionId?.trim();

  if (!normalizedSessionId) {
    return invalidConfirmation();
  }

  try {
    const accountUser = await getServerAccountUser();

    if (!accountUser) {
      return invalidConfirmation();
    }

    const session = await getStripeClient().checkout.sessions.retrieve(
      normalizedSessionId,
    );

    const orderId =
      session.metadata?.order_id ?? session.client_reference_id ?? null;

    if (!orderId) {
      return invalidConfirmation();
    }

    const sessionProfileId = session.metadata?.profile_id ?? null;

    if (sessionProfileId && sessionProfileId !== accountUser.id) {
      return invalidConfirmation();
    }

    if (
      session.client_reference_id &&
      session.client_reference_id !== orderId
    ) {
      return invalidConfirmation();
    }

    const client = await createSupabaseServerClient();

    const orderResponse = await client
      .from("orders")
      .select(
        "id, order_number, profile_id, payment_method, stripe_checkout_session_id",
      )
      .eq("id", orderId)
      .eq("profile_id", accountUser.id)
      .eq("payment_method", "stripe")
      .eq("stripe_checkout_session_id", session.id)
      .maybeSingle();

    if (orderResponse.error || !orderResponse.data) {
      return invalidConfirmation();
    }

    const order = orderResponse.data;

    const paid =
      session.status === "complete" && session.payment_status === "paid";

    return {
      valid: true,
      paid,
      orderId: order.id,
      orderNumber: order.order_number,
    };
  } catch {
    return invalidConfirmation();
  }
}
