"use client";

import { useEffect, useState } from "react";

import { Heading } from "@/components/ui/heading";
import type { CatalogProductSummaryView } from "@/content/catalog/types";
import { ProductCard } from "@/features/catalog/product-card";
import { registerRecentlyViewed } from "@/features/product/recently-viewed-storage";
import { fetchProductCards } from "@/lib/browser/catalog-client";

export function RecentlyViewed({ currentSlug }: { currentSlug: string }) {
  const [recentProducts, setRecentProducts] = useState<
    CatalogProductSummaryView[]
  >([]);

  useEffect(() => {
    const controller = new AbortController();
    const registrationFrame = window.requestAnimationFrame(() => {
      const recentSlugs = registerRecentlyViewed(
        window.localStorage,
        currentSlug,
      )
        .filter((slug) => slug !== currentSlug)
        .slice(0, 4);
      fetchProductCards(recentSlugs, controller.signal)
        .then(setRecentProducts)
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError")
            return;
          setRecentProducts([]);
        });
    });

    return () => {
      controller.abort();
      window.cancelAnimationFrame(registrationFrame);
    };
  }, [currentSlug]);

  if (recentProducts.length === 0) return null;

  return (
    <section className="mt-24 md:mt-32">
      <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
        Il tuo percorso
      </p>
      <Heading className="mt-4">Visti di recente</Heading>
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 lg:gap-x-6">
        {recentProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
