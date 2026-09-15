import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/app/admin/(dashboard)/sconti/page.tsx"),
  "utf8",
);

describe("admin promotion codes page contract", () => {
  it("carica i codici promozionali insieme alle offerte", () => {
    expect(source).toContain("getAdminPromotionCodes");
    expect(source).toContain("Promise.all");
  });

  it("mostra il riepilogo dei codici", () => {
    expect(source).toContain('label="Codici totali"');
    expect(source).toContain('label="Codici attivi"');
    expect(source).toContain('label="Codici disattivati"');
    expect(source).toContain('label="Utilizzi registrati"');
  });

  it("mostra codice sconto minimo ordine utilizzi validità e stato", () => {
    expect(source).toContain(">Codice<");
    expect(source).toContain(">Sconto<");
    expect(source).toContain(">Ordine minimo<");
    expect(source).toContain(">Utilizzi<");
    expect(source).toContain(">Validità<");
    expect(source).toContain(">Stato<");
  });

  it("supporta percentuale e sconto fisso", () => {
    expect(source).toContain('code.discountType === "percentage"');
    expect(source).toContain("formatMoney(code.discountValue, code.currency)");
  });

  it("mostra il limite utilizzi o infinito", () => {
    expect(source).toContain("code.usageLimit === null");
    expect(source).toContain("${code.usageCount} / ∞");
  });

  it("distingue stato attivo programmato scaduto esaurito e disattivato", () => {
    expect(source).toContain('return "Disattivato"');
    expect(source).toContain('return "Programmato"');
    expect(source).toContain('return "Scaduto"');
    expect(source).toContain('return "Esaurito"');
    expect(source).toContain('return "Attivo"');
  });

  it("gestisce lo stato vuoto senza errori", () => {
    expect(source).toContain("Nessun codice promozionale configurato.");
  });
});
