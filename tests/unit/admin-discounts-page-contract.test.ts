import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/app/admin/(dashboard)/sconti/page.tsx"),
  "utf8",
);

describe("admin discounts page contract", () => {
  it("usa la query server delle offerte", () => {
    expect(source).toContain("getAdminOffers");
    expect(source).toContain("query,");
    expect(source).toContain("status,");
    expect(source).toContain("page: requestedPage");
  });

  it("espone riepilogo promozioni", () => {
    expect(source).toContain("Offerte attive");
    expect(source).toContain("Offerte archiviate");
    expect(source).toContain("Righe storico");
    expect(source).toContain("Prodotti coinvolti");
  });

  it("espone ricerca e filtro stato", () => {
    expect(source).toContain('name="q"');
    expect(source).toContain('name="status"');
    expect(source).toContain('value="active"');
    expect(source).toContain('value="inactive"');
  });

  it("mostra prezzi reali, sconto e stato", () => {
    expect(source).toContain("regularGrossAmountMinor");
    expect(source).toContain("promotionalGrossAmountMinor");
    expect(source).toContain("discountPercentage");
    expect(source).toContain('offer.isActive ? "Attiva" : "Archiviata"');
  });

  it("rimanda al dettaglio prodotto per la gestione", () => {
    expect(source).toContain("href={`/admin/prodotti/${offer.productId}`}");
    expect(source).toContain("Apri prodotto");
  });

  it("supporta paginazione e stato vuoto", () => {
    expect(source).toContain("buildPageHref");
    expect(source).toContain(
      "Nessuna offerta corrisponde ai filtri selezionati.",
    );
  });
});
