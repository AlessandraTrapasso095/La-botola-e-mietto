import "server-only";

import type { Cart } from "@/types/commerce";
import type { Address, UserProfile } from "@/types/customer";
import type { Order } from "@/types/order";
import type { ProductCardView } from "@/types/catalog";

export interface ProfileService {
  getProfile(userId: string): Promise<UserProfile | null>;
  updateProfile(
    userId: string,
    profile: Partial<UserProfile>,
  ): Promise<UserProfile>;
  listAddresses(userId: string): Promise<Address[]>;
}

export interface CartService {
  getCart(userId: string): Promise<Cart>;
  setQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart>;
  removeItem(userId: string, productId: string): Promise<Cart>;
}

export interface WishlistService {
  listProducts(userId: string): Promise<ProductCardView[]>;
  addProduct(userId: string, productId: string): Promise<void>;
  removeProduct(userId: string, productId: string): Promise<void>;
}

export interface OrderService {
  listOrders(userId: string): Promise<Order[]>;
  getOrder(userId: string, orderId: string): Promise<Order | null>;
}

export type PaymentIntentRequest = {
  orderId: string;
  amountMinor: bigint;
  currency: "EUR";
  idempotencyKey: string;
};

export interface PaymentService {
  createPaymentIntent(request: PaymentIntentRequest): Promise<{
    providerReference: string;
    clientSecret: string;
  }>;
}

export interface AdminService {
  assertStaffAccess(userId: string): Promise<void>;
}

export interface EmailService {
  sendTransactionalEmail(message: {
    recipient: string;
    template: string;
    variables: Record<string, string>;
  }): Promise<void>;
}
