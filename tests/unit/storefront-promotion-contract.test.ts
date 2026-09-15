import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/server/catalog/storefront-promotion.ts"),
  "utf8",
);

describe("storefront promotion contract", () => {
  it("legge solo codici promozionali attivi", () => {
    expect(source).toContain('.from("promotion_codes")');
    expect(source).toContain('.eq("is_active", true)');
  });

  it("esclude codici non ancora iniziati", () => {
    expect(source).toContain(
      "promotion.starts_at && new Date(promotion.starts_at) > now",
    );
  });

  it("esclude codici scaduti", () => {
    expect(source).toContain(
      "promotion.ends_at && new Date(promotion.ends_at) <= now",
    );
  });

  it("conta gli utilizzi con le stesse regole dell'admin", () => {
    expect(source).toContain('.from("orders")');
    expect(source).toContain('.neq("status", "cancelled")');
    expect(source).toContain(
      '.in("payment_status", ["pending", "authorized", "paid"])',
    );
  });

  it("esclude codici che hanno raggiunto il limite utilizzi", () => {
    expect(source).toContain("candidate.usage_limit === null");
    expect(source).toContain(
      "(usageCountByCode.get(candidate.id) ?? 0) < candidate.usage_limit",
    );
  });

  it("usa una regola deterministica quando esistono più codici", () => {
    expect(source).toContain('.order("created_at", { ascending: false })');
    expect(source).toContain("candidates.find");
  });

  it("espone i dati necessari al messaggio storefront", () => {
    expect(source).toContain("code: promotion.code");
    expect(source).toContain("discountType: promotion.discount_type");
    expect(source).toContain("discountValue: Number(promotion.discount_value)");
    expect(source).toContain("minimumOrderGrossAmountMinor");
  });

  it("restituisce null se non esiste una promozione utilizzabile", () => {
    expect(source).toContain("return null");
  });
});
