import { isEuropeanCountryCode } from "@/lib/european-countries";

import { businessInfo } from "@/config/business";

export type CommerceShippingMethod = "store_pickup" | "tnt" | "fedex";

export function shippingMethodForCountry(
  countryCode: string | null | undefined,
): Exclude<CommerceShippingMethod, "store_pickup"> {
  const normalizedCountryCode = countryCode?.trim().toUpperCase() ?? "";

  if (!isEuropeanCountryCode(normalizedCountryCode)) {
    throw new Error("Paese di spedizione non supportato.");
  }

  return normalizedCountryCode === "IT" ? "tnt" : "fedex";
}

export function shippingCarrierLabel(method: CommerceShippingMethod) {
  switch (method) {
    case "tnt":
      return "TNT";

    case "fedex":
      return "FedEx";

    case "store_pickup":
      return "Ritiro in negozio";
  }
}

export function calculateShippingGrossAmountMinor({
  method,
  subtotalMinor,
}: {
  method: CommerceShippingMethod;
  subtotalMinor: number;
}) {
  if (method === "store_pickup") {
    return 0;
  }

  if (
    method === "tnt" &&
    subtotalMinor >= Number(businessInfo.freeShippingThresholdMinor)
  ) {
    return 0;
  }

  if (method === "tnt") {
    return Number(businessInfo.standardShippingGrossAmountMinor);
  }

  return Number(businessInfo.internationalShippingGrossAmountMinor);
}
