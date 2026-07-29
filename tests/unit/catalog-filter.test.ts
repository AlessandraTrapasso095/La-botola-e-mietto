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

    expect(filtered.map((product) => product.slug)).toEqual(["caprisius-43"]);
  });

  it("filtra importi, capacità e gradazione usando valori numerici interi", () => {
    const filtered = filterCatalogProducts(catalogProductFixtures, {
      ...emptyCatalogFilters,
      priceRanges: ["30-60"],
      capacities: ["700"],
      alcoholRanges: ["over-40"],
    });

    expect(filtered.map((product) => product.slug)).toEqual(["caprisius-43"]);
  });

  it("ordina per prezzo e priorità editoriale", () => {
    expect(
      sortCatalogProducts(catalogProductFixtures, "price-asc").map(
        (product) => product.slug,
      ),
    ).toEqual([
      "caprisius-43",
      "the-macallan-12-double-cask",
      "yamazaki-18-years-old",
    ]);
    expect(
      sortCatalogProducts(catalogProductFixtures, "featured")[0]?.slug,
    ).toBe("yamazaki-18-years-old");
  });
});
