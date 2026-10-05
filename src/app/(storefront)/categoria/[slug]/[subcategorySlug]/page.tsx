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

type CatalogFamily = {
  categorySlug: string;
  label: string;
  subcategories: readonly string[];
};

const catalogFamilies: Record<string, CatalogFamily> = {
  "irish-whiskey": {
    categorySlug: "whisky-whiskey",
    label: "Irish Whiskey",
    subcategories: [
      "Irish Blended Whiskey",
      "Irish Grain Whiskey",
      "Irish Single Malt",
      "Irish Single Pot Still",
    ],
  },
  "bourbon-rye": {
    categorySlug: "whisky-whiskey",
    label: "Bourbon | Rye",
    subcategories: [
      "Bourbon Whiskey",
      "Rye Whiskey",
    ],
  },
  "whisky-giapponesi": {
    categorySlug: "whisky-whiskey",
    label: "Whisky Giapponesi",
    subcategories: [
      "Japanese Blended Whisky",
      "Japanese Grain Whisky",
      "Japanese Single Malt",
    ],
  },
  "rum-invecchiati": {
    categorySlug: "rum-rhum",
    label: "Rum Invecchiati",
    subcategories: ["Rum Invecchiato"],
  },
  "rum-tradizionali": {
    categorySlug: "rum-rhum",
    label: "Rum Tradizionali",
    subcategories: ["Rum Tradizionale da Melassa"],
  },
  "rhum-agricole": {
    categorySlug: "rum-rhum",
    label: "Rhum Agricole",
    subcategories: ["Rhum Agricole"],
  },
  cachaca: {
    categorySlug: "rum-rhum",
    label: "Cachaça",
    subcategories: ["Cachaça"],
  },
  tequila: {
    categorySlug: "tequila-mezcal",
    label: "Tequila",
    subcategories: [
      "Tequila Añejo",
      "Tequila Blanco / Plata",
      "Tequila Cristalino",
      "Tequila Joven / Oro",
      "Tequila Reposado",
    ],
  },
  mezcal: {
    categorySlug: "tequila-mezcal",
    label: "Mezcal",
    subcategories: ["Mezcal Artesanal"],
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

  const family = catalogFamilies[subcategorySlug];

  if (!family || family.categorySlug !== category.slug) {
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

  const { category, label, scope } = resolved;
  const description = `${label}: scopri la selezione disponibile nella categoria ${category.name}.`;
  const { result } = await loadCatalogPage({}, scope);
  const socialImage = result.items
    .flatMap((product) => product.media)
    .find((media) => media.src !== "/images/placeholder-bottle.svg");

  return {
    title: label,
    description,
    alternates: {
      canonical: `/categoria/${category.slug}/${subcategorySlug}`,
    },
    openGraph: {
      title: `${label} | La Botola e Mietto`,
      description,
      ...(socialImage
        ? {
            images: [
              {
                url: socialImage.src,
                width: socialImage.width,
                height: socialImage.height,
                alt: socialImage.alt,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${label} | La Botola e Mietto`,
      description,
      ...(socialImage ? { images: [socialImage.src] } : {}),
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
