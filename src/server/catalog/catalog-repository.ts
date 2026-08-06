import "server-only";

import type {
  CatalogFilterOptions,
  CatalogQuery,
  CatalogQueryScope,
  CatalogSearchResults,
  PaginatedProducts,
  ProductCardView,
  ProductDetailView,
} from "@/types/catalog";

export type CatalogSearchOptions = {
  productLimit?: number;
  brandLimit?: number;
  categoryLimit?: number;
};

export interface CatalogRepository {
  queryProducts(query: CatalogQuery): Promise<PaginatedProducts>;
  getFilterOptions(scope?: CatalogQueryScope): Promise<CatalogFilterOptions>;
  getProductBySlug(slug: string): Promise<ProductDetailView | null>;
  getProductByCode(code: string): Promise<ProductDetailView | null>;
  getProductsBySlugs(slugs: readonly string[]): Promise<ProductCardView[]>;
  getRelatedProducts(slug: string, limit: number): Promise<ProductCardView[]>;
  search(
    query: string,
    options?: CatalogSearchOptions,
  ): Promise<CatalogSearchResults>;
}
