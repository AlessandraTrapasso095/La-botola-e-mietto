import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(
    process.cwd(),
    "supabase/migrations/0046_checkout_promotion_codes.sql",
  ),
  "utf8",
);

describe("checkout promotion code contract", () => {
  it("sostituisce la vecchia firma checkout con promotion code opzionale", () => {
    expect(source).toContain(
      "drop function if exists public.checkout_account_cart",
    );

    expect(source).toContain("p_promotion_code text default null");
  });

  it("normalizza e valida il codice esclusivamente lato database", () => {
    expect(source).toContain("upper(btrim(coalesce(p_promotion_code, '')))");

    expect(source).toContain("from public.promotion_codes as promotion");
  });

  it("blocca il promotion code durante il checkout", () => {
    expect(source).toContain(
      "where promotion.code = v_normalized_promotion_code\n    for update",
    );
  });

  it("controlla finestra temporale minimo ordine e usage limit", () => {
    expect(source).toContain("not v_promotion.is_active");
    expect(source).toContain("v_promotion.starts_at > now()");
    expect(source).toContain("v_promotion.ends_at <= now()");
    expect(source).toContain("v_promotion.minimum_order_gross_amount_minor");
    expect(source).toContain(
      "v_promotion_usage_count >= v_promotion.usage_limit",
    );
  });

  it("supporta percentuale e importo fisso", () => {
    expect(source).toContain("v_promotion.discount_type = 'percentage'");

    expect(source).toContain("v_promotion.discount_type = 'fixed'");
  });

  it("sottrae lo sconto dal totale prima della creazione ordine", () => {
    expect(source).toContain(
      "v_subtotal_gross_amount_minor -\n    v_discount_gross_amount_minor +\n    v_shipping_gross_amount_minor",
    );
  });

  it("salva lo snapshot promozione sull'ordine", () => {
    expect(source).toContain("promotion_code_id,");
    expect(source).toContain("promotion_discount_type,");
    expect(source).toContain("discount_net_amount_minor,");
    expect(source).toContain("discount_vat_amount_minor,");
    expect(source).toContain("discount_gross_amount_minor,");
  });

  it("restituisce codice e sconto nel risultato checkout", () => {
    expect(source).toContain("promotion_code text,");
    expect(source).toContain("discount_gross_amount_minor bigint,");
    expect(source).toContain("created_order.promotion_code,");
    expect(source).toContain("created_order.discount_gross_amount_minor");
  });

  it("mantiene la soglia spedizione prima del calcolo totale scontato", () => {
    const shippingIndex = source.indexOf(
      "v_subtotal_gross_amount_minor >= 10000",
    );

    const totalIndex = source.indexOf("v_total_gross_amount_minor :=");

    expect(shippingIndex).toBeGreaterThan(-1);
    expect(totalIndex).toBeGreaterThan(shippingIndex);
  });
});
