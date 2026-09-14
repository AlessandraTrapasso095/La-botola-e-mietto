import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin product inventory history repository", () => {
  const repository = source("src/server/admin/admin-products.ts");

  it("loads movements for the selected product", () => {
    expect(repository).toContain("getAdminProductInventoryMovements");
    expect(repository).toContain('.from("inventory_movements")');
    expect(repository).toContain('.eq("product_id", productId)');
  });

  it("loads the latest 25 movements", () => {
    expect(repository).toContain('.order("created_at", { ascending: false })');
    expect(repository).toContain(".limit(normalizedLimit)");
    expect(repository).toContain("limit = 25");
  });

  it("loads related order numbers and administrator identities", () => {
    expect(repository).toContain("orders");
    expect(repository).toContain("order_number");
    expect(repository).toContain('.from("profiles")');
    expect(repository).toContain("first_name,last_name,email");
  });

  it("maps database fields to the admin history model", () => {
    expect(repository).toContain("movementType: movement.movement_type");
    expect(repository).toContain("stockDelta: movement.stock_delta");
    expect(repository).toContain("reservedDelta: movement.reserved_delta");
    expect(repository).toContain("createdByName:");
  });
});
