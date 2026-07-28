import { describe, expect, it } from "vitest";

import { businessInfo } from "@/config/business";
import { baseMetadata, defaultSiteUrl } from "@/config/metadata";

describe("metadata base", () => {
  it("usa URL canonico e identità centralizzata", () => {
    expect(baseMetadata.metadataBase?.toString()).toBe(`${defaultSiteUrl}/`);
    expect(baseMetadata.applicationName).toBe(businessInfo.brandName);
    expect(baseMetadata.description).toContain("Selezione italiana");
  });

  it("predispone Open Graph e icone", () => {
    expect(baseMetadata.openGraph).toMatchObject({
      locale: "it_IT",
      siteName: businessInfo.brandName,
    });
    expect(baseMetadata.icons).toBeDefined();
  });
});
