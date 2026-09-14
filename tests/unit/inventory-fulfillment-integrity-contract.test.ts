import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("inventory fulfillment integrity", () => {
  const migration = readFileSync(
    resolve("supabase/migrations/0041_inventory_fulfillment_integrity.sql"),
    "utf8",
  );

  it("tracks whether an order has already affected physical stock", () => {
    expect(migration).toContain("inventory_committed_at");
    expect(migration).toContain("orders_commit_inventory_before_fulfillment");
  });

  it("reconciles reservations using only open orders", () => {
    expect(migration).toContain(
      "customer_order.status in ('received', 'preparing')",
    );
    expect(migration).toContain(
      "customer_order.reservation_released_at is null",
    );
    expect(migration).toContain("'reservation_reconciliation'");
  });

  it("decrements stock and reservations together on fulfillment", () => {
    expect(migration).toContain(
      "stock_quantity = v_stock_before - v_item.quantity",
    );
    expect(migration).toContain(
      "reserved_quantity = v_reserved_before - v_item.quantity",
    );
    expect(migration).toContain("'order_fulfilled'");
  });

  it("prevents duplicate or inconsistent inventory commits", () => {
    expect(migration).toContain("new.inventory_committed_at is not null");
    expect(migration).toContain("ORDER_STOCK_INSUFFICIENT");
    expect(migration).toContain("ORDER_RESERVATION_INCONSISTENT");
  });

  it("records an immutable inventory movement trail", () => {
    expect(migration).toContain(
      "create table if not exists public.inventory_movements",
    );
    expect(migration).toContain("inventory_movements_stock_delta_valid");
    expect(migration).toContain("inventory_movements_reserved_delta_valid");
  });

  it("keeps the operation unavailable to public roles", () => {
    expect(migration).toContain("from public, anon, authenticated");
    expect(migration).toContain("to service_role");
  });
});
