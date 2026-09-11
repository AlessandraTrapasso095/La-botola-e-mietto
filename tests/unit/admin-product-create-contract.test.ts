import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin product creation backend", () => {
  it("creates products through an admin-only server action", () => {
    const action = source("src/server/admin/admin-product-create.ts");

    expect(action).toContain("getServerAdminUser");
    expect(action).toContain("createAdminProduct");
    expect(action).toContain('"admin_create_product"');
  });

  it("creates product price and empty inventory atomically", () => {
    const migration = source(
      "supabase/migrations/0037_admin_create_product.sql",
    );

    expect(migration).toContain("insert into public.products");
    expect(migration).toContain("insert into public.inventory");
    expect(migration).toContain("insert into public.prices");
  });

  it("creates new products as draft", () => {
    const migration = source(
      "supabase/migrations/0037_admin_create_product.sql",
    );

    expect(migration).toContain("'draft'");
  });

  it("keeps the RPC restricted to service role", () => {
    const migration = source(
      "supabase/migrations/0037_admin_create_product.sql",
    );

    expect(migration).toContain("from public, anon, authenticated");
    expect(migration).toContain("to service_role");
  });
});
