import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/features/admin/admin-promotion-code-manager.tsx",
  ),
  "utf8",
);

describe("admin promotion code activation contract", () => {
  it("usa la server action dedicata allo stato attivo", () => {
    expect(source).toContain("setAdminPromotionCodeActive");
    expect(source).toContain("confirmActivationChange");
  });

  it("mostra Attiva o Disattiva in base allo stato corrente", () => {
    expect(source).toContain('promotionCode.isActive ? "Disattiva" : "Attiva"');
  });

  it("inverte esclusivamente lo stato attivo richiesto", () => {
    expect(source).toContain("!promotionCode.isActive");
    expect(source).toContain("nextActive");
  });

  it("usa AdminConfirmDialog per la conferma", () => {
    expect(source).toContain("activationTarget !== null");
    expect(source).toContain(
      'tone={activationTarget?.nextActive ? "success" : "danger"}',
    );
  });

  it("spiega che la disattivazione conserva storico e ordini", () => {
    expect(source).toContain(
      "Gli ordini e lo storico degli utilizzi resteranno invariati.",
    );
  });

  it("aggiorna la pagina dopo la mutazione", () => {
    expect(source).toContain("router.refresh()");
  });

  it("non usa dialoghi nativi", () => {
    expect(source).not.toContain("window.confirm");
    expect(source).not.toContain("window.alert");
    expect(source).not.toContain("window.prompt");
  });
});
