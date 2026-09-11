import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("admin product creation image field", () => {
  const component = readFileSync(
    resolve("src/features/admin/admin-product-create-image-field.tsx"),
    "utf8",
  );

  it("accepts JPG PNG and WebP images up to 5 MB", () => {
    expect(component).toContain('accept="image/jpeg,image/png,image/webp"');
    expect(component).toContain("5 * 1024 * 1024");
    expect(component).toContain("limite massimo di 5 MB");
  });

  it("creates an immediate local preview", () => {
    expect(component).toContain("URL.createObjectURL(file)");
    expect(component).toContain("Immagine pronta per il caricamento");
    expect(component).toContain("Sostituisci immagine");
    expect(component).toContain("Rimuovi immagine");
  });

  it("validates dimensions and reports quality advisories", () => {
    expect(component).toContain("validateProductImageDimensions");
    expect(component).toContain("getProductImageAdvisories");
    expect(component).toContain("Controlla la qualità dell’immagine");
  });

  it("passes a valid file and dimensions to the creation form", () => {
    expect(component).toContain("onSelectionChange");
    expect(component).toContain("file,");
    expect(component).toContain("width: dimensions.width");
    expect(component).toContain("height: dimensions.height");
  });

  it("explains that the image will be uploaded with the product", () => {
    expect(component).toContain(
      "L’immagine verrà caricata insieme al nuovo prodotto",
    );
    expect(component).toContain("creato come Bozza");
  });
});
