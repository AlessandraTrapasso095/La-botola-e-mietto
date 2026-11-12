import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("admin bulk price increase", () => {
  it("preserves price history and refreshes the catalog projection", () => {
    const migration = source(
      "supabase/migrations/0061_admin_bulk_price_increase.sql",
    );

    expect(migration).toContain("set valid_to = v_now");
    expect(migration).toContain("insert into public.prices");
    expect(migration).toContain(
      "refresh materialized view public.catalog_products_projection",
    );
  });

  it("supports the same product filters used by the admin list", () => {
    const migration = source(
      "supabase/migrations/0061_admin_bulk_price_increase.sql",
    );

    expect(migration).toContain("p_status");
    expect(migration).toContain("p_brand_id");
    expect(migration).toContain("p_category_id");
    expect(migration).toContain("p_availability");
    expect(migration).toContain("p_query");
  });

  it("restricts privileged functions to service_role", () => {
    const migration = source(
      "supabase/migrations/0061_admin_bulk_price_increase.sql",
    );

    expect(migration).toContain("from public, anon, authenticated");
    expect(migration).toContain("to service_role");
  });

  it("requires preview before applying the bulk change", () => {
    const component = source(
      "src/features/admin/admin-bulk-price-control.tsx",
    );

    expect(component).toContain("Mostra anteprima");
    expect(component).toContain("previewAdminBulkPriceIncrease");
    expect(component).toContain("AdminConfirmDialog");
    expect(component).toContain("Lo storico dei prezzi sarà conservato");
  });

  it("warns about active offers instead of silently rewriting them", () => {
    const component = source(
      "src/features/admin/admin-bulk-price-control.tsx",
    );

    expect(component).toContain("Con offerta attiva");
    expect(component).toContain(
      "Le offerte attive non vengono modificate automaticamente",
    );
  });

  it("integrates the control into the admin products page", () => {
    const page = source("src/app/admin/(dashboard)/prodotti/page.tsx");

    expect(page).toContain("AdminBulkPriceControl");
    expect(page).toContain("filteredProductCount={result.totalCount}");
  });
});
