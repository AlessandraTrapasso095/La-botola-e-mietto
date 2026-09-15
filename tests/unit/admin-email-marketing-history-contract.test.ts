import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const serverSource = fs.readFileSync(
  path.join(process.cwd(), "src/server/admin/admin-email-marketing.ts"),
  "utf8",
);

const historySource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/features/admin/admin-email-marketing-history.tsx",
  ),
  "utf8",
);

const pageSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/admin/(dashboard)/email-marketing/page.tsx",
  ),
  "utf8",
);

describe("admin email marketing history contract", () => {
  it("legge lo storico dalla tabella campagne", () => {
    expect(serverSource).toContain("getAdminMarketingCampaignHistory");
    expect(serverSource).toContain('.from("email_marketing_campaigns")');
    expect(serverSource).toContain(
      '.order("created_at", { ascending: false })',
    );
  });

  it("limita lo storico alle ultime 50 campagne", () => {
    expect(serverSource).toContain(".limit(50)");
  });

  it("protegge anche lo storico con autenticazione admin", () => {
    expect(serverSource).toContain(
      "export async function getAdminMarketingCampaignHistory",
    );
    expect(serverSource).toContain("await requireAdmin()");
  });

  it("collega lo storico alla pagina email marketing", () => {
    expect(pageSource).toContain("getAdminMarketingCampaignHistory");
    expect(pageSource).toContain("AdminEmailMarketingHistory");
  });

  it("mostra stato vuoto quando non esistono campagne", () => {
    expect(historySource).toContain("Nessuna campagna presente");
  });

  it("mostra i principali dati di invio", () => {
    expect(historySource).toContain("Idonei");
    expect(historySource).toContain("Inviate");
    expect(historySource).toContain("Duplicate");
    expect(historySource).toContain("Fallite");
  });

  it("distingue pubblico completo e selezione manuale", () => {
    expect(historySource).toContain("Tutti gli idonei");
    expect(historySource).toContain("Selezione manuale");
  });

  it("espone gli stati principali della campagna", () => {
    expect(historySource).toContain("Completata");
    expect(historySource).toContain("Completata con errori");
    expect(historySource).toContain("Fallita");
    expect(historySource).toContain("In invio");
  });
});
