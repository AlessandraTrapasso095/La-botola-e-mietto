import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin product status", () => {
  it("supports all database product statuses", () => {
    const action = source("src/server/admin/admin-product-status.ts");

    expect(action).toContain('"draft"');
    expect(action).toContain('"active"');
    expect(action).toContain('"archived"');
  });

  it("requires an authenticated admin before changing status", () => {
    const action = source("src/server/admin/admin-product-status.ts");

    expect(action).toContain("getServerAdminUser");
    expect(action).toContain("Accesso amministratore richiesto.");
  });

  it("uses the privileged database function", () => {
    const action = source("src/server/admin/admin-product-status.ts");

    expect(action).toContain('"admin_set_product_status"');
    expect(action).toContain("p_product_id");
    expect(action).toContain("p_status");
  });

  it("refreshes admin and storefront routes after updates", () => {
    const action = source("src/server/admin/admin-product-status.ts");

    expect(action).toContain('revalidatePath("/admin/prodotti")');
    expect(action).toContain('revalidatePath("/prodotti")');
  });

  it("migration refreshes the catalog projection", () => {
    const migration = source(
      "supabase/migrations/0033_admin_product_status.sql",
    );

    expect(migration).toContain(
      "refresh materialized view public.catalog_products_projection",
    );

    expect(migration).toContain(
      "grant execute on function public.admin_set_product_status",
    );

    expect(migration).toContain("to service_role");
  });

  it("does not expose the privileged function to customers", () => {
    const migration = source(
      "supabase/migrations/0033_admin_product_status.sql",
    );

    expect(migration).toContain("from authenticated");

    expect(migration).toContain("from anon");
  });
});
