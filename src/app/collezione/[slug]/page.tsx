import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { catalogCollections } from "@/content/catalog/collections";
import { getCollectionBySlug } from "@/content/catalog/selectors";
import { Breadcrumbs } from "@/features/catalog/breadcrumbs";
import { CatalogExplorer } from "@/features/catalog/catalog-explorer";
import { CatalogHero } from "@/features/catalog/catalog-hero";
import { ShippingPromise } from "@/features/catalog/shipping-promise";
import type { CatalogSearchParams } from "@/server/catalog/catalog-query";
import { loadCatalogPage } from "@/server/catalog/load-catalog-page";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<CatalogSearchParams>;
};

export function generateStaticParams() {
  return catalogCollections
    .filter((collection) => collection.productSlugs.length > 0)
    .map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return {};

  return {
    title: collection.label,
    description: collection.description,
    alternates: { canonical: `/collezione/${collection.slug}` },
    openGraph: {
      title: `${collection.label} | La Botola e Mietto`,
      description: collection.description,
    },
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection || collection.productSlugs.length === 0) notFound();

  const { query, result, filterOptions } = await loadCatalogPage(
    await searchParams,
    { productSlugs: collection.productSlugs },
  );

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Catalogo", href: "/catalogo" },
          { label: collection.label },
        ]}
      />
      <CatalogHero
        eyebrow={collection.eyebrow}
        title={collection.label}
        description={collection.description}
        introduction={collection.introduction}
        media={collection.media}
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
