import { describe, expect, it } from "vitest";

import { createCatalogMenuGroups } from "@/config/catalog";
import { catalogCollections } from "@/content/catalog/collections";
import {
  getProductBySlug,
  getProductsByCollection,
} from "@/content/catalog/selectors";

describe("collezioni del catalogo", () => {
  it("deriva soltanto collezioni con prodotti reali associati", () => {
    expect(catalogCollections).toHaveLength(3);

    catalogCollections.forEach((collection) => {
      expect(collection.productSlugs.length).toBeGreaterThan(0);
      expect(collection.productCount).toBe(collection.productSlugs.length);
      expect(
        collection.productSlugs.every((slug) =>
          Boolean(getProductBySlug(slug)),
        ),
      ).toBe(true);
      expect(getProductsByCollection(collection.slug)).toHaveLength(
        collection.productSlugs.length,
      );
    });
  });

  it("pubblica soltanto le collezioni sostenute dalle fonti", () => {
    expect(catalogCollections.map((collection) => collection.label)).toEqual([
      "Etichette di Pregio",
      "Confezioni Regalo",
      "Nuovi Arrivi",
    ]);
    expect(
      catalogCollections.map((collection) => collection.label),
    ).not.toEqual(
      expect.arrayContaining([
        "Bottiglie Rare",
        "Distillati Rari",
        "Edizioni da Collezione",
      ]),
    );
  });

  it("mappa Etichette di Pregio alla categoria Prestashop verificata", () => {
    const prestigeCollection = catalogCollections.find(
      (collection) => collection.slug === "etichette-di-pregio",
    );
    const products = getProductsByCollection("etichette-di-pregio");

    expect(prestigeCollection).toMatchObject({
      sourceType: "prestashop-category",
      sourceValue: "category:64",
      productCount: 1,
      href: "/collezione/etichette-di-pregio",
    });
    expect(products.map((product) => product.code)).toEqual(["AB1319"]);
  });

  it("conserva i conteggi derivati dalle regole Excel verificate", () => {
    expect(
      catalogCollections.find(
        (collection) => collection.slug === "confezioni-regalo",
      )?.productCount,
    ).toBe(98);
    expect(
      catalogCollections.find(
        (collection) => collection.slug === "nuovi-arrivi",
      )?.productCount,
    ).toBe(65);
  });

  it("espone nel menu tutte e sole le collezioni disponibili", () => {
    const collectionLinks = catalogCollections
      .filter((collection) => collection.productSlugs.length > 0)
      .map((collection) => ({
        label: collection.label,
        href: collection.href,
      }));
    const collectionGroup = createCatalogMenuGroups(collectionLinks).find(
      (group) => group.title === "Collezioni",
    );

    expect(collectionGroup?.links).toEqual(collectionLinks);
  });
});
