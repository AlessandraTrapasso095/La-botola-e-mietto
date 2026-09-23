import "server-only";

import { getServerAdminUser } from "@/server/admin/admin-user";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

export const adminOffersPageSize = 50;

function throwAdminOffersError(
  operation: string,
  userMessage: string,
  error: { code?: string },
): never {
  console.error(`[admin-offers] ${operation}`, {
    code: error.code,
  });

  throw new Error(userMessage);
}

async function requireAdmin() {
  const adminUser = await getServerAdminUser();

  if (!adminUser) {
    throw new Error("Accesso amministratore richiesto.");
  }

  return adminUser;
}

export type AdminOfferStatus = "all" | "active" | "inactive";

export type AdminOffersFilters = {
  query?: string;
  status?: AdminOfferStatus;
  page?: number;
};

export type AdminOfferListItem = {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  productSlug: string;
  productStatus: string;
  regularNetAmountMinor: number | null;
  promotionalNetAmountMinor: number | null;
  vatRateBasisPoints: number | null;
  currency: string | null;
  discountPercentage: number | null;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminOffersSummary = {
  activeCount: number;
  inactiveCount: number;
  totalCount: number;
  involvedProductsCount: number;
};

export type AdminOffersResult = {
  offers: AdminOfferListItem[];
  summary: AdminOffersSummary;
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
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

function calculateDiscountPercentage(
  regularNetAmountMinor: number | null,
  promotionalNetAmountMinor: number | null,
) {
  if (
    regularNetAmountMinor === null ||
    promotionalNetAmountMinor === null ||
    regularNetAmountMinor <= 0 ||
    promotionalNetAmountMinor >= regularNetAmountMinor
  ) {
    return null;
  }

  return Math.round(
    ((regularNetAmountMinor - promotionalNetAmountMinor) /
      regularNetAmountMinor) *
      100,
  );
}

export async function getAdminOffers(
  filters: AdminOffersFilters = {},
): Promise<AdminOffersResult> {
  await requireAdmin();

  const admin = createSupabaseAdminClient();

  const requestedPage = normalizePage(filters.page);
  const status = filters.status ?? "all";
  const query = filters.query?.trim() ?? "";

  const summaryResponse = await admin
    .from("offers")
    .select("product_id,is_active");

  if (summaryResponse.error) {
    throwAdminOffersError(
      "caricamento riepilogo offerte fallito",
      "Impossibile caricare il riepilogo offerte. Riprova.",
      summaryResponse.error,
    );
  }

  const summaryRows = summaryResponse.data ?? [];

  const summary: AdminOffersSummary = {
    activeCount: summaryRows.filter((offer) => offer.is_active).length,
    inactiveCount: summaryRows.filter((offer) => !offer.is_active).length,
    totalCount: summaryRows.length,
    involvedProductsCount: new Set(summaryRows.map((offer) => offer.product_id))
      .size,
  };

  let matchingProductIds: string[] | null = null;

  if (query) {
    const search = escapePostgrestSearch(query);

    const productsResponse = await admin
      .from("products")
      .select("id")
      .is("deleted_at", null)
      .or(`name.ilike.%${search}%,code.ilike.%${search}%`);

    if (productsResponse.error) {
      throwAdminOffersError(
        "ricerca prodotti offerte fallita",
        "Impossibile cercare i prodotti delle offerte. Riprova.",
        productsResponse.error,
      );
    }

    matchingProductIds = (productsResponse.data ?? []).map(
      (product) => product.id,
    );

    if (matchingProductIds.length === 0) {
      return {
        offers: [],
        summary,
        totalCount: 0,
        page: 1,
        pageSize: adminOffersPageSize,
        totalPages: 1,
      };
    }
  }

  let countQuery = admin
    .from("offers")
    .select("id", { count: "exact", head: true });

  if (status === "active") {
    countQuery = countQuery.eq("is_active", true);
  }

  if (status === "inactive") {
    countQuery = countQuery.eq("is_active", false);
  }

  if (matchingProductIds) {
    countQuery = countQuery.in("product_id", matchingProductIds);
  }

  const countResponse = await countQuery;

  if (countResponse.error) {
    throwAdminOffersError(
      "conteggio offerte fallito",
      "Impossibile caricare le offerte. Riprova.",
      countResponse.error,
    );
  }

  const totalCount = countResponse.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / adminOffersPageSize));

  const page = Math.min(requestedPage, totalPages);
  const from = (page - 1) * adminOffersPageSize;
  const to = from + adminOffersPageSize - 1;

  let offersQuery = admin.from("offers").select(
    `
        id,
        product_id,
        promotional_net_amount_minor,
        starts_at,
        ends_at,
        is_active,
        created_at,
        updated_at,
        products (
          id,
          code,
          name,
          slug,
          status,
          deleted_at
        )
      `,
  );

  if (status === "active") {
    offersQuery = offersQuery.eq("is_active", true);
  }

  if (status === "inactive") {
    offersQuery = offersQuery.eq("is_active", false);
  }

  if (matchingProductIds) {
    offersQuery = offersQuery.in("product_id", matchingProductIds);
  }

  const offersResponse = await offersQuery
    .order("created_at", { ascending: false })
    .range(from, to);

  if (offersResponse.error) {
    throwAdminOffersError(
      "caricamento offerte fallito",
      "Impossibile caricare le offerte. Riprova.",
      offersResponse.error,
    );
  }

  const offerRows = (offersResponse.data ?? []).filter((offer) => {
    const product = Array.isArray(offer.products)
      ? offer.products[0]
      : offer.products;

    return product && product.deleted_at === null;
  });

  const productIds = [...new Set(offerRows.map((offer) => offer.product_id))];

  const currentPrices = new Map<
    string,
    {
      netAmountMinor: number;
      vatRateBasisPoints: number;
      currency: string;
    }
  >();

  if (productIds.length > 0) {
    const pricesResponse = await admin
      .from("prices")
      .select(
        `
          product_id,
          net_amount_minor,
          vat_rate_basis_points,
          currency
        `,
      )
      .in("product_id", productIds)
      .is("valid_to", null);

    if (pricesResponse.error) {
      throwAdminOffersError(
        "caricamento prezzi offerte fallito",
        "Impossibile caricare i prezzi delle offerte. Riprova.",
        pricesResponse.error,
      );
    }

    for (const price of pricesResponse.data ?? []) {
      currentPrices.set(price.product_id, {
        netAmountMinor: Number(price.net_amount_minor),
        vatRateBasisPoints: price.vat_rate_basis_points,
        currency: price.currency,
      });
    }
  }

  const offers: AdminOfferListItem[] = offerRows.flatMap((offer) => {
    const product = Array.isArray(offer.products)
      ? offer.products[0]
      : offer.products;

    if (!product) {
      return [];
    }

    const price = currentPrices.get(offer.product_id);

    const regularNetAmountMinor = price?.netAmountMinor ?? null;

    const promotionalNetAmountMinor =
      offer.promotional_net_amount_minor === null
        ? null
        : Number(offer.promotional_net_amount_minor);

    return [
      {
        id: offer.id,
        productId: product.id,
        productCode: product.code,
        productName: product.name,
        productSlug: product.slug,
        productStatus: product.status,
        regularNetAmountMinor,
        promotionalNetAmountMinor,
        vatRateBasisPoints: price?.vatRateBasisPoints ?? null,
        currency: price?.currency ?? null,
        discountPercentage: calculateDiscountPercentage(
          regularNetAmountMinor,
          promotionalNetAmountMinor,
        ),
        startsAt: offer.starts_at,
        endsAt: offer.ends_at,
        isActive: offer.is_active,
        createdAt: offer.created_at,
        updatedAt: offer.updated_at,
      },
    ];
  });

  return {
    offers,
    summary,
    totalCount,
    page,
    pageSize: adminOffersPageSize,
    totalPages,
  };
}
