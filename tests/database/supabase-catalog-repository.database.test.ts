import { createClient } from "@supabase/supabase-js";
import { beforeAll, describe, expect, it } from "vitest";

import { emptyCatalogFilters } from "@/features/catalog/catalog-filter";
import { getLocalSupabaseEnvironment } from "@/server/catalog-import/local-supabase";
import { DemoCatalogRepository } from "@/server/catalog/demo-catalog-repository";
import { SupabaseCatalogRepository } from "@/server/catalog/supabase-catalog-repository";
import type { Database } from "@/types/database.generated";

describe("SupabaseCatalogRepository locale", () => {
  const environment = getLocalSupabaseEnvironment();
  const client = createClient<Database>(
    environment.API_URL,
    environment.ANON_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
  const supabaseRepository = new SupabaseCatalogRepository(async () => client);
  const demoRepository = new DemoCatalogRepository();

  beforeAll(async () => {
    const { count, error } = await client
      .from("catalog_products_view")
      .select("product_id", { count: "exact", head: true });
    expect(error).toBeNull();
    expect(count).toBe(2_123);
  });

  it("pagina, ordina e filtra senza caricare il catalogo completo", async () => {
    const firstPage = await supabaseRepository.queryProducts({
      page: 1,
      pageSize: 12,
      sort: "price-asc",
      filters: emptyCatalogFilters,
    });
    const secondPage = await supabaseRepository.queryProducts({
      page: 2,
      pageSize: 12,
      sort: "price-asc",
      filters: emptyCatalogFilters,
    });
    const gin = await supabaseRepository.queryProducts({
      page: 1,
      pageSize: 20,
      sort: "name",
      filters: { ...emptyCatalogFilters, categories: ["gin"] },
    });

    expect(firstPage).toMatchObject({
      page: 1,
      pageSize: 12,
      totalCount: 2_123,
    });
    expect(firstPage.items).toHaveLength(12);
    expect(secondPage.items).toHaveLength(12);
    expect(secondPage.items[0]?.slug).not.toBe(firstPage.items[0]?.slug);
    expect(gin.totalCount).toBe(547);
    expect(gin.items.every((product) => product.categorySlug === "gin")).toBe(
      true,
    );
  });

  it("supporta categoria, sottocategoria, marchio e collezioni per slug", async () => {
    const subcategoryScope = {
      subcategorySlug: "whisky-whiskey--blended-scotch",
    } as const;
    const [demoSubcategory, supabaseSubcategory, brand, collection] =
      await Promise.all([
        demoRepository.queryProducts({
          page: 1,
          pageSize: 20,
          sort: "name",
          filters: emptyCatalogFilters,
          scope: subcategoryScope,
        }),
        supabaseRepository.queryProducts({
          page: 1,
          pageSize: 20,
          sort: "name",
          filters: emptyCatalogFilters,
          scope: subcategoryScope,
        }),
        supabaseRepository.queryProducts({
          page: 1,
          pageSize: 20,
          sort: "name",
          filters: emptyCatalogFilters,
          scope: { brandSlug: "the-glen-grant" },
        }),
        supabaseRepository.queryProducts({
          page: 1,
          pageSize: 10,
          sort: "featured",
          filters: emptyCatalogFilters,
          scope: {
            productSlugs: [
              "glen-grant-12yo-0-70-2-bicchieri",
              "ak47-absolute-standard",
            ],
          },
        }),
      ]);

    expect(supabaseSubcategory.totalCount).toBe(demoSubcategory.totalCount);
    expect(brand.items.some((product) => product.code === "AB1170")).toBe(true);
    expect(collection.items.map((product) => product.code).sort()).toEqual([
      "AB1170",
      "AB6837",
    ]);
  });

  it("restituisce opzioni filtro aggregate e nuovi arrivi reali", async () => {
    const [options, newArrivals] = await Promise.all([
      supabaseRepository.getFilterOptions({ categorySlug: "gin" }),
      supabaseRepository.queryProducts({
        page: 1,
        pageSize: 100,
        sort: "newest",
        filters: { ...emptyCatalogFilters, onlyNew: true },
      }),
    ]);

    expect(options.brands.length).toBeGreaterThan(0);
    expect(options.categories).toHaveLength(13);
    expect(options.brands.map((brand) => brand.value)).toContain("tanqueray");
    expect(newArrivals.totalCount).toBe(65);
    expect(newArrivals.items.every((product) => product.isNew)).toBe(true);
  });

  it("ricerca per nome, codice e marchio con limiti espliciti", async () => {
    const [byName, byCode, byBrand] = await Promise.all([
      supabaseRepository.search("Absolut", { productLimit: 8 }),
      supabaseRepository.search("AB1170", { productLimit: 8 }),
      supabaseRepository.search("The Glen Grant", { productLimit: 20 }),
    ]);

    expect(byName.products.length).toBeGreaterThan(0);
    expect(
      byName.products.some((product) =>
        product.name.toLocaleLowerCase("it-IT").includes("absolut"),
      ),
    ).toBe(true);
    expect(byCode.products.map((product) => product.code)).toContain("AB1170");
    expect(byBrand.brands.map((brand) => brand.slug)).toContain(
      "the-glen-grant",
    );
    expect(
      byBrand.products.some(
        (product) => product.brandSlug === "the-glen-grant",
      ),
    ).toBe(true);
  });

  it("mappa prezzi e offerte senza inventare prezzo precedente", async () => {
    const product = await supabaseRepository.getProductByCode("AB1170");
    const offers = await supabaseRepository.queryProducts({
      page: 1,
      pageSize: 100,
      sort: "featured",
      filters: emptyCatalogFilters,
      scope: { onlyOffers: true },
    });

    expect(product).toMatchObject({
      code: "AB1170",
      grossPriceMinor: 3_845,
      grossPrice: "38,45 €",
    });
    expect(offers.totalCount).toBe(50);
    expect(offers.items.every((item) => item.offer?.isActive)).toBe(true);
    expect(
      offers.items.every(
        (item) =>
          item.offer?.previousGrossPrice === null &&
          item.offer?.discountPercentage === null,
      ),
    ).toBe(true);
  });

  it("mantiene sconosciuto AB1293 e il placeholder verificato di AB6837", async () => {
    const [duplicateCode, missingImage] = await Promise.all([
      supabaseRepository.getProductByCode("AB1293"),
      supabaseRepository.getProductByCode("AB6837"),
    ]);

    expect(duplicateCode?.stockQuantity).toBeNull();
    expect(missingImage?.media[0]?.src).toBe("/images/placeholder-bottle.svg");
  });

  it("risolve carrello e wishlist preservando l'ordine richiesto", async () => {
    const slugs = [
      "ak47-absolute-standard",
      "glen-grant-12yo-0-70-2-bicchieri",
    ];
    const products = await supabaseRepository.getProductsBySlugs(slugs);

    expect(products.map((product) => product.slug)).toEqual(slugs);
    expect(products).toHaveLength(2);
  });

  it("documenta l'unica differenza di cardinalità attesa dal duplicato AB1293", async () => {
    const [demo, supabase] = await Promise.all([
      demoRepository.queryProducts({
        page: 1,
        pageSize: 12,
        sort: "price-asc",
        filters: emptyCatalogFilters,
      }),
      supabaseRepository.queryProducts({
        page: 1,
        pageSize: 12,
        sort: "price-asc",
        filters: emptyCatalogFilters,
      }),
    ]);

    expect(demo.totalCount - supabase.totalCount).toBe(1);
    expect(supabase.items.map((product) => product.code)).toEqual(
      demo.items.map((product) => product.code),
    );
  });

  it("completa un burst delle query pubbliche senza timeout 57014", async () => {
    const startedAt = performance.now();
    const operations = Array.from({ length: 4 }, () =>
      Promise.all([
        supabaseRepository.queryProducts({
          page: 1,
          pageSize: 24,
          sort: "featured",
          filters: emptyCatalogFilters,
        }),
        supabaseRepository.queryProducts({
          page: 1,
          pageSize: 24,
          sort: "newest",
          filters: { ...emptyCatalogFilters, onlyNew: true },
        }),
        supabaseRepository.queryProducts({
          page: 1,
          pageSize: 24,
          sort: "name",
          filters: emptyCatalogFilters,
          scope: { onlyOffers: true },
        }),
        supabaseRepository.getProductBySlug("caprisius"),
        supabaseRepository.getRelatedProducts("caprisius", 4),
        supabaseRepository.getProductsBySlugs([
          "caprisius",
          "glen-grant-12yo-0-70-2-bicchieri",
        ]),
        supabaseRepository.getFilterOptions({ categorySlug: "gin" }),
        supabaseRepository.search("Absolut", { productLimit: 8 }),
      ]),
    );

    const results = await Promise.all(operations);
    expect(results).toHaveLength(4);
    expect(performance.now() - startedAt).toBeLessThan(3_000);
  });
});
