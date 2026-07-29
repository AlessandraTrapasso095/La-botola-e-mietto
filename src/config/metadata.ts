import type { Metadata } from "next";

import { brandAssets } from "@/config/brand";
import { businessInfo } from "@/config/business";

export const defaultSiteUrl = "https://labotolaemietto.com";

export const baseMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl),
  title: {
    default: `${businessInfo.brandName} | Distillati, vini e rarità`,
    template: `%s | ${businessInfo.brandName}`,
  },
  description:
    "Selezione italiana di whisky, rum, gin, vini, liquori ed etichette di pregio.",
  applicationName: businessInfo.brandName,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: brandAssets.faviconIco },
      { url: brandAssets.favicon16, sizes: "16x16", type: "image/png" },
      { url: brandAssets.favicon32, sizes: "32x32", type: "image/png" },
      { url: brandAssets.favicon48, sizes: "48x48", type: "image/png" },
    ],
    shortcut: [{ url: brandAssets.faviconIco }],
    apple: [
      {
        url: brandAssets.appleTouchIcon,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: businessInfo.brandName,
    title: `${businessInfo.brandName} | Distillati, vini e rarità`,
    description:
      "Selezione italiana di distillati, vini, liquori ed etichette di pregio.",
    url: "/",
    images: [
      {
        url: brandAssets.openGraphImage,
        width: 1200,
        height: 630,
        alt: businessInfo.brandName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${businessInfo.brandName} | Distillati, vini e rarità`,
    description:
      "Selezione italiana di distillati, vini, liquori ed etichette di pregio.",
    images: [brandAssets.openGraphImage],
  },
};
