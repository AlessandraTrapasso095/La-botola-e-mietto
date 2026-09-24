import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const root = process.cwd();

function read(relativePath: string) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

describe("final content QA contract", () => {
  const shippingPromise = read("src/features/catalog/shipping-promise.tsx");
  const terms = read("src/app/(storefront)/termini-e-condizioni/page.tsx");
  const business = read("src/config/business.ts");

  it("mantiene la promessa di spedizione collegata alla soglia aziendale", () => {
    expect(shippingPromise).toContain(
      "businessInfo.freeShippingThresholdMinor",
    );

    expect(shippingPromise).toContain("Spedizione gratuita");
    expect(shippingPromise).toContain("In Italia sopra");
  });

  it("non presenta i termini come contenuto futuro o ancora da completare", () => {
    expect(terms).not.toContain("futura conclusione degli acquisti");
    expect(terms).not.toContain("Le condizioni definitive dovranno");

    expect(terms).toContain(
      "Condizioni che regolano l’accesso al catalogo e gli acquisti effettuati sul sito.",
    );
  });

  it("non espone avvisi interni di revisione nelle pagine legali", () => {
    const legalPage = read("src/components/legal/legal-page.tsx");
    const privacy = read("src/app/(storefront)/privacy-policy/page.tsx");
    const cookie = read("src/app/(storefront)/cookie-policy/page.tsx");

    expect(legalPage).not.toContain(
      "Contenuto da validare e aggiornare prima della pubblicazione.",
    );
    expect(legalPage).not.toContain(
      "Le informazioni sono in revisione e non costituiscono consulenza legale.",
    );
    expect(legalPage).not.toContain("showReviewNotice");

    expect(privacy).not.toContain("showReviewNotice");
    expect(cookie).not.toContain("showReviewNotice");
  });

  it("non mantiene i refusi editoriali legali già individuati", () => {
    const privacy = read("src/app/(storefront)/privacy-policy/page.tsx");
    const cookie = read("src/app/(storefront)/cookie-policy/page.tsx");

    expect(privacy).not.toContain("Aisensi");
    expect(cookie).not.toContain("consensopuò");
  });

  it("mantiene i dati del venditore collegati alla configurazione aziendale", () => {
    expect(terms).toContain("businessInfo.legalName");
    expect(terms).toContain("businessInfo.vatNumber");
    expect(terms).toContain("businessInfo.address.city");

    expect(business).toContain('brandName: "La Botola e Mietto"');
  });
});
