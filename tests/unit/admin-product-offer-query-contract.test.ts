import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("lettura admin offerta prodotto", () => {
  const source = readFileSync(
    resolve("src/server/admin/admin-products.ts"),
    "utf8",
  );

  it("espone il contratto dell’offerta corrente", () => {
    expect(source).toContain("export type AdminProductOffer");
    expect(source).toContain("promotionalNetAmountMinor: number | null");
    expect(source).toContain("startsAt: string | null");
    expect(source).toContain("endsAt: string | null");
  });

  it("carica soltanto l’offerta attiva del prodotto", () => {
    expect(source).toContain("export async function getAdminProductOffer");
    expect(source).toContain('.from("offers")');
    expect(source).toContain('.eq("product_id", productId)');
    expect(source).toContain('.eq("is_active", true)');
    expect(source).toContain(".maybeSingle()");
  });

  it("preserva il valore nullo dei marcatori importati", () => {
    expect(source).toContain("offer.promotional_net_amount_minor === null");
    expect(source).toContain(": Number(offer.promotional_net_amount_minor)");
  });
});
