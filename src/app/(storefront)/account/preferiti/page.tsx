import type { Metadata } from "next";

import { WishlistPageContent } from "@/features/commerce/wishlist-page-content";

export const metadata: Metadata = { title: "Preferiti" };

export default function AccountWishlistPage() {
  return <WishlistPageContent />;
}
