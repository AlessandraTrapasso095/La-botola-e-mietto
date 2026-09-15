import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const shell = fs.readFileSync(
  path.join(process.cwd(), "src/features/account/account-shell.tsx"),
  "utf8",
);

const dashboard = fs.readFileSync(
  path.join(process.cwd(), "src/features/account/account-dashboard.tsx"),
  "utf8",
);

describe("account responsive contract", () => {
  it("protegge lo shell account da overflow", () => {
    expect(shell).toContain(
      '<Container className="min-w-0 py-8 sm:py-14 lg:py-20">',
    );

    expect(shell).toContain("group relative min-w-0");
    expect(shell).toContain("Navigazione account mobile");
    expect(shell).toContain("group-open:rotate-180");
  });

  it("non usa il select nativo per la navigazione mobile", () => {
    expect(shell).not.toContain("<select");
    expect(shell).not.toContain("<option");
  });

  it("mantiene le summary card in una colonna sui telefoni", () => {
    expect(dashboard).toContain("grid-cols-1 gap-3 md:grid-cols-2");

    expect(dashboard).not.toContain("sm:grid-cols-2 xl:grid-cols-4");
  });

  it("protegge card e contenuti da overflow", () => {
    expect(dashboard).toContain("min-w-0 overflow-hidden border p-4");

    expect(dashboard).toContain("[overflow-wrap:anywhere]");
  });

  it("impila l'header ultimo ordine sui telefoni", () => {
    expect(dashboard).toContain("flex-col items-start gap-3 sm:flex-row");
  });

  it("usa una sola colonna per i dettagli ordine sui telefoni", () => {
    expect(dashboard).toContain(
      "grid-cols-1 gap-4 border-t pt-6 text-sm sm:grid-cols-2",
    );
  });
});
