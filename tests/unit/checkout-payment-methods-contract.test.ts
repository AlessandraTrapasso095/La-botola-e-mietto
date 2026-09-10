import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("checkout payment methods", () => {
  const validation = readFileSync(
    resolve("src/lib/validation/checkout.ts"),
    "utf8",
  );

  const checkout = readFileSync(
    resolve("src/features/checkout/checkout-content.tsx"),
    "utf8",
  );

  it("consente Stripe e bonifico", () => {
    expect(validation).toContain('"stripe"');
    expect(validation).toContain('"bank_transfer"');
  });

  it("non consente Satispay nei nuovi checkout", () => {
    expect(validation).not.toContain('"satispay"');
    expect(checkout).not.toContain('value="satispay"');
    expect(checkout).not.toContain('setPaymentMethod("satispay")');
  });
});
