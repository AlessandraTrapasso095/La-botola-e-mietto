import type { Metadata } from "next";
import Link from "next/link";

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
  const verifiedBrands = catalogBrands.filter((brand) => !brand.needsReview);
  const featuredBrands = [...verifiedBrands]
    .sort(
      (left, right) =>
        right.productCount - left.productCount ||
        left.name.localeCompare(right.name, "it"),
    )
    .slice(0, 24);

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
          <BrandGrid brands={featuredBrands} />
          <section
            className="border-border-subtle mt-20 border-t pt-12"
            aria-labelledby="brand-directory-title"
          >
            <h2
              id="brand-directory-title"
              className="text-text-strong font-serif text-3xl"
            >
              Tutti i marchi verificati
            </h2>
            <p className="text-text-muted mt-3 max-w-2xl text-sm">
              Consulta l’elenco alfabetico delle maison e distillerie
              identificate con corrispondenza univoca nel catalogo.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-x-6 border-t border-[var(--color-border-subtle)] sm:grid-cols-3 lg:grid-cols-4">
              {verifiedBrands.map((brand) => (
                <li key={brand.slug} className="border-border-subtle border-b">
                  <Link
                    href={`/marchio/${brand.slug}`}
                    className="hover:text-accent-soft flex min-h-12 items-center justify-between gap-3 text-sm transition-colors"
                  >
                    <span>{brand.name}</span>
                    <span className="text-text-muted text-xs">
                      {brand.productCount}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Container>
      </Section>
    </main>
  );
}
