import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const workspaceSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/features/admin/admin-email-marketing-workspace.tsx",
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

describe("admin email marketing composer contract", () => {
  it("collega il workspace alla pagina admin", () => {
    expect(pageSource).toContain("AdminEmailMarketingWorkspace");
    expect(pageSource).toContain(
      "<AdminEmailMarketingWorkspace recipients={result.recipients} />",
    );
  });

  it("mantiene nello stesso workspace destinatari e composer", () => {
    expect(workspaceSource).toContain("AdminEmailMarketingRecipientSelector");
    expect(workspaceSource).toContain("onChange={setAudience}");
    expect(workspaceSource).toContain("selectedEligibleCount");
  });

  it("espone oggetto titolo introduzione e contenuto", () => {
    expect(workspaceSource).toContain("Oggetto email");
    expect(workspaceSource).toContain("Titolo principale");
    expect(workspaceSource).toContain("Introduzione");
    expect(workspaceSource).toContain("Contenuto");
  });

  it("espone configurazione CTA", () => {
    expect(workspaceSource).toContain("Testo pulsante");
    expect(workspaceSource).toContain("Link pulsante");
    expect(workspaceSource).toContain("ctaLabel");
    expect(workspaceSource).toContain("ctaHref");
  });

  it("mostra il conteggio dei destinatari previsti", () => {
    expect(workspaceSource).toContain("Destinatari previsti");
    expect(workspaceSource).toContain('audience.mode === "all"');
    expect(workspaceSource).toContain('audience.mode === "selected"');
  });

  it("mostra una anteprima dinamica della campagna", () => {
    expect(workspaceSource).toContain("Anteprima");
    expect(workspaceSource).toContain("previewTitle");
    expect(workspaceSource).toContain("previewIntro");
    expect(workspaceSource).toContain("previewContent");
    expect(workspaceSource).toContain("previewCta");
  });

  it("collega l'invio reale soltanto tramite conferma", () => {
    expect(workspaceSource).toContain("sendAdminMarketingCampaign");
    expect(workspaceSource).toContain("AdminConfirmDialog");
    expect(workspaceSource).toContain("onConfirm={confirmSend}");
    expect(workspaceSource).toContain("onClick={requestSend}");
  });
});
