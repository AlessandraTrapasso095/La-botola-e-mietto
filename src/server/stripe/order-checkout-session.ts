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
          name:
            order.shipping_method === "fedex"
              ? "Spedizione FedEx"
              : "Spedizione TNT",
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

    if (existingSession.status === "open") {
      if (!existingSession.url) {
        throw new AuthHttpError(
          502,
          "La sessione di pagamento Stripe aperta non contiene un URL valido.",
        );
      }

      return {
        sessionId: existingSession.id,
        redirectUrl: existingSession.url,
      };
    }

    if (existingSession.status === "complete") {
      throw new AuthHttpError(
        409,
        existingSession.payment_status === "paid"
          ? "Il pagamento Stripe risulta già completato. Aggiorna la pagina."
          : "Il pagamento Stripe è ancora in elaborazione. Attendi la conferma prima di riprovare.",
      );
    }

    if (existingSession.status !== "expired") {
      throw new AuthHttpError(
        502,
        "Lo stato della sessione Stripe precedente non consente di creare un nuovo pagamento.",
      );
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

  const calculatedPreDiscountTotal = lineItems.reduce(
    (total, line) =>
      total + (line.price_data?.unit_amount ?? 0) * (line.quantity ?? 1),
    0,
  );

  const discountGrossAmountMinor = Number(
    order.discount_gross_amount_minor ?? 0,
  );

  const expectedPreDiscountTotal =
    order.total_gross_amount_minor + discountGrossAmountMinor;

  if (calculatedPreDiscountTotal !== expectedPreDiscountTotal) {
    throw new AuthHttpError(
      500,
      "Il totale dell’ordine non coincide con il totale del pagamento.",
    );
  }

  const stripe = getStripeClient();

  let stripeCouponId: string | null = null;

  if (discountGrossAmountMinor > 0) {
    if (!order.promotion_code) {
      throw new AuthHttpError(
        500,
        "Lo sconto dell’ordine non contiene un codice promozionale valido.",
      );
    }

    const coupon = await stripe.coupons.create(
      {
        amount_off: discountGrossAmountMinor,
        currency: order.currency.toLowerCase(),
        duration: "once",
        name: `Codice ${order.promotion_code}`,
        metadata: {
          order_id: order.id,
          order_number: order.order_number,
          promotion_code: order.promotion_code,
        },
      },
      {
        idempotencyKey: `checkout-coupon-${order.id}-${discountGrossAmountMinor}`,
      },
    );

    stripeCouponId = coupon.id;
  }

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      line_items: lineItems,
      ...(stripeCouponId
        ? {
            discounts: [
              {
                coupon: stripeCouponId,
              },
            ],
          }
        : {}),
      success_url: `${origin}/checkout/conferma?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/annullato?order_id=${encodeURIComponent(
        order.id,
      )}`,
      client_reference_id: order.id,
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
        profile_id: order.profile_id,
        ...(order.promotion_code
          ? {
              promotion_code: order.promotion_code,
              discount_gross_amount_minor: String(discountGrossAmountMinor),
            }
          : {}),
      },
      payment_intent_data: {
        metadata: {
          order_id: order.id,
          order_number: order.order_number,
          profile_id: order.profile_id,
          ...(order.promotion_code
            ? {
                promotion_code: order.promotion_code,
                discount_gross_amount_minor: String(discountGrossAmountMinor),
              }
            : {}),
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

  if (session.amount_total !== order.total_gross_amount_minor) {
    try {
      await stripe.checkout.sessions.expire(session.id);
    } catch {
      // La sessione scadrà comunque automaticamente.
    }

    throw new AuthHttpError(
      502,
      "Il totale Stripe non coincide con il totale definitivo dell’ordine.",
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
