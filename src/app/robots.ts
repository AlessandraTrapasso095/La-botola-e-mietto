import type { MetadataRoute } from "next";

import { defaultSiteUrl } from "@/config/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/design-system", "/api/"],
    },
    sitemap: `${defaultSiteUrl}/sitemap.xml`,
  };
}
