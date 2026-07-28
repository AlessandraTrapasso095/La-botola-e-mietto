import type { MetadataRoute } from "next";

import { defaultSiteUrl } from "@/config/metadata";

const routes = [
  "",
  "/privacy-policy",
  "/cookie-policy",
  "/termini-e-condizioni",
  "/spedizioni-e-resi",
  "/contatti",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${defaultSiteUrl}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.4,
  }));
}
