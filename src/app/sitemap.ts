import type { MetadataRoute } from "next";

import { defaultSiteUrl } from "@/config/metadata";
import { catalogBrands } from "@/content/catalog/brands";
import { catalogCategories } from "@/content/catalog/categories";
import { catalogProducts } from "@/content/catalog/products";

const staticRoutes = [
  "",
  "/catalogo",
  "/marchi",
  "/preferiti",
  "/carrello",
  "/privacy-policy",
  "/cookie-policy",
  "/termini-e-condizioni",
  "/spedizioni-e-resi",
  "/contatti",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const categoryRoutes = catalogCategories.map(
    (category) => `/categoria/${category.slug}`,
  );
  const brandRoutes = catalogBrands.map((brand) => `/marchio/${brand.slug}`);
  const productRoutes = catalogProducts.map(
    (product) => `/prodotto/${product.slug}`,
  );

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...brandRoutes,
    ...productRoutes,
  ].map((route) => ({
    url: `${defaultSiteUrl}${route}`,
    changeFrequency:
      route === "" || route === "/catalogo" ? "weekly" : "monthly",
    priority:
      route === ""
        ? 1
        : route === "/catalogo" || route.startsWith("/categoria/")
          ? 0.8
          : route.startsWith("/prodotto/")
            ? 0.7
            : 0.5,
  }));
}
