import "server-only";

import { z } from "zod";

import type { CatalogQuery } from "@/types/catalog";

const listValue = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value) => {
    const values = Array.isArray(value) ? value : value ? [value] : [];
    return values
      .flatMap((entry) => entry.split(","))
      .map((entry) => entry.trim())
      .filter(Boolean);
  });

const booleanValue = z
  .union([z.literal("1"), z.literal("true")])
  .optional()
  .transform(Boolean);

const catalogQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).catch(1),
  sort: z
    .enum(["featured", "price-asc", "price-desc", "name", "newest"])
    .catch("featured"),
  brands: listValue,
  categories: listValue,
  prices: listValue,
  capacities: listValue,
  alcohol: listValue,
  countries: listValue,
  offer: booleanValue,
  new: booleanValue,
  limited: booleanValue,
  available: booleanValue,
});

export type CatalogSearchParams = Record<string, string | string[] | undefined>;

export function parseCatalogQuery(
  searchParams: CatalogSearchParams,
  pageSize = 12,
): Omit<CatalogQuery, "scope"> {
  const parsed = catalogQuerySchema.parse(searchParams);

  return {
    page: parsed.page,
    pageSize,
    sort: parsed.sort,
    filters: {
      brands: parsed.brands,
      categories: parsed.categories,
      priceRanges: parsed.prices,
      capacities: parsed.capacities,
      alcoholRanges: parsed.alcohol,
      countries: parsed.countries,
      onlyOnOffer: parsed.offer,
      onlyNew: parsed.new,
      onlyLimited: parsed.limited,
      onlyAvailable: parsed.available,
    },
  };
}
