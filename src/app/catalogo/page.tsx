import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { catalogBanners } from "@/content/catalog/demo-commerce";
import { catalogCategories } from "@/content/catalog/categories";
import { catalogProducts } from "@/content/catalog/products";
import { demoMedia } from "@/content/demo-assets/media";
import { Breadcrumbs } from "@/features/catalog/breadcrumbs";
import { CatalogExplorer } from "@/features/catalog/catalog-explorer";
import { CatalogHero } from "@/features/catalog/catalog-hero";
import { CategoryNavigation } from "@/features/catalog/category-navigation";
import { ShippingPromise } from "@/features/catalog/shipping-promise";
import { createCatalogProductViews } from "@/server/catalog-view";

export const metadata: Metadata = {
  title: "Catalogo",
  description:
    "Esplora la selezione di whisky, rum, gin, tequila, cognac, amari, vermouth e bottiglie rare di La Botola e Mietto.",
  alternates: { canonical: "/catalogo" },
};

export default function CatalogPage() {
  const productViews = createCatalogProductViews(catalogProducts);

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Catalogo" }]}
      />
      <CatalogHero
        eyebrow={catalogBanners.catalog.eyebrow}
        title={catalogBanners.catalog.title}
        description={catalogBanners.catalog.description}
        introduction="Esplora la collezione per stile, provenienza, marchio e occasione: ogni prezzo esposto è comprensivo di IVA."
        media={demoMedia.hero}
      />
      <Section spacing="standard">
        <Container>
          <CategoryNavigation categories={catalogCategories} />
        </Container>
      </Section>
      <ShippingPromise />
      <Section spacing="standard">
        <Container>
          <CatalogExplorer
            products={productViews}
            categories={catalogCategories}
          />
        </Container>
      </Section>
    </main>
  );
}
