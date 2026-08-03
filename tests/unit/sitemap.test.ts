import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import { defaultSiteUrl } from "@/config/metadata";
import { catalogBrands } from "@/content/catalog/brands";
import { catalogCategories } from "@/content/catalog/categories";
import { catalogCollections } from "@/content/catalog/collections";
import { catalogProducts } from "@/content/catalog/products";

describe("sitemap catalogo", () => {
  it("include tutte e sole le route dinamiche del dataset centralizzato", () => {
    const urls = sitemap().map((entry) => entry.url);

    catalogCategories.forEach((category) => {
      expect(urls).toContain(`${defaultSiteUrl}/categoria/${category.slug}`);
    });
    catalogBrands.forEach((brand) => {
      expect(urls).toContain(`${defaultSiteUrl}/marchio/${brand.slug}`);
    });
    catalogCollections.forEach((collection) => {
      expect(urls).toContain(`${defaultSiteUrl}/collezione/${collection.slug}`);
    });
    catalogProducts.forEach((product) => {
      expect(urls).toContain(`${defaultSiteUrl}/prodotto/${product.slug}`);
    });
  });

  it("include le route pubbliche statiche richieste", () => {
    const urls = sitemap().map((entry) => entry.url);

    ["/catalogo", "/in-offerta", "/marchi", "/preferiti", "/carrello"].forEach(
      (route) => {
        expect(urls).toContain(`${defaultSiteUrl}${route}`);
      },
    );
  });
});
