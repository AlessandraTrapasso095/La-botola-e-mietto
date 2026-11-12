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
      "admin_preview_bulk_price_adjustment_v1",
    );
    expect(server).toContain("totalCount: Number(payload.total_count ?? 0)");
    expect(server).not.toContain("totalCount: items.length");
  });

  it("requires preview before applying the bulk change", () => {
    const component = source(
      "src/features/admin/admin-bulk-price-control.tsx",
    );

    expect(component).toContain("Mostra anteprima");
    expect(component).toContain("previewAdminBulkPriceAdjustment");
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

  it("supports explicit product-id selection for preview and apply", () => {
    const migration = source(
      "supabase/migrations/0063_admin_bulk_price_selected_products.sql",
    );
    const server = source("src/server/admin/admin-bulk-prices.ts");

    expect(migration).toContain("p_product_ids uuid[]");
    expect(migration).toContain("product.id = any(p_product_ids)");
    expect(migration).toContain("admin_preview_bulk_price_increase_v3");
    expect(migration).toContain("admin_apply_bulk_price_increase_v2");
    expect(server).toContain("productIds:");
    expect(server).toContain("p_product_ids: input.productIds");
  });

  it("defaults the UI to manual selection and keeps filtered-all explicit", () => {
    const component = source(
      "src/features/admin/admin-bulk-price-control.tsx",
    );
    const selection = source(
      "src/features/admin/admin-product-selection.tsx",
    );

    expect(component).toContain('"selected" | "filtered"');
    expect(component).toContain("Solo prodotti selezionati");
    expect(component).toContain("Tutti i risultati filtrati");
    expect(component).toContain("Seleziona almeno un prodotto dalla lista.");
    expect(selection).toContain("AdminProductSelectionCheckbox");
    expect(selection).toContain("Seleziona i");
    expect(selection).toContain("Azzera selezione");
  });

  it("supports both percentage increases and decreases", () => {
    const migration = source(
      "supabase/migrations/0064_admin_bulk_price_adjustment.sql",
    );
    const server = source("src/server/admin/admin-bulk-prices.ts");
    const component = source(
      "src/features/admin/admin-bulk-price-control.tsx",
    );

    expect(migration).toContain(
      "admin_preview_bulk_price_adjustment_v1",
    );
    expect(migration).toContain(
      "admin_apply_bulk_price_adjustment_v1",
    );
    expect(migration).toContain("p_operation text");
    expect(migration).toContain("p_operation = 'increase'");
    expect(migration).toContain("p_operation = 'decrease'");
    expect(migration).toContain("(1 + p_percentage / 100)");
    expect(migration).toContain("(1 - p_percentage / 100)");
    expect(migration).toContain("greatest(");
    expect(migration).toContain("set valid_to = v_now");
    expect(migration).toContain("insert into public.prices");
    expect(migration).toContain(
      "refresh materialized view public.catalog_products_projection",
    );
    expect(migration).toContain("to service_role");

    expect(server).toContain(
      'operation: z.enum(["increase", "decrease"])',
    );
    expect(server).toContain("p_operation: input.operation");
    expect(server).toContain(
      "admin_preview_bulk_price_adjustment_v1",
    );
    expect(server).toContain(
      "admin_apply_bulk_price_adjustment_v1",
    );

    expect(component).toContain('"increase" | "decrease"');
    expect(component).toContain("Aumento prezzo");
    expect(component).toContain("Riduzione prezzo");
    expect(component).toContain("Aumento percentuale");
    expect(component).toContain("Riduzione percentuale");
    expect(component).toContain("Applica aumento del");
    expect(component).toContain("Applica riduzione del");
  });

  it("renders a server-side quick search for product selection", () => {
    const page = source("src/app/admin/(dashboard)/prodotti/page.tsx");
    const repository = source("src/server/admin/admin-products.ts");

    expect(page).toContain("Cerca prodotto da selezionare");
    expect(page).toContain('name="q"');
    expect(page).toContain("Nome o codice prodotto...");
    expect(page).toContain("Azzera ricerca");
    expect(repository).toContain(
      "name.ilike.%${search}%,code.ilike.%${search}%",
    );
  });

  it("integrates the control into the admin products page", () => {
    const page = source("src/app/admin/(dashboard)/prodotti/page.tsx");

    expect(page).toContain("AdminBulkPriceControl");
    expect(page).toContain("AdminProductSelectionProvider");
    expect(page).toContain("AdminProductSelectionCheckbox");
    expect(page).toContain("AdminProductSelectionToolbar");
    expect(page).toContain("filteredProductCount={result.totalCount}");
  });
});
