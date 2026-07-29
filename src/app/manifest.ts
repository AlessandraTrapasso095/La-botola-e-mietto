import type { MetadataRoute } from "next";

import { brandAssets } from "@/config/brand";
import { businessInfo } from "@/config/business";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: businessInfo.brandName,
    short_name: "La Botola",
    description:
      "Selezione italiana di distillati, vini ed etichette di pregio.",
    start_url: "/",
    display: "standalone",
    background_color: "#131313",
    theme_color: "#131313",
    lang: "it",
    icons: [
      {
        src: brandAssets.androidIcon192,
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: brandAssets.androidIcon512,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
