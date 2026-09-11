import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin product storefront route", () => {
  const detailPage = source("src/app/admin/(dashboard)/prodotti/[id]/page.tsx");
  const imageActions = source("src/server/admin/admin-product-images.ts");
  const editAction = source("src/server/admin/admin-product-edit.ts");

  it("links the admin product to the existing singular storefront route", () => {
    expect(
      existsSync(resolve("src/app/(storefront)/prodotto/[slug]/page.tsx")),
    ).toBe(true);

    expect(detailPage).toContain("href={`/prodotto/${product.slug}`}");
    expect(detailPage).not.toContain("href={`/prodotti/${product.slug}`}");
  });

  it("revalidates the storefront detail after image changes", () => {
    expect(imageActions).toContain(
      "revalidatePath(`/prodotto/${productSlug}`)",
    );
    expect(imageActions).not.toContain(
      "revalidatePath(`/prodotti/${productSlug}`)",
    );
  });

  it("revalidates the storefront detail after product changes", () => {
    expect(editAction).toContain("revalidatePath(`/prodotto/${data.slug}`)");
    expect(editAction).not.toContain(
      "revalidatePath(`/prodotti/${data.slug}`)",
    );
  });
});
