import type { CatalogOfferView } from "@/content/catalog/types";
import { formatEuroMinor } from "@/lib/money";

export function createCatalogOfferView(
  currentGrossPriceMinor: number,
  previousGrossPriceMinor: number | null,
): CatalogOfferView {
  if (
    !Number.isSafeInteger(currentGrossPriceMinor) ||
    currentGrossPriceMinor < 0
  ) {
    throw new Error("Prezzo lordo corrente non valido.");
  }

  if (previousGrossPriceMinor === null) {
    return {
      isActive: true,
      previousGrossPriceMinor: null,
      previousGrossPrice: null,
      discountPercentage: null,
    };
  }

  if (
    !Number.isSafeInteger(previousGrossPriceMinor) ||
    previousGrossPriceMinor <= currentGrossPriceMinor
  ) {
    throw new Error("Prezzo lordo precedente non valido.");
  }

  const discountPercentage = Math.round(
    ((previousGrossPriceMinor - currentGrossPriceMinor) /
      previousGrossPriceMinor) *
      100,
  );

  return {
    isActive: true,
    previousGrossPriceMinor,
    previousGrossPrice: formatEuroMinor(BigInt(previousGrossPriceMinor)),
    discountPercentage,
  };
}
