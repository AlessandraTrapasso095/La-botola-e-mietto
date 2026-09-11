import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin new product form", () => {
  const form = source("src/features/admin/admin-product-create-form.tsx");

  it("supports all core product fields", () => {
    expect(form).toContain("Codice prodotto");
    expect(form).toContain("Nome prodotto");
    expect(form).toContain("Marchio");
    expect(form).toContain("Categoria");
    expect(form).toContain("Sottocategoria");
    expect(form).toContain("Prezzo netto");
    expect(form).toContain("IVA");
  });

  it("creates products through the admin server action", () => {
    expect(form).toContain("createAdminProduct");
    expect(form).toContain("Crea prodotto");
  });

  it("uses a styled confirmation dialog", () => {
    expect(form).toContain("AdminConfirmDialog");
    expect(form).toContain("Sì, crea prodotto");
    expect(form).not.toContain("window.confirm");
  });

  it("redirects to the newly created product", () => {
    expect(form).toContain("router.push(`/admin/prodotti/${productId}`)");
  });

  it("integrates image management into product creation", () => {
    expect(form).toContain("AdminProductCreateImageField");
    expect(form).toContain("uploadAdminProductImage");
    expect(form).toContain("caricata automaticamente");
  });
});
