import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "supabase/migrations/0044_promotion_codes.sql"),
  "utf8",
);

describe("promotion codes schema contract", () => {
  it("crea la tabella promotion_codes", () => {
    expect(source).toContain("create table public.promotion_codes");
    expect(source).toContain("code text not null");
    expect(source).toContain("is_active boolean not null default true");
  });

  it("supporta sconti percentuali e a importo fisso", () => {
    expect(source).toContain("discount_type in ('percentage', 'fixed')");
    expect(source).toContain("discount_value bigint not null");
    expect(source).toContain("discount_value between 1 and 90");
  });

  it("supporta validità, minimo ordine e limite utilizzi", () => {
    expect(source).toContain("minimum_order_gross_amount_minor");
    expect(source).toContain("starts_at timestamptz");
    expect(source).toContain("ends_at timestamptz");
    expect(source).toContain("usage_limit integer");
  });

  it("predispone i riferimenti Stripe senza renderli obbligatori", () => {
    expect(source).toContain("stripe_coupon_id text");
    expect(source).toContain("stripe_promotion_code_id text");
  });

  it("salva sull'ordine lo snapshot della promozione", () => {
    expect(source).toContain("add column promotion_code_id uuid");
    expect(source).toContain("add column promotion_code text");
    expect(source).toContain("add column promotion_discount_type text");
    expect(source).toContain("add column promotion_discount_value bigint");
  });

  it("mantiene separati sconto netto IVA e lordo", () => {
    expect(source).toContain("add column discount_net_amount_minor bigint");
    expect(source).toContain("add column discount_vat_amount_minor bigint");
    expect(source).toContain("add column discount_gross_amount_minor bigint");
    expect(source).toContain(
      "discount_gross_amount_minor =\n      discount_net_amount_minor +\n      discount_vat_amount_minor",
    );
  });

  it("non espone direttamente i codici al frontend autenticato", () => {
    expect(source).toContain("enable row level security");
    expect(source).toContain(
      "on table public.promotion_codes\n  from anon, authenticated",
    );
  });

  it("normalizza il formato dei codici promozionali", () => {
    expect(source).toContain("code = upper(btrim(code))");
    expect(source).toContain("^[A-Z0-9_-]{3,32}$");
  });
});
