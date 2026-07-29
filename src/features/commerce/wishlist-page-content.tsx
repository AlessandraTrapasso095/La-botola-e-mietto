"use client";

import Link from "next/link";

import { HeartIcon } from "@/components/icons";
import { Heading } from "@/components/ui/heading";
import { ProductCard } from "@/features/catalog/product-card";
import { useCommerce } from "@/features/commerce/commerce-provider";
import type { CatalogProductView } from "@/content/catalog/types";

function isCatalogProduct(
  product: CatalogProductView | undefined,
): product is CatalogProductView {
  return Boolean(product);
}

export function WishlistPageContent() {
  const { products, wishlist } = useCommerce();
  const wishlistedProducts = wishlist
    .map((slug) => products.find((product) => product.slug === slug))
    .filter(isCatalogProduct);

  if (wishlistedProducts.length === 0) {
    return (
      <div className="border-border-subtle flex min-h-[30rem] flex-col items-center justify-center border px-6 text-center">
        <span className="border-border text-accent flex size-20 items-center justify-center rounded-full border">
          <HeartIcon className="size-8" />
        </span>
        <Heading as="h1" className="mt-6">
          Crea la tua collezione personale.
        </Heading>
        <p className="text-text-muted mt-4 max-w-md">
          Salva le bottiglie che vuoi confrontare, regalare o ritrovare con
          facilità.
        </p>
        <Link
          href="/catalogo"
          className="border-accent bg-accent text-accent-contrast hover:bg-accent-soft mt-7 inline-flex min-h-12 items-center border px-8 text-sm font-semibold tracking-[var(--letter-spacing-label)] uppercase transition-colors"
        >
          Scopri la selezione
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
            La tua collezione
          </p>
          <Heading as="h1" className="mt-4">
            Preferiti
          </Heading>
        </div>
        <p className="text-text-muted text-sm">
          {wishlistedProducts.length}{" "}
          {wishlistedProducts.length === 1 ? "bottiglia" : "bottiglie"}
        </p>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {wishlistedProducts.map((product) => (
          <ProductCard key={product.code} product={product} />
        ))}
      </div>
    </>
  );
}
