import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const pageSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/admin/(dashboard)/email-marketing/page.tsx",
  ),
  "utf8",
);

const selectorSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/features/admin/admin-email-marketing-recipient-selector.tsx",
  ),
  "utf8",
);

const layoutSource = fs.readFileSync(
  path.join(process.cwd(), "src/app/admin/(dashboard)/layout.tsx"),
  "utf8",
);

describe("admin email marketing page contract", () => {
  it("espone la pagina nella navigazione admin", () => {
    expect(layoutSource).toContain('href="/admin/email-marketing"');
    expect(layoutSource).toContain("Email marketing");
  });

  it("carica i destinatari marketing dal server admin", () => {
    expect(pageSource).toContain("getAdminMarketingRecipients");
    expect(pageSource).toContain("result.recipients");
  });

  it("supporta modalità tutti e selezione manuale", () => {
    expect(selectorSource).toContain('"all"');
    expect(selectorSource).toContain('"selected"');
    expect(selectorSource).toContain("Tutti gli utenti idonei");
    expect(selectorSource).toContain("Seleziona manualmente");
  });

  it("permette ricerca per i dati del cliente", () => {
    expect(selectorSource).toContain("Nome, cognome, email o telefono...");
    expect(selectorSource).toContain("recipient.firstName");
    expect(selectorSource).toContain("recipient.lastName");
    expect(selectorSource).toContain("recipient.email");
    expect(selectorSource).toContain("recipient.phone");
  });

  it("permette selezione singola e multipla", () => {
    expect(selectorSource).toContain("toggleRecipient");
    expect(selectorSource).toContain("toggleAllFiltered");
    expect(selectorSource).toContain("selectedIds");
  });

  it("mostra tutti i clienti ma distingue il consenso marketing", () => {
    expect(selectorSource).toContain("Consenso attivo");
    expect(selectorSource).toContain("Consenso assente");
    expect(selectorSource).toContain("disabled={!eligible}");
    expect(pageSource).toContain("Clienti totali");
    expect(pageSource).toContain("Idonei al marketing");
  });

  it("collega il composer senza abilitare ancora l'invio reale", () => {
    expect(pageSource).toContain("AdminEmailMarketingWorkspace");
    expect(pageSource).not.toContain("sendAdminMarketingCampaign");
  });
});
