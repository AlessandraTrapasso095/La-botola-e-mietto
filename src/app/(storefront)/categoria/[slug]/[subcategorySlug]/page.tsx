import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { getCategoryBySlug } from "@/content/catalog/selectors";
import { Breadcrumbs } from "@/features/catalog/breadcrumbs";
import { CatalogExplorer } from "@/features/catalog/catalog-explorer";
import { CatalogHero } from "@/features/catalog/catalog-hero";
import { ShippingPromise } from "@/features/catalog/shipping-promise";
import { createCatalogSubcategorySlug } from "@/lib/catalog-taxonomy";
import type { CatalogSearchParams } from "@/server/catalog/catalog-query";
import { loadCatalogPage } from "@/server/catalog/load-catalog-page";

type SubcategoryPageProps = {
  params: Promise<{
    slug: string;
    subcategorySlug: string;
  }>;
  searchParams: Promise<CatalogSearchParams>;
};

function getSubcategory(slug: string, subcategorySlug: string) {
  const category = getCategoryBySlug(slug);

  if (!category) {
    return null;
  }

  const subcategory = category.subcategories.find(
    (name) =>
      createCatalogSubcategorySlug(category.slug, name) === subcategorySlug,
  );

  if (!subcategory) {
    return null;
  }

  return { category, subcategory };
}

export async function generateMetadata({
  params,
}: SubcategoryPageProps): Promise<Metadata> {
  const { slug, subcategorySlug } = await params;
  const resolved = getSubcategory(slug, subcategorySlug);

  if (!resolved) {
    return {};
  }

  const { category, subcategory } = resolved;

  return {
    title: subcategory,
    description: `${subcategory}: scopri la selezione disponibile nella categoria ${category.name}.`,
    alternates: {
      canonical: `/categoria/${category.slug}/${subcategorySlug}`,
    },
    openGraph: {
      title: `${subcategory} | La Botola e Mietto`,
      description: `${subcategory}: scopri la selezione disponibile nella categoria ${category.name}.`,
    },
  };
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: SubcategoryPageProps) {
  const { slug, subcategorySlug } = await params;
  const resolved = getSubcategory(slug, subcategorySlug);

  if (!resolved) {
    notFound();
  }

  const { category, subcategory } = resolved;

  const { query, result, filterOptions } = await loadCatalogPage(
    await searchParams,
    {
      categorySlug: category.slug,
      subcategorySlug,
    },
  );

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Catalogo", href: "/catalogo" },
          {
            label: category.name,
            href: `/categoria/${category.slug}`,
          },
          { label: subcategory },
        ]}
      />

      <CatalogHero
        eyebrow={category.eyebrow}
        title={subcategory}
        description={`Esplora la selezione ${subcategory} disponibile nel catalogo La Botola e Mietto.`}
        introduction={category.introduction}
        media={category.media}
      />

      <ShippingPromise />

      <Section spacing="standard">
        <Container>
          <CatalogExplorer
            result={result}
            filterOptions={filterOptions}
            initialFilters={query.filters}
            initialSort={query.sort}
            fixedCategory={category.slug}
          />
        </Container>
      </Section>
    </main>
  );
}
