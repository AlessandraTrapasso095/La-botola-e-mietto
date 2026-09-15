import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/app/admin/(dashboard)/layout.tsx"),
  "utf8",
);

describe("admin fixed header contract", () => {
  it("mantiene l'header fisso durante lo scroll", () => {
    expect(source).toContain("fixed inset-x-0 top-0 z-40");
  });

  it("lascia spazio alla sidebar desktop", () => {
    expect(source).toContain("lg:left-64");
  });

  it("compensa l'altezza dell'header nel main", () => {
    expect(source).toContain("pt-[4.5rem]");
    expect(source).toContain("sm:pt-20");
    expect(source).toContain("lg:pt-24");
  });

  it("non nasconde artificialmente l'overflow nel main", () => {
    expect(source).not.toContain('className="w-full min-w-0 overflow-x-hidden');
  });
});
