import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { catalogCategories } from "@/content/catalog/categories";
import { getOfferProducts } from "@/content/catalog/selectors";
import { demoMedia } from "@/content/demo-assets/media";
import { Breadcrumbs } from "@/features/catalog/breadcrumbs";
import { CatalogExplorer } from "@/features/catalog/catalog-explorer";
import { CatalogHero } from "@/features/catalog/catalog-hero";
import { ShippingPromise } from "@/features/catalog/shipping-promise";
import { createCatalogProductViews } from "@/server/catalog-view";

export const metadata: Metadata = {
  title: "In offerta",
  description:
    "Scopri la selezione di prodotti in offerta di La Botola e Mietto.",
  alternates: { canonical: "/in-offerta" },
  openGraph: {
    title: "In offerta | La Botola e Mietto",
    description:
      "Una selezione di distillati e specialità proposti a condizioni dedicate.",
  },
};

export default function OffersPage() {
  const offerProducts = createCatalogProductViews(getOfferProducts());

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "In offerta" }]}
      />
      <CatalogHero
        eyebrow="Occasioni selezionate"
        title="In offerta"
        description="Una selezione di bottiglie proposta a condizioni speciali, scelta con la stessa cura riservata a ogni etichetta del nostro catalogo."
        introduction={`${offerProducts.length} ${offerProducts.length === 1 ? "referenza disponibile" : "referenze disponibili"}, tra distillati, vini e specialità da scoprire.`}
        media={demoMedia.ginTea}
      />
      <ShippingPromise />
      <Section spacing="standard">
        <Container>
          <CatalogExplorer
            products={offerProducts}
            categories={catalogCategories}
          />
        </Container>
      </Section>
    </main>
  );
}
