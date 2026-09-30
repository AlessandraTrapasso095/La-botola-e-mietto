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

const whiskyFamilies: Record<
  string,
  { label: string; subcategories: readonly string[] }
> = {
  "irish-whiskey": {
    label: "Irish Whiskey",
    subcategories: [
      "Irish Blended Whiskey",
      "Irish Grain Whiskey",
      "Irish Single Malt",
      "Irish Single Pot Still",
    ],
  },
  "bourbon-rye": {
    label: "Bourbon | Rye",
    subcategories: [
      "Bourbon Whiskey",
      "Rye Whiskey",
    ],
  },
  "whisky-giapponesi": {
    label: "Whisky Giapponesi",
    subcategories: [
      "Japanese Blended Whisky",
      "Japanese Grain Whisky",
      "Japanese Single Malt",
    ],
  },
};

function resolveCatalogScope(slug: string, subcategorySlug: string) {
  const category = getCategoryBySlug(slug);

  if (!category) {
    return null;
  }

  const subcategory = category.subcategories.find(
    (name) =>
      createCatalogSubcategorySlug(category.slug, name) === subcategorySlug,
  );

  if (subcategory) {
    return {
      category,
      label: subcategory,
      scope: {
        categorySlug: category.slug,
        subcategorySlug,
      },
    };
  }

  if (category.slug !== "whisky-whiskey") {
    return null;
  }

  const family = whiskyFamilies[subcategorySlug];

  if (!family) {
    return null;
  }

  const categorySubcategories = new Set<string>(category.subcategories);

  if (
    family.subcategories.some(
      (name) => !categorySubcategories.has(name),
    )
  ) {
    return null;
  }

  return {
    category,
    label: family.label,
    scope: {
      categorySlug: category.slug,
      subcategorySlugs: family.subcategories.map((name) =>
        createCatalogSubcategorySlug(category.slug, name),
      ),
    },
  };
}

export async function generateMetadata({
  params,
}: SubcategoryPageProps): Promise<Metadata> {
  const { slug, subcategorySlug } = await params;
  const resolved = resolveCatalogScope(slug, subcategorySlug);

  if (!resolved) {
    return {};
  }

  const { category, label } = resolved;

  return {
    title: label,
    description: `${label}: scopri la selezione disponibile nella categoria ${category.name}.`,
    alternates: {
      canonical: `/categoria/${category.slug}/${subcategorySlug}`,
    },
    openGraph: {
      title: `${label} | La Botola e Mietto`,
      description: `${label}: scopri la selezione disponibile nella categoria ${category.name}.`,
    },
  };
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: SubcategoryPageProps) {
  const { slug, subcategorySlug } = await params;
  const resolved = resolveCatalogScope(slug, subcategorySlug);

  if (!resolved) {
    notFound();
  }

  const { category, label, scope } = resolved;

  const { query, result, filterOptions } = await loadCatalogPage(
    await searchParams,
    scope,
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
          { label },
        ]}
      />

      <CatalogHero
        eyebrow={category.eyebrow}
        title={label}
        description={`Esplora la selezione ${label} disponibile nel catalogo La Botola e Mietto.`}
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
