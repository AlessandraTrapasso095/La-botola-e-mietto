import { describe, expect, it } from "vitest";

import { createCatalogOfferView } from "@/lib/offer-pricing";

describe("prezzi delle offerte", () => {
  it("mantiene sconosciuti prezzo precedente e sconto quando non forniti", () => {
    expect(createCatalogOfferView(4_000, null)).toEqual({
      isActive: true,
      previousGrossPriceMinor: null,
      previousGrossPrice: null,
      discountPercentage: null,
    });
  });

  it("calcola la percentuale soltanto da due prezzi reali", () => {
    expect(createCatalogOfferView(4_000, 5_000)).toEqual({
      isActive: true,
      previousGrossPriceMinor: 5_000,
      previousGrossPrice: "50,00 €",
      discountPercentage: 20,
    });
  });

  it("rifiuta prezzi precedenti non superiori al prezzo corrente", () => {
    expect(() => createCatalogOfferView(5_000, 5_000)).toThrow(
      "Prezzo lordo precedente non valido.",
    );

    expect(() => createCatalogOfferView(5_000, 4_000)).toThrow(
      "Prezzo lordo precedente non valido.",
    );
  });
});
