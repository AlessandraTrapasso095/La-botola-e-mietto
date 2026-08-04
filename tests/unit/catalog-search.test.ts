import { describe, expect, it } from "vitest";

import { catalogBrands } from "@/content/catalog/brands";
import { catalogCategories } from "@/content/catalog/categories";
import {
  normalizeCatalogSearchValue,
  searchCatalog,
} from "@/features/search/catalog-search";
import {
  catalogProductFixtures,
  createCatalogProductFixture,
} from "../fixtures/catalog";

const products = [
  {
    ...catalogProductFixtures[0],
    offer: {
      isActive: true,
      previousGrossPriceMinor: null,
      previousGrossPrice: null,
      discountPercentage: null,
    } as const,
  },
  ...catalogProductFixtures.slice(1),
  createCatalogProductFixture({
    code: "AB1319",
    slug: "don-julio-1942",
    name: "Don Julio 1942",
    brandSlug: "don",
    brandName: "Don Julio",
    categorySlug: "tequila-mezcal",
    categoryName: "Tequila | Mezcal",
    subcategory: "Tequila Añejo",
  }),
  createCatalogProductFixture({
    code: "AB1170",
    slug: "glen-grant-12yo-0-70-2-bicchieri",
    name: "Glen Grant 12YO 0.70 +2 Bicchieri",
    brandSlug: "the-glen-grant",
    brandName: "The Glen Grant",
  }),
] as const;

function runSearch(query: string) {
  return searchCatalog({
    query,
    products,
    brands: catalogBrands,
    categories: catalogCategories,
  });
}

describe("ricerca globale del catalogo", () => {
  it("normalizza accenti, apostrofi, trattini e separatori di categoria", () => {
    expect(
      normalizeCatalogSearchValue("  Whisky & e | Añejo--d’Italia  "),
    ).toBe("whisky anejo ditalia");
  });

  it("trova un prodotto per nome", () => {
    expect(
      runSearch("Yamazaki").products.map((product) => product.slug),
    ).toContain("suntory-yamazaki-18-y-o");
  });

  it("trova prodotti e marchi per marca", () => {
    const results = runSearch("Suntory");

    expect(results.products.map((product) => product.brandName)).toContain(
      "Suntory",
    );
    expect(results.brands.map((brand) => brand.name)).toContain("Suntory");
  });

  it("trova il marchio canonico applicato per codice", () => {
    const results = runSearch("The Glen Grant");

    expect(results.products.map((product) => product.code)).toContain("AB1170");
    expect(results.brands.map((brand) => brand.name)).toContain(
      "The Glen Grant",
    );
  });

  it("trova un prodotto per codice reale", () => {
    expect(runSearch("AB1319").products.map((product) => product.slug)).toEqual(
      ["don-julio-1942"],
    );
  });

  it("trova prodotti per categoria, sottocategoria e capacità", () => {
    expect(runSearch("Japanese Single Malt").products).not.toHaveLength(0);
    expect(runSearch("70 cl").products).not.toHaveLength(0);
  });

  it("gestisce query troppo brevi e nessun risultato", () => {
    expect(runSearch("a").isSearchable).toBe(false);
    expect(runSearch("termine inesistente").totalCount).toBe(0);
  });

  it("trova i prodotti contrassegnati in offerta", () => {
    const results = runSearch("In offerta");

    expect(results.products.map((product) => product.slug)).toEqual([
      "the-macallan-12-y-o-double-cask",
    ]);
  });
});
