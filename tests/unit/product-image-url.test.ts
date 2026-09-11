import { afterEach, describe, expect, it, vi } from "vitest";

import { resolveProductImageUrl } from "@/lib/product-image-url";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("product image URL resolver", () => {
  it("keeps existing local catalog image paths compatible", () => {
    expect(resolveProductImageUrl("images/catalog/example.webp")).toBe(
      "/images/catalog/example.webp",
    );
  });

  it("keeps absolute image URLs unchanged", () => {
    const url = "https://cdn.example.com/product.webp";

    expect(resolveProductImageUrl(url)).toBe(url);
  });

  it("resolves new product image paths through Supabase Storage", () => {
    vi.stubEnv(
      "NEXT_PUBLIC_SUPABASE_URL",
      "https://example-project.supabase.co",
    );

    expect(
      resolveProductImageUrl(
        "products/11111111-1111-4111-8111-111111111111/image.webp",
      ),
    ).toBe(
      "https://example-project.supabase.co/storage/v1/object/public/product-images/products/11111111-1111-4111-8111-111111111111/image.webp",
    );
  });
});
