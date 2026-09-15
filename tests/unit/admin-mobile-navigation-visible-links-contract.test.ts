import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/features/admin/admin-mobile-navigation.tsx"),
  "utf8",
);

describe("admin mobile navigation visible links contract", () => {
  it("usa una colonna flex esplicita per le voci", () => {
    expect(source).toContain('className="flex flex-col gap-1"');
  });

  it("rende ogni voce come elemento visibile a larghezza piena", () => {
    expect(source).toContain("flex min-h-12 w-full items-center rounded-md");
  });

  it("mantiene la navigazione tra header e footer", () => {
    expect(source).toContain("min-h-0 flex-1 overflow-y-auto");
    expect(source).toContain("shrink-0 border-t");
  });

  it("usa un overlay sopra tutto il pannello admin", () => {
    expect(source).toContain("fixed inset-0 z-[200]");
    expect(source).toContain("absolute inset-y-0 left-0 z-10");
  });

  it("usa altezza viewport dinamica", () => {
    expect(source).toContain("h-[100dvh]");
  });

  it("blocca sia body sia html quando il menu è aperto", () => {
    expect(source).toContain(
      'document.documentElement.style.overflow = "hidden"',
    );
  });
});
