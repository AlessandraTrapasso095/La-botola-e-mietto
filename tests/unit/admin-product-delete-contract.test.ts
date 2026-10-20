import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin permanent product deletion", () => {
  const migration = source("supabase/migrations/0060_admin_delete_product.sql");
  const action = source("src/server/admin/admin-product-delete.ts");
  const component = source("src/features/admin/admin-product-actions.tsx");
  const page = source("src/app/admin/(dashboard)/prodotti/[id]/page.tsx");

  it("protects commercial and inventory history", () => {
    expect(migration).toContain("PRODUCT_HAS_ORDER_HISTORY");
    expect(migration).toContain("PRODUCT_HAS_INVENTORY_HISTORY");
    expect(migration).toContain("from public.order_items");
    expect(migration).toContain("from public.inventory_movements");
  });

  it("deletes transient cart references and refreshes the catalog projection", () => {
    expect(migration).toContain("delete from public.cart_items");
    expect(migration).toContain("delete from public.products");
    expect(migration).toContain(
      "refresh materialized view public.catalog_products_projection",
    );
  });

  it("is restricted to the service role", () => {
    expect(migration).toContain(
      "revoke all on function public.admin_delete_product(uuid)",
    );
    expect(migration).toContain(
      "grant execute on function public.admin_delete_product(uuid)",
    );
    expect(migration).toContain("to service_role");
  });

  it("returns friendly errors instead of database errors", () => {
    expect(action).toContain("deleteAdminProduct");
    expect(action).toContain("PRODUCT_HAS_ORDER_HISTORY");
    expect(action).toContain("PRODUCT_HAS_INVENTORY_HISTORY");
    expect(action).toContain("Puoi archiviarlo");
  });

  it("cleans up product image files from storage", () => {
    expect(action).toContain('PRODUCT_IMAGE_BUCKET = "product-images"');
    expect(action).toContain(".remove(validPaths)");
  });

  it("renders visible archive and permanent delete actions", () => {
    expect(component).toContain("Archivia prodotto");
    expect(component).toContain("Elimina definitivamente");
    expect(component).toContain("Scrivi ELIMINA");
    expect(page).toContain("AdminProductActions");
  });
});
