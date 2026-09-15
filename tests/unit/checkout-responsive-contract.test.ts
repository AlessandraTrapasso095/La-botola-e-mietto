import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const page = fs.readFileSync(
  path.join(process.cwd(), "src/app/(storefront)/checkout/page.tsx"),
  "utf8",
);

const checkout = fs.readFileSync(
  path.join(process.cwd(), "src/features/checkout/checkout-content.tsx"),
  "utf8",
);

describe("checkout responsive contract", () => {
  it("protegge container e form da overflow", () => {
    expect(page).toContain('<Container className="min-w-0">');
    expect(checkout).toContain("grid min-w-0 gap-8");
  });

  it("rende le opzioni di consegna responsive", () => {
    expect(checkout).toContain("grid-cols-[auto_minmax(0,1fr)]");
    expect(checkout).toContain("sm:grid-cols-[auto_minmax(0,1fr)_auto]");
    expect(checkout).toContain("grid min-w-0 cursor-pointer");
  });

  it("protegge le sezioni principali del checkout", () => {
    expect(checkout).toContain("min-w-0 overflow-hidden border p-4");
    expect(checkout).toContain("lg:grid-cols-[minmax(0,1fr)_24rem]");
  });

  it("rende il riepilogo mobile-safe", () => {
    expect(checkout).toContain(
      'className="min-w-0" aria-label="Riepilogo ordine"',
    );
    expect(checkout).toContain("lg:sticky lg:top-28");
    expect(checkout).toContain("grid-cols-[minmax(0,1fr)_auto]");
  });

  it("rende il codice promozionale responsive", () => {
    expect(checkout).toContain("sm:grid-cols-[minmax(0,1fr)_auto]");
    expect(checkout).toContain("min-w-0 flex-1 border");
  });

  it("non contiene classi malformate note", () => {
    expect(checkout).not.toContain("flex-1border");
    expect(checkout).not.toContain("justify-centerborder");
    expect(checkout).not.toContain("overflow-hiddenborder");
  });
});
