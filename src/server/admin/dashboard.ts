import "server-only";

import { cache } from "react";

import {
  getServerAdminOrders,
  type AdminOrderView,
} from "@/server/admin/orders";

export type AdminDashboardData = {
  orderCount: number;
  ordersToManageCount: number;
  pendingPaymentCount: number;
  pendingCancellationCount: number;
  customerCount: number;
  paidRevenueMinor: number;
  refundedAmountMinor: number;
  receivedCount: number;
  preparingCount: number;
  shippedCount: number;
  deliveredCount: number;
  refundedOrderCount: number;
  recentOrders: readonly AdminOrderView[];
  attentionOrders: readonly AdminOrderView[];
};

function isOrderToManage(order: AdminOrderView) {
  return order.status === "received" || order.status === "preparing";
}

function needsAttention(order: AdminOrderView) {
  return (
    order.cancellationRequestStatus === "pending" ||
    order.paymentStatus === "pending" ||
    order.paymentStatus === "authorized" ||
    order.status === "received"
  );
}

export const getServerAdminDashboard = cache(
  async (): Promise<AdminDashboardData> => {
    const orders = await getServerAdminOrders();

    const paidOrders = orders.filter((order) => order.paymentStatus === "paid");

    const refundedOrders = orders.filter(
      (order) => order.paymentStatus === "refunded",
    );

    const customerIds = new Set(orders.map((order) => order.customer.id));

    return {
      orderCount: orders.length,

      ordersToManageCount: orders.filter(isOrderToManage).length,

      pendingPaymentCount: orders.filter(
        (order) =>
          order.paymentStatus === "pending" ||
          order.paymentStatus === "authorized",
      ).length,

      pendingCancellationCount: orders.filter(
        (order) => order.cancellationRequestStatus === "pending",
      ).length,

      customerCount: customerIds.size,

      paidRevenueMinor: paidOrders.reduce(
        (total, order) => total + order.totalGrossAmountMinor,
        0,
      ),

      refundedAmountMinor: refundedOrders.reduce(
        (total, order) => total + order.totalGrossAmountMinor,
        0,
      ),

      receivedCount: orders.filter((order) => order.status === "received")
        .length,

      preparingCount: orders.filter((order) => order.status === "preparing")
        .length,

      shippedCount: orders.filter((order) => order.status === "shipped").length,

      deliveredCount: orders.filter((order) => order.status === "delivered")
        .length,

      refundedOrderCount: refundedOrders.length,

      recentOrders: orders.slice(0, 5),

      attentionOrders: orders.filter(needsAttention).slice(0, 5),
    };
  },
);
