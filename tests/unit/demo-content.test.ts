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

  it("non pubblica l'immagine contestata per il prodotto AB6837", () => {
    const ak47Product = catalogProducts.find(
      (product) => product.code === "AB6837",
    );
    const redArmyProduct = catalogProducts.find(
      (product) => product.code === "AB0093",
    );

    expect(ak47Product?.media[0].src).toBe("/images/placeholder-bottle.svg");
    expect(redArmyProduct?.media[0].src).toContain(
      "1200-vodka-red-army-kalashnikov-40",
    );
    expect(
      catalogProducts.filter((product) =>
        product.media.some((media) =>
          media.src.includes("0700-vodka-ak47-absolute-standard"),
        ),
      ),
    ).toHaveLength(0);
  });
});
