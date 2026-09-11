import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("product image Next configuration", () => {
  const config = readFileSync(resolve("next.config.ts"), "utf8");

  it("allows optimized product images from the configured Supabase project", () => {
    expect(config).toContain("NEXT_PUBLIC_SUPABASE_URL");
    expect(config).toContain("supabaseImageRemotePatterns");
    expect(config).toContain(
      'pathname: "/storage/v1/object/public/product-images/**"',
    );
    expect(config).toContain("remotePatterns: supabaseImageRemotePatterns");
  });

  it("keeps Supabase product images allowed by the CSP", () => {
    expect(config).toContain(
      `"img-src 'self' data: blob: https://*.supabase.co"`,
    );
  });
});
