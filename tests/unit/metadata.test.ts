import { describe, expect, it } from "vitest";

import { businessInfo } from "@/config/business";
import { brandAssets } from "@/config/brand";
import { baseMetadata, defaultSiteUrl } from "@/config/metadata";

describe("metadata base", () => {
  it("usa URL configurato con fallback canonico e identità centralizzata", () => {
    const expectedSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl;

    expect(baseMetadata.metadataBase?.toString()).toBe(
      new URL(expectedSiteUrl).toString(),
    );
    expect(baseMetadata.applicationName).toBe(businessInfo.brandName);
    expect(baseMetadata.description).toContain("Selezione italiana");
  });

  it("predispone Open Graph e icone", () => {
    expect(baseMetadata.openGraph).toMatchObject({
      locale: "it_IT",
      siteName: businessInfo.brandName,
    });
    expect(baseMetadata.icons).toBeDefined();
    expect(brandAssets).toMatchObject({
      faviconIco: "/favicon.ico",
      favicon16: "/brand/favicon-16.png",
      favicon32: "/brand/favicon-32.png",
      favicon48: "/brand/favicon-48.png",
      appleTouchIcon: "/brand/apple-touch-icon.png",
      androidIcon192: "/brand/icon-192.png",
      androidIcon512: "/brand/icon-512.png",
    });
  });
});
