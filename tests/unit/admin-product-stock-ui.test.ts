import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin product stock UI", () => {
  const control = source("src/features/admin/admin-product-stock-control.tsx");

  it("allows changing the total stock with a required reason", () => {
    expect(control).toContain('name="stockQuantity"');
    expect(control).toContain('name="stockNote"');
    expect(control).toContain("Motivazione della modifica");
    expect(control).toContain("Aggiorna stock");
  });

  it("never permits stock lower than reserved quantity", () => {
    expect(control).toContain("min={reservedQuantity}");
    expect(control).toContain("parsedStockQuantity < reservedQuantity");
  });

  it("previews the resulting available quantity", () => {
    expect(control).toContain("parsedStockQuantity - reservedQuantity");
    expect(control).toContain("Disponibili dopo la modifica");
    expect(control).toContain("newAvailableQuantity > 0");
  });

  it("uses the styled confirmation dialog", () => {
    expect(control).toContain("AdminConfirmDialog");
    expect(control).toContain("Conferma modifica stock");
    expect(control).not.toContain("window.confirm");
  });

  it("calls the stock action and refreshes the detail", () => {
    expect(control).toContain("updateAdminProductStock");
    expect(control).toContain("router.refresh()");
  });

  it("explains that reservations remain unchanged", () => {
    expect(control).toContain("La quantità riservata non verrà modificata.");
  });
});
