import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin product detail", () => {
  it("loads a product by id from the server admin client", () => {
    const repository = source("src/server/admin/admin-products.ts");

    expect(repository).toContain("getAdminProductDetail");
    expect(repository).toContain('.eq("id", productId)');
    expect(repository).toContain(".maybeSingle()");
  });

  it("loads current inventory and price separately", () => {
    const repository = source("src/server/admin/admin-products.ts");

    expect(repository).toContain('.from("inventory")');
    expect(repository).toContain('.from("prices")');
    expect(repository).toContain('.is("valid_to", null)');
  });

  it("renders the main product admin information", () => {
    const page = source("src/app/admin/(dashboard)/prodotti/[id]/page.tsx");

    expect(page).toContain("Anagrafica");
    expect(page).toContain("Caratteristiche");
    expect(page).toContain("Contenuti prodotto");
    expect(page).toContain("Prezzo corrente");
    expect(page).toContain("Magazzino");
  });

  it("keeps inventory read-only until stock management", () => {
    const page = source("src/app/admin/(dashboard)/prodotti/[id]/page.tsx");

    expect(page).toContain("Step 35 — Stock");
    expect(page).toContain("Management.");
    expect(page).not.toContain('name="stock');
  });

  it("exposes product status management separately from stock", () => {
    const page = source("src/app/admin/(dashboard)/prodotti/[id]/page.tsx");

    expect(page).toContain("AdminProductStatusControl");
    expect(page).toContain("currentStatus={product.status}");
  });

  it("links back to admin list and storefront product", () => {
    const page = source("src/app/admin/(dashboard)/prodotti/[id]/page.tsx");

    expect(page).toContain('href="/admin/prodotti"');
    expect(page).toContain("href={`/prodotti/${product.slug}`}");
  });
});
