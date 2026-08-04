import type { CatalogProductSummaryView } from "@/content/catalog/types";

export type CatalogFilters = {
  brands: string[];
  categories: string[];
  priceRanges: string[];
  capacities: string[];
  alcoholRanges: string[];
  countries: string[];
  onlyOnOffer: boolean;
  onlyNew: boolean;
  onlyLimited: boolean;
  onlyAvailable: boolean;
};

export type CatalogSort =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name"
  | "newest";

export const emptyCatalogFilters: CatalogFilters = {
  brands: [],
  categories: [],
  priceRanges: [],
  capacities: [],
  alcoholRanges: [],
  countries: [],
  onlyOnOffer: false,
  onlyNew: false,
  onlyLimited: false,
  onlyAvailable: false,
};

function matchesPrice(
  product: CatalogProductSummaryView,
  ranges: readonly string[],
) {
  if (ranges.length === 0) return true;
  return ranges.some((range) => {
    if (range === "under-30") return product.grossPriceMinor < 3_000;
    if (range === "30-60")
      return (
        product.grossPriceMinor >= 3_000 && product.grossPriceMinor < 6_000
      );
    if (range === "60-150")
      return (
        product.grossPriceMinor >= 6_000 && product.grossPriceMinor < 15_000
      );
    return product.grossPriceMinor >= 15_000;
  });
}

function matchesCapacity(
  product: CatalogProductSummaryView,
  capacities: readonly string[],
) {
  if (capacities.length === 0) return true;
  if (product.capacityMl === null) return false;
  const capacityMl = product.capacityMl;

  return capacities.some((capacity) => {
    if (capacity === "small") return capacityMl <= 500;
    if (capacity === "700") return capacityMl === 700;
    if (capacity === "750") return capacityMl === 750;
    return capacityMl >= 1000;
  });
}

function matchesAlcohol(
  product: CatalogProductSummaryView,
  ranges: readonly string[],
) {
  if (ranges.length === 0) return true;
  if (!product.alcoholPercentage) return ranges.includes("not-declared");
  const alcohol = Number(product.alcoholPercentage);

  return ranges.some((range) => {
    if (range === "under-30") return alcohol < 30;
    if (range === "30-40") return alcohol >= 30 && alcohol <= 40;
    if (range === "over-40") return alcohol > 40;
    return false;
  });
}

export function filterCatalogProducts(
  products: readonly CatalogProductSummaryView[],
  filters: CatalogFilters,
) {
  return products.filter(
    (product) =>
      (filters.brands.length === 0 ||
        (product.brandSlug !== null &&
          filters.brands.includes(product.brandSlug))) &&
      (filters.categories.length === 0 ||
        filters.categories.includes(product.categorySlug)) &&
      (filters.countries.length === 0 ||
        (product.country !== null &&
          filters.countries.includes(product.country))) &&
      matchesPrice(product, filters.priceRanges) &&
      matchesCapacity(product, filters.capacities) &&
      matchesAlcohol(product, filters.alcoholRanges) &&
      (!filters.onlyOnOffer || product.offer !== null) &&
      (!filters.onlyNew || product.isNew) &&
      (!filters.onlyLimited || product.isLimited) &&
      (!filters.onlyAvailable || product.stockQuantity > 0),
  );
}

export function sortCatalogProducts(
  products: readonly CatalogProductSummaryView[],
  sort: CatalogSort,
) {
  return [...products].sort((left, right) => {
    if (sort === "price-asc")
      return left.grossPriceMinor - right.grossPriceMinor;
    if (sort === "price-desc")
      return right.grossPriceMinor - left.grossPriceMinor;
    if (sort === "name") return left.name.localeCompare(right.name, "it");
    if (sort === "newest") return Number(right.isNew) - Number(left.isNew);
    return (
      Number(right.isLimited) - Number(left.isLimited) ||
      Number(right.isNew) - Number(left.isNew)
    );
  });
}
