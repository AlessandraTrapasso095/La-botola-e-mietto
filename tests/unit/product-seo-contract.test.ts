import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(process.cwd(), "src/app/(storefront)/prodotto/[slug]/page.tsx"),
  "utf8",
);

describe("product SEO contract", () => {
  it("espone metadata specifici per la scheda prodotto", () => {
    expect(source).toContain("generateMetadata");
    expect(source).toContain("createSeoDescription");
    expect(source).toContain("alternates: { canonical:");
    expect(source).toContain('card: "summary_large_image"');
  });

  it("espone dati strutturati Product completi", () => {
    expect(source).toContain('"@type": "Product"');
    expect(source).toContain('"@type": "Offer"');
    expect(source).toContain('priceCurrency: "EUR"');
    expect(source).toContain('"@type": "Organization"');
    expect(source).toContain("businessInfo.brandName");
  });

  it("espone breadcrumb strutturati", () => {
    expect(source).toContain('"@type": "BreadcrumbList"');
    expect(source).toContain('"@type": "ListItem"');
    expect(source).toContain("itemListElement");
  });

  it("usa URL assoluti per le immagini SEO", () => {
    expect(source).toContain("absoluteUrl(product.media[0].src)");
    expect(source).toContain("absoluteUrl(media.src)");
    expect(source).toContain("defaultSiteUrl");
  });
});
