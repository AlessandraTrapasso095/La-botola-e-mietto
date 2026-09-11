import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin product image storage backend", () => {
  const registerMigration = source(
    "supabase/migrations/0038_admin_register_product_image.sql",
  );
  const managementMigration = source(
    "supabase/migrations/0039_admin_replace_delete_product_image.sql",
  );
  const thumbnailMigration = source(
    "supabase/migrations/0040_admin_product_image_thumbnail.sql",
  );
  const action = source("src/server/admin/admin-product-images.ts");

  it("requires an admin before all image mutations", () => {
    expect(action).toContain("getServerAdminUser");
    expect(action).toContain("prepareAdminProductImageUpload");
    expect(action).toContain("discardAdminProductImageUpload");
    expect(action).toContain("registerAdminProductImage");
    expect(action).toContain("deleteAdminProductImage");
  });

  it("uses signed uploads without sending files through server actions", () => {
    expect(action).toContain("createSignedUploadUrl");
    expect(action).toContain("thumbnailStoragePath");
    expect(action).toContain("thumbnailToken");
    expect(action).not.toContain("arrayBuffer");
  });

  it("validates file type and the 5 MB limit on the server", () => {
    expect(action).toContain('"image/jpeg"');
    expect(action).toContain('"image/png"');
    expect(action).toContain('"image/webp"');
    expect(action).toContain("5 * 1024 * 1024");
  });

  it("keeps the first image registration migration immutable", () => {
    expect(registerMigration).toContain(
      "create or replace function public.admin_register_product_image",
    );
    expect(registerMigration).toContain("insert into public.product_images");
  });

  it("requires original and thumbnail objects to exist", () => {
    expect(thumbnailMigration).toContain("from storage.objects");
    expect(thumbnailMigration).toContain("bucket_id = 'product-images'");
    expect(thumbnailMigration).toContain("PRODUCT_IMAGE_OBJECT_MISSING");
    expect(thumbnailMigration).toContain(
      "PRODUCT_IMAGE_THUMBNAIL_OBJECT_MISSING",
    );
  });

  it("registers original and thumbnail atomically", () => {
    expect(action).toContain('"admin_replace_product_image_with_thumbnail"');
    expect(thumbnailMigration).toContain(
      "create or replace function public.admin_replace_product_image_with_thumbnail",
    );
    expect(thumbnailMigration).toContain("thumbnail_path = p_thumbnail_path");
    expect(thumbnailMigration).toContain("p_thumbnail_path");
    expect(thumbnailMigration).toContain("for update");
  });

  it("deletes the primary image and returns both storage paths", () => {
    expect(action).toContain('"admin_delete_product_image"');
    expect(managementMigration).toContain(
      "create or replace function public.admin_delete_product_image",
    );
    expect(managementMigration).toContain("delete from public.product_images");
    expect(managementMigration).toContain("PRODUCT_IMAGE_NOT_FOUND");
  });

  it("removes incomplete, replaced or deleted managed objects", () => {
    expect(action).toContain("removeStorageObject");
    expect(action).toContain("removePreparedUpload");
    expect(action).toContain(".remove([storagePath])");
    expect(action).toContain("previous_storage_path");
    expect(action).toContain("previous_thumbnail_path");
  });

  it("refreshes the catalog after image mutations", () => {
    expect(registerMigration).toContain(
      "refresh materialized view public.catalog_products_projection",
    );
    expect(
      managementMigration.match(/refresh materialized view/g),
    ).toHaveLength(2);
    expect(thumbnailMigration).toContain(
      "refresh materialized view public.catalog_products_projection",
    );
  });

  it("restricts all image RPCs to service role", () => {
    expect(registerMigration).toContain("from public, anon, authenticated");
    expect(registerMigration).toContain("to service_role");
    expect(
      managementMigration.match(/from public, anon, authenticated/g),
    ).toHaveLength(2);
    expect(managementMigration.match(/to service_role/g)).toHaveLength(2);
    expect(thumbnailMigration).toContain("from public, anon, authenticated");
    expect(thumbnailMigration).toContain("to service_role");
  });
});
