import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const validationSource = fs.readFileSync(
  path.join(process.cwd(), "src/lib/validation/checkout.ts"),
  "utf8",
);

const serverSource = fs.readFileSync(
  path.join(process.cwd(), "src/server/checkout/account-checkout.ts"),
  "utf8",
);

describe("checkout promotion plumbing contract", () => {
  it("accetta un promotion code opzionale nel checkout input", () => {
    expect(validationSource).toContain("promotionCode:");
    expect(validationSource).toContain(".max(32)");
    expect(validationSource).toContain("/^[A-Za-z0-9_-]+$/");
  });

  it("restituisce codice e sconto realmente applicati", () => {
    expect(validationSource).toContain("promotionCode: z.string().nullable()");

    expect(validationSource).toContain(
      "discountGrossAmountMinor: z.number().int().nonnegative()",
    );
  });

  it("normalizza il codice prima di inviarlo alla RPC", () => {
    expect(serverSource).toContain("p_promotion_code:");

    expect(serverSource).toContain("input.promotionCode.trim().toUpperCase()");
  });

  it("mappa lo snapshot promo restituito dal database", () => {
    expect(serverSource).toContain("promotionCode: row.promotion_code || null");

    expect(serverSource).toContain(
      "discountGrossAmountMinor: row.discount_gross_amount_minor",
    );
  });

  it("propaga al cliente gli errori funzionali dei codici promo", () => {
    expect(serverSource).toContain('message.includes("Codice promozionale")');

    expect(serverSource).toContain('message.includes("Importo minimo ordine")');
  });
});
