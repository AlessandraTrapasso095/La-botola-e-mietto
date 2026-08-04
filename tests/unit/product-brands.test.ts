import { describe, expect, it } from "vitest";

import { catalogBrands } from "@/content/catalog/brands";
import {
  approvedCatalogBrands,
  genericBrandManualReviewCodes,
  productBrandByCode,
} from "@/content/catalog/product-brands";
import { catalogProducts } from "@/content/catalog/products";
import { getProductsByBrand } from "@/content/catalog/selectors";

function getProductByCode(code: string) {
  return catalogProducts.find((product) => product.code === code);
}

describe("marchi catalogo approvati", () => {
  it("associa le correzioni esclusivamente tramite codice prodotto", () => {
    expect(Object.keys(productBrandByCode)).toHaveLength(109);
    expect(productBrandByCode.AB1170).toBe("The Glen Grant");
    expect(getProductByCode("AB1170")?.brandSlug).toBe("the-glen-grant");

    const approvedSlugByName = new Map(
      approvedCatalogBrands.map((brand) => [brand.name, brand.slug]),
    );
    Object.entries(productBrandByCode).forEach(([code, brandName]) => {
      expect(getProductByCode(code)?.brandSlug).toBe(
        approvedSlugByName.get(brandName),
      );
    });
  });

  it("non pubblica categorie e nazionalità come marchi", () => {
    expect(genericBrandManualReviewCodes).toHaveLength(41);
    genericBrandManualReviewCodes.forEach((code) => {
      expect(getProductByCode(code)?.brandSlug).toBeNull();
    });
    expect(
      catalogBrands.some((brand) =>
        [
          "aguardiente",
          "amaro",
          "american",
          "corn-whiskey",
          "japanese-whiskey",
          "ouzo",
          "pastis",
          "sambuca",
          "taiwan-whisky",
        ].includes(brand.slug),
      ),
    ).toBe(false);
  });

  it.each([
    ["AB6660", "ballantines", "Ballantine’s"],
    ["AB2904", "crafters", "Crafter’s"],
    ["AB6205", "the-glenlivet", "The Glenlivet"],
    ["AB2189", "goslings", "Gosling’s"],
  ])(
    "normalizza %s nel marchio canonico",
    (code, expectedSlug, expectedName) => {
      expect(getProductByCode(code)?.brandSlug).toBe(expectedSlug);
      expect(
        catalogBrands.find((brand) => brand.slug === expectedSlug)?.name,
      ).toBe(expectedName);
    },
  );

  it("mantiene distinti Plantation e Planteray", () => {
    const plantationProducts = catalogProducts.filter((product) =>
      product.name.startsWith("Plantation "),
    );
    const planterayProducts = catalogProducts.filter((product) =>
      product.name.startsWith("Planteray "),
    );

    expect(plantationProducts.length).toBeGreaterThan(0);
    expect(
      plantationProducts.every((product) => product.brandSlug === "plantation"),
    ).toBe(true);
    expect(planterayProducts).toHaveLength(8);
    expect(
      planterayProducts.every((product) => product.brandSlug === "planteray"),
    ).toBe(true);
  });

  it("genera un elenco marchi univoco e sempre collegato a prodotti", () => {
    const slugs = catalogBrands.map((brand) => brand.slug);
    const names = catalogBrands.map((brand) =>
      brand.name.toLocaleLowerCase("it"),
    );

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(names).size).toBe(names.length);
    expect(catalogBrands.length).toBeGreaterThan(0);

    catalogBrands.forEach((brand) => {
      const products = getProductsByBrand(brand.slug);
      expect(products).toHaveLength(brand.productCount);
      expect(products.length).toBeGreaterThan(0);
    });
  });

  it("preserva prezzi, quantità e il conflitto AB1293", () => {
    const glenGrant = getProductByCode("AB1170");
    const duplicatedProducts = catalogProducts.filter(
      (product) => product.code === "AB1293",
    );

    expect(glenGrant?.netPriceMinor).toBe(3152n);
    expect(glenGrant?.stockQuantity).toBe(94);
    expect(duplicatedProducts).toHaveLength(2);
    expect(duplicatedProducts.map((product) => product.stockQuantity)).toEqual([
      41, 65,
    ]);
    expect(
      duplicatedProducts.every((product) => product.netPriceMinor === 1699n),
    ).toBe(true);
  });
});
