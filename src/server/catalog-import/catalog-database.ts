import postgres, { type Sql, type TransactionSql } from "postgres";

import { commerceConfig } from "@/config/commerce";
import { createCatalogSubcategorySlug } from "@/lib/catalog-taxonomy";
import type {
  CatalogImportAction,
  CatalogImportIssue,
  CatalogImportResult,
  CatalogImportRow,
  CatalogImportSource,
  CatalogImportSummary,
  EntityImportStats,
} from "@/server/catalog-import/types";
import { createEmptyEntityStats } from "@/server/catalog-import/types";

type DatabaseRow = Record<string, unknown>;

type CatalogDatabaseOptions = {
  databaseUrl: string;
  runId: string;
};

function valueEquals(left: unknown, right: unknown): boolean {
  if (left === null || left === undefined) return right === null;
  if (right === null || right === undefined) return left === null;
  return String(left) === String(right);
}

function rowMatches(
  current: DatabaseRow | undefined,
  expected: DatabaseRow,
  keys: readonly string[],
) {
  return Boolean(
    current && keys.every((key) => valueEquals(current[key], expected[key])),
  );
}

function recordAction(
  stats: EntityImportStats,
  current: DatabaseRow | undefined,
  matches: boolean,
): CatalogImportAction {
  if (!current) {
    stats.created += 1;
    return "created";
  }
  if (matches) {
    stats.unchanged += 1;
    return "unchanged";
  }
  stats.updated += 1;
  return "updated";
}

function indexRows(rows: readonly DatabaseRow[], key: string) {
  return new Map(rows.map((row) => [String(row[key]), row]));
}

function createSubcategorySlug(row: CatalogImportRow) {
  return row.subcategory
    ? createCatalogSubcategorySlug(row.categorySlug, row.subcategory)
    : null;
}

async function upsertCatalogTaxonomy(
  transaction: TransactionSql,
  source: CatalogImportSource,
  brandStats: EntityImportStats,
  categoryStats: EntityImportStats,
  subcategoryStats: EntityImportStats,
) {
  const currentBrands = indexRows(
    await transaction`select id, name, slug, status from public.brands`,
    "slug",
  );
  const brands = [
    ...new Map(
      source.rows.flatMap((row) =>
        row.brandSlug && row.brandName
          ? [[row.brandSlug, { slug: row.brandSlug, name: row.brandName }]]
          : [],
      ),
    ).values(),
  ];
  const changedBrands = brands.filter((brand) => {
    const current = currentBrands.get(brand.slug);
    return (
      recordAction(
        brandStats,
        current,
        rowMatches(current, { ...brand, status: "active" }, [
          "name",
          "slug",
          "status",
        ]),
      ) !== "unchanged"
    );
  });
  if (changedBrands.length) {
    await transaction`
      insert into public.brands ${transaction(
        changedBrands.map((brand) => ({ ...brand, status: "active" })),
        "name",
        "slug",
        "status",
      )}
      on conflict (slug) do update set
        name = excluded.name,
        status = excluded.status,
        deleted_at = null
    `;
  }

  const currentCategories = indexRows(
    await transaction`
      select id, parent_id, name, slug, status from public.categories
    `,
    "slug",
  );
  const categories = [
    ...new Map(
      source.rows.map((row) => [
        row.categorySlug,
        { slug: row.categorySlug, name: row.categoryName },
      ]),
    ).values(),
  ];
  const changedCategories = categories.filter((category) => {
    const current = currentCategories.get(category.slug);
    return (
      recordAction(
        categoryStats,
        current,
        rowMatches(
          current,
          { ...category, parent_id: null, status: "active" },
          ["name", "slug", "parent_id", "status"],
        ),
      ) !== "unchanged"
    );
  });
  if (changedCategories.length) {
    await transaction`
      insert into public.categories ${transaction(
        changedCategories.map((category) => ({
          ...category,
          parent_id: null,
          status: "active",
        })),
        "name",
        "slug",
        "parent_id",
        "status",
      )}
      on conflict (slug) do update set
        name = excluded.name,
        parent_id = excluded.parent_id,
        status = excluded.status,
        deleted_at = null
    `;
  }

  const persistedCategories = indexRows(
    await transaction`
      select id, parent_id, name, slug, status from public.categories
    `,
    "slug",
  );
  const subcategories = [
    ...new Map(
      source.rows.flatMap((row) => {
        const slug = createSubcategorySlug(row);
        const parent = persistedCategories.get(row.categorySlug);
        return slug && row.subcategory && parent
          ? [
              [
                slug,
                {
                  slug,
                  name: row.subcategory,
                  parent_id: String(parent.id),
                },
              ] as const,
            ]
          : [];
      }),
    ).values(),
  ];
  const changedSubcategories = subcategories.filter((subcategory) => {
    const current = persistedCategories.get(subcategory.slug);
    return (
      recordAction(
        subcategoryStats,
        current,
        rowMatches(current, { ...subcategory, status: "active" }, [
          "name",
          "slug",
          "parent_id",
          "status",
        ]),
      ) !== "unchanged"
    );
  });
  if (changedSubcategories.length) {
    await transaction`
      insert into public.categories ${transaction(
        changedSubcategories.map((subcategory) => ({
          ...subcategory,
          status: "active",
        })),
        "name",
        "slug",
        "parent_id",
        "status",
      )}
      on conflict (slug) do update set
        name = excluded.name,
        parent_id = excluded.parent_id,
        status = excluded.status,
        deleted_at = null
    `;
  }
}

async function importProducts(
  transaction: TransactionSql,
  source: CatalogImportSource,
  stats: EntityImportStats,
) {
  const brandBySlug = indexRows(
    await transaction`select id, slug from public.brands`,
    "slug",
  );
  const categoryBySlug = indexRows(
    await transaction`select id, slug from public.categories`,
    "slug",
  );
  const currentProducts = indexRows(
    await transaction`
      select id, code, name, slug, brand_id, category_id, subcategory_id,
        capacity_ml, capacity_label, pack_quantity, alcohol_percentage,
        country, producer, is_new, is_limited, status
      from public.products
    `,
    "code",
  );

  const productRows = source.rows.map((row) => ({
    code: row.code,
    name: row.name,
    slug: row.slug,
    brand_id: row.brandSlug
      ? String(brandBySlug.get(row.brandSlug)?.id ?? "") || null
      : null,
    category_id: String(categoryBySlug.get(row.categorySlug)?.id ?? ""),
    subcategory_id: row.subcategory
      ? String(
          categoryBySlug.get(createSubcategorySlug(row) ?? "")?.id ?? "",
        ) || null
      : null,
    capacity_ml: row.capacityMl,
    capacity_label: row.capacityLabel,
    pack_quantity: row.packQuantity,
    alcohol_percentage: row.alcoholPercentage,
    country: row.country,
    producer: row.producer,
    is_new: row.isNew,
    is_limited: row.isLimited,
    status: "active",
  }));
  const compareKeys = [
    "code",
    "name",
    "slug",
    "brand_id",
    "category_id",
    "subcategory_id",
    "capacity_ml",
    "capacity_label",
    "pack_quantity",
    "alcohol_percentage",
    "country",
    "producer",
    "is_new",
    "is_limited",
    "status",
  ] as const;
  const actions = new Map<string, CatalogImportAction>();
  const changedProducts = productRows.filter((product) => {
    const current = currentProducts.get(product.code);
    const action = recordAction(
      stats,
      current,
      rowMatches(current, product, compareKeys),
    );
    actions.set(product.code, action);
    return action !== "unchanged";
  });

  if (changedProducts.length) {
    await transaction`
      insert into public.products ${transaction(changedProducts, ...compareKeys)}
      on conflict (code) do update set
        name = excluded.name,
        slug = excluded.slug,
        brand_id = excluded.brand_id,
        category_id = excluded.category_id,
        subcategory_id = excluded.subcategory_id,
        capacity_ml = excluded.capacity_ml,
        capacity_label = excluded.capacity_label,
        pack_quantity = excluded.pack_quantity,
        alcohol_percentage = excluded.alcohol_percentage,
        country = excluded.country,
        producer = excluded.producer,
        is_new = excluded.is_new,
        is_limited = excluded.is_limited,
        status = excluded.status,
        deleted_at = null
    `;
  }

  return actions;
}

async function importPrices(
  transaction: TransactionSql,
  source: CatalogImportSource,
  productByCode: Map<string, DatabaseRow>,
  stats: EntityImportStats,
) {
  const currentPrices = indexRows(
    await transaction`
      select id, product_id, net_amount_minor, vat_rate_basis_points, currency
      from public.prices where valid_to is null
    `,
    "product_id",
  );
  const actions = new Map<string, CatalogImportAction>();
  const changedProductIds: string[] = [];
  const newPrices: DatabaseRow[] = [];

  for (const row of source.rows) {
    const productId = String(productByCode.get(row.code)?.id);
    const expected = {
      product_id: productId,
      net_amount_minor: row.netAmountMinor.toString(),
      vat_rate_basis_points:
        commerceConfig.defaultVatRateBasisPoints.toString(),
      currency: commerceConfig.currency,
    };
    const current = currentPrices.get(productId);
    const action = recordAction(
      stats,
      current,
      rowMatches(current, expected, [
        "product_id",
        "net_amount_minor",
        "vat_rate_basis_points",
        "currency",
      ]),
    );
    actions.set(row.code, action);
    if (action !== "unchanged") {
      if (current) changedProductIds.push(productId);
      newPrices.push(expected);
    }
  }

  if (changedProductIds.length) {
    await transaction`
      update public.prices set valid_to = now()
      where product_id in ${transaction(changedProductIds)} and valid_to is null
    `;
  }
  if (newPrices.length) {
    await transaction`
      insert into public.prices ${transaction(
        newPrices,
        "product_id",
        "net_amount_minor",
        "vat_rate_basis_points",
        "currency",
      )}
    `;
  }
  return actions;
}

async function importInventory(
  transaction: TransactionSql,
  source: CatalogImportSource,
  productByCode: Map<string, DatabaseRow>,
  stats: EntityImportStats,
) {
  const currentInventory = indexRows(
    await transaction`
      select product_id, stock_quantity, reserved_quantity from public.inventory
    `,
    "product_id",
  );
  const duplicateCodeSet = new Set(source.duplicateCodes);
  const actions = new Map<string, CatalogImportAction>();
  const changedInventory: DatabaseRow[] = [];

  for (const row of source.rows) {
    if (duplicateCodeSet.has(row.code)) {
      stats.skipped += 1;
      actions.set(row.code, "conflict");
      continue;
    }
    const productId = String(productByCode.get(row.code)?.id);
    const expected = {
      product_id: productId,
      stock_quantity: row.quantity,
      reserved_quantity: 0,
    };
    const current = currentInventory.get(productId);
    const action = recordAction(
      stats,
      current,
      rowMatches(current, expected, [
        "product_id",
        "stock_quantity",
        "reserved_quantity",
      ]),
    );
    actions.set(row.code, action);
    if (action !== "unchanged") changedInventory.push(expected);
  }

  if (changedInventory.length) {
    await transaction`
      insert into public.inventory ${transaction(
        changedInventory,
        "product_id",
        "stock_quantity",
        "reserved_quantity",
      )}
      on conflict (product_id) do update set
        stock_quantity = excluded.stock_quantity,
        reserved_quantity = least(
          public.inventory.reserved_quantity,
          excluded.stock_quantity
        )
    `;
  }
  return actions;
}

async function importImages(
  transaction: TransactionSql,
  source: CatalogImportSource,
  productByCode: Map<string, DatabaseRow>,
  stats: EntityImportStats,
) {
  const currentImages = indexRows(
    await transaction`
      select id, product_id, storage_path, thumbnail_path, alt_text, width,
        height, sort_order, is_primary
      from public.product_images where is_primary
    `,
    "product_id",
  );
  const actions = new Map<string, CatalogImportAction>();
  const inserts: DatabaseRow[] = [];
  const updates: DatabaseRow[] = [];
  const removals: string[] = [];

  for (const row of source.rows) {
    const productId = String(productByCode.get(row.code)?.id);
    const current = currentImages.get(productId);
    if (!row.image) {
      if (current) removals.push(String(current.id));
      stats.skipped += 1;
      actions.set(row.code, "skipped");
      continue;
    }
    const expected = {
      product_id: productId,
      storage_path: row.image.storagePath,
      thumbnail_path: row.image.thumbnailPath,
      alt_text: row.image.altText,
      width: row.image.width,
      height: row.image.height,
      sort_order: 0,
      is_primary: true,
    };
    const action = recordAction(
      stats,
      current,
      rowMatches(current, expected, [
        "product_id",
        "storage_path",
        "thumbnail_path",
        "alt_text",
        "width",
        "height",
        "sort_order",
        "is_primary",
      ]),
    );
    actions.set(row.code, action);
    if (action === "created") inserts.push(expected);
    if (action === "updated") updates.push({ id: current?.id, ...expected });
  }

  if (removals.length) {
    await transaction`
      delete from public.product_images where id in ${transaction(removals)}
    `;
  }
  if (inserts.length) {
    await transaction`
      insert into public.product_images ${transaction(
        inserts,
        "product_id",
        "storage_path",
        "thumbnail_path",
        "alt_text",
        "width",
        "height",
        "sort_order",
        "is_primary",
      )}
    `;
  }
  for (const image of updates) {
    await transaction`
      update public.product_images set
        storage_path = ${image.storage_path as string},
        thumbnail_path = ${image.thumbnail_path as string},
        alt_text = ${image.alt_text as string},
        width = ${image.width as number},
        height = ${image.height as number},
        sort_order = 0,
        is_primary = true
      where id = ${image.id as string}
    `;
  }
  return actions;
}

async function importOffers(
  transaction: TransactionSql,
  source: CatalogImportSource,
  productByCode: Map<string, DatabaseRow>,
  stats: EntityImportStats,
) {
  const currentOffers = indexRows(
    await transaction`
      select id, product_id, promotional_net_amount_minor, is_active
      from public.offers where is_active
    `,
    "product_id",
  );
  const actions = new Map<string, CatalogImportAction>();
  const inserts: DatabaseRow[] = [];
  const deactivations: string[] = [];

  for (const row of source.rows) {
    const productId = String(productByCode.get(row.code)?.id);
    const current = currentOffers.get(productId);
    if (!row.isOffer) {
      if (current) {
        stats.updated += 1;
        actions.set(row.code, "updated");
        deactivations.push(String(current.id));
      } else {
        actions.set(row.code, "skipped");
      }
      continue;
    }
    if (current && current.promotional_net_amount_minor === null) {
      stats.unchanged += 1;
      actions.set(row.code, "unchanged");
    } else if (current) {
      stats.updated += 1;
      actions.set(row.code, "updated");
    } else {
      stats.created += 1;
      actions.set(row.code, "created");
      inserts.push({
        product_id: productId,
        promotional_net_amount_minor: null,
        is_active: true,
      });
    }
  }

  if (deactivations.length) {
    await transaction`
      update public.offers set is_active = false
      where id in ${transaction(deactivations)}
    `;
  }
  if (inserts.length) {
    await transaction`
      insert into public.offers ${transaction(
        inserts,
        "product_id",
        "promotional_net_amount_minor",
        "is_active",
      )}
    `;
  }
  return actions;
}

async function getDatabaseCounts(sql: Sql): Promise<Record<string, number>> {
  const [counts] = await sql<
    [
      {
        products: number;
        brands: number;
        categories: number;
        subcategories: number;
        prices: number;
        inventories: number;
        images: number;
        offers: number;
      },
    ]
  >`
    select
      (select count(*)::int from public.products) as products,
      (select count(*)::int from public.brands) as brands,
      (select count(*)::int from public.categories where parent_id is null) as categories,
      (select count(*)::int from public.categories where parent_id is not null) as subcategories,
      (select count(*)::int from public.prices where valid_to is null) as prices,
      (select count(*)::int from public.inventory) as inventories,
      (select count(*)::int from public.product_images) as images,
      (select count(*)::int from public.offers where is_active) as offers
  `;
  if (!counts) throw new Error("Conteggi database non disponibili.");
  return counts;
}

function mapResults(
  source: CatalogImportSource,
  productActions: Map<string, CatalogImportAction>,
  inventoryActions: Map<string, CatalogImportAction>,
  priceActions: Map<string, CatalogImportAction>,
  imageActions: Map<string, CatalogImportAction>,
  offerActions: Map<string, CatalogImportAction>,
): CatalogImportResult[] {
  return source.rows.map((row) => ({
    code: row.code,
    productName: row.name,
    action: productActions.get(row.code) ?? "skipped",
    inventoryAction: inventoryActions.get(row.code) ?? "skipped",
    priceAction: priceActions.get(row.code) ?? "skipped",
    imageAction: imageActions.get(row.code) ?? "skipped",
    offerAction: offerActions.get(row.code) ?? "skipped",
    details:
      row.imageIssue ?? (row.isOffer ? "Offerta senza prezzo precedente." : ""),
  }));
}

export async function importCatalogToDatabase(
  source: CatalogImportSource,
  options: CatalogDatabaseOptions,
): Promise<CatalogImportSummary> {
  const startedAt = new Date().toISOString();
  const sql = postgres(options.databaseUrl, { max: 1, prepare: false });
  const products = createEmptyEntityStats();
  const brands = createEmptyEntityStats();
  const categories = createEmptyEntityStats();
  const subcategories = createEmptyEntityStats();
  const prices = createEmptyEntityStats();
  const inventories = createEmptyEntityStats();
  const images = createEmptyEntityStats();
  const offers = createEmptyEntityStats();

  try {
    const actionMaps = await sql.begin(async (transaction) => {
      await upsertCatalogTaxonomy(
        transaction,
        source,
        brands,
        categories,
        subcategories,
      );
      const productActions = await importProducts(
        transaction,
        source,
        products,
      );
      const productByCode = indexRows(
        await transaction`select id, code from public.products`,
        "code",
      );
      const priceActions = await importPrices(
        transaction,
        source,
        productByCode,
        prices,
      );
      const inventoryActions = await importInventory(
        transaction,
        source,
        productByCode,
        inventories,
      );
      const imageActions = await importImages(
        transaction,
        source,
        productByCode,
        images,
      );
      const offerActions = await importOffers(
        transaction,
        source,
        productByCode,
        offers,
      );
      return {
        productActions,
        priceActions,
        inventoryActions,
        imageActions,
        offerActions,
      };
    });
    await sql`refresh materialized view public.catalog_products_projection`;
    const databaseCounts = await getDatabaseCounts(sql);
    const issues: CatalogImportIssue[] = source.issues;

    return {
      runId: options.runId,
      startedAt,
      completedAt: new Date().toISOString(),
      rowsRead: source.rowsRead,
      validRows: source.rows.length,
      uniqueProductCodes: source.rows.length,
      products,
      brands,
      categories,
      subcategories,
      prices,
      inventories,
      images,
      offers,
      newArrivalsImported: source.rows.filter((row) => row.isNew).length,
      offersImported: source.rows.filter((row) => row.isOffer).length,
      invalidRows: issues.filter((issue) => issue.kind === "invalid").length,
      skippedRows:
        inventories.skipped +
        images.skipped +
        products.skipped +
        prices.skipped,
      conflicts: issues.filter((issue) => issue.kind === "conflict").length,
      duplicateCodes: source.duplicateCodes,
      missingImages: issues.filter((issue) => issue.kind === "missing_image")
        .length,
      databaseCounts,
      results: mapResults(
        source,
        actionMaps.productActions,
        actionMaps.inventoryActions,
        actionMaps.priceActions,
        actionMaps.imageActions,
        actionMaps.offerActions,
      ),
      issues,
    };
  } finally {
    await sql.end();
  }
}

export function createCatalogDatabaseClient(databaseUrl: string): Sql {
  return postgres(databaseUrl, { max: 1, prepare: false });
}
