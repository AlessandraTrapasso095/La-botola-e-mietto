import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("residual admin technical error sanitization", () => {
  const taxonomy = source("src/server/admin/admin-taxonomy.ts");
  const offers = source("src/server/admin/admin-offers.ts");
  const status = source("src/server/admin/admin-product-status.ts");

  it("non espone errori Postgres generici nella tassonomia", () => {
    expect(taxonomy).not.toContain(
      "Impossibile salvare il marchio: ${error.message}",
    );

    expect(taxonomy).not.toContain(
      "Impossibile salvare la categoria: ${error.message}",
    );

    expect(taxonomy).not.toContain(
      "Impossibile eliminare il marchio: ${error.message}",
    );

    expect(taxonomy).not.toContain(
      "Impossibile eliminare l’elemento: ${error.message}",
    );
  });

  it("mantiene i mapping business della tassonomia", () => {
    expect(taxonomy).toContain(
      "duplicate key value violates unique constraint",
    );

    expect(taxonomy).toContain("BRAND_IN_USE");
    expect(taxonomy).toContain("CATEGORY_IN_USE");
    expect(taxonomy).toContain("CATEGORY_HAS_SUBCATEGORIES");
  });

  it("non concatena errori Supabase nelle query offerte", () => {
    expect(offers).not.toMatch(/\$\{[A-Za-z]+Response\.error\.message\}/);

    expect(offers).toContain("throwAdminOffersError");
  });

  it("mantiene messaggi leggibili nelle query offerte", () => {
    expect(offers).toContain(
      "Impossibile caricare il riepilogo offerte. Riprova.",
    );

    expect(offers).toContain(
      "Impossibile cercare i prodotti delle offerte. Riprova.",
    );

    expect(offers).toContain(
      "Impossibile caricare i prezzi delle offerte. Riprova.",
    );
  });

  it("non espone il messaggio RPC grezzo nello stato prodotto", () => {
    expect(status).not.toContain(
      "Impossibile aggiornare lo stato prodotto: ${error.message}",
    );

    expect(status).toContain(
      "Impossibile aggiornare lo stato prodotto. Riprova.",
    );
  });

  it("mantiene validazione runtime UUID e stato prodotto", () => {
    expect(status).toContain("z.string().uuid()");
    expect(status).toContain('z.enum(["draft", "active", "archived"])');

    expect(status).toContain("parseProductId");
    expect(status).toContain("parseProductStatus");
  });
});
