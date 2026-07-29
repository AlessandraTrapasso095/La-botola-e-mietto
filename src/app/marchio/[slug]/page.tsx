import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import {
  getBrandBySlug,
  getProductsByBrand,
} from "@/content/catalog/selectors";
import { Breadcrumbs } from "@/features/catalog/breadcrumbs";
import { CatalogHero } from "@/features/catalog/catalog-hero";
import { ProductCard } from "@/features/catalog/product-card";
import { createCatalogProductViews } from "@/server/catalog-view";

type BrandPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return {};

  return {
    title: brand.name,
    description: brand.description,
    alternates: { canonical: `/marchio/${brand.slug}` },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const products = createCatalogProductViews(getProductsByBrand(slug));

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Marchi", href: "/marchi" },
          { label: brand.name },
        ]}
      />
      <CatalogHero
        eyebrow={brand.country ?? "Selezione del catalogo"}
        title={brand.name}
        description={brand.description}
        introduction={brand.story}
        media={brand.media}
      />
      <Section spacing="standard">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
                La selezione
              </p>
              <Heading className="mt-4">Bottiglie {brand.name}</Heading>
            </div>
            <p className="text-text-muted text-sm">
              {products.length}{" "}
              {products.length === 1 ? "bottiglia" : "bottiglie"}
            </p>
          </div>

          {products.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="border-border-subtle mt-10 border p-10 text-center">
              <p className="text-text-strong font-serif text-2xl">
                La selezione è in aggiornamento.
              </p>
              <p className="text-text-muted mt-3 text-sm">
                Contattaci per verificare le etichette disponibili di questo
                produttore.
              </p>
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}
