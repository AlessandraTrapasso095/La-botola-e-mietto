import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin product stock action", () => {
  const action = source("src/server/admin/admin-product-stock.ts");

  it("requires an authenticated administrator", () => {
    expect(action).toContain("getServerAdminUser");
    expect(action).toContain("Accesso amministratore richiesto.");
  });

  it("validates quantity and adjustment reason", () => {
    expect(action).toContain("Number.isSafeInteger(stockQuantity)");
    expect(action).toContain("stockQuantity < 0");
    expect(action).toContain("normalizedNote.length < 3");
    expect(action).toContain("normalizedNote.length > 500");
  });

  it("calls the privileged stock function with the admin identity", () => {
    expect(action).toContain('"admin_set_product_stock"');
    expect(action).toContain("p_product_id: productId");
    expect(action).toContain("p_stock_quantity: stockQuantity");
    expect(action).toContain("p_note: normalizedNote");
    expect(action).toContain("p_created_by: adminUser.id");
  });

  it("provides readable stock errors", () => {
    expect(action).toContain("INVENTORY_STOCK_BELOW_RESERVED");
    expect(action).toContain("INVENTORY_STOCK_UNCHANGED");
    expect(action).toContain("PRODUCT_INVENTORY_NOT_FOUND");
  });

  it("refreshes admin and storefront routes", () => {
    expect(action).toContain('revalidatePath("/admin/prodotti")');
    expect(action).toContain('revalidatePath("/prodotti")');
  });
});
