import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("product editorial characteristics", () => {
  const editorial = source("src/features/product/product-editorial.tsx");
  const mapper = source("src/server/catalog/supabase-catalog-mapper.ts");

  it("renders the normalized characteristics without appending producer twice", () => {
    expect(editorial).toContain("product.characteristics.map((characteristic)");
    expect(editorial).not.toContain(
      '{ label: "Produttore", value: product.producer }',
    );
  });

  it("keeps producer normalization in the catalog mapper", () => {
    expect(mapper).toContain(
      'card.producer ? [{ label: "Produttore", value: card.producer }] : []',
    );
  });
});
