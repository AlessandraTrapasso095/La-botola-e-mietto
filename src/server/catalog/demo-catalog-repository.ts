import "server-only";

import { catalogBrands } from "@/content/catalog/brands";
import { catalogCategories } from "@/content/catalog/categories";
import { catalogProducts } from "@/content/catalog/products";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/content/catalog/selectors";
import {
  filterCatalogProducts,
  sortCatalogProducts,
} from "@/features/catalog/catalog-filter";
import { searchCatalog } from "@/features/search/catalog-search";
import { createCatalogSubcategorySlug } from "@/lib/catalog-taxonomy";
import {
  createCatalogProductView,
  createCatalogProductViews,
} from "@/server/catalog-view";
import { mapCatalogProductToDomain } from "@/server/catalog/product-mapper";
import type {
  CatalogFilterOptions,
  CatalogQuery,
  CatalogQueryScope,
  ProductCardView,
} from "@/types/catalog";
import type {
  CatalogRepository,
  CatalogSearchOptions,
} from "@/server/catalog/catalog-repository";

function selectScope(scope?: CatalogQueryScope) {
  if (!scope) return catalogProducts;
  const allowedSlugs = scope.productSlugs
    ? new Set(scope.productSlugs)
    : undefined;

  return catalogProducts.filter((product) => {
    if (scope.categorySlug === "bottiglie-rare" && !product.isLimited) {
      return false;
    }
    if (
      scope.categorySlug &&
      scope.categorySlug !== "bottiglie-rare" &&
      product.categorySlug !== scope.categorySlug
    ) {
      return false;
    }
    if (scope.brandSlug && product.brandSlug !== scope.brandSlug) return false;
    if (
      scope.subcategorySlug &&
      createCatalogSubcategorySlug(
        product.categorySlug,
        product.subcategory,
      ) !== scope.subcategorySlug
    ) {
      return false;
    }
    if (allowedSlugs && !allowedSlugs.has(product.slug)) return false;
    return true;
  });
}

function createOptions(
  products: readonly ProductCardView[],
): CatalogFilterOptions {
  const brandMap = new Map<string, string>(
    products.flatMap((product) =>
      product.brandSlug && product.brandName
        ? [[product.brandSlug, product.brandName] as const]
        : [],
    ),
  );

  return {
    brands: [...brandMap.entries()]
      .map(([value, label]) => ({ value, label }))
      .sort((left, right) => left.label.localeCompare(right.label, "it")),
    categories: catalogCategories.map((category) => ({
      value: category.slug,
      label: category.name,
    })),
    countries: [
      ...new Set(
        products
          .map((product) => product.country)
          .filter((country): country is string => Boolean(country)),
      ),
    ]
      .sort((left, right) => left.localeCompare(right, "it"))
      .map((country) => ({ value: country, label: country })),
  };
}

export class DemoCatalogRepository implements CatalogRepository {
  async queryProducts(query: CatalogQuery) {
    const scopedProducts = createCatalogProductViews(
      selectScope(query.scope).map(mapCatalogProductToDomain),
    );
    const scopedOfferProducts = query.scope?.onlyOffers
      ? scopedProducts.filter((product) => product.offer)
      : scopedProducts;
    const filteredProducts = sortCatalogProducts(
      filterCatalogProducts(scopedOfferProducts, query.filters),
      query.sort,
    );
    const totalPages = Math.max(
      1,
      Math.ceil(filteredProducts.length / query.pageSize),
    );
    const page = Math.min(query.page, totalPages);
    const start = (page - 1) * query.pageSize;

    return {
      items: filteredProducts.slice(start, start + query.pageSize),
      page,
      pageSize: query.pageSize,
      totalCount: filteredProducts.length,
      totalPages,
    };
  }

  async getFilterOptions(scope?: CatalogQueryScope) {
    return createOptions(
      createCatalogProductViews(
        selectScope(scope).map(mapCatalogProductToDomain),
      ),
    );
  }

  async getProductBySlug(slug: string) {
    const product = getProductBySlug(slug);
    return product
      ? createCatalogProductView(mapCatalogProductToDomain(product))
      : null;
  }

  async getProductByCode(code: string) {
    const product = catalogProducts.find(
      (candidate) => candidate.code === code,
    );
    return product
      ? createCatalogProductView(mapCatalogProductToDomain(product))
      : null;
  }

  async getProductsBySlugs(slugs: readonly string[]) {
    const requested = new Set(slugs);
    const productsBySlug = new Map(
      createCatalogProductViews(
        catalogProducts
          .filter((product) => requested.has(product.slug))
          .map(mapCatalogProductToDomain),
      ).map((product) => [product.slug, product]),
    );

    return slugs.flatMap((slug) => {
      const product = productsBySlug.get(slug);
      return product ? [product] : [];
    });
  }

  async getRelatedProducts(slug: string, limit: number) {
    return createCatalogProductViews(
      getRelatedProducts(slug, limit).map(mapCatalogProductToDomain),
    );
  }

  async search(query: string, options: CatalogSearchOptions = {}) {
    return searchCatalog({
      query,
      products: createCatalogProductViews(
        catalogProducts.map(mapCatalogProductToDomain),
      ),
      brands: catalogBrands,
      categories: catalogCategories,
      limits: {
        products: options.productLimit,
        brands: options.brandLimit,
        categories: options.categoryLimit,
      },
    });
  }
}
