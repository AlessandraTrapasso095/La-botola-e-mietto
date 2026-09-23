import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin technical error sanitization", () => {
  const create = source("src/server/admin/admin-product-create.ts");
  const edit = source("src/server/admin/admin-product-edit.ts");
  const products = source("src/server/admin/admin-products.ts");
  const customers = source("src/server/admin/admin-customers.ts");
  const orders = source("src/server/admin/orders.ts");
  const promotions = source("src/server/admin/admin-promotion-codes.ts");
  const offer = source("src/server/admin/admin-product-offer.ts");
  const stock = source("src/server/admin/admin-product-stock.ts");

  it("nasconde gli errori RPC generici di creazione e modifica prodotto", () => {
    expect(create).not.toContain(
      "Impossibile creare il prodotto: ${error.message}",
    );

    expect(edit).not.toContain(
      "Impossibile aggiornare il prodotto: ${error.message}",
    );

    expect(create).toContain("Impossibile creare il prodotto. Riprova.");

    expect(edit).toContain("Impossibile aggiornare il prodotto. Riprova.");
  });

  it("mantiene il mapping business per codice o slug duplicati", () => {
    expect(create).toContain("duplicate key value violates unique constraint");

    expect(edit).toContain("duplicate key value violates unique constraint");

    expect(edit).toContain(
      "Codice o slug già utilizzato da un altro prodotto.",
    );
  });

  it("non concatena messaggi Supabase nelle letture prodotti", () => {
    expect(products).not.toMatch(/\$\{[A-Za-z]+Response\.error\.message\}/);

    expect(products).toContain("throwAdminProductsError");
  });

  it("non concatena messaggi Supabase nelle letture clienti", () => {
    expect(customers).not.toMatch(/\$\{[A-Za-z]+Response\.error\.message\}/);

    expect(customers).toContain("throwAdminCustomersError");
  });

  it("non concatena messaggi Supabase nelle letture ordini", () => {
    expect(orders).not.toMatch(/\$\{[A-Za-z]+Response\.error\.message\}/);

    expect(orders).toContain("throwAdminOrdersError");
  });

  it("sanitizza fallback e letture dei codici promozionali", () => {
    expect(promotions).not.toContain(
      "Impossibile aggiornare il codice promozionale: ${error.message}",
    );

    expect(promotions).not.toContain(
      "Impossibile caricare i codici promozionali: ${codesResponse.error.message}",
    );

    expect(promotions).not.toContain(
      "Impossibile caricare gli utilizzi dei codici promozionali: ${usageResponse.error.message}",
    );

    expect(promotions).toContain(
      "Impossibile aggiornare il codice promozionale. Riprova.",
    );
  });

  it("mantiene i mapping business di promozioni offerte e stock", () => {
    expect(promotions).toContain("mapPromotionCodeError");

    expect(offer).toContain("OFFER_DISCOUNT_INVALID");

    expect(offer).toContain("PRODUCT_OFFER_NOT_FOUND");

    expect(stock).toContain("INVENTORY_STOCK_BELOW_RESERVED");

    expect(stock).toContain("PRODUCT_INVENTORY_NOT_FOUND");
  });

  it("non restituisce il fallback DB grezzo per offerte e stock", () => {
    expect(offer).not.toMatch(/return `[^`]*\$\{message\}[^`]*`/);

    expect(stock).not.toContain("Impossibile aggiornare lo stock: ${message}");

    expect(stock).toContain("Impossibile aggiornare lo stock. Riprova.");
  });
});
