import { afterEach, describe, expect, it } from "vitest";

import { DemoCatalogRepository } from "@/server/catalog/demo-catalog-repository";
import { getCatalogRepository } from "@/server/catalog/get-catalog-repository";
import { SupabaseCatalogRepository } from "@/server/catalog/supabase-catalog-repository";

const initialRepository = process.env.CATALOG_REPOSITORY;

afterEach(() => {
  if (initialRepository === undefined) delete process.env.CATALOG_REPOSITORY;
  else process.env.CATALOG_REPOSITORY = initialRepository;
});

describe("configurazione repository catalogo", () => {
  it("usa sempre il repository demo in assenza di configurazione", () => {
    delete process.env.CATALOG_REPOSITORY;
    expect(getCatalogRepository()).toBeInstanceOf(DemoCatalogRepository);
  });

  it("seleziona Supabase soltanto quando richiesto esplicitamente", () => {
    process.env.CATALOG_REPOSITORY = "supabase";
    expect(getCatalogRepository()).toBeInstanceOf(SupabaseCatalogRepository);
  });
});
