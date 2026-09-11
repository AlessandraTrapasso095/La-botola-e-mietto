import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin product edit UI", () => {
  it("renders the full editable product form", () => {
    const form = source("src/features/admin/admin-product-edit-form.tsx");

    expect(form).toContain("Anagrafica prodotto");
    expect(form).toContain("Caratteristiche");
    expect(form).toContain("Contenuti prodotto");
    expect(form).toContain("Prezzo");
    expect(form).toContain("Salva modifiche");
  });

  it("supports all editable catalog fields", () => {
    const form = source("src/features/admin/admin-product-edit-form.tsx");

    expect(form).toContain("Codice prodotto");
    expect(form).toContain("Nome prodotto");
    expect(form).toContain("Slug");
    expect(form).toContain("Marchio");
    expect(form).toContain("Categoria");
    expect(form).toContain("Sottocategoria");
    expect(form).toContain("Produttore");
    expect(form).toContain("Paese");
    expect(form).toContain("Origine");
    expect(form).toContain("Descrizione");
    expect(form).toContain("Note di degustazione");
    expect(form).toContain("Note di servizio");
    expect(form).toContain("Gradazione % Vol.");
    expect(form).toContain("Edizione limitata");
  });

  it("uses the styled confirmation dialog", () => {
    const form = source("src/features/admin/admin-product-edit-form.tsx");

    expect(form).toContain("AdminConfirmDialog");
    expect(form).not.toContain("window.confirm");
    expect(form).toContain("Conferma modifiche");
  });

  it("loads taxonomy options server-side", () => {
    const repository = source("src/server/admin/admin-products.ts");

    expect(repository).toContain("getAdminProductEditOptions");
    expect(repository).toContain("subcategories");
    expect(repository).toContain("parentId");
  });

  it("renders the edit form in product detail", () => {
    const page = source("src/app/admin/(dashboard)/prodotti/[id]/page.tsx");

    expect(page).toContain("AdminProductEditForm");
    expect(page).toContain("options={editOptions}");
  });
});
