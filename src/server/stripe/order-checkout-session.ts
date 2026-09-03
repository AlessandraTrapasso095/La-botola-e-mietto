import "server-only";

import type Stripe from "stripe";

import { AuthHttpError } from "@/server/auth/http";
import { createSupabaseAdminClient } from "@/server/supabase-admin";
import { getStripeClient } from "@/server/stripe/client";
import type { Database } from "@/types/database.generated";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];

type StripeCheckoutSessionResult = {
  sessionId: string;
  redirectUrl: string;
};

function createLineItems(
  order: OrderRow,
  items: readonly OrderItemRow[],
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
    (item) => ({
      quantity: item.quantity,
      price_data: {
        currency: order.currency.toLowerCase(),
        unit_amount: item.unit_gross_amount_minor,
        product_data: {
          name: item.product_name,
          metadata: {
            product_code: item.product_code,
            order_item_id: item.id,
          },
        },
      },
    }),
  );

  if (order.shipping_gross_amount_minor > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: order.currency.toLowerCase(),
        unit_amount: order.shipping_gross_amount_minor,
        product_data: {
          name: "Spedizione TNT",
        },
      },
    });
  }

  return lineItems;
}

export async function createOrderStripeCheckoutSession({
  orderId,
  profileId,
  origin,
}: {
  orderId: string;
  profileId: string;
  origin: string;
}): Promise<StripeCheckoutSessionResult> {
  const admin = createSupabaseAdminClient();

  const orderResponse = await admin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("profile_id", profileId)
    .single();

  if (orderResponse.error || !orderResponse.data) {
    throw new AuthHttpError(404, "Ordine non disponibile.");
  }

  const order = orderResponse.data;

  if (order.payment_method !== "stripe") {
    throw new AuthHttpError(
      400,
      "L’ordine non prevede il pagamento tramite Stripe.",
    );
  }

  if (order.payment_status === "paid") {
    throw new AuthHttpError(409, "Questo ordine risulta già pagato.");
  }

  if (order.status === "cancelled") {
    throw new AuthHttpError(409, "Questo ordine è stato annullato.");
  }

  let previousSessionId: string | null = null;

  if (order.stripe_checkout_session_id) {
    previousSessionId = order.stripe_checkout_session_id;

    const existingSession = await getStripeClient().checkout.sessions.retrieve(
      order.stripe_checkout_session_id,
    );

    if (existingSession.status === "open" && existingSession.url) {
      return {
        sessionId: existingSession.id,
        redirectUrl: existingSession.url,
      };
    }
  }

  const itemsResponse = await admin
    .from("order_items")
    .select("*")
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  if (itemsResponse.error || !itemsResponse.data?.length) {
    throw new AuthHttpError(500, "Le righe dell’ordine non sono disponibili.");
  }

  const lineItems = createLineItems(order, itemsResponse.data);

  const calculatedTotal = lineItems.reduce(
    (total, line) =>
      total + (line.price_data?.unit_amount ?? 0) * (line.quantity ?? 1),
    0,
  );

  if (calculatedTotal !== order.total_gross_amount_minor) {
    throw new AuthHttpError(
      500,
      "Il totale dell’ordine non coincide con il totale del pagamento.",
    );
  }

  const stripe = getStripeClient();

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/checkout/conferma?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/annullato?order_id=${encodeURIComponent(
        order.id,
      )}`,
      client_reference_id: order.id,
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
        profile_id: order.profile_id,
      },
      payment_intent_data: {
        metadata: {
          order_id: order.id,
          order_number: order.order_number,
          profile_id: order.profile_id,
        },
      },
      locale: "it",
    },
    {
      idempotencyKey: previousSessionId
        ? `checkout-session-${order.id}-after-${previousSessionId}`
        : `checkout-session-${order.id}`,
    },
  );

  if (!session.url) {
    throw new AuthHttpError(
      502,
      "Stripe non ha restituito una pagina di pagamento valida.",
    );
  }

  const updateResponse = await admin
    .from("orders")
    .update({
      stripe_checkout_session_id: session.id,
      payment_provider_reference: session.id,
    })
    .eq("id", order.id)
    .eq("profile_id", profileId);

  if (updateResponse.error) {
    try {
      await stripe.checkout.sessions.expire(session.id);
    } catch {
      // La sessione scadrà comunque automaticamente.
    }

    throw new AuthHttpError(
      500,
      "Non è stato possibile collegare il pagamento all’ordine.",
    );
  }

  return {
    sessionId: session.id,
    redirectUrl: session.url,
  };
}
