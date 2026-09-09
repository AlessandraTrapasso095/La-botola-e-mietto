import "server-only";

import { getServerAdminUser } from "@/server/admin/admin-user";
import { AuthHttpError } from "@/server/auth/http";
import { createSupabaseAdminClient } from "@/server/supabase-admin";
import { getStripeClient } from "@/server/stripe/client";

type CancelAdminReceivedOrderInput = {
  orderId: string;
  customerNote: string;
  manualRefundReference?: string;
};

function normalize(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

async function finalizeCancellation({
  orderId,
  customerNote,
  refundProvider,
  refundReference,
  refundAmountMinor,
}: {
  orderId: string;
  customerNote: string;
  refundProvider?: string;
  refundReference?: string;
  refundAmountMinor?: number;
}) {
  const admin = createSupabaseAdminClient();

  const response = await admin.rpc("cancel_admin_received_order", {
    p_order_id: orderId,
    p_customer_note: customerNote,
    p_refund_provider: refundProvider,
    p_refund_reference: refundReference,
    p_refund_amount_minor: refundAmountMinor,
  });

  if (response.error) {
    throw new AuthHttpError(
      409,
      response.error.message || "Annullamento ordine non riuscito.",
    );
  }

  return response.data;
}

export async function cancelAdminReceivedOrder({
  orderId,
  customerNote,
  manualRefundReference,
}: CancelAdminReceivedOrderInput) {
  const adminUser = await getServerAdminUser();

  if (!adminUser) {
    throw new AuthHttpError(403, "Accesso amministratore richiesto.");
  }

  const note = normalize(customerNote);

  if (!note) {
    throw new AuthHttpError(400, "Inserisci una motivazione per il cliente.");
  }

  const admin = createSupabaseAdminClient();

  const response = await admin
    .from("orders")
    .select(
      `
      id,
      order_number,
      status,
      payment_status,
      payment_method,
      cancellation_request_status,
      total_gross_amount_minor,
      stripe_checkout_session_id,
      stripe_payment_intent_id
    `,
    )
    .eq("id", orderId)
    .single();

  if (response.error || !response.data) {
    throw new AuthHttpError(404, "Ordine non disponibile.");
  }

  const order = response.data;

  if (order.status === "cancelled") {
    return {
      status: "cancelled" as const,
      alreadyCancelled: true,
    };
  }

  if (order.status !== "received") {
    throw new AuthHttpError(
      409,
      "Solo un ordine ricevuto può essere annullato direttamente.",
    );
  }

  if (order.cancellation_request_status === "pending") {
    throw new AuthHttpError(
      409,
      "È già presente una richiesta di annullamento del cliente. Gestiscila tramite il flusso dedicato.",
    );
  }

  /*
   * ORDINE NON PAGATO
   *
   * Se esiste una Checkout Session Stripe ancora aperta,
   * la chiudiamo prima dell'annullamento.
   */
  if (
    order.payment_status !== "paid" &&
    order.payment_status !== "authorized"
  ) {
    if (order.payment_method === "stripe" && order.stripe_checkout_session_id) {
      const stripe = getStripeClient();

      const session = await stripe.checkout.sessions.retrieve(
        order.stripe_checkout_session_id,
      );

      if (session.payment_status === "paid") {
        throw new AuthHttpError(
          409,
          "Stripe segnala il pagamento come completato. Aggiorna la pagina prima di annullare.",
        );
      }

      if (session.status === "open") {
        await stripe.checkout.sessions.expire(session.id);
      }
    }

    await finalizeCancellation({
      orderId: order.id,
      customerNote: note,
    });

    return {
      status: "cancelled" as const,
      alreadyCancelled: false,
      refunded: false,
    };
  }

  /*
   * PAGAMENTO STRIPE
   */
  if (order.payment_method === "stripe") {
    if (!order.stripe_payment_intent_id) {
      throw new AuthHttpError(
        409,
        "Riferimento Stripe del pagamento non disponibile.",
      );
    }

    const stripe = getStripeClient();

    const paymentIntent = await stripe.paymentIntents.retrieve(
      order.stripe_payment_intent_id,
    );

    if (
      order.payment_status === "paid" ||
      paymentIntent.status === "succeeded"
    ) {
      const refund = await stripe.refunds.create(
        {
          payment_intent: paymentIntent.id,
          reason: "requested_by_customer",
          metadata: {
            order_id: order.id,
            order_number: order.order_number,
            cancelled_by: "admin",
          },
        },
        {
          idempotencyKey: `admin-direct-order-cancellation-refund-${order.id}`,
        },
      );

      if (refund.status === "failed") {
        throw new AuthHttpError(
          502,
          "Stripe non ha completato il rimborso. L’ordine non è stato annullato.",
        );
      }

      await finalizeCancellation({
        orderId: order.id,
        customerNote: note,
        refundProvider: "stripe",
        refundReference: refund.id,
        refundAmountMinor: refund.amount,
      });

      return {
        status: "cancelled" as const,
        alreadyCancelled: false,
        refunded: true,
      };
    }

    if (
      order.payment_status === "authorized" &&
      paymentIntent.status === "requires_capture"
    ) {
      const cancelled = await stripe.paymentIntents.cancel(
        paymentIntent.id,
        {},
        {
          idempotencyKey: `admin-direct-order-cancellation-void-${order.id}`,
        },
      );

      await finalizeCancellation({
        orderId: order.id,
        customerNote: note,
        refundProvider: "stripe_authorization_void",
        refundReference: cancelled.id,
        refundAmountMinor: Number(order.total_gross_amount_minor),
      });

      return {
        status: "cancelled" as const,
        alreadyCancelled: false,
        refunded: true,
      };
    }

    throw new AuthHttpError(
      409,
      `Lo stato Stripe "${paymentIntent.status}" non consente l’annullamento automatico.`,
    );
  }

  /*
   * BONIFICO / SATISPAY GIÀ PAGATI
   */
  const manualReference = normalize(manualRefundReference);

  if (!manualReference) {
    throw new AuthHttpError(
      400,
      "Inserisci il riferimento del rimborso effettuato.",
    );
  }

  await finalizeCancellation({
    orderId: order.id,
    customerNote: note,
    refundProvider:
      order.payment_method === "bank_transfer" ? "bank_transfer" : "satispay",
    refundReference: manualReference,
    refundAmountMinor: Number(order.total_gross_amount_minor),
  });

  return {
    status: "cancelled" as const,
    alreadyCancelled: false,
    refunded: true,
  };
}
