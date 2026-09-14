import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/server/admin/admin-offers.ts"),
  "utf8",
);

describe("admin offers query contract", () => {
  it("usa esclusivamente il server e il client admin Supabase", () => {
    expect(source).toContain('import "server-only"');
    expect(source).toContain("createSupabaseAdminClient");
  });

  it("espone ricerca, stato e paginazione", () => {
    expect(source).toContain(
      'export type AdminOfferStatus = "all" | "active" | "inactive"',
    );
    expect(source).toContain("query?: string");
    expect(source).toContain("status?: AdminOfferStatus");
    expect(source).toContain("page?: number");
    expect(source).toContain("adminOffersPageSize = 50");
  });

  it("carica offerte e prodotti collegati", () => {
    expect(source).toContain('.from("offers")');
    expect(source).toContain("products (");
    expect(source).toContain("product_id");
    expect(source).toContain("promotional_net_amount_minor");
  });

  it("carica il prezzo corrente senza usare prezzi storici", () => {
    expect(source).toContain('.from("prices")');
    expect(source).toContain('.is("valid_to", null)');
    expect(source).toContain("net_amount_minor");
    expect(source).toContain("vat_rate_basis_points");
  });

  it("calcola lo sconto esclusivamente da prezzo reale e promozionale", () => {
    expect(source).toContain("calculateDiscountPercentage");
    expect(source).toContain(
      "promotionalNetAmountMinor >= regularNetAmountMinor",
    );
    expect(source).toContain(
      "((regularNetAmountMinor - promotionalNetAmountMinor) /",
    );
  });

  it("espone il riepilogo amministrativo", () => {
    expect(source).toContain("activeCount");
    expect(source).toContain("inactiveCount");
    expect(source).toContain("involvedProductsCount");
    expect(source).toContain("new Set(");
  });
});
