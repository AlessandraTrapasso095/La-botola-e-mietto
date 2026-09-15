import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/components/layout/mobile-navigation.tsx"),
  "utf8",
);

describe("storefront mobile navigation responsive contract", () => {
  it("usa un drawer mobile viewport-safe", () => {
    expect(source).toContain("h-dvh");
    expect(source).toContain("min-h-0 flex-1 overflow-y-auto");
    expect(source).toContain("overscroll-contain");
  });

  it("mantiene header e utility bar compatti", () => {
    expect(source).toContain("min-h-16 items-center");
    expect(source).toContain("min-h-14 items-center justify-center");
    expect(source).toContain("shrink-0 grid-cols-2");
  });

  it("rende la navigazione principale più compatta", () => {
    expect(source).toContain(
      "min-h-12 items-center justify-between border-b py-2 font-serif text-lg",
    );
  });

  it("rende gli accordion catalogo compatti", () => {
    expect(source).toContain(
      "min-h-12 cursor-pointer list-none items-center justify-between py-2 font-serif text-base",
    );
  });

  it("non contiene la classe summary concatenata", () => {
    expect(source).not.toContain("text-lg[&::-webkit-details-marker]:hidden");
  });
});
