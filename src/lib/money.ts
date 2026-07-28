import { businessInfo } from "@/config/business";
import type { Money } from "@/types/money";

const euroFormatter = new Intl.NumberFormat(businessInfo.locale, {
  style: "currency",
  currency: businessInfo.currency,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function createEuro(amountMinor: bigint): Money {
  return {
    amountMinor,
    currency: "EUR",
  };
}

export function formatEuroMinor(amountMinor: bigint): string {
  if (amountMinor < 0n) {
    throw new RangeError("L'importo non può essere negativo.");
  }

  const majorUnits = amountMinor / 100n;
  const remainder = amountMinor % 100n;

  return euroFormatter
    .formatToParts(majorUnits)
    .map((part) =>
      part.type === "fraction"
        ? remainder.toString().padStart(2, "0")
        : part.value,
    )
    .join("");
}
