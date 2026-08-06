import type { ProductCardView } from "@/types/catalog";

export type CartItem = { product: ProductCardView; quantity: number };

export type Cart = {
  id: string | null;
  items: CartItem[];
  currency: "EUR";
};

export type WishlistItem = {
  product: ProductCardView;
  addedAt: string | null;
};
