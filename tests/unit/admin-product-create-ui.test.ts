import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin product creation entry point", () => {
  it("shows a new product button in the products page", () => {
    const page = source("src/app/admin/(dashboard)/prodotti/page.tsx");

    expect(page).toContain('href="/admin/prodotti/nuovo"');
    expect(page).toContain("Nuovo prodotto");
    expect(page).toContain(">");
  });

  it("creates the new product route", () => {
    const page = source("src/app/admin/(dashboard)/prodotti/nuovo/page.tsx");

    expect(page).toContain("Nuovo prodotto");
    expect(page).toContain('href="/admin/prodotti"');
  });
});
