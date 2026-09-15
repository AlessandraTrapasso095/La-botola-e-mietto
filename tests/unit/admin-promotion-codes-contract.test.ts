import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/server/admin/admin-promotion-codes.ts"),
  "utf8",
);

describe("admin promotion codes server contract", () => {
  it("protegge letture e mutazioni con autenticazione admin", () => {
    expect(source).toContain("getServerAdminUser");
    expect(source).toContain(
      'throw new Error("Accesso amministratore richiesto.")',
    );
    expect(source).toContain("await requireAdmin()");
  });

  it("legge i codici dalla tabella promotion_codes", () => {
    expect(source).toContain('.from("promotion_codes")');
    expect(source).toContain("getAdminPromotionCodes");
  });

  it("calcola gli utilizzi dagli ordini realmente riservati o pagati", () => {
    expect(source).toContain('.from("orders")');
    expect(source).toContain('.neq("status", "cancelled")');
    expect(source).toContain(
      '.in("payment_status", ["pending", "authorized", "paid"])',
    );
    expect(source).toContain("usageCountByPromotionCode");
  });

  it("distingue gli utilizzi totali dagli ordini effettivamente pagati", () => {
    expect(source).toContain("paidUsageCountByPromotionCode");
    expect(source).toContain('order.payment_status === "paid"');
    expect(source).toContain("paidUsageCount:");
  });

  it("calcola lo sconto lordo realmente generato dagli ordini pagati", () => {
    expect(source).toContain("discount_gross_amount_minor");
    expect(source).toContain("paidDiscountByPromotionCode");
    expect(source).toContain("paidDiscountGrossAmountMinor");
  });

  it("normalizza il codice in uppercase e applica il formato consentito", () => {
    expect(source).toContain("value.trim().toUpperCase()");
    expect(source).toContain("/^[A-Z0-9_-]{3,32}$/");
  });

  it("valida percentuali da 1 a 90 e importi fissi positivi", () => {
    expect(source).toContain('input.discountType === "percentage"');
    expect(source).toContain("input.discountValue > 90");
    expect(source).toContain("input.discountValue <= 0");
  });

  it("valida minimo ordine limite utilizzi e finestra temporale", () => {
    expect(source).toContain("minimumOrderGrossAmountMinor < 0");
    expect(source).toContain("usageLimit <= 0");
    expect(source).toContain(
      "La data di fine deve essere successiva alla data di inizio.",
    );
  });

  it("supporta creazione modifica e attivazione del codice", () => {
    expect(source).toContain("createAdminPromotionCode");
    expect(source).toContain("updateAdminPromotionCode");
    expect(source).toContain("setAdminPromotionCodeActive");
  });

  it("non espone gestione manuale degli identificativi Stripe", () => {
    expect(source).not.toContain("stripe_coupon_id:");
    expect(source).not.toContain("stripe_promotion_code_id:");
  });

  it("revalida la pagina admin sconti dopo le mutazioni", () => {
    expect(source).toContain('revalidatePath("/admin/sconti")');
  });
});
