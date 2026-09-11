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

  it("uses server-side pagination instead of a fixed catalog limit", () => {
    const repository = source("src/server/admin/admin-products.ts");

    expect(repository).toContain("export const adminProductsPageSize = 50");
    expect(repository).toContain(".range(from, to)");
    expect(repository).toContain('{ count: "exact" }');
    expect(repository).not.toContain(".limit(250)");
  });

  it("supports search and catalog filters", () => {
    const repository = source("src/server/admin/admin-products.ts");

    expect(repository).toContain(
      "name.ilike.%${search}%,code.ilike.%${search}%",
    );
    expect(repository).toContain('.eq("status", status)');
    expect(repository).toContain('.eq("brand_id", filters.brandId)');
    expect(repository).toContain('"category_id"');
    expect(repository).toContain('"inventory.available_quantity"');
  });

  it("renders search filters and pagination in the admin UI", () => {
    const page = source("src/app/admin/(dashboard)/prodotti/page.tsx");

    expect(page).toContain('name="q"');
    expect(page).toContain('name="status"');
    expect(page).toContain('name="brand"');
    expect(page).toContain('name="category"');
    expect(page).toContain('name="availability"');
    expect(page).toContain("Applica filtri");
    expect(page).toContain("Precedente");
    expect(page).toContain("Successiva");
  });

  it("keeps navigation to product detail", () => {
    const page = source("src/app/admin/(dashboard)/prodotti/page.tsx");

    expect(page).toContain("href={`/admin/prodotti/${product.id}`}");
  });
});
