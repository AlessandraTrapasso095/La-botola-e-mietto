import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/components/layout/site-header-client.tsx"),
  "utf8",
);

describe("storefront promotion header ui contract", () => {
  it("mostra la promo soltanto quando presente", () => {
    expect(source).toContain("storefrontPromotion ?");
    expect(source).toContain("Ottieni");
    expect(source).toContain("di sconto con il codice");
    expect(source).toContain("{storefrontPromotion.code}");
  });

  it("mantiene il messaggio spedizione gratuita", () => {
    expect(source).toContain("Spedizione gratuita in Italia sopra");
    expect(source).toContain("freeShippingThreshold");
  });

  it("usa layout promo a sinistra e spedizione a destra", () => {
    expect(source).toContain("sm:justify-between");
    expect(source).toContain("sm:text-left");
    expect(source).toContain("sm:text-right");
  });

  it("mantiene il fallback centrato senza promo", () => {
    expect(source).toContain(
      'className="flex min-h-10 items-center justify-center text-center"',
    );
  });

  it("formatta correttamente sconti percentuali", () => {
    expect(source).toContain(
      'storefrontPromotion.discountType === "percentage"',
    );
    expect(source).toContain("`${storefrontPromotion.discountValue}%`");
  });

  it("formatta correttamente sconti fissi", () => {
    expect(source).toContain("formatPromotionMoney");
    expect(source).toContain("storefrontPromotion.currency");
  });

  it("mostra l'importo minimo quando configurato", () => {
    expect(source).toContain(
      "storefrontPromotion.minimumOrderGrossAmountMinor > 0",
    );
    expect(source).toContain("su ordini da");
  });

  it("evidenzia il codice promozionale nel messaggio", () => {
    expect(source).toContain("di sconto con il codice");
    expect(source).toContain(
      'className="ml-1 inline-flex rounded-full bg-emerald-400',
    );
    expect(source).toContain("{storefrontPromotion.code}");
  });

  it("mantiene un layout mobile compatto", () => {
    expect(source).toContain("flex-col");
    expect(source).toContain("sm:flex-row");
  });
});
