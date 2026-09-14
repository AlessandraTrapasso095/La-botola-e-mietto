import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("azioni server offerte prodotto", () => {
  const source = readFileSync(
    resolve("src/server/admin/admin-product-offer.ts"),
    "utf8",
  );

  it("richiede una sessione amministratore per entrambe le azioni", () => {
    expect(source.match(/getServerAdminUser\(\)/g)).toHaveLength(2);
    expect(source.match(/Accesso amministratore richiesto\./g)).toHaveLength(2);
  });

  it("valida la percentuale anche prima della chiamata RPC", () => {
    expect(source).toContain("Number.isSafeInteger(discountPercentage)");
    expect(source).toContain("discountPercentage < 1");
    expect(source).toContain("discountPercentage > 90");
  });

  it("usa gli RPC amministrativi tipizzati", () => {
    expect(source).toContain('.rpc("admin_set_product_offer"');
    expect(source).toContain('"admin_deactivate_product_offer"');
    expect(source).toContain("p_discount_percentage: discountPercentage");
  });

  it("traduce gli errori del database in messaggi comprensibili", () => {
    expect(source).toContain("OFFER_DISCOUNT_INVALID");
    expect(source).toContain("OFFER_PROMOTIONAL_PRICE_INVALID");
    expect(source).toContain("PRODUCT_CURRENT_PRICE_NOT_FOUND");
    expect(source).toContain("PRODUCT_OFFER_NOT_FOUND");
    expect(source).toContain("PRODUCT_NOT_FOUND");
  });

  it("aggiorna admin, catalogo, offerte e dettaglio prodotto", () => {
    expect(source).toContain('revalidatePath("/catalogo")');
    expect(source).toContain('revalidatePath("/in-offerta")');
    expect(source).toContain('revalidatePath("/prodotto/[slug]", "page")');
    expect(source).toContain("revalidatePath(`/admin/prodotti/${productId}`)");
  });
});
