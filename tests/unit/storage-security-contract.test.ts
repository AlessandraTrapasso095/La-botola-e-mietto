import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("storage security contract", () => {
  const foundation = source("supabase/migrations/0001_foundation.sql");
  const hardening = source(
    "supabase/migrations/0053_harden_product_image_bucket.sql",
  );
  const action = source("src/server/admin/admin-product-images.ts");

  it("keeps product images publicly readable", () => {
    expect(foundation).toContain(
      'values (\'product-images\', \'product-images\', true)',
    );
    expect(foundation).toContain(
      'create policy "Product storage is publicly readable"',
    );
    expect(foundation).toContain("for select to anon, authenticated");
  });

  it("does not introduce public storage mutation policies", () => {
    expect(hardening).not.toMatch(/create\s+policy/i);
    expect(hardening).not.toMatch(/for\s+(insert|update|delete)/i);
  });

  it("enforces the 5 MB bucket limit", () => {
    expect(hardening).toContain("file_size_limit = 5 * 1024 * 1024");
    expect(action).toContain("5 * 1024 * 1024");
  });

  it("restricts the bucket to supported image MIME types", () => {
    expect(hardening).toContain("'image/jpeg'");
    expect(hardening).toContain("'image/png'");
    expect(hardening).toContain("'image/webp'");

    expect(action).toContain('"image/jpeg"');
    expect(action).toContain('"image/png"');
    expect(action).toContain('"image/webp"');
  });

  it("targets only the product-images bucket", () => {
    expect(hardening).toContain("where id = 'product-images'");
  });

  it("preserves signed upload architecture", () => {
    expect(action).toContain("createSignedUploadUrl");
    expect(action).toContain("crypto.randomUUID()");
  });
});
