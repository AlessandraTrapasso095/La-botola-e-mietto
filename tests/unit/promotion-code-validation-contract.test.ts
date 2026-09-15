import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(
    process.cwd(),
    "supabase/migrations/0045_promotion_code_validation.sql",
  ),
  "utf8",
);

describe("promotion code validation contract", () => {
  it("crea una funzione server-side di validazione", () => {
    expect(source).toContain(
      "create or replace function public.validate_promotion_code",
    );

    expect(source).toContain("security definer");
  });

  it("normalizza e valida il formato del codice", () => {
    expect(source).toContain("upper(btrim(coalesce(p_code, '')))");

    expect(source).toContain("^[A-Z0-9_-]{3,32}$");
  });

  it("controlla attivazione e finestra temporale", () => {
    expect(source).toContain("not v_promotion.is_active");
    expect(source).toContain("v_promotion.starts_at > now()");
    expect(source).toContain("v_promotion.ends_at <= now()");
  });

  it("verifica valuta e minimo ordine", () => {
    expect(source).toContain("Valuta non supportata.");
    expect(source).toContain("v_promotion.minimum_order_gross_amount_minor");
  });

  it("verifica il limite utilizzi sugli ordini non annullati", () => {
    expect(source).toContain(
      "existing_order.promotion_code_id = v_promotion.id",
    );

    expect(source).toContain("existing_order.status <> 'cancelled'");

    expect(source).toContain("v_usage_count >= v_promotion.usage_limit");
  });

  it("calcola sconti percentuali", () => {
    expect(source).toContain("v_promotion.discount_type = 'percentage'");

    expect(source).toContain("* v_promotion.discount_value::numeric");
  });

  it("limita uno sconto fisso al subtotale disponibile", () => {
    expect(source).toContain("v_promotion.discount_type = 'fixed'");

    expect(source).toContain(
      "least(\n        v_promotion.discount_value,\n        p_subtotal_gross_amount_minor",
    );
  });

  it("non espone il validatore direttamente al browser", () => {
    expect(source).toContain("from anon, authenticated");

    expect(source).toContain("to service_role");
  });
});
