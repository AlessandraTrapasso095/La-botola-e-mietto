import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("remaining admin runtime input validation", () => {
  const stock = source("src/server/admin/admin-product-stock.ts");
  const status = source("src/server/admin/admin-product-status.ts");
  const customers = source("src/server/admin/admin-customers.ts");
  const products = source("src/server/admin/admin-products.ts");

  it("valida productId come UUID nella modifica stock", () => {
    expect(stock).toContain("const productIdSchema = z.string().uuid()");

    expect(stock).toContain(
      "const result = productIdSchema.safeParse(productId)",
    );

    expect(stock).toContain("productId = parseProductId(productId)");

    expect(stock).toContain("p_product_id: productId");
  });

  it("mantiene quantità e motivazione stock validate", () => {
    expect(stock).toContain("Number.isSafeInteger(stockQuantity)");

    expect(stock).toContain("stockQuantity < 0");

    expect(stock).toContain("normalizedNote.length < 3");

    expect(stock).toContain("normalizedNote.length > 500");
  });

  it("valida UUID e stato prodotto a runtime", () => {
    expect(status).toContain("const productIdSchema = z.string().uuid()");

    expect(status).toContain(
      'const productStatusSchema = z.enum(["draft", "active", "archived"])',
    );

    expect(status).toContain("productId = parseProductId(productId)");

    expect(status).toContain("status = parseProductStatus(status)");
  });

  it("valida customerId prima delle query admin", () => {
    expect(customers).toContain(
      "const adminCustomerIdSchema = z.string().uuid()",
    );

    expect(customers).toContain(
      "adminCustomerIdSchema.safeParse(customerId.trim())",
    );

    expect(customers).toContain(
      "const normalizedCustomerId = parsedCustomerId.data",
    );
  });

  it("valida productId nei tre lookup read-only admin", () => {
    expect(products).toContain(
      "const adminProductIdSchema = z.string().uuid()",
    );

    expect(
      products.match(/adminProductIdSchema\.safeParse\(productId\)/g),
    ).toHaveLength(3);

    expect(products.match(/productId = parsedProductId\.data/g)).toHaveLength(
      3,
    );
  });

  it("non interroga il database per identificativi read-only malformati", () => {
    expect(products).toContain(
      "if (!parsedProductId.success) {\n    return null;",
    );

    expect(products).toContain(
      "if (!parsedProductId.success) {\n    return [];",
    );

    expect(customers).toContain(
      "if (!parsedCustomerId.success) {\n    return null;",
    );
  });
});
