import type { Address } from "@/types/customer";

export type OrderStatus =
  | "received"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitNetAmountMinor: bigint;
  vatRateBasisPoints: number;
  unitGrossAmountMinor: bigint;
};

export type Order = {
  id: string;
  number: string;
  profileId: string;
  status: OrderStatus;
  currency: "EUR";
  subtotalGrossAmountMinor: bigint;
  shippingGrossAmountMinor: bigint;
  totalGrossAmountMinor: bigint;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  createdAt: string;
};
