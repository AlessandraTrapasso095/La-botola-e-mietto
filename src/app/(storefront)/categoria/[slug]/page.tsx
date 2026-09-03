import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { catalogCategories } from "@/content/catalog/categories";
import { getCategoryBySlug } from "@/content/catalog/selectors";
import { Breadcrumbs } from "@/features/catalog/breadcrumbs";
import { CatalogExplorer } from "@/features/catalog/catalog-explorer";
import { CatalogHero } from "@/features/catalog/catalog-hero";
import { ShippingPromise } from "@/features/catalog/shipping-promise";
import type { CatalogSearchParams } from "@/server/catalog/catalog-query";
import { loadCatalogPage } from "@/server/catalog/load-catalog-page";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<CatalogSearchParams>;
};

export function generateStaticParams() {
  return catalogCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/categoria/${category.slug}` },
    openGraph: {
      title: `${category.name} | La Botola e Mietto`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();
  const { query, result, filterOptions } = await loadCatalogPage(
    await searchParams,
    { categorySlug: slug },
  );

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Catalogo", href: "/catalogo" },
          { label: category.name },
        ]}
      />
      <CatalogHero
        eyebrow={category.eyebrow}
        title={category.name}
        description={category.description}
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
