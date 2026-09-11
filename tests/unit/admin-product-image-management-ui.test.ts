import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin product image replacement and deletion UI", () => {
  const preview = source("src/features/admin/admin-product-image-preview.tsx");
  const upload = source("src/features/admin/admin-product-image-upload.ts");
  const deleteButton = source(
    "src/features/admin/admin-product-image-delete-button.tsx",
  );
  const action = source("src/server/admin/admin-product-images.ts");

  it("generates and uploads a WebP thumbnail", () => {
    expect(preview).toContain("uploadAdminProductImage");
    expect(preview).toContain("Thumbnail WebP generata automaticamente");

    expect(upload).toContain("createProductImageThumbnail");
    expect(upload).toContain("thumbnailStoragePath");
    expect(upload).toContain("thumbnailToken");
    expect(upload).toContain('contentType: "image/webp"');
  });

  it("shows non-blocking image quality advisories", () => {
    expect(preview).toContain("getProductImageAdvisories");
    expect(preview).toContain("Controlla la qualità dell’immagine");
  });

  it("uses the thumbnail replacement RPC when a new image is saved", () => {
    expect(upload).toContain("registerAdminProductImage");
    expect(action).toContain('"admin_replace_product_image_with_thumbnail"');
    expect(action).toContain("previous_storage_path");
    expect(action).toContain("previous_thumbnail_path");
  });

  it("shows image deletion only when a saved image exists", () => {
    expect(preview).toContain("AdminProductImageDeleteButton");
    expect(preview).toContain("image && !previewUrl");
  });

  it("uses the reusable styled confirmation dialog", () => {
    expect(deleteButton).toContain("AdminConfirmDialog");
    expect(deleteButton).toContain("Eliminare l’immagine?");
    expect(deleteButton).toContain("Sì, elimina");
    expect(deleteButton).toContain('tone="danger"');
  });

  it("does not use browser-native dialogs", () => {
    expect(deleteButton).not.toContain("window.confirm");
    expect(deleteButton).not.toContain("window.alert");
    expect(deleteButton).not.toContain("window.prompt");
  });

  it("calls the protected delete action and refreshes the page", () => {
    expect(deleteButton).toContain("deleteAdminProductImage");
    expect(deleteButton).toContain("router.refresh()");
    expect(action).toContain('"admin_delete_product_image"');
  });
});
