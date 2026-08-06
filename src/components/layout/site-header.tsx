import { SiteHeaderClient } from "@/components/layout/site-header-client";
import { businessInfo } from "@/config/business";
import { createCatalogMenuGroups } from "@/config/catalog";
import { catalogBrands } from "@/content/catalog/brands";
import { catalogCategories } from "@/content/catalog/categories";
import { catalogCollections } from "@/content/catalog/collections";
import { emptyCatalogFilters } from "@/features/catalog/catalog-filter";
import { formatEuroMinor } from "@/lib/money";
import { getCatalogRepository } from "@/server/catalog/get-catalog-repository";

const suggestedCategorySlugs = [
  "whisky-whiskey",
  "rum-rhum",
  "gin",
  "tequila-mezcal",
  "bottiglie-rare",
] as const;

export async function SiteHeader() {
  const collectionLinks = catalogCollections
    .filter((collection) => collection.productSlugs.length > 0)
    .map((collection) => ({
      label: collection.label,
      href: collection.href,
    }));

  const featuredProducts = (
    await getCatalogRepository().queryProducts({
      page: 1,
      pageSize: 5,
      sort: "newest",
      filters: emptyCatalogFilters,
    })
  ).items;

  return (
    <SiteHeaderClient
      menuGroups={createCatalogMenuGroups(collectionLinks)}
      featuredSearchProducts={featuredProducts}
      featuredSearchBrands={catalogBrands.slice(0, 3)}
      featuredSearchCategories={catalogCategories.filter((category) =>
        suggestedCategorySlugs.includes(
          category.slug as (typeof suggestedCategorySlugs)[number],
        ),
      )}
      freeShippingThreshold={formatEuroMinor(
        businessInfo.freeShippingThresholdMinor,
      )}
    />
  );
}
