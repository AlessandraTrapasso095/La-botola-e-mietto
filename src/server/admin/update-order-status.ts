import "server-only";

import { AuthHttpError } from "@/server/auth/http";
import { getServerAdminUser } from "@/server/admin/admin-user";
import { createSupabaseAdminClient } from "@/server/supabase-admin";
import type { AdminOrderStatus } from "@/server/admin/orders";

const allowedTransitions: Record<
  Exclude<AdminOrderStatus, "cancelled">,
  readonly AdminOrderStatus[]
> = {
  received: ["preparing"],
  preparing: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
};

export async function updateAdminOrderStatus({
  orderId,
  nextStatus,
}: {
  orderId: string;
  nextStatus: AdminOrderStatus;
}) {
  const adminUser = await getServerAdminUser();

  if (!adminUser) {
    throw new AuthHttpError(403, "Accesso amministratore richiesto.");
  }

  if (nextStatus === "cancelled") {
    throw new AuthHttpError(
      400,
      "L’annullamento deve essere gestito tramite il flusso dedicato.",
    );
  }

  const client = createSupabaseAdminClient();

  const orderResponse = await client
    .from("orders")
    .select("id, status, payment_status, cancellation_request_status")
    .eq("id", orderId)
    .single();

  if (orderResponse.error || !orderResponse.data) {
    throw new AuthHttpError(404, "Ordine non disponibile.");
  }

  const order = orderResponse.data;

  if (order.status === "cancelled") {
    throw new AuthHttpError(409, "Un ordine annullato non può cambiare stato.");
  }

  if (order.status === nextStatus) {
    return {
      status: order.status,
    };
  }

  const validNextStatuses =
    allowedTransitions[
      order.status as Exclude<AdminOrderStatus, "cancelled">
    ] ?? [];

  if (!validNextStatuses.includes(nextStatus)) {
    throw new AuthHttpError(
      409,
      `Transizione non consentita da "${order.status}" a "${nextStatus}".`,
    );
  }

  if (
    nextStatus === "shipped" &&
    order.payment_status !== "paid" &&
    order.payment_status !== "authorized"
  ) {
    throw new AuthHttpError(
      409,
      "L’ordine non può essere spedito finché il pagamento non risulta acquisito o autorizzato.",
    );
  }

  if (
    order.cancellation_request_status === "pending" &&
    (nextStatus === "shipped" || nextStatus === "delivered")
  ) {
    throw new AuthHttpError(
      409,
      "È presente una richiesta di annullamento da gestire prima di proseguire.",
    );
  }

  const updateResponse = await client
    .from("orders")
    .update({
      status: nextStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", order.id)
    .eq("status", order.status)
    .select("status")
    .single();

  if (updateResponse.error || !updateResponse.data) {
    throw new AuthHttpError(
      409,
      "Lo stato dell’ordine è cambiato nel frattempo. Aggiorna la pagina e riprova.",
    );
  }

  return {
    status: updateResponse.data.status,
  };
}
