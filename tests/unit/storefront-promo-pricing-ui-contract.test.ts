import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const productPrice = fs.readFileSync(
  path.join(process.cwd(), "src/features/catalog/product-price.tsx"),
  "utf8",
);

const cartLine = fs.readFileSync(
  path.join(process.cwd(), "src/features/commerce/cart-line.tsx"),
  "utf8",
);

const checkout = fs.readFileSync(
  path.join(process.cwd(), "src/features/checkout/checkout-content.tsx"),
  "utf8",
);

describe("storefront promo pricing UI", () => {
  it("mostra prezzo precedente e percentuale nelle card e nel dettaglio", () => {
    expect(productPrice).toContain("product.offer.previousGrossPrice");
    expect(productPrice).toContain("product.offer.discountPercentage");
    expect(productPrice).toContain("<del");
  });

  it("mostra prezzo precedente, percentuale e prezzo promo nel carrello", () => {
    expect(cartLine).toContain("line.product.offer.previousGrossPrice");
    expect(cartLine).toContain("line.product.offer.discountPercentage");
    expect(cartLine).toContain("line.product.grossPrice");
  });

  it("mostra nel checkout il totale precedente barrato quando disponibile", () => {
    expect(checkout).toContain("line.product.offer.previousGrossPriceMinor *");

    expect(checkout).toContain("line.product.offer.discountPercentage");

    expect(checkout).toContain("line.lineTotalMinor");
  });

  it("non ricalcola il prezzo promo nel frontend", () => {
    expect(cartLine).not.toContain("grossPriceMinor * (100 -");

    expect(checkout).not.toContain("grossPriceMinor * (100 -");
  });
});
