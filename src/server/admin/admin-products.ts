import "server-only";

import { createSupabaseAdminClient } from "@/server/supabase-admin";

export const adminProductsPageSize = 50;

export type AdminProductAvailability = "all" | "available" | "unavailable";

export type AdminProductStatus = "all" | "active" | "draft";

export type AdminProductsFilters = {
  query?: string;
  status?: AdminProductStatus;
  brandId?: string;
  categoryId?: string;
  availability?: AdminProductAvailability;
  page?: number;
};

export type AdminProductListItem = {
  id: string;
  code: string;
  name: string;
  status: string;
  brandName: string | null;
  categoryName: string | null;
  stockQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
};

export type AdminCatalogFilterOption = {
  id: string;
  name: string;
};

export type AdminProductsResult = {
  products: AdminProductListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  brands: AdminCatalogFilterOption[];
  categories: AdminCatalogFilterOption[];
};

function normalizePage(value: number | undefined) {
  if (!value || !Number.isFinite(value) || value < 1) {
    return 1;
  }

  return Math.floor(value);
}

function escapePostgrestSearch(value: string) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("%", "\\%")
    .replaceAll("_", "\\_")
    .replaceAll(",", "\\,")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

export async function getAdminProducts(
  filters: AdminProductsFilters = {},
): Promise<AdminProductsResult> {
  const admin = createSupabaseAdminClient();

  const requestedPage = normalizePage(filters.page);
  const status = filters.status ?? "all";
  const availability = filters.availability ?? "all";
  const query = filters.query?.trim() ?? "";

  const inventoryRelation =
    availability === "all" ? "inventory" : "inventory!inner";

  let productsQuery = admin
    .from("products")
    .select(
      `
        id,
        code,
        name,
        status,
        deleted_at,
        brands (
          name
        ),
        categories!products_category_id_fkey (
          name
        ),
        ${inventoryRelation} (
          stock_quantity,
          reserved_quantity,
          available_quantity
        )
      `,
      { count: "exact" },
    )
    .is("deleted_at", null);

  if (query) {
    const search = escapePostgrestSearch(query);

    productsQuery = productsQuery.or(
      `name.ilike.%${search}%,code.ilike.%${search}%`,
    );
  }

  if (status !== "all") {
    productsQuery = productsQuery.eq("status", status);
  }

  if (filters.brandId) {
    productsQuery = productsQuery.eq("brand_id", filters.brandId);
  }

  if (filters.categoryId) {
    productsQuery = productsQuery.eq("category_id", filters.categoryId);
  }

  if (availability === "available") {
    productsQuery = productsQuery.gt("inventory.available_quantity", 0);
  }

  if (availability === "unavailable") {
    productsQuery = productsQuery.lte("inventory.available_quantity", 0);
  }

  const countOnlyResponse = await productsQuery
    .order("name", { ascending: true })
    .order("code", { ascending: true })
    .range(0, 0);

  if (countOnlyResponse.error) {
    throw new Error(
      `Impossibile contare i prodotti admin: ${countOnlyResponse.error.message}`,
    );
  }

  const totalCount = countOnlyResponse.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / adminProductsPageSize));

  const page = Math.min(requestedPage, totalPages);
  const from = (page - 1) * adminProductsPageSize;
  const to = from + adminProductsPageSize - 1;

  let pageQuery = admin
    .from("products")
    .select(
      `
        id,
        code,
        name,
        status,
        deleted_at,
        brands (
          name
        ),
        categories!products_category_id_fkey (
          name
        ),
        ${inventoryRelation} (
          stock_quantity,
          reserved_quantity,
          available_quantity
        )
      `,
    )
    .is("deleted_at", null);

  if (query) {
    const search = escapePostgrestSearch(query);

    pageQuery = pageQuery.or(`name.ilike.%${search}%,code.ilike.%${search}%`);
  }

  if (status !== "all") {
    pageQuery = pageQuery.eq("status", status);
  }

  if (filters.brandId) {
    pageQuery = pageQuery.eq("brand_id", filters.brandId);
  }

  if (filters.categoryId) {
    pageQuery = pageQuery.eq("category_id", filters.categoryId);
  }

  if (availability === "available") {
    pageQuery = pageQuery.gt("inventory.available_quantity", 0);
  }

  if (availability === "unavailable") {
    pageQuery = pageQuery.lte("inventory.available_quantity", 0);
  }

  const [productsResponse, brandsResponse, categoriesResponse] =
    await Promise.all([
      pageQuery
        .order("name", { ascending: true })
        .order("code", { ascending: true })
        .range(from, to),

      admin
        .from("brands")
        .select("id,name")
        .is("deleted_at", null)
        .order("name", { ascending: true }),

      admin
        .from("categories")
        .select("id,name")
        .is("deleted_at", null)
        .is("parent_id", null)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
    ]);

  if (productsResponse.error) {
    throw new Error(
      `Impossibile caricare i prodotti admin: ${productsResponse.error.message}`,
    );
  }

  if (brandsResponse.error) {
    throw new Error(
      `Impossibile caricare i marchi admin: ${brandsResponse.error.message}`,
    );
  }

  if (categoriesResponse.error) {
    throw new Error(
      `Impossibile caricare le categorie admin: ${categoriesResponse.error.message}`,
    );
  }

  const products = (productsResponse.data ?? []).map((product) => {
    const brand = Array.isArray(product.brands)
      ? product.brands[0]
      : product.brands;

    const category = Array.isArray(product.categories)
      ? product.categories[0]
      : product.categories;

    const inventory = Array.isArray(product.inventory)
      ? product.inventory[0]
      : product.inventory;

    return {
      id: product.id,
      code: product.code,
      name: product.name,
      status: product.status,
      brandName: brand?.name ?? null,
      categoryName: category?.name ?? null,
      stockQuantity: inventory?.stock_quantity ?? 0,
      reservedQuantity: inventory?.reserved_quantity ?? 0,
      availableQuantity: inventory?.available_quantity ?? 0,
    };
  });

  return {
    products,
    totalCount,
    page,
    pageSize: adminProductsPageSize,
    totalPages,
    brands: brandsResponse.data ?? [],
    categories: categoriesResponse.data ?? [],
  };
}
