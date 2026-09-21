import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

function source(relativePath: string) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

const productsSource = source("src/server/admin/admin-products.ts");
const offersSource = source("src/server/admin/admin-offers.ts");

describe("admin permissions contract", () => {
  it("protegge tutte le letture privilegiate prodotti admin", () => {
    expect(productsSource).toContain("getServerAdminUser");
    expect(productsSource).toContain("async function requireAdmin()");
    expect(productsSource.match(/await requireAdmin\(\);/g)).toHaveLength(6);
  });

  it("protegge la lettura privilegiata delle offerte admin", () => {
    expect(offersSource).toContain("getServerAdminUser");
    expect(offersSource).toContain("async function requireAdmin()");
    expect(offersSource.match(/await requireAdmin\(\);/g)).toHaveLength(1);
  });

  it("usa il service role soltanto dietro funzioni admin protette", () => {
    expect(productsSource).toContain("createSupabaseAdminClient");
    expect(offersSource).toContain("createSupabaseAdminClient");
  });
});
