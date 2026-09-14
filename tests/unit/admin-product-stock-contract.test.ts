import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("admin product stock database contract", () => {
  const migration = readFileSync(
    resolve("supabase/migrations/0042_admin_product_stock.sql"),
    "utf8",
  );

  it("provides a privileged stock adjustment RPC", () => {
    expect(migration).toContain(
      "create or replace function public.admin_set_product_stock",
    );
    expect(migration).toContain("security definer");
    expect(migration).toContain("p_stock_quantity integer");
    expect(migration).toContain("p_created_by uuid");
  });

  it("requires a valid quantity, note and administrator", () => {
    expect(migration).toContain("INVENTORY_STOCK_INVALID");
    expect(migration).toContain("INVENTORY_NOTE_INVALID");
    expect(migration).toContain("ADMIN_USER_INVALID");
    expect(migration).toContain("profile.role = 'admin'");
  });

  it("locks the inventory row before changing stock", () => {
    expect(migration).toContain("for update of product_inventory");
    expect(migration).toContain("PRODUCT_INVENTORY_NOT_FOUND");
  });

  it("never allows physical stock below reserved stock", () => {
    expect(migration).toContain("p_stock_quantity < v_reserved_quantity");
    expect(migration).toContain("INVENTORY_STOCK_BELOW_RESERVED");
  });

  it("records the adjustment without changing reservations", () => {
    expect(migration).toContain("'admin_adjustment'");
    expect(migration).toContain("p_stock_quantity - v_stock_before");
    expect(migration).toContain("v_reserved_quantity");
    expect(migration).toContain("p_created_by");
    expect(migration).toContain("INVENTORY_STOCK_UNCHANGED");
  });

  it("refreshes the storefront stock projection atomically", () => {
    expect(migration).toContain(
      "refresh materialized view public.catalog_products_projection",
    );
    expect(migration).toContain("available_quantity");
  });

  it("keeps the RPC unavailable to public roles", () => {
    expect(migration).toContain("from public, anon, authenticated");
    expect(migration).toContain("to service_role");
  });
});
