import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { catalogCategories } from "@/content/catalog/categories";
import {
  getCategoryBySlug,
  getProductsByCategory,
} from "@/content/catalog/selectors";
import { Breadcrumbs } from "@/features/catalog/breadcrumbs";
import { CatalogExplorer } from "@/features/catalog/catalog-explorer";
import { CatalogHero } from "@/features/catalog/catalog-hero";
import { ShippingPromise } from "@/features/catalog/shipping-promise";
import { createCatalogProductViews } from "@/server/catalog-view";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const products = createCatalogProductViews(getProductsByCategory(slug));

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
            products={products}
            categories={catalogCategories}
            fixedCategory={category.slug}
          />
        </Container>
      </Section>
    </main>
  );
}
