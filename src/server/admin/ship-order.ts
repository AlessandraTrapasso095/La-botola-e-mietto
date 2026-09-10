import "server-only";

import { getServerAdminUser } from "@/server/admin/admin-user";
import { AuthHttpError } from "@/server/auth/http";
import { createSupabaseAdminClient } from "@/server/supabase-admin";
import { safelySendOrderShippedEmail } from "@/server/email/safe-send";

type ShipOrderInput = {
  orderId: string;
  carrier: string;
  trackingCode: string;
  trackingUrl: string;
};

function normalizeRequiredText(value: string) {
  return value.trim();
}

function validateTrackingUrl(value: string) {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new AuthHttpError(400, "Il link di tracking non è valido.");
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new AuthHttpError(400, "Il link di tracking non è valido.");
  }

  return url.toString();
}

export async function shipAdminOrder({
  orderId,
  carrier,
  trackingCode,
  trackingUrl,
}: ShipOrderInput) {
  const adminUser = await getServerAdminUser();

  if (!adminUser) {
    throw new AuthHttpError(403, "Accesso amministratore richiesto.");
  }

  const normalizedCarrier = normalizeRequiredText(carrier);
  const normalizedTrackingCode = normalizeRequiredText(trackingCode);
  const normalizedTrackingUrl = validateTrackingUrl(trackingUrl);

  if (!normalizedCarrier) {
    throw new AuthHttpError(400, "Inserisci il corriere.");
  }

  if (!normalizedTrackingCode) {
    throw new AuthHttpError(400, "Inserisci il codice tracking.");
  }

  const client = createSupabaseAdminClient();

  const orderResponse = await client
    .from("orders")
    .select(
      `
      id,
      status,
      payment_status,
      cancellation_request_status,
      shipping_method
    `,
    )
    .eq("id", orderId)
    .single();

  if (orderResponse.error || !orderResponse.data) {
    throw new AuthHttpError(404, "Ordine non disponibile.");
  }

  const order = orderResponse.data;

  if (order.shipping_method === "store_pickup") {
    throw new AuthHttpError(
      409,
      "Il tracking è disponibile solo per gli ordini con spedizione.",
    );
  }

  if (order.status === "cancelled") {
    throw new AuthHttpError(409, "Un ordine annullato non può essere spedito.");
  }

  if (order.status !== "preparing") {
    throw new AuthHttpError(
      409,
      "L’ordine deve essere in preparazione prima della spedizione.",
    );
  }

  if (
    order.payment_status !== "paid" &&
    order.payment_status !== "authorized"
  ) {
    throw new AuthHttpError(
      409,
      "L’ordine non può essere spedito finché il pagamento non risulta acquisito o autorizzato.",
    );
  }

  if (order.cancellation_request_status === "pending") {
    throw new AuthHttpError(
      409,
      "Gestisci prima la richiesta di annullamento.",
    );
  }

  const shippedAt = new Date().toISOString();

  const updateResponse = await client
    .from("orders")
    .update({
      status: "shipped",
      shipping_carrier: normalizedCarrier,
      tracking_code: normalizedTrackingCode,
      tracking_url: normalizedTrackingUrl,
      shipped_at: shippedAt,
      updated_at: shippedAt,
    })
    .eq("id", order.id)
    .eq("status", "preparing")
    .select(
      `
      status,
      shipping_carrier,
      tracking_code,
      tracking_url,
      shipped_at
    `,
    )
    .single();

  if (updateResponse.error || !updateResponse.data) {
    throw new AuthHttpError(
      409,
      "Lo stato dell’ordine è cambiato nel frattempo. Aggiorna la pagina e riprova.",
    );
  }

  await safelySendOrderShippedEmail(order.id);

  return {
    status: updateResponse.data.status,
    carrier: updateResponse.data.shipping_carrier,
    trackingCode: updateResponse.data.tracking_code,
    trackingUrl: updateResponse.data.tracking_url,
    shippedAt: updateResponse.data.shipped_at,
  };
}
