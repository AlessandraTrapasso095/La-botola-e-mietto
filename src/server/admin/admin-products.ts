import "server-only";

import { getServerAdminUser } from "@/server/admin/admin-user";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

export const adminProductsPageSize = 50;

async function requireAdmin() {
  const adminUser = await getServerAdminUser();

  if (!adminUser) {
    throw new Error("Accesso amministratore richiesto.");
  }

  return adminUser;
}

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
  await requireAdmin();

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
  characteristics: string | null;
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
  primaryImage: {
    id: string;
    storagePath: string;
    thumbnailPath: string | null;
    altText: string;
    width: number;
    height: number;
  } | null;
};

export async function getAdminProductDetail(
  productId: string,
): Promise<AdminProductDetail | null> {
  await requireAdmin();

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
        characteristics,
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

  const primaryImageResponse = await admin
    .from("product_images")
    .select(
      "id,storage_path,thumbnail_path,alt_text,width,height,is_primary,sort_order",
    )
    .eq("product_id", productId)
    .order("is_primary", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (primaryImageResponse.error) {
    throw new Error(
      `Impossibile caricare l’immagine prodotto: ${primaryImageResponse.error.message}`,
    );
  }

  const primaryImage = primaryImageResponse.data
    ? {
        id: primaryImageResponse.data.id,
        storagePath: primaryImageResponse.data.storage_path,
        thumbnailPath: primaryImageResponse.data.thumbnail_path,
        altText: primaryImageResponse.data.alt_text,
        width: primaryImageResponse.data.width,
        height: primaryImageResponse.data.height,
      }
    : null;

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
    characteristics: product.characteristics,
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
    primaryImage,
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
  await requireAdmin();

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

export type AdminTaxonomyBrand = {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  description: string | null;
  status: string;
};

export type AdminTaxonomyCategory = {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  status: string;
};

export type AdminTaxonomyData = {
  brands: AdminTaxonomyBrand[];
  categories: AdminTaxonomyCategory[];
  subcategories: AdminTaxonomyCategory[];
};

export async function getAdminTaxonomyData(): Promise<AdminTaxonomyData> {
  await requireAdmin();

  const admin = createSupabaseAdminClient();

  const [brandsResponse, categoriesResponse] = await Promise.all([
    admin
      .from("brands")
      .select("id,name,slug,country,description,status")
      .is("deleted_at", null)
      .order("name", { ascending: true }),

    admin
      .from("categories")
      .select("id,parent_id,name,slug,description,sort_order,status")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
  ]);

  if (brandsResponse.error) {
    throw new Error(
      `Impossibile caricare i marchi: ${brandsResponse.error.message}`,
    );
  }

  if (categoriesResponse.error) {
    throw new Error(
      `Impossibile caricare le categorie: ${categoriesResponse.error.message}`,
    );
  }

  const categories = (categoriesResponse.data ?? []).map((item) => ({
    id: item.id,
    parentId: item.parent_id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    sortOrder: item.sort_order,
    status: item.status,
  }));

  return {
    brands: brandsResponse.data ?? [],
    categories: categories.filter((item) => item.parentId === null),
    subcategories: categories.filter((item) => item.parentId !== null),
  };
}

export type AdminProductInventoryMovement = {
  id: string;
  movementType: string;
  stockDelta: number;
  reservedDelta: number;
  stockBefore: number;
  stockAfter: number;
  reservedBefore: number;
  reservedAfter: number;
  note: string | null;
  orderId: string | null;
  orderNumber: string | null;
  createdById: string | null;
  createdByName: string;
  createdAt: string;
};

export async function getAdminProductInventoryMovements(
  productId: string,
  limit = 25,
): Promise<AdminProductInventoryMovement[]> {
  await requireAdmin();

  const admin = createSupabaseAdminClient();

  const normalizedLimit = Math.min(Math.max(Math.trunc(limit), 1), 100);

  const movementsResponse = await admin
    .from("inventory_movements")
    .select(
      `
        id,
        movement_type,
        stock_delta,
        reserved_delta,
        stock_before,
        stock_after,
        reserved_before,
        reserved_after,
        note,
        order_id,
        created_by,
        created_at,
        orders (
          order_number
        )
      `,
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .limit(normalizedLimit);

  if (movementsResponse.error) {
    throw new Error(
      `Impossibile caricare lo storico magazzino: ${movementsResponse.error.message}`,
    );
  }

  const movements = movementsResponse.data ?? [];

  const creatorIds = Array.from(
    new Set(
      movements
        .map((movement) => movement.created_by)
        .filter((id): id is string => Boolean(id)),
    ),
  );

  const creatorsResponse =
    creatorIds.length > 0
      ? await admin
          .from("profiles")
          .select("id,first_name,last_name,email")
          .in("id", creatorIds)
      : null;

  if (creatorsResponse?.error) {
    throw new Error(
      `Impossibile caricare gli autori dei movimenti: ${creatorsResponse.error.message}`,
    );
  }

  const creatorNames = new Map(
    (creatorsResponse?.data ?? []).map((profile) => {
      const fullName = [profile.first_name, profile.last_name]
        .filter(Boolean)
        .join(" ")
        .trim();

      return [profile.id, fullName || profile.email || "Amministratore"];
    }),
  );

  return movements.map((movement) => {
    const order = Array.isArray(movement.orders)
      ? movement.orders[0]
      : movement.orders;

    return {
      id: movement.id,
      movementType: movement.movement_type,
      stockDelta: movement.stock_delta,
      reservedDelta: movement.reserved_delta,
      stockBefore: movement.stock_before,
      stockAfter: movement.stock_after,
      reservedBefore: movement.reserved_before,
      reservedAfter: movement.reserved_after,
      note: movement.note,
      orderId: movement.order_id,
      orderNumber: order?.order_number ?? null,
      createdById: movement.created_by,
      createdByName: movement.created_by
        ? (creatorNames.get(movement.created_by) ?? "Amministratore")
        : "Sistema",
      createdAt: movement.created_at,
    };
  });
}

export type AdminProductOffer = {
  id: string;
  promotionalNetAmountMinor: number | null;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getAdminProductOffer(
  productId: string,
): Promise<AdminProductOffer | null> {
  await requireAdmin();

  const admin = createSupabaseAdminClient();

  const offerResponse = await admin
    .from("offers")
    .select(
      `
        id,
        promotional_net_amount_minor,
        starts_at,
        ends_at,
        is_active,
        created_at,
        updated_at
      `,
    )
    .eq("product_id", productId)
    .eq("is_active", true)
    .maybeSingle();

  if (offerResponse.error) {
    throw new Error(
      `Impossibile caricare l’offerta prodotto: ${offerResponse.error.message}`,
    );
  }

  const offer = offerResponse.data;

  if (!offer) {
    return null;
  }

  return {
    id: offer.id,
    promotionalNetAmountMinor:
      offer.promotional_net_amount_minor === null
        ? null
        : Number(offer.promotional_net_amount_minor),
    startsAt: offer.starts_at,
    endsAt: offer.ends_at,
    isActive: offer.is_active,
    createdAt: offer.created_at,
    updatedAt: offer.updated_at,
  };
}
