import { describe, expect, it } from "vitest";

import { catalogProducts } from "@/content/catalog/products";
import { createCatalogProductSummaryView } from "@/server/catalog-view";
import { mapCatalogProductToDomain } from "@/server/catalog/product-mapper";

describe("mapping catalogo e denaro", () => {
  it("mantiene il prezzo netto bigint e crea un DTO card ridotto", () => {
    const source = catalogProducts[0];
    expect(source).toBeDefined();
    if (!source) return;

    const product = mapCatalogProductToDomain(source);
    const card = createCatalogProductSummaryView(product);

    expect(typeof product.price.netAmountMinor).toBe("bigint");
    expect(Number.isInteger(card.grossPriceMinor)).toBe(true);
    expect(card).not.toHaveProperty("overview");
    expect(card).not.toHaveProperty("tastingNotes");
  });
});
