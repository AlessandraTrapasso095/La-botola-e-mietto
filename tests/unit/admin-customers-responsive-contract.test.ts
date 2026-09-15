import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/app/admin/(dashboard)/clienti/page.tsx"),
  "utf8",
);

describe("admin customers responsive contract", () => {
  it("usa card su telefono e tablet", () => {
    expect(source).toContain("divide-y divide-white/10 lg:hidden");
    expect(source).toContain("hidden w-full overflow-hidden lg:block");
  });

  it("mantiene la tabella completa solo desktop", () => {
    expect(source).toContain("w-full table-fixed divide-y divide-white/10");
  });

  it("protegge email e telefono da overflow", () => {
    expect(source).toContain("break-all text-white/60");
    expect(source).toContain("break-words text-white/35");
  });

  it("rende i filtri responsive", () => {
    expect(source).toContain(
      "md:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)_auto]",
    );
    expect(source).toContain("md:grid-cols-2 xl:col-span-1 xl:flex");
  });

  it("protegge le summary card", () => {
    expect(source).toContain("min-w-0 overflow-hidden rounded-lg");
    expect(source).toContain("tabular-nums");
  });

  it("rende la paginazione mobile-safe", () => {
    expect(source).toContain(
      "grid grid-cols-2 gap-3 sm:grid-cols-[1fr_auto_1fr]",
    );
    expect(source).toContain("col-span-2 row-start-1 text-center");
  });

  it("rende il dettaglio cliente facilmente accessibile", () => {
    expect(source).toContain("min-h-11 w-full items-center justify-center");
    expect(source).toContain("Dettaglio cliente");
  });
});
