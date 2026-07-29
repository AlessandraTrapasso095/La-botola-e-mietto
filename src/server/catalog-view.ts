import "server-only";

import { commerceConfig } from "@/config/commerce";
import { getBrandBySlug } from "@/content/catalog/selectors";
import { getCategoryBySlug } from "@/content/catalog/selectors";
import type {
  CatalogProduct,
  CatalogProductView,
} from "@/content/catalog/types";
import { createEuro, formatEuroMinor } from "@/lib/money";
import { calculateGrossPrice } from "@/server/pricing";

export function createCatalogProductView(
  product: CatalogProduct,
): CatalogProductView {
  const { netPriceMinor, ...serializableProduct } = product;
  const brand = getBrandBySlug(product.brandSlug);
  const category = getCategoryBySlug(product.categorySlug);
  const grossPrice = calculateGrossPrice(
    createEuro(netPriceMinor),
    commerceConfig.defaultVatRateBasisPoints,
  );

  if (!brand || !category) {
    throw new Error(`Relazione catalogo non valida per ${product.code}.`);
  }

  return {
    ...serializableProduct,
    brandName: brand.name,
    categoryName: category.name,
    capacityLabel:
      product.capacityMl >= 1000
        ? `${product.capacityMl / 1000} L`
        : `${product.capacityMl / 10} cl`,
    grossPriceMinor: Number(grossPrice.amountMinor),
    grossPrice: formatEuroMinor(grossPrice.amountMinor),
  };
}

export function createCatalogProductViews(
  products: readonly CatalogProduct[],
): CatalogProductView[] {
  return products.map(createCatalogProductView);
}
