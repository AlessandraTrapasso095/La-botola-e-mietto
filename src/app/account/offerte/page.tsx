import type { Metadata } from "next";

import { Heading } from "@/components/ui/heading";
import { getOfferProducts } from "@/content/catalog/selectors";
import { ProductCard } from "@/features/catalog/product-card";
import { createCatalogProductViews } from "@/server/catalog-view";

export const metadata: Metadata = { title: "Offerte" };

export default function AccountOffersPage() {
  const products = createCatalogProductViews(getOfferProducts());
  return (
    <div>
      <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
        Occasioni selezionate
      </p>
      <Heading as="h1" size="xl" className="mt-4">
        Offerte
      </Heading>
      <p className="text-text-muted mt-4">
        Una selezione di bottiglie disponibili a condizioni speciali.
      </p>
      {products.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="border-border-subtle mt-10 border px-6 py-20 text-center">
          <p className="text-text-muted">
            Non ci sono offerte disponibili in questo momento.
          </p>
        </div>
      )}
    </div>
  );
}
