import "server-only";

import { getServerAdminUser } from "@/server/admin/admin-user";
import { AuthHttpError } from "@/server/auth/http";
import { createSupabaseAdminClient } from "@/server/supabase-admin";
import { getStripeClient } from "@/server/stripe/client";

type ResolveAdminCancellationInput = {
  orderId: string;
  action: "approve" | "reject";
  resolutionNote?: string;
  manualRefundReference?: string;
};

function normalizeOptionalText(value: string | undefined) {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}

async function resolveDatabaseCancellation({
  orderId,
  action,
  refundProvider = null,
  refundReference = null,
  refundAmountMinor = null,
  resolutionNote = null,
}: {
  orderId: string;
  action: "approve" | "reject";
  refundProvider?: string | null;
  refundReference?: string | null;
  refundAmountMinor?: number | null;
  resolutionNote?: string | null;
}) {
  const admin = createSupabaseAdminClient();

  const response = await admin.rpc("resolve_admin_order_cancellation", {
    p_order_id: orderId,
    p_action: action,
    p_refund_provider: refundProvider ?? undefined,
    p_refund_reference: refundReference ?? undefined,
    p_refund_amount_minor: refundAmountMinor ?? undefined,
    p_resolution_note: resolutionNote ?? undefined,
  });

  if (response.error) {
    throw new AuthHttpError(
      409,
      response.error.message ||
        "Risoluzione della richiesta di annullamento non riuscita.",
    );
  }

  return response.data;
}

export async function resolveAdminOrderCancellation({
  orderId,
  action,
  resolutionNote,
  manualRefundReference,
}: ResolveAdminCancellationInput) {
  const adminUser = await getServerAdminUser();

  if (!adminUser) {
    throw new AuthHttpError(403, "Accesso amministratore richiesto.");
  }

  const normalizedNote = normalizeOptionalText(resolutionNote);

  const admin = createSupabaseAdminClient();

  const orderResponse = await admin
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
      stripe_payment_intent_id,
      refund_provider,
      refund_reference,
      refund_amount_minor,
      refunded_at
    `,
    )
    .eq("id", orderId)
    .single();

  if (orderResponse.error || !orderResponse.data) {
    throw new AuthHttpError(404, "Ordine non disponibile.");
  }

  const order = orderResponse.data;

  /*
   * Idempotenza lato applicazione.
   */
  if (
    action === "approve" &&
    order.status === "cancelled" &&
    order.cancellation_request_status === "approved"
  ) {
    return {
      action: "approved" as const,
      alreadyResolved: true,
    };
  }

  if (action === "reject" && order.cancellation_request_status === "rejected") {
    return {
      action: "rejected" as const,
      alreadyResolved: true,
    };
  }

  if (order.cancellation_request_status !== "pending") {
    throw new AuthHttpError(
      409,
      "Non esiste una richiesta di annullamento pendente.",
    );
  }

  if (action === "reject") {
    await resolveDatabaseCancellation({
      orderId: order.id,
      action: "reject",
      resolutionNote: normalizedNote,
    });

    return {
      action: "rejected" as const,
      alreadyResolved: false,
    };
  }

  if (order.status === "shipped" || order.status === "delivered") {
    throw new AuthHttpError(
      409,
      "Un ordine già spedito o consegnato non può essere annullato.",
    );
  }

  if (order.status !== "received" && order.status !== "preparing") {
    throw new AuthHttpError(
      409,
      "Lo stato attuale dell’ordine non consente l’annullamento.",
    );
  }

  /*
   * STRIPE
   *
   * Per Stripe usiamo il PaymentIntent salvato dal webhook.
   * L'idempotency key impedisce doppi rimborsi in caso di retry.
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

    /*
     * Caso normale: pagamento già acquisito.
     */
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
          },
        },
        {
          idempotencyKey: `admin-order-cancellation-refund-${order.id}`,
        },
      );

      if (refund.status === "failed") {
        throw new AuthHttpError(
          502,
          "Stripe non ha completato il rimborso. L’ordine non è stato annullato.",
        );
      }

      await resolveDatabaseCancellation({
        orderId: order.id,
        action: "approve",
        refundProvider: "stripe",
        refundReference: refund.id,
        refundAmountMinor: refund.amount,
        resolutionNote: normalizedNote,
      });

      return {
        action: "approved" as const,
        alreadyResolved: false,
        refundProvider: "stripe",
        refundReference: refund.id,
      };
    }

    /*
     * Eventuale autorizzazione non ancora acquisita:
     * viene stornata anziché creare un refund.
     */
    if (
      order.payment_status === "authorized" &&
      paymentIntent.status === "requires_capture"
    ) {
      const cancelledPaymentIntent = await stripe.paymentIntents.cancel(
        paymentIntent.id,
        {},
        {
          idempotencyKey: `admin-order-cancellation-void-${order.id}`,
        },
      );

      await resolveDatabaseCancellation({
        orderId: order.id,
        action: "approve",
        refundProvider: "stripe_authorization_void",
        refundReference: cancelledPaymentIntent.id,
        refundAmountMinor: Number(order.total_gross_amount_minor),
        resolutionNote: normalizedNote,
      });

      return {
        action: "approved" as const,
        alreadyResolved: false,
        refundProvider: "stripe_authorization_void",
        refundReference: cancelledPaymentIntent.id,
      };
    }

    throw new AuthHttpError(
      409,
      `Lo stato Stripe "${paymentIntent.status}" non consente il rimborso automatico.`,
    );
  }

  /*
   * BONIFICO / SATISPAY
   *
   * Finché non esiste una API refund dedicata, l'admin deve
   * confermare di aver effettuato il rimborso esternamente
   * inserendo un riferimento.
   */
  const normalizedManualReference = normalizeOptionalText(
    manualRefundReference,
  );

  if (!normalizedManualReference) {
    throw new AuthHttpError(
      400,
      "Inserisci il riferimento del rimborso effettuato.",
    );
  }

  await resolveDatabaseCancellation({
    orderId: order.id,
    action: "approve",
    refundProvider:
      order.payment_method === "bank_transfer" ? "bank_transfer" : "satispay",
    refundReference: normalizedManualReference,
    refundAmountMinor: Number(order.total_gross_amount_minor),
    resolutionNote: normalizedNote,
  });

  return {
    action: "approved" as const,
    alreadyResolved: false,
    refundProvider: order.payment_method,
    refundReference: normalizedManualReference,
  };
}
