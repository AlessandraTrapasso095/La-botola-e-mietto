import { afterEach, describe, expect, it } from "vitest";

import { resolveCatalogMode } from "@/server/catalog/catalog-mode";
import { DemoCatalogRepository } from "@/server/catalog/demo-catalog-repository";
import { getCatalogRepository } from "@/server/catalog/get-catalog-repository";
import { SupabaseCatalogRepository } from "@/server/catalog/supabase-catalog-repository";

const initialRepository = process.env.CATALOG_REPOSITORY;

afterEach(() => {
  if (initialRepository === undefined) delete process.env.CATALOG_REPOSITORY;
  else process.env.CATALOG_REPOSITORY = initialRepository;
});

describe("configurazione repository catalogo", () => {
  it("consente demo soltanto fuori produzione", () => {
    expect(resolveCatalogMode(undefined, "development")).toBe("demo");
    expect(resolveCatalogMode("", "test")).toBe("demo");
    expect(resolveCatalogMode("demo", "development")).toBe("demo");
    expect(resolveCatalogMode("supabase", "development")).toBe("supabase");
  });

  it("consente soltanto Supabase in produzione", () => {
    expect(resolveCatalogMode("supabase", "production")).toBe("supabase");

    for (const value of [undefined, "", "invalid", "demo"]) {
      expect(() => resolveCatalogMode(value, "production")).toThrow(
        "CATALOG_REPOSITORY deve essere impostato su supabase in produzione.",
      );
    }
  });

  it("usa sempre il repository demo in assenza di configurazione", () => {
    delete process.env.CATALOG_REPOSITORY;
    expect(getCatalogRepository()).toBeInstanceOf(DemoCatalogRepository);
  });

  it("seleziona Supabase soltanto quando richiesto esplicitamente", () => {
    process.env.CATALOG_REPOSITORY = "supabase";
    expect(getCatalogRepository()).toBeInstanceOf(SupabaseCatalogRepository);
  });
});
