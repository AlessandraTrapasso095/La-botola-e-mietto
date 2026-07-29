import { demoMedia } from "@/content/demo-assets/media";
import type { CatalogCollection } from "@/content/catalog/types";

export const catalogCollections = [
  {
    slug: "nuovi-arrivi",
    title: "Nuovi arrivi",
    description:
      "Release recenti e bottiglie appena entrate nella selezione della boutique.",
    productSlugs: [
      "yamazaki-18-years-old",
      "hendricks-another-gin",
      "caprisius-43",
      "roku-noryo-tea-edition",
      "clase-azul-gold",
    ],
    media: demoMedia.ginTea,
  },
  {
    slug: "distillati-rari",
    title: "Distillati rari",
    description:
      "Cuvée di prestigio, lunghe maturazioni e decanter da collezione.",
    productSlugs: [
      "the-macallan-18-double-cask",
      "yamazaki-18-years-old",
      "clase-azul-anejo",
      "the-macallan-rare-cask-2023",
    ],
    media: demoMedia.rareCollection,
  },
] as const satisfies readonly CatalogCollection[];
