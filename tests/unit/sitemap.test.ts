import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import { defaultSiteUrl } from "@/config/metadata";
import { catalogBrands } from "@/content/catalog/brands";
import { catalogCategories } from "@/content/catalog/categories";
import { catalogCollections } from "@/content/catalog/collections";
import { catalogProducts } from "@/content/catalog/products";

describe("sitemap catalogo", () => {
  it("include le route dinamiche indicizzabili del catalogo demo", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);

    catalogCategories.forEach((category) => {
      expect(urls).toContain(`${defaultSiteUrl}/categoria/${category.slug}`);
    });

    catalogBrands.forEach((brand) => {
      expect(urls).toContain(`${defaultSiteUrl}/marchio/${brand.slug}`);
    });

    catalogCollections
      .filter((collection) => collection.productSlugs.length > 0)
      .forEach((collection) => {
        expect(urls).toContain(
          `${defaultSiteUrl}/collezione/${collection.slug}`,
        );
      });

    catalogProducts.forEach((product) => {
      expect(urls).toContain(`${defaultSiteUrl}/prodotto/${product.slug}`);
    });
  });

  it("include soltanto le route statiche indicizzabili", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);

    ["/catalogo", "/in-offerta", "/marchi", "/chi-siamo", "/contatti"].forEach(
      (route) => {
        expect(urls).toContain(`${defaultSiteUrl}${route}`);
      },
    );

    [
      "/preferiti",
      "/carrello",
      "/privacy-policy",
      "/cookie-policy",
      "/termini-e-condizioni",
      "/spedizioni-e-resi",
      "/accedi",
      "/registrati",
      "/checkout",
      "/cerca",
    ].forEach((route) => {
      expect(urls).not.toContain(`${defaultSiteUrl}${route}`);
    });
  });

  it("non pubblica duplicati", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);

    expect(new Set(urls).size).toBe(urls.length);
  });
});
