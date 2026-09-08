import type { CatalogOfferView } from "@/content/catalog/types";
import { formatEuroMinor } from "@/lib/money";

export const catalogOfferDiscountPercentage = 10;

export function createCatalogTenPercentOffer(
  currentGrossPriceMinor: number,
): CatalogOfferView {
  if (!Number.isSafeInteger(currentGrossPriceMinor) || currentGrossPriceMinor < 0) {
    throw new Error("Prezzo lordo corrente non valido.");
  }

  const previousGrossPriceMinor = Math.round(
    currentGrossPriceMinor / (1 - catalogOfferDiscountPercentage / 100),
  );

  return {
    isActive: true,
    previousGrossPriceMinor,
    previousGrossPrice: formatEuroMinor(BigInt(previousGrossPriceMinor)),
    discountPercentage: catalogOfferDiscountPercentage,
  };
}
