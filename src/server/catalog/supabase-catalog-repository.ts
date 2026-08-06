import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  isCatalogSearchQuery,
  normalizeCatalogSearchValue,
} from "@/features/search/catalog-search";
import { createSupabaseServerClient } from "@/server/supabase";
import type {
  CatalogRepository,
  CatalogSearchOptions,
} from "@/server/catalog/catalog-repository";
import {
  getSupabaseProductId,
  mapSupabaseBrand,
  mapSupabaseCategory,
  mapSupabaseProductCard,
  mapSupabaseProductDetail,
  mapSupabaseProductImage,
} from "@/server/catalog/supabase-catalog-mapper";
import type {
  CatalogFilterOptions,
  CatalogFilters,
  CatalogQuery,
  CatalogQueryScope,
  CatalogSort,
  ProductCardView,
  ProductDetailView,
} from "@/types/catalog";
import type { Database } from "@/types/database.generated";

type CatalogSupabaseClient = SupabaseClient<Database>;
type CatalogClientFactory = () => Promise<CatalogSupabaseClient>;

const maximumPageSize = 500;
const maximumSearchProducts = 100;
const maximumSearchTaxonomyResults = 50;

const productCardColumns = [
  "product_id",
  "code",
  "slug",
  "name",
  "producer",
  "country",
  "capacity_ml",
  "capacity_label",
  "pack_quantity",
  "alcohol_percentage",
  "is_new",
  "is_limited",
  "brand_slug",
  "brand_name",
  "category_slug",
  "category_name",
  "subcategory_slug",
  "subcategory_name",
  "stock_quantity",
  "reserved_quantity",
  "available_quantity",
  "regular_net_amount_minor",
  "promotional_net_amount_minor",
  "effective_net_amount_minor",
  "gross_amount_minor",
  "previous_gross_amount_minor",
  "vat_rate_basis_points",
  "currency",
  "offer_id",
  "image_path",
  "thumbnail_path",
  "image_alt_text",
  "image_width",
  "image_height",
].join(",");

const productDetailColumns = [
  productCardColumns,
  "description",
  "tasting_notes",
  "service_notes",
  "origin",
].join(",");

function createRangeExpressions(
  values: readonly string[],
  expressions: Readonly<Record<string, string>>,
) {
  return values.flatMap((value) => {
    const expression = expressions[value];
    return expression ? [expression] : [];
  });
}

function clampLimit(
  value: number | undefined,
  fallback: number,
  maximum: number,
) {
  if (value === undefined) return fallback;
  return Math.max(1, Math.min(Math.trunc(value), maximum));
}

function databaseError(operation: string, error: { message: string }) {
  return new Error(`Catalogo locale: ${operation} non riuscita.`, {
    cause: error,
  });
}

export class SupabaseCatalogRepository implements CatalogRepository {
  constructor(
    private readonly createClient: CatalogClientFactory = createSupabaseServerClient,
  ) {}

  private applyScopeAndFilters<
    QueryBuilder extends {
      eq(column: string, value: unknown): QueryBuilder;
      in(column: string, values: readonly unknown[]): QueryBuilder;
      is(column: string, value: null): QueryBuilder;
      not(column: string, operator: string, value: unknown): QueryBuilder;
      or(filters: string): QueryBuilder;
    },
  >(request: QueryBuilder, filters: CatalogFilters, scope?: CatalogQueryScope) {
    let query = request;

    if (scope?.categorySlug === "bottiglie-rare") {
      query = query.eq("is_limited", true);
    } else if (scope?.categorySlug) {
      query = query.eq("category_slug", scope.categorySlug);
    }
    if (scope?.subcategorySlug) {
      query = query.eq("subcategory_slug", scope.subcategorySlug);
    }
    if (scope?.brandSlug) query = query.eq("brand_slug", scope.brandSlug);
    if (scope?.productSlugs) {
      query = query.in("slug", [...scope.productSlugs]);
    }
    if (scope?.onlyOffers) query = query.not("offer_id", "is", null);

    if (filters.brands.length > 0) {
      query = query.in("brand_slug", filters.brands);
    }
    if (filters.categories.length > 0) {
      query = query.in("category_slug", filters.categories);
    }
    if (filters.countries.length > 0) {
      query = query.in("country", filters.countries);
    }

    const priceExpressions = createRangeExpressions(filters.priceRanges, {
      "under-30": "gross_amount_minor.lt.3000",
      "30-60": "and(gross_amount_minor.gte.3000,gross_amount_minor.lt.6000)",
      "60-150": "and(gross_amount_minor.gte.6000,gross_amount_minor.lt.15000)",
      "over-150": "gross_amount_minor.gte.15000",
    });
    if (priceExpressions.length > 0) {
      query = query.or(priceExpressions.join(","));
    }

    const capacityExpressions = createRangeExpressions(filters.capacities, {
      small: "capacity_ml.lte.500",
      "700": "capacity_ml.eq.700",
      "750": "capacity_ml.eq.750",
      large: "capacity_ml.gte.1000",
    });
    if (capacityExpressions.length > 0) {
      query = query.or(capacityExpressions.join(","));
    }

    const alcoholExpressions = createRangeExpressions(filters.alcoholRanges, {
      "under-30": "alcohol_percentage.lt.30",
      "30-40": "and(alcohol_percentage.gte.30,alcohol_percentage.lte.40)",
      "over-40": "alcohol_percentage.gt.40",
      "not-declared": "alcohol_percentage.is.null",
    });
    if (alcoholExpressions.length > 0) {
      query = query.or(alcoholExpressions.join(","));
    }

    if (filters.onlyOnOffer) query = query.not("offer_id", "is", null);
    if (filters.onlyNew) query = query.eq("is_new", true);
    if (filters.onlyLimited) query = query.eq("is_limited", true);
    if (filters.onlyAvailable) {
      query = query.or("available_quantity.gt.0");
    }

    return query;
  }

  private applyOrdering<
    QueryBuilder extends {
      order(
        column: string,
        options?: { ascending?: boolean; nullsFirst?: boolean },
      ): QueryBuilder;
    },
  >(request: QueryBuilder, sort: CatalogSort) {
    let query = request;

    if (sort === "price-asc") {
      query = query.order("gross_amount_minor", { ascending: true });
    } else if (sort === "price-desc") {
      query = query.order("gross_amount_minor", { ascending: false });
    } else if (sort === "name") {
      query = query.order("name", { ascending: true });
    } else if (sort === "newest") {
      query = query
        .order("is_new", { ascending: false })
        .order("updated_at", { ascending: false });
    } else {
      query = query
        .order("is_limited", { ascending: false })
        .order("is_new", { ascending: false })
        .order("name", { ascending: true });
    }

    return query.order("code", { ascending: true });
  }

  async queryProducts(query: CatalogQuery) {
    if (query.scope?.productSlugs?.length === 0) {
      return {
        items: [],
        page: 1,
        pageSize: Math.min(query.pageSize, maximumPageSize),
        totalCount: 0,
        totalPages: 1,
      };
    }

    const client = await this.createClient();
    const pageSize = Math.max(1, Math.min(query.pageSize, maximumPageSize));

    const executePage = async (page: number) => {
      const start = (page - 1) * pageSize;
      let request = client
        .from("catalog_products_view")
        .select(productCardColumns, { count: "exact" });
      request = this.applyScopeAndFilters(request, query.filters, query.scope);
      request = this.applyOrdering(request, query.sort);
      return request.range(start, start + pageSize - 1);
    };

    const requestedPage = Math.max(1, query.page);
    let response = await executePage(requestedPage);
    if (response.error) throw databaseError("query prodotti", response.error);

    const totalCount = response.count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const page = Math.min(requestedPage, totalPages);
    if (page !== requestedPage && totalCount > 0) {
      response = await executePage(page);
      if (response.error) throw databaseError("query prodotti", response.error);
    }

    return {
      items: (response.data ?? []).map(mapSupabaseProductCard),
      page,
      pageSize,
      totalCount,
      totalPages,
    };
  }

  async getFilterOptions(
    scope?: CatalogQueryScope,
  ): Promise<CatalogFilterOptions> {
    const client = await this.createClient();
    const args: Database["public"]["Functions"]["catalog_filter_options"]["Args"] =
      {
        only_offers: scope?.onlyOffers ?? false,
        ...(scope?.categorySlug && scope.categorySlug !== "bottiglie-rare"
          ? { category_slug: scope.categorySlug }
          : {}),
        ...(scope?.subcategorySlug
          ? { subcategory_slug: scope.subcategorySlug }
          : {}),
        ...(scope?.brandSlug ? { brand_slug: scope.brandSlug } : {}),
        ...(scope?.productSlugs
          ? { product_slugs: [...scope.productSlugs] }
          : {}),
      };
    const response = await client.rpc("catalog_filter_options", args);
    if (response.error) {
      throw databaseError("opzioni filtri", response.error);
    }

    const rows = response.data ?? [];
    const options = (kind: "brand" | "category" | "country") =>
      rows
        .filter((row) => row.kind === kind)
        .map((row) => ({ value: row.value, label: row.label }));

    return {
      brands: options("brand"),
      categories: options("category"),
      countries: options("country"),
    };
  }

  private async getProduct(
    field: "slug" | "code",
    value: string,
  ): Promise<ProductDetailView | null> {
    const client = await this.createClient();
    const productResponse = await client
      .from("catalog_products_view")
      .select(productDetailColumns)
      .eq(field, value)
      .maybeSingle();
    if (productResponse.error) {
      throw databaseError("dettaglio prodotto", productResponse.error);
    }
    if (!productResponse.data) return null;

    const productId = getSupabaseProductId(productResponse.data);
    const imageResponse = await client
      .from("product_images")
      .select(
        "storage_path,thumbnail_path,alt_text,width,height,sort_order,is_primary",
      )
      .eq("product_id", productId)
      .order("sort_order", { ascending: true });
    if (imageResponse.error) {
      throw databaseError("galleria prodotto", imageResponse.error);
    }

    const media = (imageResponse.data ?? []).map(mapSupabaseProductImage);
    return mapSupabaseProductDetail(productResponse.data, media);
  }

  async getProductBySlug(slug: string) {
    return this.getProduct("slug", slug);
  }

  async getProductByCode(code: string) {
    return this.getProduct("code", code.trim().toUpperCase());
  }

  async getProductsBySlugs(slugs: readonly string[]) {
    if (slugs.length === 0) return [];

    const requestedSlugs = [...new Set(slugs)].slice(0, 100);
    const client = await this.createClient();
    const response = await client
      .from("catalog_products_view")
      .select(productCardColumns)
      .in("slug", requestedSlugs)
      .limit(requestedSlugs.length);
    if (response.error) {
      throw databaseError("risoluzione prodotti", response.error);
    }

    const productsBySlug = new Map(
      (response.data ?? [])
        .map(mapSupabaseProductCard)
        .map((product) => [product.slug, product] as const),
    );

    return slugs.flatMap((slug) => {
      const product = productsBySlug.get(slug);
      return product ? [product] : [];
    });
  }

  async getRelatedProducts(slug: string, limit: number) {
    const productLimit = clampLimit(limit, 4, 12);
    const client = await this.createClient();
    const sourceResponse = await client
      .from("products")
      .select("category_id")
      .eq("slug", slug)
      .maybeSingle();
    if (sourceResponse.error) {
      throw databaseError("categoria prodotto", sourceResponse.error);
    }
    if (!sourceResponse.data?.category_id) return [];

    const relatedResponse = await client
      .from("catalog_products_view")
      .select(productCardColumns)
      .eq("category_id", sourceResponse.data.category_id)
      .neq("slug", slug)
      .order("is_limited", { ascending: false })
      .order("name", { ascending: true })
      .order("code", { ascending: true })
      .limit(productLimit);
    if (relatedResponse.error) {
      throw databaseError("prodotti correlati", relatedResponse.error);
    }

    const relatedProducts = (relatedResponse.data ?? []).map(
      mapSupabaseProductCard,
    );
    if (relatedProducts.length >= productLimit) return relatedProducts;

    const excludedSlugs = [
      slug,
      ...relatedProducts.map((product) => product.slug),
    ];
    const complementaryResponse = await client
      .from("catalog_products_view")
      .select(productCardColumns)
      .neq("category_id", sourceResponse.data.category_id)
      .not("slug", "in", `(${excludedSlugs.join(",")})`)
      .order("is_limited", { ascending: false })
      .order("name", { ascending: true })
      .order("code", { ascending: true })
      .limit(productLimit - relatedProducts.length);
    if (complementaryResponse.error) {
      throw databaseError(
        "prodotti correlati complementari",
        complementaryResponse.error,
      );
    }

    return [
      ...relatedProducts,
      ...(complementaryResponse.data ?? []).map(mapSupabaseProductCard),
    ];
  }

  async search(query: string, options: CatalogSearchOptions = {}) {
    const normalizedQuery = normalizeCatalogSearchValue(query);
    const searchable = isCatalogSearchQuery(query);
    if (!searchable) {
      return {
        query: query.trim(),
        normalizedQuery,
        isSearchable: false,
        products: [],
        brands: [],
        categories: [],
        totalCount: 0,
      };
    }

    const productLimit = clampLimit(
      options.productLimit,
      24,
      maximumSearchProducts,
    );
    const brandLimit = clampLimit(
      options.brandLimit,
      12,
      maximumSearchTaxonomyResults,
    );
    const categoryLimit = clampLimit(
      options.categoryLimit,
      12,
      maximumSearchTaxonomyResults,
    );
    const client = await this.createClient();
    const searchPattern = `%${normalizedQuery}%`;

    const [productIdsResponse, brandResponse, categoryResponse, subcategories] =
      await Promise.all([
        client
          .from("products")
          .select("id")
          .textSearch("search_document", normalizedQuery, {
            config: "simple",
            type: "plain",
          })
          .limit(1_000),
        client
          .from("catalog_brands_view")
          .select("slug,name,country,description,product_count", {
            count: "exact",
          })
          .ilike("search_text", searchPattern)
          .order("name", { ascending: true })
          .limit(brandLimit),
        client
          .from("catalog_categories_view")
          .select("slug,name,description,subcategories", { count: "exact" })
          .ilike("search_text", searchPattern)
          .order("sort_order", { ascending: true })
          .order("name", { ascending: true })
          .limit(categoryLimit),
        client
          .from("categories")
          .select("id,name")
          .not("parent_id", "is", null)
          .order("name", { ascending: true })
          .limit(200),
      ]);

    if (productIdsResponse.error) {
      throw databaseError("indice ricerca prodotti", productIdsResponse.error);
    }
    if (brandResponse.error) {
      throw databaseError("ricerca marchi", brandResponse.error);
    }
    if (categoryResponse.error) {
      throw databaseError("ricerca categorie", categoryResponse.error);
    }
    if (subcategories.error) {
      throw databaseError("ricerca sottocategorie", subcategories.error);
    }

    const matchingSubcategoryIds = (subcategories.data ?? [])
      .filter((subcategory) =>
        normalizeCatalogSearchValue(subcategory.name).includes(normalizedQuery),
      )
      .map((subcategory) => subcategory.id);
    const productFilters = [
      ...(productIdsResponse.data?.length
        ? [
            `product_id.in.(${productIdsResponse.data.map(({ id }) => id).join(",")})`,
          ]
        : []),
      ...(brandResponse.data?.length
        ? [
            `brand_slug.in.(${brandResponse.data
              .flatMap((brand) => (brand.slug ? [brand.slug] : []))
              .join(",")})`,
          ]
        : []),
      ...(categoryResponse.data?.length
        ? [
            `category_slug.in.(${categoryResponse.data
              .flatMap((category) => (category.slug ? [category.slug] : []))
              .join(",")})`,
          ]
        : []),
      ...(matchingSubcategoryIds.length
        ? [`subcategory_id.in.(${matchingSubcategoryIds.join(",")})`]
        : []),
      ...(normalizedQuery === "in offerta" ? ["offer_id.not.is.null"] : []),
    ].filter((filter) => !filter.endsWith("in.()"));

    let products: ProductCardView[] = [];
    let productCount = 0;
    if (productFilters.length > 0) {
      const productResponse = await client
        .from("catalog_products_view")
        .select(productCardColumns, { count: "exact" })
        .or(productFilters.join(","))
        .order("name", { ascending: true })
        .order("code", { ascending: true })
        .limit(productLimit);
      if (productResponse.error) {
        throw databaseError("ricerca prodotti", productResponse.error);
      }
      products = (productResponse.data ?? []).map(mapSupabaseProductCard);
      productCount = productResponse.count ?? 0;
    }

    return {
      query: query.trim(),
      normalizedQuery,
      isSearchable: true,
      products,
      brands: (brandResponse.data ?? []).map(mapSupabaseBrand),
      categories: (categoryResponse.data ?? []).map(mapSupabaseCategory),
      totalCount:
        productCount +
        (brandResponse.count ?? 0) +
        (categoryResponse.count ?? 0),
    };
  }
}
