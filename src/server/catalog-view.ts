import "server-only";

import { commerceConfig } from "@/config/commerce";
import { getBrandBySlug } from "@/content/catalog/selectors";
import { getCategoryBySlug } from "@/content/catalog/selectors";
import type {
  CatalogProduct,
  CatalogProductSummaryView,
  CatalogProductView,
} from "@/content/catalog/types";
import { createEuro, formatEuroMinor } from "@/lib/money";
import { calculateGrossPrice } from "@/server/pricing";

export function createCatalogProductSummaryView(
  product: CatalogProduct,
): CatalogProductSummaryView {
  const brand = getBrandBySlug(product.brandSlug);
  const category = getCategoryBySlug(product.categorySlug);
  const grossPrice = calculateGrossPrice(
    createEuro(product.netPriceMinor),
    commerceConfig.defaultVatRateBasisPoints,
  );

  if (!brand || !category) {
    throw new Error(`Relazione catalogo non valida per ${product.code}.`);
  }

  return {
    code: product.code,
    slug: product.slug,
    name: product.name,
    brandSlug: product.brandSlug,
    categorySlug: product.categorySlug,
    subcategory: product.subcategory,
    capacityMl: product.capacityMl,
    capacityLabel: product.capacityLabel,
    packQuantity: product.packQuantity,
    alcoholPercentage: product.alcoholPercentage,
    country: product.country,
    producer: product.producer,
    stockQuantity: product.stockQuantity,
    isNew: product.isNew,
    isLimited: product.isLimited,
    badges: product.badges,
    media: product.media,
    brandName: brand.name,
    categoryName: category.name,
    grossPriceMinor: Number(grossPrice.amountMinor),
    grossPrice: formatEuroMinor(grossPrice.amountMinor),
  };
}

export function createCatalogProductView(
  product: CatalogProduct,
): CatalogProductView {
  return {
    ...createCatalogProductSummaryView(product),
    overview: product.overview,
    tastingNotes: product.tastingNotes,
    service: product.service,
    origin: product.origin,
    pairings: product.pairings,
    characteristics: product.characteristics,
  };
}

export function createCatalogProductViews(
  products: readonly CatalogProduct[],
): CatalogProductSummaryView[] {
  return products.map(createCatalogProductSummaryView);
}
