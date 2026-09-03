import "server-only";

import { AuthHttpError } from "@/server/auth/http";
import { createSupabaseServerClient } from "@/server/supabase";
import { getStripeClient } from "@/server/stripe/client";

export type CancelAccountOrderResult = {
  action: "cancelled" | "requested";
};

export async function cancelAccountOrder(
  orderId: string,
): Promise<CancelAccountOrderResult> {
  const client = await createSupabaseServerClient();

  const userResponse = await client.auth.getUser();

  if (userResponse.error || !userResponse.data.user) {
    throw new AuthHttpError(401, "Accesso richiesto.");
  }

  const orderResponse = await client
    .from("orders")
    .select(
      "id, status, payment_status, stripe_checkout_session_id, profile_id, cancellation_request_status",
    )
    .eq("id", orderId)
    .eq("profile_id", userResponse.data.user.id)
    .single();

  if (orderResponse.error || !orderResponse.data) {
    throw new AuthHttpError(404, "Ordine non disponibile.");
  }

  const order = orderResponse.data;

  if (order.status === "cancelled") {
    return {
      action: "cancelled",
    };
  }

  if (order.status === "shipped" || order.status === "delivered") {
    throw new AuthHttpError(
      409,
      "L’ordine è già stato spedito e non può più essere annullato.",
    );
  }

  /*
   * Se non è ancora pagato e c'è una sessione Stripe aperta,
   * la chiudiamo prima di annullare definitivamente l'ordine.
   */
  if (
    order.payment_status !== "paid" &&
    order.payment_status !== "authorized" &&
    order.stripe_checkout_session_id
  ) {
    const stripe = getStripeClient();

    const session = await stripe.checkout.sessions.retrieve(
      order.stripe_checkout_session_id,
    );

    /*
     * Protezione contro la race condition:
     * Stripe potrebbe aver completato il pagamento pochi istanti prima.
     */
    if (session.payment_status === "paid") {
      throw new AuthHttpError(
        409,
        "Il pagamento risulta completato. Aggiorna la pagina e richiedi l’annullamento.",
      );
    }

    if (session.status === "open") {
      await stripe.checkout.sessions.expire(session.id);
    }
  }

  const cancellation = await client.rpc("cancel_account_order", {
    p_order_id: order.id,
  });

  if (cancellation.error) {
    throw new AuthHttpError(
      409,
      cancellation.error.message || "Annullamento ordine non riuscito.",
    );
  }

  return {
    action: cancellation.data === "requested" ? "requested" : "cancelled",
  };
}
