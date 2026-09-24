import type { MetadataRoute } from "next";

import { defaultSiteUrl } from "@/config/metadata";
import { catalogBrands } from "@/content/catalog/brands";
import { catalogCategories } from "@/content/catalog/categories";
import { catalogCollections } from "@/content/catalog/collections";
import { getCatalogRepository } from "@/server/catalog/get-catalog-repository";

const staticRoutes = [
  "",
  "/catalogo",
  "/in-offerta",
  "/marchi",
  "/chi-siamo",
  "/contatti",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categoryRoutes = catalogCategories.map(
    (category) => `/categoria/${category.slug}`,
  );

  const brandRoutes = catalogBrands.map((brand) => `/marchio/${brand.slug}`);

  const collectionRoutes = catalogCollections
    .filter((collection) => collection.productSlugs.length > 0)
    .map((collection) => collection.href);

  const runtimeProductSlugs = await getCatalogRepository().getAllProductSlugs();

  const productRoutes = runtimeProductSlugs.map((slug) => `/prodotto/${slug}`);

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...brandRoutes,
    ...collectionRoutes,
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
