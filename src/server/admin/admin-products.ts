import "server-only";

import { createSupabaseAdminClient } from "@/server/supabase-admin";

export const adminProductsPageSize = 50;

export type AdminProductAvailability = "all" | "available" | "unavailable";

export type AdminProductStatus = "all" | "active" | "draft" | "archived";

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

export type AdminProductDetail = {
  id: string;
  code: string;
  name: string;
  slug: string;
  status: string;
  description: string | null;
  tastingNotes: string | null;
  serviceNotes: string | null;
  origin: string | null;
  producer: string | null;
  country: string | null;
  capacityMl: number | null;
  capacityLabel: string;
  packQuantity: number | null;
  alcoholPercentage: number | null;
  isNew: boolean;
  isLimited: boolean;
  brandId: string | null;
  brandName: string | null;
  categoryId: string;
  categoryName: string | null;
  subcategoryId: string | null;
  subcategoryName: string | null;
  stockQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  netAmountMinor: number | null;
  vatRateBasisPoints: number | null;
  currency: string | null;
};

export async function getAdminProductDetail(
  productId: string,
): Promise<AdminProductDetail | null> {
  const admin = createSupabaseAdminClient();

  const [productResponse, inventoryResponse, priceResponse] = await Promise.all(
    [
      admin
        .from("products")
        .select(
          `
        id,
        code,
        name,
        slug,
        status,
        description,
        tasting_notes,
        service_notes,
        origin,
        producer,
        country,
        capacity_ml,
        capacity_label,
        pack_quantity,
        alcohol_percentage,
        is_new,
        is_limited,
        deleted_at,
        brand_id,
        category_id,
        subcategory_id,
        brands (
          name
        ),
        category:categories!products_category_id_fkey (
          name
        ),
        subcategory:categories!products_subcategory_id_fkey (
          name
        )
      `,
        )
        .eq("id", productId)
        .is("deleted_at", null)
        .maybeSingle(),

      admin
        .from("inventory")
        .select(
          `
        stock_quantity,
        reserved_quantity,
        available_quantity
      `,
        )
        .eq("product_id", productId)
        .maybeSingle(),

      admin
        .from("prices")
        .select(
          `
        net_amount_minor,
        vat_rate_basis_points,
        currency
      `,
        )
        .eq("product_id", productId)
        .is("valid_to", null)
        .maybeSingle(),
    ],
  );

  if (productResponse.error) {
    throw new Error(
      `Impossibile caricare il prodotto admin: ${productResponse.error.message}`,
    );
  }

  if (inventoryResponse.error) {
    throw new Error(
      `Impossibile caricare lo stock prodotto: ${inventoryResponse.error.message}`,
    );
  }

  if (priceResponse.error) {
    throw new Error(
      `Impossibile caricare il prezzo prodotto: ${priceResponse.error.message}`,
    );
  }

  const product = productResponse.data;

  if (!product) {
    return null;
  }

  const brand = Array.isArray(product.brands)
    ? product.brands[0]
    : product.brands;

  const category = Array.isArray(product.category)
    ? product.category[0]
    : product.category;

  const subcategory = Array.isArray(product.subcategory)
    ? product.subcategory[0]
    : product.subcategory;

  const inventory = inventoryResponse.data;
  const price = priceResponse.data;

  return {
    id: product.id,
    code: product.code,
    name: product.name,
    slug: product.slug,
    status: product.status,
    description: product.description,
    tastingNotes: product.tasting_notes,
    serviceNotes: product.service_notes,
    origin: product.origin,
    producer: product.producer,
    country: product.country,
    capacityMl: product.capacity_ml,
    capacityLabel: product.capacity_label,
    packQuantity: product.pack_quantity,
    alcoholPercentage:
      product.alcohol_percentage === null
        ? null
        : Number(product.alcohol_percentage),
    isNew: product.is_new,
    isLimited: product.is_limited,
    brandId: product.brand_id,
    brandName: brand?.name ?? null,
    categoryId: product.category_id,
    categoryName: category?.name ?? null,
    subcategoryId: product.subcategory_id,
    subcategoryName: subcategory?.name ?? null,
    stockQuantity: inventory?.stock_quantity ?? 0,
    reservedQuantity: inventory?.reserved_quantity ?? 0,
    availableQuantity: inventory?.available_quantity ?? 0,
    netAmountMinor:
      price?.net_amount_minor === null || price?.net_amount_minor === undefined
        ? null
        : Number(price.net_amount_minor),
    vatRateBasisPoints: price?.vat_rate_basis_points ?? null,
    currency: price?.currency ?? null,
  };
}

export type AdminProductEditOptions = {
  brands: Array<{
    id: string;
    name: string;
  }>;
  categories: Array<{
    id: string;
    name: string;
  }>;
  subcategories: Array<{
    id: string;
    name: string;
    parentId: string;
  }>;
};

export async function getAdminProductEditOptions(): Promise<AdminProductEditOptions> {
  const admin = createSupabaseAdminClient();

  const [brandsResponse, categoriesResponse, subcategoriesResponse] =
    await Promise.all([
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

      admin
        .from("categories")
        .select("id,name,parent_id")
        .is("deleted_at", null)
        .not("parent_id", "is", null)
        .order("name", { ascending: true }),
    ]);

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

  if (subcategoriesResponse.error) {
    throw new Error(
      `Impossibile caricare le sottocategorie admin: ${subcategoriesResponse.error.message}`,
    );
  }

  return {
    brands: brandsResponse.data ?? [],
    categories: categoriesResponse.data ?? [],
    subcategories: (subcategoriesResponse.data ?? [])
      .filter((item) => item.parent_id)
      .map((item) => ({
        id: item.id,
        name: item.name,
        parentId: item.parent_id as string,
      })),
  };
}
