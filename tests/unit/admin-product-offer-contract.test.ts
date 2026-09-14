import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("contratto backend offerte prodotto", () => {
  const source = readFileSync(
    resolve("supabase/migrations/0043_admin_product_offers.sql"),
    "utf8",
  );

  it("espone le operazioni di attivazione e disattivazione", () => {
    expect(source).toContain(
      "create or replace function public.admin_set_product_offer",
    );
    expect(source).toContain(
      "create or replace function public.admin_deactivate_product_offer",
    );
  });

  it("accetta esclusivamente percentuali comprese tra 1 e 90", () => {
    expect(source).toContain("p_discount_percentage < 1");
    expect(source).toContain("p_discount_percentage > 90");
    expect(source).toContain("OFFER_DISCOUNT_INVALID");
  });

  it("calcola il prezzo promozionale dal prezzo netto corrente", () => {
    expect(source).toContain("v_regular_net_amount_minor::numeric");
    expect(source).toContain("(100 - p_discount_percentage)");
    expect(source).toContain("v_promotional_net_amount_minor");
  });

  it("impedisce prezzi promozionali nulli o non inferiori al listino", () => {
    expect(source).toContain("v_promotional_net_amount_minor <= 0");
    expect(source).toContain(
      "v_promotional_net_amount_minor >= v_regular_net_amount_minor",
    );
    expect(source).toContain("OFFER_PROMOTIONAL_PRICE_INVALID");
  });

  it("serializza le modifiche concorrenti sul prodotto", () => {
    expect(source).toMatch(/from public\.products[\s\S]*for update;/);
  });

  it("conserva lo storico disattivando le offerte precedenti", () => {
    expect(source).toContain("update public.offers");
    expect(source).toContain("is_active = false");
    expect(source).not.toContain("delete from public.offers");
  });

  it("aggiorna la proiezione pubblica dopo ogni modifica", () => {
    expect(
      source.match(
        /refresh materialized view public\.catalog_products_projection;/g,
      ),
    ).toHaveLength(2);
  });

  it("limita entrambe le funzioni al service role", () => {
    expect(source).toContain(
      "grant execute on function public.admin_set_product_offer",
    );
    expect(source).toContain(
      "grant execute on function public.admin_deactivate_product_offer",
    );
    expect(source.match(/to service_role;/g)).toHaveLength(2);
  });
});
