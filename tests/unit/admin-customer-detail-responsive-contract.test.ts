import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/admin/(dashboard)/clienti/[customerId]/page.tsx",
  ),
  "utf8",
);

describe("admin customer detail responsive contract", () => {
  it("elimina lo scroll orizzontale dello storico ordini", () => {
    expect(source).not.toContain("overflow-x-auto");
  });

  it("usa card ordini su telefono e tablet", () => {
    expect(source).toContain("divide-y divide-white/10 xl:hidden");

    expect(source).toContain("hidden xl:block");
  });

  it("mantiene la tabella ordini completa solo desktop", () => {
    expect(source).toContain("min-w-[900px]");
  });

  it("protegge email e identificativi lunghi", () => {
    expect(source).toContain("break-all text-white/50");
    expect(source).toContain("[overflow-wrap:anywhere]");
  });

  it("protegge summary e griglie principali", () => {
    expect(source).toContain(
      "grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4",
    );

    expect(source).toContain("min-w-0 overflow-hidden rounded-lg");

    expect(source).toContain("tabular-nums");
  });

  it("protegge gli indirizzi da testi lunghi", () => {
    expect(source).toContain("[&_p]:break-words");
  });

  it("rende apri ordine comodo su mobile", () => {
    expect(source).toContain("min-h-11 w-full items-center justify-center");

    expect(source).toContain("Apri ordine");
  });
});
