import type { CatalogFilters, CatalogSort } from "@/types/catalog";

export function serializeCatalogQuery(
  filters: CatalogFilters,
  sort: CatalogSort,
  page: number,
) {
  const params = new URLSearchParams();
  const addList = (name: string, values: readonly string[]) => {
    if (values.length > 0) params.set(name, values.join(","));
  };

  if (page > 1) params.set("page", String(page));
  if (sort !== "featured") params.set("sort", sort);
  addList("brands", filters.brands);
  addList("categories", filters.categories);
  addList("prices", filters.priceRanges);
  addList("capacities", filters.capacities);
  addList("alcohol", filters.alcoholRanges);
  addList("countries", filters.countries);
  if (filters.onlyOnOffer) params.set("offer", "1");
  if (filters.onlyNew) params.set("new", "1");
  if (filters.onlyLimited) params.set("limited", "1");
  if (filters.onlyAvailable) params.set("available", "1");

  return params;
}
