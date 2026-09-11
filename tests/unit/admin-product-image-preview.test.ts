import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin product image preview", () => {
  const component = source(
    "src/features/admin/admin-product-image-preview.tsx",
  );
  const uploadUtility = source(
    "src/features/admin/admin-product-image-upload.ts",
  );

  it("shows the current product image or placeholder", () => {
    expect(component).toContain("/images/placeholder-bottle.svg");
    expect(component).toContain("Immagine attuale");
  });

  it("accepts jpg png and webp files", () => {
    expect(component).toContain('accept="image/jpeg,image/png,image/webp"');
  });

  it("limits local preview files to 5 MB", () => {
    expect(component).toContain("5 * 1024 * 1024");
    expect(component).toContain("limite massimo di 5 MB");
  });

  it("creates an immediate local preview", () => {
    expect(component).toContain("URL.createObjectURL(file)");
    expect(component).toContain("Nuova immagine selezionata");
  });

  it("states that preview is not persisted yet", () => {
    expect(component).toContain("solo un’anteprima locale");
    expect(component).toContain("non è ancora stata");
    expect(component).toContain("salvata.");
  });

  it("uploads and registers the selected image", () => {
    expect(component).toContain("uploadAdminProductImage");
    expect(component).toContain("Salva immagine");
    expect(component).toContain("Caricamento in corso");
    expect(component).toContain("router.refresh()");

    expect(uploadUtility).toContain("createProductImageThumbnail");
    expect(uploadUtility).toContain("prepareAdminProductImageUpload");
    expect(uploadUtility).toContain("uploadToSignedUrl");
    expect(uploadUtility).toContain("registerAdminProductImage");
    expect(uploadUtility).toContain("discardAdminProductImageUpload");
  });
});

describe("admin product detail image", () => {
  it("loads and renders the primary image", () => {
    const repository = source("src/server/admin/admin-products.ts");

    const page = source("src/app/admin/(dashboard)/prodotti/[id]/page.tsx");

    expect(repository).toContain("primaryImageResponse");
    expect(repository).toContain('"product_images"');
    expect(page).toContain("AdminProductImagePreview");
    expect(page).toContain("product.primaryImage");
  });
});
