import { describe, expect, it } from "vitest";

import { emptyCatalogFilters } from "@/features/catalog/catalog-filter";
import { DemoCatalogRepository } from "@/server/catalog/demo-catalog-repository";

describe("DemoCatalogRepository", () => {
  const repository = new DemoCatalogRepository();

  it("pagina il catalogo senza esporre l'intero snapshot", async () => {
    const firstPage = await repository.queryProducts({
      page: 1,
      pageSize: 12,
      sort: "featured",
      filters: emptyCatalogFilters,
    });
    const secondPage = await repository.queryProducts({
      page: 2,
      pageSize: 12,
      sort: "featured",
      filters: emptyCatalogFilters,
    });

    expect(firstPage.totalCount).toBe(2_124);
    expect(firstPage.items).toHaveLength(12);
    expect(secondPage.items).toHaveLength(12);
    expect(secondPage.items[0]?.slug).not.toBe(firstPage.items[0]?.slug);
  });

  it("applica filtri e ricerca nel repository server", async () => {
    const filtered = await repository.queryProducts({
      page: 1,
      pageSize: 12,
      sort: "name",
      filters: { ...emptyCatalogFilters, categories: ["gin"] },
    });
    const results = await repository.search("AB1170", { productLimit: 5 });

    expect(filtered.items.length).toBeGreaterThan(0);
    expect(
      filtered.items.every((product) => product.categorySlug === "gin"),
    ).toBe(true);
    expect(results.products.map((product) => product.code)).toContain("AB1170");
  });
});
