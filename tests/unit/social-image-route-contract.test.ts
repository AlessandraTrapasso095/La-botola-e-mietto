import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const routePath = path.join(process.cwd(), "src/app/opengraph-image/route.ts");

describe("stable social image route", () => {
  it("espone /opengraph-image riutilizzando la sorgente Open Graph ufficiale", () => {
    const source = fs.readFileSync(routePath, "utf8");

    expect(source).toContain(
      'import OpenGraphImage from "@/app/(storefront)/opengraph-image"',
    );
    expect(source).toContain("export function GET()");
    expect(source).toContain("return OpenGraphImage()");
  });
});
