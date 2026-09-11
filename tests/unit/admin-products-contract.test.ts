import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin products", () => {
  it("loads products through the server-side admin client", () => {
    const repository = source("src/server/admin/admin-products.ts");

    expect(repository).toContain("createSupabaseAdminClient");
    expect(repository).toContain('.from("products")');
    expect(repository).toContain('.is("deleted_at", null)');
  });

  it("loads brand category and inventory context", () => {
    const repository = source("src/server/admin/admin-products.ts");

    expect(repository).toContain("brands");
    expect(repository).toContain("categories");
    expect(repository).toContain("inventory");
    expect(repository).toContain("available_quantity");
  });

  it("renders the admin product table", () => {
    const page = source("src/app/admin/(dashboard)/prodotti/page.tsx");

    expect(page).toContain("Catalogo");
    expect(page).toContain("Prodotti");
    expect(page).toContain("Marchio");
    expect(page).toContain("Categoria");
    expect(page).toContain("Disponibili");
  });

  it("prepares navigation to product detail", () => {
    const page = source("src/app/admin/(dashboard)/prodotti/page.tsx");

    expect(page).toContain("href={`/admin/prodotti/${product.id}`}");
  });
});
