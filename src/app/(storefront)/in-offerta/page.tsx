import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { demoMedia } from "@/content/demo-assets/media";
import { Breadcrumbs } from "@/features/catalog/breadcrumbs";
import { CatalogExplorer } from "@/features/catalog/catalog-explorer";
import { CatalogHero } from "@/features/catalog/catalog-hero";
import { ShippingPromise } from "@/features/catalog/shipping-promise";
import type { CatalogSearchParams } from "@/server/catalog/catalog-query";
import { loadCatalogPage } from "@/server/catalog/load-catalog-page";

type OffersPageProps = {
  searchParams: Promise<CatalogSearchParams>;
};

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

export default async function OffersPage({ searchParams }: OffersPageProps) {
  const { query, result, filterOptions } = await loadCatalogPage(
    await searchParams,
    { onlyOffers: true },
  );

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "In offerta" }]}
      />
      <CatalogHero
        eyebrow="Occasioni selezionate"
        title="In offerta"
        description="Una selezione di bottiglie proposta a condizioni speciali, scelta con la stessa cura riservata a ogni etichetta del nostro catalogo."
        introduction={`${result.totalCount} ${result.totalCount === 1 ? "referenza disponibile" : "referenze disponibili"}, tra distillati, vini e specialità da scoprire.`}
        media={demoMedia.ginTea}
      />
      <ShippingPromise />
      <Section spacing="standard">
        <Container>
          <CatalogExplorer
            result={result}
            filterOptions={filterOptions}
            initialFilters={query.filters}
            initialSort={query.sort}
          />
        </Container>
      </Section>
    </main>
  );
}
