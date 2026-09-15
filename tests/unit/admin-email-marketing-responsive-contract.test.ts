import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const workspace = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/features/admin/admin-email-marketing-workspace.tsx",
  ),
  "utf8",
);

const selector = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/features/admin/admin-email-marketing-recipient-selector.tsx",
  ),
  "utf8",
);

const history = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/features/admin/admin-email-marketing-history.tsx",
  ),
  "utf8",
);

describe("admin email marketing responsive contract", () => {
  it("elimina gli scroll orizzontali", () => {
    expect(selector).not.toContain("overflow-x-auto");
    expect(history).not.toContain("overflow-x-auto");
  });

  it("usa card mobile per i destinatari", () => {
    expect(selector).toContain("divide-y divide-white/10 lg:hidden");
    expect(selector).toContain("hidden lg:block");
    expect(selector).not.toContain("min-w-[760px]");
  });

  it("mantiene la selezione multipla anche su mobile", () => {
    expect(selector).toContain("Seleziona tutti i risultati idonei");
    expect(selector).toContain("toggleAllFiltered");
    expect(selector).toContain("toggleRecipient");
  });

  it("usa card mobile per lo storico campagne", () => {
    expect(history).toContain("divide-y divide-white/10 lg:hidden");
    expect(history).toContain("hidden lg:block");
  });

  it("protegge il composer da overflow", () => {
    expect(workspace).toContain("grid min-w-0 gap-6");
    expect(workspace).toContain("min-w-0 space-y-5");
  });

  it("rende il pulsante invio full-width su telefono", () => {
    expect(workspace).toContain("min-h-11 w-full items-center justify-center");
    expect(workspace).toContain("sm:w-auto");
  });

  it("rende l'anteprima sicura per testi lunghi", () => {
    expect(workspace).toContain("[overflow-wrap:anywhere]");
    expect(workspace).toContain("xl:sticky xl:top-24");
  });
});
