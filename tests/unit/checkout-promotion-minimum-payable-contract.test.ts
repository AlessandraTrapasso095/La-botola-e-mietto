import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(
    process.cwd(),
    "supabase/migrations/0047_checkout_promotion_minimum_payable.sql",
  ),
  "utf8",
);

describe("checkout promotion minimum payable contract", () => {
  it("mantiene la firma checkout con codice promozionale", () => {
    expect(source).toContain("p_promotion_code text default null");
  });

  it("calcola il totale scontato prima del controllo", () => {
    const totalIndex = source.indexOf("v_total_gross_amount_minor :=");
    const guardIndex = source.indexOf(
      "if v_total_gross_amount_minor <= 0 then",
    );

    expect(totalIndex).toBeGreaterThan(-1);
    expect(guardIndex).toBeGreaterThan(totalIndex);
  });

  it("impedisce la creazione di ordini completamente gratuiti", () => {
    expect(source).toContain("if v_total_gross_amount_minor <= 0 then");

    expect(source).toContain(
      "Il codice promozionale non può azzerare completamente l’importo dell’ordine.",
    );
  });

  it("esegue il controllo prima di generare l'ordine", () => {
    const guardIndex = source.indexOf(
      "if v_total_gross_amount_minor <= 0 then",
    );

    const orderIndex = source.indexOf("v_order_id := gen_random_uuid();");

    expect(guardIndex).toBeGreaterThan(-1);
    expect(orderIndex).toBeGreaterThan(guardIndex);
  });
});
