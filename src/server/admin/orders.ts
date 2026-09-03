import "server-only";

import { cache } from "react";

import { getServerAdminUser } from "@/server/admin/admin-user";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

export type AdminOrderStatus =
  | "received"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type AdminPaymentStatus =
  | "pending"
  | "authorized"
  | "paid"
  | "failed"
  | "refunded";

export type AdminCancellationRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | null;

export type AdminPaymentMethod = "stripe" | "bank_transfer" | "satispay";

export type AdminShippingMethod = "store_pickup" | "tnt";

export type AdminOrderCustomer = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type AdminOrderView = {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: AdminOrderCustomer;
  status: AdminOrderStatus;
  paymentStatus: AdminPaymentStatus;
  cancellationRequestStatus: AdminCancellationRequestStatus;
  paymentMethod: AdminPaymentMethod;
  shippingMethod: AdminShippingMethod;
  totalGrossAmountMinor: number;
  itemCount: number;
};

export type AdminOrderDetailView = AdminOrderView & {
  updatedAt: string;
  currency: string;
  subtotalNetAmountMinor: number;
  vatAmountMinor: number;
  shippingGrossAmountMinor: number;
  shippingAddress: unknown;
  billingAddress: unknown;
  paymentProviderReference: string | null;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  cancelledAt: string | null;
  reservationReleasedAt: string | null;
  cancellationRequestedAt: string | null;
  cancellationRequestResolvedAt: string | null;
  products: readonly {
    id: string;
    productId: string | null;
    code: string;
    name: string;
    quantity: number;
    unitNetAmountMinor: number;
    vatRateBasisPoints: number;
    unitGrossAmountMinor: number;
    lineGrossAmountMinor: number;
  }[];
};

async function getProfilesById(
  profileIds: readonly string[],
): Promise<Map<string, AdminOrderCustomer>> {
  const client = createSupabaseAdminClient();

  const profilesById = new Map<string, AdminOrderCustomer>();

  if (profileIds.length === 0) {
    return profilesById;
  }

  const profilesResponse = await client
    .from("profiles")
    .select("id, email, first_name, last_name")
    .in("id", [...profileIds]);

  if (profilesResponse.error) {
    throw new Error(
      `Clienti ordini non disponibili: ${profilesResponse.error.message}`,
    );
  }

  for (const profile of profilesResponse.data) {
    profilesById.set(profile.id, {
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
    });
  }

  return profilesById;
}

function fallbackCustomer(profileId: string): AdminOrderCustomer {
  return {
    id: profileId,
    email: "Cliente non disponibile",
    firstName: "",
    lastName: "",
  };
}

export const getServerAdminOrders = cache(
  async (): Promise<AdminOrderView[]> => {
    const admin = await getServerAdminUser();

    if (!admin) {
      throw new Error("Accesso amministratore richiesto.");
    }

    const client = createSupabaseAdminClient();

    const ordersResponse = await client
      .from("orders")
      .select(
        `
        id,
        profile_id,
        order_number,
        created_at,
        status,
        payment_status,
        cancellation_request_status,
        payment_method,
        shipping_method,
        total_gross_amount_minor,
        order_items (
          id,
          quantity
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (ordersResponse.error) {
      throw new Error(
        `Ordini amministrazione non disponibili: ${ordersResponse.error.message}`,
      );
    }

    const profileIds = Array.from(
      new Set(ordersResponse.data.map((order) => order.profile_id)),
    );

    const profilesById = await getProfilesById(profileIds);

    return ordersResponse.data.map((order) => ({
      id: order.id,
      orderNumber: order.order_number,
      createdAt: order.created_at,
      customer:
        profilesById.get(order.profile_id) ??
        fallbackCustomer(order.profile_id),
      status: order.status,
      paymentStatus: order.payment_status,
      cancellationRequestStatus: order.cancellation_request_status,
      paymentMethod: order.payment_method,
      shippingMethod: order.shipping_method,
      totalGrossAmountMinor: Number(order.total_gross_amount_minor),
      itemCount: order.order_items.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
    }));
  },
);

export async function getServerAdminOrderByNumber(
  orderNumber: string,
): Promise<AdminOrderDetailView | null> {
  const admin = await getServerAdminUser();

  if (!admin) {
    throw new Error("Accesso amministratore richiesto.");
  }

  const client = createSupabaseAdminClient();

  const response = await client
    .from("orders")
    .select(
      `
      id,
      profile_id,
      order_number,
      created_at,
      updated_at,
      status,
      payment_status,
      currency,
      subtotal_net_amount_minor,
      vat_amount_minor,
      shipping_gross_amount_minor,
      total_gross_amount_minor,
      shipping_address,
      billing_address,
      payment_provider_reference,
      cancelled_at,
      shipping_method,
      payment_method,
      stripe_checkout_session_id,
      stripe_payment_intent_id,
      reservation_released_at,
      cancellation_requested_at,
      cancellation_request_status,
      cancellation_request_resolved_at,
      order_items (
        id,
        product_id,
        product_code,
        product_name,
        quantity,
        unit_net_amount_minor,
        vat_rate_basis_points,
        unit_gross_amount_minor,
        line_gross_amount_minor
      )
    `,
    )
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (response.error) {
    throw new Error(
      `Dettaglio ordine amministrazione non disponibile: ${response.error.message}`,
    );
  }

  if (!response.data) {
    return null;
  }

  const order = response.data;

  const profilesById = await getProfilesById([order.profile_id]);

  return {
    id: order.id,
    orderNumber: order.order_number,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    customer:
      profilesById.get(order.profile_id) ?? fallbackCustomer(order.profile_id),
    status: order.status,
    paymentStatus: order.payment_status,
    cancellationRequestStatus: order.cancellation_request_status,
    paymentMethod: order.payment_method,
    shippingMethod: order.shipping_method,
    currency: order.currency,
    subtotalNetAmountMinor: Number(order.subtotal_net_amount_minor),
    vatAmountMinor: Number(order.vat_amount_minor),
    shippingGrossAmountMinor: Number(order.shipping_gross_amount_minor),
    totalGrossAmountMinor: Number(order.total_gross_amount_minor),
    shippingAddress: order.shipping_address,
    billingAddress: order.billing_address,
    paymentProviderReference: order.payment_provider_reference,
    stripeCheckoutSessionId: order.stripe_checkout_session_id,
    stripePaymentIntentId: order.stripe_payment_intent_id,
    cancelledAt: order.cancelled_at,
    reservationReleasedAt: order.reservation_released_at,
    cancellationRequestedAt: order.cancellation_requested_at,
    cancellationRequestResolvedAt: order.cancellation_request_resolved_at,
    itemCount: order.order_items.reduce(
      (total, item) => total + item.quantity,
      0,
    ),
    products: order.order_items.map((item) => ({
      id: item.id,
      productId: item.product_id,
      code: item.product_code,
      name: item.product_name,
      quantity: item.quantity,
      unitNetAmountMinor: Number(item.unit_net_amount_minor),
      vatRateBasisPoints: item.vat_rate_basis_points,
      unitGrossAmountMinor: Number(item.unit_gross_amount_minor),
      lineGrossAmountMinor: Number(item.line_gross_amount_minor),
    })),
  };
}
