import type { Metadata } from "next";

import { accountOrders } from "@/content/account/account-data";
import { OrdersList } from "@/features/account/orders-list";

export const metadata: Metadata = { title: "Ordini" };

export default function AccountOrdersPage() {
  return <OrdersList orders={accountOrders} />;
}
