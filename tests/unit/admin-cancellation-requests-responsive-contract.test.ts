import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/admin/(dashboard)/richieste-annullamento/page.tsx",
  ),
  "utf8",
);

describe("admin cancellation requests responsive contract", () => {
  it("usa un header verticale su telefono", () => {
    expect(source).toContain("flex min-w-0 flex-col items-start gap-4");
    expect(source).toContain("sm:flex-row");
  });

  it("rende il contatore full-width su telefono", () => {
    expect(source).toContain("w-full rounded-lg border border-orange-400/20");
    expect(source).toContain("sm:w-auto");
  });

  it("non comprime tre colonne già sui telefoni", () => {
    expect(source).toContain("md:grid-cols-3");
    expect(source).not.toContain("sm:grid-cols-3 lg:min-w-[420px]");
  });

  it("protegge gli importi lunghi", () => {
    expect(source).toContain("font-semibold break-words tabular-nums");
  });

  it("non usa overflow orizzontale", () => {
    expect(source).not.toContain("overflow-x-auto");
    expect(source).not.toContain("overflow-x-scroll");
  });

  it("mantiene il pulsante gestione full-width su telefono", () => {
    expect(source).toContain("min-h-11 w-full items-center justify-center");
    expect(source).toContain("sm:w-auto");
  });
});
