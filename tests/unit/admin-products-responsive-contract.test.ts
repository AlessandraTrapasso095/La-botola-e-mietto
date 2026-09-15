import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/app/admin/(dashboard)/prodotti/page.tsx"),
  "utf8",
);

describe("admin products responsive contract", () => {
  it("elimina lo scroll orizzontale", () => {
    expect(source).not.toContain("overflow-x-auto");
    expect(source).not.toContain("overflow-x-scroll");
  });

  it("usa card su telefono e tablet", () => {
    expect(source).toContain('className="divide-y divide-white/10 lg:hidden"');
    expect(source).toContain("product.code");
    expect(source).toContain("product.name");
    expect(source).toContain("product.brandName");
    expect(source).toContain("product.categoryName");
    expect(source).toContain("product.availableQuantity");
  });

  it("mantiene la tabella solo desktop", () => {
    expect(source).toContain('className="hidden lg:block"');
    expect(source).toContain(
      '<table className="min-w-full divide-y divide-white/10 text-sm">',
    );
  });

  it("rende Apri utilizzabile su mobile", () => {
    expect(source).toContain(
      "min-h-11 w-full shrink-0 items-center justify-center",
    );
    expect(source).toContain("sm:w-auto");
  });

  it("rende i filtri responsive", () => {
    expect(source).toContain("sm:grid-cols-2");
    expect(source).toContain("lg:grid-cols-3");
    expect(source).toContain("xl:grid-cols-6");
  });

  it("rende le azioni filtro full-width sui viewport piccoli", () => {
    expect(source).toContain("h-11 w-full items-center justify-center");
    expect(source).toContain("xl:w-auto");
  });

  it("rende la paginazione sicura su telefono", () => {
    expect(source).toContain("grid grid-cols-2 gap-3 border-t");
    expect(source).toContain("col-span-2 row-start-1 text-center");
  });
});
