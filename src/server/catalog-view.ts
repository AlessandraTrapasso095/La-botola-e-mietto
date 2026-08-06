import "server-only";

import { commerceConfig } from "@/config/commerce";
import { getBrandBySlug } from "@/content/catalog/selectors";
import { getCategoryBySlug } from "@/content/catalog/selectors";
import {
  getCatalogOfferView,
  isCatalogOfferProductCode,
} from "@/content/catalog/offers";
import type {
  CatalogProduct,
  CatalogProductSummaryView,
  CatalogProductView,
  Product,
} from "@/content/catalog/types";
import { createEuro, formatEuroMinor } from "@/lib/money";
import { calculateGrossPrice } from "@/server/pricing";

export function createCatalogProductSummaryView(
  product: CatalogProduct | Product,
): CatalogProductSummaryView {
  const brand = product.brandSlug
    ? getBrandBySlug(product.brandSlug)
    : undefined;
  const category = getCategoryBySlug(product.categorySlug);
  const grossPrice = calculateGrossPrice(
    createEuro(
      "price" in product ? product.price.netAmountMinor : product.netPriceMinor,
    ),
    "price" in product
      ? product.price.vatRateBasisPoints
      : commerceConfig.defaultVatRateBasisPoints,
  );
  const isOnOffer = isCatalogOfferProductCode(product.code);
  const badges = [
    ...(isOnOffer ? (["In offerta"] as const) : []),
    ...product.badges.filter((badge) => !(isOnOffer && badge === "Nuovo")),
  ];

  if (!category || (product.brandSlug && !brand)) {
    throw new Error(`Relazione catalogo non valida per ${product.code}.`);
  }

  return {
    code: product.code,
    slug: product.slug,
    name: product.name,
    brandSlug: product.brandSlug,
    categorySlug: product.categorySlug,
    subcategory: product.subcategory.replace(/ (?:&|e) /g, " | "),
    capacityMl: product.capacityMl,
    capacityLabel: product.capacityLabel,
    packQuantity: product.packQuantity,
    alcoholPercentage: product.alcoholPercentage,
    country: product.country,
    producer: product.producer,
    stockQuantity:
      "inventory" in product
        ? product.inventory.availableQuantity
        : product.stockQuantity,
    isNew: product.isNew && !isOnOffer,
    isLimited: product.isLimited,
    badges,
    media: product.media,
    brandName: brand?.name ?? null,
    categoryName: category.name,
    grossPriceMinor: Number(grossPrice.amountMinor),
    grossPrice: formatEuroMinor(grossPrice.amountMinor),
    offer: getCatalogOfferView(product.code),
  };
}

export function createCatalogProductView(
  product: CatalogProduct | Product,
): CatalogProductView {
  return {
    ...createCatalogProductSummaryView(product),
    overview: product.overview,
    tastingNotes: product.tastingNotes,
    service: product.service,
    origin: product.origin,
    pairings: product.pairings,
    characteristics: product.characteristics.map((characteristic) => ({
      ...characteristic,
      value:
        characteristic.label === "Tipologia"
          ? characteristic.value.replace(/ (?:&|e) /g, " | ")
          : characteristic.value,
    })),
  };
}

export function createCatalogProductViews(
  products: readonly (CatalogProduct | Product)[],
): CatalogProductSummaryView[] {
  return products.map(createCatalogProductSummaryView);
}
