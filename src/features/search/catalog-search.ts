import type {
  CatalogBrand,
  CatalogCategory,
  CatalogProductSummaryView,
} from "@/content/catalog/types";

type SearchLimits = {
  products?: number;
  brands?: number;
  categories?: number;
};

export type CatalogSearchResults = {
  query: string;
  normalizedQuery: string;
  isSearchable: boolean;
  products: readonly CatalogProductSummaryView[];
  brands: readonly CatalogBrand[];
  categories: readonly CatalogCategory[];
  totalCount: number;
};

export function normalizeCatalogSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'`]/g, "")
    .replace(/[&|]/g, " ")
    .replace(/[-_/]+/g, " ")
    .replace(/\be\b/gi, " ")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("it-IT");
}

export function isCatalogSearchQuery(value: string) {
  return normalizeCatalogSearchValue(value).length >= 2;
}

function matchesSearchValue(value: string, normalizedQuery: string) {
  const normalizedValue = normalizeCatalogSearchValue(value);
  if (normalizedValue.includes(normalizedQuery)) return true;

  if (!/\d/.test(normalizedQuery)) return false;

  return normalizedValue
    .replace(/\s/g, "")
    .includes(normalizedQuery.replace(/\s/g, ""));
}

function applyLimit<T>(values: readonly T[], limit?: number) {
  return typeof limit === "number" ? values.slice(0, limit) : values;
}

export function searchCatalog({
  query,
  products,
  brands,
  categories,
  limits = {},
}: {
  query: string;
  products: readonly CatalogProductSummaryView[];
  brands: readonly CatalogBrand[];
  categories: readonly CatalogCategory[];
  limits?: SearchLimits;
}): CatalogSearchResults {
  const normalizedQuery = normalizeCatalogSearchValue(query);
  const isSearchable = normalizedQuery.length >= 2;

  if (!isSearchable) {
    return {
      query: query.trim(),
      normalizedQuery,
      isSearchable,
      products: [],
      brands: [],
      categories: [],
      totalCount: 0,
    };
  }

  const productMatches = products.filter((product) => {
    const searchableText = [
      product.name,
      product.brandName,
      product.categoryName,
      product.subcategory,
      product.capacityLabel,
      product.offer ? "In offerta" : "",
    ].join(" ");
    const codeMatches =
      /\d/.test(normalizedQuery) &&
      matchesSearchValue(product.code, normalizedQuery);

    return matchesSearchValue(searchableText, normalizedQuery) || codeMatches;
  });
  const brandMatches = brands.filter((brand) =>
    matchesSearchValue(
      [brand.name, brand.country ?? ""].join(" "),
      normalizedQuery,
    ),
  );
  const categoryMatches = categories.filter((category) =>
    matchesSearchValue(
      [category.name, category.shortName, ...category.subcategories].join(" "),
      normalizedQuery,
    ),
  );

  return {
    query: query.trim(),
    normalizedQuery,
    isSearchable,
    products: applyLimit(productMatches, limits.products),
    brands: applyLimit(brandMatches, limits.brands),
    categories: applyLimit(categoryMatches, limits.categories),
    totalCount:
      productMatches.length + brandMatches.length + categoryMatches.length,
  };
}
