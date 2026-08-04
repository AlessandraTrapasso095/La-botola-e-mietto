import type { CatalogOfferView } from "@/content/catalog/types";

export const catalogOfferProductCodes = [
  "AB3197",
  "AB4556",
  "AB5889",
  "AB1406",
  "AB4700",
  "AB1746",
  "AB6026",
  "AB3352",
  "AB2726",
  "AB5230",
  "AB4123",
  "AB5091",
  "AB5092",
  "AB5636",
  "AB4573",
  "AB5579",
  "AB4293",
  "AB3116",
  "AB6825",
  "AB5296",
  "AB3508",
  "AB0100",
  "AB1270",
  "AB3479",
  "AB6900",
  "AB6679",
  "AB2972",
  "AB3573",
  "AB6040",
  "AB2362",
  "AB4799",
  "AB4798",
  "AB5295",
  "AB0708",
  "AB4398",
  "AB0198",
  "AB4682",
  "AB0598",
  "AB0571",
  "AB0570",
  "AB0576",
  "AB1820",
  "AB0609",
  "AB0279",
  "AB0393",
  "AB4204",
  "AB1238",
  "AB5575",
  "AB2957",
  "AB3966",
] as const;

const offerProductCodeSet = new Set<string>(catalogOfferProductCodes);

export function isCatalogOfferProductCode(productCode: string) {
  return offerProductCodeSet.has(productCode);
}

export function getCatalogOfferView(
  productCode: string,
): CatalogOfferView | null {
  if (!isCatalogOfferProductCode(productCode)) return null;

  return {
    isActive: true,
    previousGrossPriceMinor: null,
    previousGrossPrice: null,
    discountPercentage: null,
  };
}
