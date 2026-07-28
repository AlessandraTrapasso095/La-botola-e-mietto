import "server-only";

import type { Money } from "@/types/money";

const basisPointScale = 10_000n;

export function calculateGrossPrice(
  netPrice: Money,
  vatRateBasisPoints: bigint,
): Money {
  if (vatRateBasisPoints < 0n) {
    throw new RangeError("L'aliquota IVA non può essere negativa.");
  }

  const taxNumerator = netPrice.amountMinor * vatRateBasisPoints;
  const roundedTax = (taxNumerator + basisPointScale / 2n) / basisPointScale;

  return {
    amountMinor: netPrice.amountMinor + roundedTax,
    currency: netPrice.currency,
  };
}
