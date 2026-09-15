import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const managerSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/features/admin/admin-promotion-code-manager.tsx",
  ),
  "utf8",
);

const pageSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/admin/(dashboard)/sconti/page.tsx"),
  "utf8",
);

describe("admin promotion code manager contract", () => {
  it("integra il manager nella pagina sconti", () => {
    expect(pageSource).toContain("AdminPromotionCodeManager");
    expect(pageSource).toContain(
      "<AdminPromotionCodeManager promotionCodes={promotionCodes} />",
    );
  });

  it("permette la creazione di un nuovo codice", () => {
    expect(managerSource).toContain("Nuovo codice");
    expect(managerSource).toContain("createAdminPromotionCode");
  });

  it("permette la modifica dei codici esistenti", () => {
    expect(managerSource).toContain("openEdit");
    expect(managerSource).toContain("updateAdminPromotionCode");
    expect(managerSource).toContain("Salva modifiche");
  });

  it("supporta percentuale e importo fisso", () => {
    expect(managerSource).toContain('value="percentage"');
    expect(managerSource).toContain('value="fixed"');
    expect(managerSource).toContain("Math.round(discountNumber * 100)");
  });

  it("gestisce ordine minimo date e limite utilizzi", () => {
    expect(managerSource).toContain("minimumOrderEuro");
    expect(managerSource).toContain('type="datetime-local"');
    expect(managerSource).toContain("usageLimit");
  });

  it("mantiene lo stato attivo corrente durante la modifica", () => {
    expect(managerSource).toContain(
      "isActive: editingPromotionCode?.isActive ?? true",
    );
  });

  it("usa AdminConfirmDialog invece dei dialog nativi", () => {
    expect(managerSource).toContain("AdminConfirmDialog");
    expect(managerSource).not.toContain("window.confirm");
    expect(managerSource).not.toContain("window.alert");
    expect(managerSource).not.toContain("window.prompt");
  });

  it("aggiorna la pagina dopo il salvataggio", () => {
    expect(managerSource).toContain("router.refresh()");
  });
});
