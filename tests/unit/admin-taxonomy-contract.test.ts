import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin taxonomy management", () => {
  it("requires an authenticated admin", () => {
    const action = source("src/server/admin/admin-taxonomy.ts");

    expect(action).toContain("getServerAdminUser");
    expect(action).toContain("Accesso amministratore richiesto.");
  });

  it("supports brand creation and editing", () => {
    const action = source("src/server/admin/admin-taxonomy.ts");

    expect(action).toContain("upsertAdminBrand");
    expect(action).toContain('"admin_upsert_brand"');
  });

  it("supports category and subcategory creation and editing", () => {
    const action = source("src/server/admin/admin-taxonomy.ts");

    expect(action).toContain("upsertAdminCategory");
    expect(action).toContain('"admin_upsert_category"');
    expect(action).toContain("parentId");
  });

  it("validates taxonomy slugs before database mutations", () => {
    const action = source("src/server/admin/admin-taxonomy.ts");

    expect(action).toContain("slugSchema");
    expect(action).toContain("/^[a-z0-9]+(?:-[a-z0-9]+)*$/");
  });

  it("supports active draft and archived taxonomy status", () => {
    const action = source("src/server/admin/admin-taxonomy.ts");

    expect(action).toContain('"draft"');
    expect(action).toContain('"active"');
    expect(action).toContain('"archived"');
  });

  it("keeps taxonomy mutations service-role only", () => {
    const migration = source(
      "supabase/migrations/0035_admin_catalog_taxonomy.sql",
    );

    expect(migration).toContain("from public, anon, authenticated");
    expect(migration).toContain("to service_role");
  });

  it("refreshes the storefront projection", () => {
    const migration = source(
      "supabase/migrations/0035_admin_catalog_taxonomy.sql",
    );

    expect(migration).toContain(
      "refresh materialized view public.catalog_products_projection",
    );
  });
});

describe("admin taxonomy deletion backend", () => {
  it("supports safe brand and category deletion", () => {
    const action = source("src/server/admin/admin-taxonomy.ts");

    expect(action).toContain("deleteAdminBrand");
    expect(action).toContain("deleteAdminCategory");
    expect(action).toContain('"admin_delete_brand"');
    expect(action).toContain('"admin_delete_category"');
  });

  it("uses soft deletion and blocks referenced taxonomy records", () => {
    const migration = source(
      "supabase/migrations/0036_admin_delete_catalog_taxonomy.sql",
    );

    expect(migration).toContain("deleted_at = now()");
    expect(migration).toContain("BRAND_IN_USE");
    expect(migration).toContain("CATEGORY_IN_USE");
    expect(migration).toContain("CATEGORY_HAS_SUBCATEGORIES");
  });
});
