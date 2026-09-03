import "server-only";

import { cache } from "react";

import { getServerAccountUser } from "@/server/auth/account-user";
import { createSupabaseServerClient } from "@/server/supabase";

export type AccountOrderView = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: "received" | "preparing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "authorized" | "paid" | "failed" | "refunded";
  cancellationRequestStatus: "pending" | "approved" | "rejected" | null;
  paymentMethod: "stripe" | "bank_transfer" | "satispay";
  shippingMethod: "store_pickup" | "tnt";
  totalGrossAmountMinor: number;
  itemCount: number;
  products: readonly {
    id: string;
    name: string;
    code: string;
    quantity: number;
  }[];
};

export const getServerAccountOrders = cache(
  async (): Promise<AccountOrderView[]> => {
    const accountUser = await getServerAccountUser();

    if (!accountUser) {
      return [];
    }

    const client = await createSupabaseServerClient();

    const response = await client
      .from("orders")
      .select(
        `
        id,
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
          product_name,
          product_code,
          quantity
        )
      `,
      )
      .eq("profile_id", accountUser.id)
      .is("hidden_from_customer_at", null)
      .order("created_at", { ascending: false });

    if (response.error) {
      throw new Error("Ordini non disponibili.");
    }

    return response.data.map((order) => ({
      id: order.id,
      orderNumber: order.order_number,
      createdAt: order.created_at,
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
      products: order.order_items.map((item) => ({
        id: item.id,
        name: item.product_name,
        code: item.product_code,
        quantity: item.quantity,
      })),
    }));
  },
);

export type AccountOrderDetailView = Omit<AccountOrderView, "products"> & {
  subtotalNetAmountMinor: number;
  vatAmountMinor: number;
  shippingGrossAmountMinor: number;
  shippingAddress: unknown;
  billingAddress: unknown;
  products: readonly {
    id: string;
    name: string;
    code: string;
    quantity: number;
    unitGrossAmountMinor: number;
    lineGrossAmountMinor: number;
  }[];
};

export async function getServerAccountOrderByNumber(
  orderNumber: string,
): Promise<AccountOrderDetailView | null> {
  const accountUser = await getServerAccountUser();

  if (!accountUser) {
    return null;
  }

  const client = await createSupabaseServerClient();

  const response = await client
    .from("orders")
    .select(
      `
      id,
      order_number,
      created_at,
      status,
      payment_status,
      cancellation_request_status,
      payment_method,
      shipping_method,
      subtotal_net_amount_minor,
      vat_amount_minor,
      shipping_gross_amount_minor,
      total_gross_amount_minor,
      shipping_address,
      billing_address,
      order_items (
        id,
        product_name,
        product_code,
        quantity,
        unit_gross_amount_minor,
        line_gross_amount_minor
      )
    `,
    )
    .eq("profile_id", accountUser.id)
    .eq("order_number", orderNumber)
    .is("hidden_from_customer_at", null)
    .maybeSingle();

  if (response.error) {
    throw new Error("Dettaglio ordine non disponibile.");
  }

  if (!response.data) {
    return null;
  }

  const order = response.data;

  return {
    id: order.id,
    orderNumber: order.order_number,
    createdAt: order.created_at,
    status: order.status,
    paymentStatus: order.payment_status,
    cancellationRequestStatus: order.cancellation_request_status,
    paymentMethod: order.payment_method,
    shippingMethod: order.shipping_method,
    subtotalNetAmountMinor: Number(order.subtotal_net_amount_minor),
    vatAmountMinor: Number(order.vat_amount_minor),
    shippingGrossAmountMinor: Number(order.shipping_gross_amount_minor),
    totalGrossAmountMinor: Number(order.total_gross_amount_minor),
    shippingAddress: order.shipping_address,
    billingAddress: order.billing_address,
    itemCount: order.order_items.reduce(
      (total, item) => total + item.quantity,
      0,
    ),
    products: order.order_items.map((item) => ({
      id: item.id,
      name: item.product_name,
      code: item.product_code,
      quantity: item.quantity,
      unitGrossAmountMinor: Number(item.unit_gross_amount_minor),
      lineGrossAmountMinor: Number(item.line_gross_amount_minor),
    })),
  };
}
