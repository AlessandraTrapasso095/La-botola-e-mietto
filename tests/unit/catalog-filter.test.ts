import { describe, expect, it } from "vitest";

import {
  emptyCatalogFilters,
  filterCatalogProducts,
  sortCatalogProducts,
} from "@/features/catalog/catalog-filter";
import { catalogProductFixtures } from "../fixtures/catalog";

describe("filtri catalogo", () => {
  it("combina marca, paese, novità e disponibilità", () => {
    const filtered = filterCatalogProducts(catalogProductFixtures, {
      ...emptyCatalogFilters,
      brands: ["caprisius"],
      countries: ["Italia"],
      onlyNew: true,
      onlyAvailable: true,
    });

    expect(filtered.map((product) => product.slug)).toEqual(["caprisius"]);
  });

  it("filtra importi, capacità e gradazione usando valori numerici interi", () => {
    const filtered = filterCatalogProducts(catalogProductFixtures, {
      ...emptyCatalogFilters,
      priceRanges: ["30-60"],
      capacities: ["700"],
      alcoholRanges: ["over-40"],
    });

    expect(filtered.map((product) => product.slug)).toEqual(["caprisius"]);
  });

  it("ordina per prezzo e priorità editoriale", () => {
    expect(
      sortCatalogProducts(catalogProductFixtures, "price-asc").map(
        (product) => product.slug,
      ),
    ).toEqual([
      "caprisius",
      "the-macallan-12-y-o-double-cask",
      "suntory-yamazaki-18-y-o",
    ]);
    expect(
      sortCatalogProducts(catalogProductFixtures, "featured")[0]?.slug,
    ).toBe("suntory-yamazaki-18-y-o");
  });

  it("filtra esclusivamente i prodotti in offerta", () => {
    const offerProduct = {
      ...catalogProductFixtures[0],
      offer: {
        isActive: true,
        previousGrossPriceMinor: null,
        previousGrossPrice: null,
        discountPercentage: null,
      } as const,
    };
    const filtered = filterCatalogProducts(
      [offerProduct, ...catalogProductFixtures.slice(1)],
      {
        ...emptyCatalogFilters,
        onlyOnOffer: true,
      },
    );

    expect(filtered.map((product) => product.slug)).toEqual([
      offerProduct.slug,
    ]);
  });
});
