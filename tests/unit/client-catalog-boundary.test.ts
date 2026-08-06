import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("confine catalogo client", () => {
  it("non serializza il catalogo completo nel CommerceProvider", () => {
    const layout = readFileSync(resolve("src/app/layout.tsx"), "utf8");
    const provider = readFileSync(
      resolve("src/features/commerce/commerce-provider.tsx"),
      "utf8",
    );

    expect(layout).not.toContain("catalogProducts");
    expect(layout).toMatch(/<CommerceProvider(?:\s|>)/);
    expect(layout).toContain("initialWishlist={initialWishlist}");
    expect(provider).not.toContain("@/content/catalog/products");
  });

  it("non importa lo snapshot statico nel repository Supabase", () => {
    const repository = readFileSync(
      resolve("src/server/catalog/supabase-catalog-repository.ts"),
      "utf8",
    );

    expect(repository).not.toContain("@/content/catalog/products");
    expect(repository).not.toContain("catalogProducts");
    expect(repository).toContain('from("catalog_products_view")');
  });
});
