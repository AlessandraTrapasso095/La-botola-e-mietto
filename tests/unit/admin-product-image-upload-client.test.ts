import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("admin product reusable image upload", () => {
  const upload = readFileSync(
    resolve("src/features/admin/admin-product-image-upload.ts"),
    "utf8",
  );

  it("creates and uploads the original image and WebP thumbnail", () => {
    expect(upload).toContain("createProductImageThumbnail");
    expect(upload.match(/uploadToSignedUrl/g)).toHaveLength(2);
    expect(upload).toContain('contentType: "image/webp"');
  });

  it("registers the uploaded files through the protected action", () => {
    expect(upload).toContain("prepareAdminProductImageUpload");
    expect(upload).toContain("registerAdminProductImage");
    expect(upload).toContain("thumbnailStoragePath");
  });

  it("cleans incomplete uploads", () => {
    expect(upload).toContain("discardAdminProductImageUpload");
    expect(upload).toContain("Pulizia upload incompleto fallita");
  });
});
