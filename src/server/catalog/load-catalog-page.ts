import "server-only";

import {
  parseCatalogQuery,
  type CatalogSearchParams,
} from "@/server/catalog/catalog-query";
import { getCatalogRepository } from "@/server/catalog/get-catalog-repository";
import type { CatalogQueryScope } from "@/types/catalog";

export async function loadCatalogPage(
  searchParams: CatalogSearchParams,
  scope?: CatalogQueryScope,
) {
  const query = { ...parseCatalogQuery(searchParams), scope };
  const repository = getCatalogRepository();
  const [result, filterOptions] = await Promise.all([
    repository.queryProducts(query),
    repository.getFilterOptions(scope),
  ]);

  return { query, result, filterOptions };
}
