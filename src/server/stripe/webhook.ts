import "server-only";

import type Stripe from "stripe";

import { createSupabaseAdminClient } from "@/server/supabase-admin";

function getOrderId(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.order_id;

  if (!orderId) {
    throw new Error("Evento Stripe senza order_id.");
  }

  return orderId;
}

function getPaymentIntentId(session: Stripe.Checkout.Session) {
  if (typeof session.payment_intent === "string") {
    return session.payment_intent;
  }

  return session.payment_intent?.id ?? session.id;
}

async function completePayment(session: Stripe.Checkout.Session) {
  const admin = createSupabaseAdminClient();

  const { error } = await admin.rpc("complete_stripe_order_payment", {
    p_order_id: getOrderId(session),
    p_checkout_session_id: session.id,
    p_payment_intent_id: getPaymentIntentId(session),
  });

  if (error) {
    throw new Error(`Conferma pagamento Stripe non riuscita: ${error.message}`);
  }
}

async function failPayment(session: Stripe.Checkout.Session) {
  const admin = createSupabaseAdminClient();

  const { error } = await admin.rpc("fail_stripe_order_payment", {
    p_order_id: getOrderId(session),
    p_checkout_session_id: session.id,
  });

  if (error) {
    throw new Error(
      `Gestione pagamento Stripe fallito non riuscita: ${error.message}`,
    );
  }
}

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      if (session.payment_status === "paid") {
        await completePayment(session);
      }

      return;
    }

    case "checkout.session.async_payment_succeeded":
      await completePayment(event.data.object);
      return;

    case "checkout.session.async_payment_failed":
    case "checkout.session.expired":
      await failPayment(event.data.object);
      return;

    default:
      return;
  }
}
