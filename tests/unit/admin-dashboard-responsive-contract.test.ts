import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/app/admin/(dashboard)/page.tsx"),
  "utf8",
);

describe("admin dashboard responsive contract", () => {
  it("non usa due colonne troppo presto per i KPI principali", () => {
    expect(source).toContain("md:grid-cols-2 xl:grid-cols-4");
    expect(source).not.toContain(
      'section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"',
    );
  });

  it("protegge il KPI Incassato da overflow", () => {
    expect(source).toContain("[overflow-wrap:anywhere]");
    expect(source).not.toContain("whitespace-nowrap tabular-nums");
  });

  it("usa card principali min-width zero", () => {
    expect(source).toContain(
      "min-w-0 overflow-hidden rounded-lg border border-white/10",
    );
  });

  it("rende la CTA ordini full-width su telefono", () => {
    expect(source).toContain("min-h-11 w-full items-center justify-center");
    expect(source).toContain("sm:w-auto");
  });

  it("usa una griglia compatta per gli stati ordine", () => {
    expect(source).toContain("grid min-w-0 grid-cols-2 gap-3");
  });

  it("non contiene classi Tailwind concatenate", () => {
    expect(source).not.toContain("sm:items-centersm:px-5");
  });

  it("protegge anche l'importo rimborsato", () => {
    expect(source).toContain(
      "text-xl leading-tight font-semibold break-words tabular-nums",
    );
  });
});
