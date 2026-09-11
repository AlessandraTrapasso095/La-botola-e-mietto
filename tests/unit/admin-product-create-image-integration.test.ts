import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("admin product creation with image", () => {
  const form = readFileSync(
    resolve("src/features/admin/admin-product-create-form.tsx"),
    "utf8",
  );
  const page = readFileSync(
    resolve("src/app/admin/(dashboard)/prodotti/nuovo/page.tsx"),
    "utf8",
  );

  it("renders the image selector inside the product creation form", () => {
    expect(form).toContain("AdminProductCreateImageField");
    expect(form).toContain("onSelectionChange={setSelectedImage}");
    expect(page).toContain("l’immagine del nuovo prodotto");
  });

  it("creates the draft product before uploading its image", () => {
    const createPosition = form.indexOf(
      "productId = await createAdminProduct(input)",
    );
    const uploadPosition = form.indexOf("await uploadAdminProductImage({");

    expect(createPosition).toBeGreaterThan(-1);
    expect(uploadPosition).toBeGreaterThan(createPosition);
  });

  it("uploads the selected original and thumbnail through the reusable flow", () => {
    expect(form).toContain("selectedImage.file");
    expect(form).toContain("selectedImage.width");
    expect(form).toContain("selectedImage.height");
    expect(form).toContain("Sì, crea e carica immagine");
  });

  it("prevents duplicate creation when image upload fails", () => {
    expect(form).toContain("setCreatedProductId(productId)");
    expect(form).toContain("Apri prodotto creato");
    expect(form).toContain("Il prodotto è stato creato come Bozza");
  });

  it("still allows creating a product without an image", () => {
    expect(form).toContain(
      "Potrai aggiungere l’immagine anche successivamente",
    );
    expect(form).toContain("Sì, crea prodotto");
  });
});
