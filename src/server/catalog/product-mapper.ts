import "server-only";

import { commerceConfig } from "@/config/commerce";
import type { CatalogProduct, Product } from "@/types/catalog";

export function mapCatalogProductToDomain(product: CatalogProduct): Product {
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
    isNew: product.isNew,
    isLimited: product.isLimited,
    badges: product.badges,
    media: product.media,
    overview: product.overview,
    tastingNotes: product.tastingNotes,
    service: product.service,
    origin: product.origin,
    pairings: product.pairings,
    characteristics: product.characteristics,
    price: {
      netAmountMinor: product.netPriceMinor,
      vatRateBasisPoints: commerceConfig.defaultVatRateBasisPoints,
      currency: "EUR",
    },
    inventory: {
      stockQuantity: product.stockQuantity,
      reservedQuantity: 0,
      availableQuantity: product.stockQuantity,
    },
  };
}
