import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin product status UI", () => {
  it("offers active draft and archived status options", () => {
    const control = source(
      "src/features/admin/admin-product-status-control.tsx",
    );

    expect(control).toContain('value: "active"');
    expect(control).toContain('value: "draft"');
    expect(control).toContain('value: "archived"');
  });

  it("never uses the browser native confirmation popup", () => {
    const control = source(
      "src/features/admin/admin-product-status-control.tsx",
    );

    expect(control).not.toContain("window.confirm");
    expect(control).not.toContain("confirm(");
  });

  it("uses the styled admin confirmation dialog", () => {
    const control = source(
      "src/features/admin/admin-product-status-control.tsx",
    );

    expect(control).toContain("AdminConfirmDialog");
    expect(control).toContain("Conferma modifica stato");
    expect(control).toContain("Conferma modifica");
  });

  it("refreshes the product detail after a successful update", () => {
    const control = source(
      "src/features/admin/admin-product-status-control.tsx",
    );

    expect(control).toContain("router.refresh()");
  });

  it("renders the status control in product detail", () => {
    const page = source("src/app/admin/(dashboard)/prodotti/[id]/page.tsx");

    expect(page).toContain("AdminProductStatusControl");
    expect(page).toContain("productId={product.id}");
    expect(page).toContain("currentStatus={product.status}");
  });

  it("supports archived products in the list filter", () => {
    const page = source("src/app/admin/(dashboard)/prodotti/page.tsx");

    expect(page).toContain('<option value="archived">Archiviati</option>');
    expect(page).toContain('label: "Archiviato"');
  });

  it("supports archived status in the server filter type", () => {
    const repository = source("src/server/admin/admin-products.ts");

    expect(repository).toContain('"archived"');
  });
});
