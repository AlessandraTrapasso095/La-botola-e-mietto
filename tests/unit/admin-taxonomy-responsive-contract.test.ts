import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const manager = fs.readFileSync(
  path.join(process.cwd(), "src/features/admin/admin-taxonomy-manager.tsx"),
  "utf8",
);

const dialog = fs.readFileSync(
  path.join(process.cwd(), "src/features/admin/admin-confirm-dialog.tsx"),
  "utf8",
);

describe("admin taxonomy responsive contract", () => {
  it("usa un browser sicuro rispetto alla viewport mobile", () => {
    expect(manager).toContain("h-[calc(100dvh-1rem)]");
    expect(manager).toContain("sm:max-h-[90dvh]");
    expect(manager).toContain("min-h-0 flex-1 overflow-y-auto");
  });

  it("rende il pulsante visualizza tutti full-width su telefono", () => {
    expect(manager).toContain("min-h-11 w-full items-center justify-center");
    expect(manager).toContain("sm:w-auto");
  });

  it("rende le azioni lista responsive", () => {
    expect(manager).toContain("grid w-full grid-cols-2 gap-2");
    expect(manager).toContain("col-span-2 sm:col-span-1");
  });

  it("non contiene la classe Tailwind malformata", () => {
    expect(manager).not.toContain("text-smfont-medium");
  });

  it("protegge i form da overflow", () => {
    expect(manager).toContain("grid min-w-0 gap-4 md:grid-cols-2");
  });

  it("rende il dialog di conferma sicuro in altezza", () => {
    expect(dialog).toContain("max-h-[calc(100dvh-1rem)]");
    expect(dialog).toContain("overflow-y-auto");
  });

  it("rende i pulsanti del dialog full-width su telefono", () => {
    expect(dialog).toContain("min-h-11 w-full items-center justify-center");
    expect(dialog).toContain("sm:w-auto");
  });
});
