import { demoMedia } from "@/content/demo-assets/media";
import { catalogProducts } from "@/content/catalog/products";
import type { CatalogCollection } from "@/content/catalog/types";

export const catalogCollections = [
  {
    slug: "nuovi-arrivi",
    title: "Nuovi arrivi",
    description:
      "Release recenti e bottiglie appena entrate nella selezione della boutique.",
    productSlugs: catalogProducts
      .filter((product) => product.isNew)
      .slice(0, 12)
      .map((product) => product.slug),
    media: demoMedia.ginTea,
  },
  {
    slug: "distillati-rari",
    title: "Distillati rari",
    description:
      "Cuvée di prestigio, lunghe maturazioni e decanter da collezione.",
    productSlugs: catalogProducts
      .filter((product) => product.isLimited)
      .slice(0, 12)
      .map((product) => product.slug),
    media: demoMedia.rareCollection,
  },
] as const satisfies readonly CatalogCollection[];
