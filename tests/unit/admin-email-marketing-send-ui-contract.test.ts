import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/features/admin/admin-email-marketing-workspace.tsx",
  ),
  "utf8",
);

describe("admin email marketing send ui contract", () => {
  it("usa il dialog di conferma admin", () => {
    expect(source).toContain("AdminConfirmDialog");
    expect(source).toContain("open={confirmOpen}");
    expect(source).toContain('confirmLabel="Conferma e invia"');
  });

  it("non invia direttamente dal primo pulsante", () => {
    expect(source).toContain("onClick={requestSend}");
    expect(source).toContain("onConfirm={confirmSend}");
  });

  it("genera una campaign id prima della conferma", () => {
    expect(source).toContain("crypto.randomUUID()");
    expect(source).toContain("setCampaignId");
  });

  it("valida contenuto e destinatari prima dell'invio", () => {
    expect(source).toContain("validateComposer");
    expect(source).toContain("selectedEligibleCount === 0");
    expect(source).toContain("Inserisci l’oggetto dell’email.");
    expect(source).toContain("Inserisci il titolo principale.");
    expect(source).toContain("Inserisci l’introduzione.");
    expect(source).toContain("Inserisci il contenuto della campagna.");
  });

  it("valida la CTA opzionale come coppia testo e link", () => {
    expect(source).toContain(
      "Testo e link del pulsante devono essere compilati insieme.",
    );
    expect(source).toContain("new URL(ctaHref)");
    expect(source).toContain('"http:"');
    expect(source).toContain('"https:"');
  });

  it("chiama la server action soltanto dopo la conferma", () => {
    expect(source).toContain("sendAdminMarketingCampaign");
    expect(source).toContain("campaignId,");
    expect(source).toContain("audience:");
  });

  it("mostra il riepilogo dell'esito", () => {
    expect(source).toContain("Campagna elaborata");
    expect(source).toContain("sendResult.eligible");
    expect(source).toContain("sendResult.sent");
    expect(source).toContain("sendResult.duplicate");
    expect(source).toContain("sendResult.failed");
  });

  it("avverte che l'invio confermato è reale", () => {
    expect(source).toContain(
      "Dopo la conferma l’invio è reale e non può essere annullato.",
    );
  });
});
