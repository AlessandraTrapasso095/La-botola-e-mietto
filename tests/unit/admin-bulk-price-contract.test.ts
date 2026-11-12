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

  it("computes preview totals in SQL without relying on API row limits", () => {
    const migration = source(
      "supabase/migrations/0062_fix_bulk_price_preview_count.sql",
    );
    const server = source("src/server/admin/admin-bulk-prices.ts");

    expect(migration).toContain(
      "admin_preview_bulk_price_increase_v2",
    );
    expect(migration).toContain("'total_count'");
    expect(migration).toContain("'active_offer_count'");
    expect(migration).toContain("limit 10");
    expect(server).toContain(
      "admin_preview_bulk_price_increase_v2",
    );
    expect(server).toContain("totalCount: Number(payload.total_count ?? 0)");
    expect(server).not.toContain("totalCount: items.length");
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
