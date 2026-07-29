"use client";

import { useEffect, useState } from "react";

import { Heading } from "@/components/ui/heading";
import type { CatalogProductView } from "@/content/catalog/types";
import { ProductCard } from "@/features/catalog/product-card";
import { registerRecentlyViewed } from "@/features/product/recently-viewed-storage";

export function RecentlyViewed({
  currentSlug,
  products,
}: {
  currentSlug: string;
  products: readonly CatalogProductView[];
}) {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  useEffect(() => {
    const registrationFrame = window.requestAnimationFrame(() => {
      setRecentSlugs(registerRecentlyViewed(window.localStorage, currentSlug));
    });

    return () => window.cancelAnimationFrame(registrationFrame);
  }, [currentSlug]);

  const recentProducts = recentSlugs
    .filter((slug) => slug !== currentSlug)
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is CatalogProductView => Boolean(product))
    .slice(0, 4);

  if (recentProducts.length === 0) return null;

  return (
    <section className="mt-24 md:mt-32">
      <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
        Il tuo percorso
      </p>
      <Heading className="mt-4">Visti di recente</Heading>
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 lg:gap-x-6">
        {recentProducts.map((product) => (
          <ProductCard key={product.code} product={product} />
        ))}
      </div>
    </section>
  );
}
