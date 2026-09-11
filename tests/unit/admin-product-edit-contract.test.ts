import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin product editing", () => {
  it("requires an authenticated admin", () => {
    const action = source("src/server/admin/admin-product-edit.ts");

    expect(action).toContain("getServerAdminUser");
    expect(action).toContain("Accesso amministratore richiesto.");
  });

  it("validates the editable product fields", () => {
    const action = source("src/server/admin/admin-product-edit.ts");

    expect(action).toContain("adminProductEditSchema");
    expect(action).toContain("capacityMl");
    expect(action).toContain("alcoholPercentage");
    expect(action).toContain("netAmountMinor");
    expect(action).toContain("vatRateBasisPoints");
  });

  it("uses the privileged product update function", () => {
    const action = source("src/server/admin/admin-product-edit.ts");

    expect(action).toContain('"admin_update_product"');
    expect(action).toContain("p_product_id");
    expect(action).toContain("p_net_amount_minor");
  });

  it("keeps price history instead of overwriting the current row", () => {
    const migration = source(
      "supabase/migrations/0034_admin_update_product.sql",
    );

    expect(migration).toContain("update public.prices");
    expect(migration).toContain("set valid_to = now()");
    expect(migration).toContain("insert into public.prices");
  });

  it("validates category and subcategory relationship", () => {
    const migration = source(
      "supabase/migrations/0034_admin_update_product.sql",
    );

    expect(migration).toContain("subcategory.parent_id = p_category_id");
    expect(migration).toContain("PRODUCT_SUBCATEGORY_INVALID");
  });

  it("refreshes the storefront catalog projection", () => {
    const migration = source(
      "supabase/migrations/0034_admin_update_product.sql",
    );

    expect(migration).toContain(
      "refresh materialized view public.catalog_products_projection",
    );
  });

  it("does not expose product editing to customer roles", () => {
    const migration = source(
      "supabase/migrations/0034_admin_update_product.sql",
    );

    expect(migration).toContain("from public, anon, authenticated");
    expect(migration).toContain("to service_role");
  });
});
