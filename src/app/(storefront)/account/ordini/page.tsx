import type { Metadata } from "next";

import { accountOrders } from "@/content/account/account-data";
import { OrdersList } from "@/features/account/orders-list";
import { getServerAccountOrders } from "@/server/account/orders";
import { getServerEnvironment } from "@/server/env";

export const metadata: Metadata = {
  title: "I miei ordini",
};

export default async function AccountOrdersPage() {
  const environment = getServerEnvironment();

  if (environment.AUTH_SERVICE === "demo") {
    const demoOrders = accountOrders.map((order) => ({
      id: order.id,
      orderNumber: order.id,
      createdAt: `${order.date}T12:00:00.000Z`,
      status:
        order.status === "ricevuto"
          ? ("received" as const)
          : order.status === "in preparazione"
            ? ("preparing" as const)
            : order.status === "spedito"
              ? ("shipped" as const)
              : order.status === "consegnato"
                ? ("delivered" as const)
                : ("cancelled" as const),
      paymentStatus: "paid" as const,
      cancellationRequestStatus: null,
      paymentMethod: "stripe" as const,
      shippingMethod: "tnt" as const,
      totalGrossAmountMinor: Math.round(
        Number(
          order.total
            .replace("€", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim(),
        ) * 100,
      ),
      itemCount: order.itemCount,
      products: order.products.map((product, index) => ({
        id: `${order.id}-${index}`,
        name: product.name,
        code: "",
        quantity: product.quantity,
      })),
    }));

    return <OrdersList orders={demoOrders} />;
  }

  const orders = await getServerAccountOrders();

  return <OrdersList orders={orders} />;
}
