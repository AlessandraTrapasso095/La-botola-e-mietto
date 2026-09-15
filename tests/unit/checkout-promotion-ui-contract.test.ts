import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const uiSource = fs.readFileSync(
  path.join(process.cwd(), "src/features/checkout/checkout-content.tsx"),
  "utf8",
);

const routeSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/api/account/checkout/promotion-code/route.ts",
  ),
  "utf8",
);

const serverSource = fs.readFileSync(
  path.join(process.cwd(), "src/server/checkout/promotion-code-preview.ts"),
  "utf8",
);

describe("checkout promotion UI contract", () => {
  it("espone campo e pulsante per il codice promozionale", () => {
    expect(uiSource).toContain("Codice promozionale");
    expect(uiSource).toContain('id="promotionCode"');
    expect(uiSource).toContain('"Applica"');
  });

  it("valida il codice prima di creare l'ordine", () => {
    expect(uiSource).toContain("promotionCodeService.validate");
    expect(uiSource).toContain("applyPromotionCode");
  });

  it("invia il codice al checkout solo se applicato", () => {
    expect(uiSource).toContain("promotionCode: appliedPromotion?.code ?? null");
  });

  it("rimuove lo sconto applicato se il testo del codice cambia", () => {
    expect(uiSource).toContain(
      "nextValue.trim().toUpperCase() !== appliedPromotion.code",
    );
    expect(uiSource).toContain("setAppliedPromotion(null)");
  });

  it("mostra lo sconto nel riepilogo e aggiorna il totale", () => {
    expect(uiSource).toContain("promotionDiscountMinor");
    expect(uiSource).toContain(
      "cart.subtotalMinor + shippingMinor - promotionDiscountMinor",
    );
    expect(uiSource).toContain("Sconto ({appliedPromotion.code})");
  });

  it("protegge la preview promo con auth e same-origin", () => {
    expect(routeSource).toContain("requireSupabaseAuthMode()");
    expect(routeSource).toContain("requireSameOrigin(request)");
    expect(routeSource).toContain("previewPromotionCode");
  });

  it("usa service role solo dopo aver verificato l'utente autenticato", () => {
    const authIndex = serverSource.indexOf("await requireAccountUser(client)");

    const adminIndex = serverSource.indexOf("createSupabaseAdminClient()");

    expect(authIndex).toBeGreaterThan(-1);
    expect(adminIndex).toBeGreaterThan(authIndex);
  });

  it("usa la RPC validate_promotion_code per la preview", () => {
    expect(serverSource).toContain('admin.rpc("validate_promotion_code"');

    expect(serverSource).toContain(
      "p_subtotal_gross_amount_minor: input.subtotalGrossAmountMinor",
    );
  });
});
