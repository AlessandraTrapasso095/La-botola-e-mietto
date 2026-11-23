import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("checkout street number contract", () => {
  it("keeps the street number mandatory in account address validation", () => {
    const validation = source("src/lib/validation/address.ts");

    expect(validation).toContain(
      'streetNumber: requiredText("Inserisci il numero civico.", 30)',
    );
  });

  it("marks the street number as required in the account form", () => {
    const panel = source("src/features/account/addresses-panel.tsx");

    expect(panel).toContain('id="address-street-number"');
    expect(panel).toContain('label="Numero civico *"');
    expect(panel).toContain("required");
  });

  it("blocks checkout when a selected address has no street number", () => {
    const checkout = source("src/features/checkout/checkout-content.tsx");

    expect(checkout).toContain("hasStreetNumber");
    expect(checkout).toContain("address?.streetNumber.trim()");
    expect(checkout).toContain(
      "L’indirizzo di spedizione non contiene il numero civico.",
    );
    expect(checkout).toContain(
      "L’indirizzo di fatturazione non contiene il numero civico.",
    );
  });

  it("still allows store pickup without a shipping address", () => {
    const checkout = source("src/features/checkout/checkout-content.tsx");

    expect(checkout).toContain(
      'shippingMethod !== "store_pickup" &&',
    );
  });
});
