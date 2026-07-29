import { describe, expect, it } from "vitest";

import { homeCategories } from "@/content/demo-assets/home";
import { catalogProducts } from "@/content/catalog/products";

describe("contenuti editoriali Milestone 1A", () => {
  it("usa categorie complete e asset centralizzati", () => {
    expect(homeCategories).toHaveLength(6);
    expect(homeCategories.every((category) => category.media.src)).toBe(true);
    expect(
      homeCategories.every((category) =>
        category.media.src.startsWith("/images/demo/"),
      ),
    ).toBe(true);
  });

  it("conserva i prezzi prodotto in unità minori intere", () => {
    expect(catalogProducts.length).toBeGreaterThan(20);
    expect(
      catalogProducts.every(
        (product) =>
          typeof product.netPriceMinor === "bigint" &&
          product.netPriceMinor > 0n,
      ),
    ).toBe(true);
  });
});
