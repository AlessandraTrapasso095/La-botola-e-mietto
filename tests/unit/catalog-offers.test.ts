import { describe, expect, it } from "vitest";

import { primaryNavigation } from "@/config/catalog";
import {
  catalogOfferProductCodes,
  getCatalogOfferView,
  isCatalogOfferProductCode,
} from "@/content/catalog/offers";
import { getOfferProducts } from "@/content/catalog/selectors";

describe("prodotti in offerta", () => {
  it("mantiene un elenco univoco dei prodotti realmente in offerta", () => {
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

  it("non inventa prezzo precedente o percentuale assenti dalla sorgente", () => {
    const currentGrossPriceMinor = 1000;
    const offer = getCatalogOfferView(
      catalogOfferProductCodes[0],
      currentGrossPriceMinor,
    );

    expect(offer).not.toBeNull();
    expect(offer?.isActive).toBe(true);
    expect(offer?.previousGrossPriceMinor).toBeNull();
    expect(offer?.previousGrossPrice).toBeNull();
    expect(offer?.discountPercentage).toBeNull();

    expect(
      getCatalogOfferView("CODICE-NON-IN-OFFERTA", currentGrossPriceMinor),
    ).toBeNull();
  });

  it("espone la stessa route alla navigazione condivisa", () => {
    expect(primaryNavigation).toContainEqual({
      label: "In offerta",
      href: "/in-offerta",
    });
  });
});
