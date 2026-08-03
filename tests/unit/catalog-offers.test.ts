import { describe, expect, it } from "vitest";

import { primaryNavigation } from "@/config/catalog";
import {
  catalogOfferProductCodes,
  catalogOfferSource,
  getCatalogOfferView,
  isCatalogOfferProductCode,
} from "@/content/catalog/offers";
import { getOfferProducts } from "@/content/catalog/selectors";

describe("prodotti in offerta", () => {
  it("mappa esclusivamente le righe marcate nel campo Excel reale", () => {
    expect(catalogOfferSource).toMatchObject({
      statusColumn: "NUOVI PRODOTTI",
      statusValue: "PRODOTTI IN OFFERTA",
      priceColumn: "PREZZO SENZA IVA",
      previousPriceColumn: null,
      discountPercentageColumn: null,
      promotionPeriodColumn: null,
    });
    expect(catalogOfferProductCodes).toHaveLength(50);
    expect(new Set(catalogOfferProductCodes).size).toBe(50);
  });

  it("risolve 50 prodotti reali senza duplicati o prodotti estranei", () => {
    const products = getOfferProducts();

    expect(products).toHaveLength(50);
    expect(new Set(products.map((product) => product.code)).size).toBe(50);
    expect(
      products.every(
        (product) =>
          isCatalogOfferProductCode(product.code) &&
          typeof product.netPriceMinor === "bigint" &&
          product.netPriceMinor > 0n,
      ),
    ).toBe(true);
  });

  it("non genera prezzo precedente, percentuale o durata assenti", () => {
    expect(getCatalogOfferView(catalogOfferProductCodes[0])).toEqual({
      isActive: true,
      previousGrossPriceMinor: null,
      previousGrossPrice: null,
      discountPercentage: null,
    });
    expect(getCatalogOfferView("CODICE-NON-IN-OFFERTA")).toBeNull();
  });

  it("espone la stessa route alla navigazione condivisa", () => {
    expect(primaryNavigation).toContainEqual({
      label: "In offerta",
      href: "/in-offerta",
    });
  });
});
