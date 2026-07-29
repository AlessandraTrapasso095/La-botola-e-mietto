import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { catalogBrands } from "@/content/catalog/brands";
import { demoMedia } from "@/content/demo-assets/media";
import { BrandGrid } from "@/features/brands/brand-grid";
import { Breadcrumbs } from "@/features/catalog/breadcrumbs";
import { CatalogHero } from "@/features/catalog/catalog-hero";

export const metadata: Metadata = {
  title: "Marchi",
  description:
    "Scopri distillerie, maison e produttori selezionati da La Botola e Mietto.",
  alternates: { canonical: "/marchi" },
};

export default function BrandsPage() {
  return (
    <main id="main-content">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Marchi" }]}
      />
      <CatalogHero
        eyebrow="Maison e distillerie"
        title="I nomi dietro le bottiglie."
        description="Produttori storici, distillerie indipendenti e marchi contemporanei scelti per identità, coerenza e qualità."
        introduction="Ogni marchio apre un percorso tra territorio, metodo e stile: una chiave di lettura per orientarsi nella selezione."
        media={demoMedia.whiskyCellar}
      />
      <Section spacing="standard">
        <Container>
          <BrandGrid brands={catalogBrands} />
        </Container>
      </Section>
    </main>
  );
}
