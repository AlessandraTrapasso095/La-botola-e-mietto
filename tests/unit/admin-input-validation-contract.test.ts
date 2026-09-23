import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("admin runtime input validation contract", () => {
  const offerSource = readFileSync(
    resolve("src/server/admin/admin-product-offer.ts"),
    "utf8",
  );

  const promotionSource = readFileSync(
    resolve("src/server/admin/admin-promotion-codes.ts"),
    "utf8",
  );

  it("valida productId come UUID prima delle RPC delle offerte", () => {
    expect(offerSource).toContain("const productIdSchema = z.string().uuid()");

    expect(offerSource).toContain(
      "const normalizedProductId = parseProductId(productId)",
    );

    expect(offerSource).toContain("p_product_id: normalizedProductId");
  });

  it("non considera sufficiente un semplice controllo truthy del productId", () => {
    expect(offerSource).not.toContain(
      'if (!productId) {\n    throw new Error("Prodotto non valido.");',
    );
  });

  it("valida promotionCodeId come UUID prima delle mutation", () => {
    expect(promotionSource).toContain(
      "const promotionCodeIdSchema = z.string().uuid()",
    );

    expect(promotionSource).toContain("parsePromotionCodeId(promotionCodeId)");

    expect(promotionSource).toContain('.eq("id", normalizedPromotionCodeId)');
  });

  it("valida isActive a runtime come boolean", () => {
    expect(promotionSource).toContain(
      "const promotionCodeActiveSchema = z.boolean()",
    );

    expect(promotionSource).toContain(
      "promotionCodeActiveSchema.parse(isActive)",
    );

    expect(promotionSource).toContain("is_active: normalizedIsActive");
  });

  it("mantiene invariata la validazione business del codice promozionale", () => {
    expect(promotionSource).toContain("/^[A-Z0-9_-]{3,32}$/");

    expect(promotionSource).toContain('input.discountType !== "percentage"');

    expect(promotionSource).toContain("input.discountValue > 90");
  });
});
