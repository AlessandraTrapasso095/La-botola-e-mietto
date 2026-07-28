import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("reduced motion CSS", () => {
  it("disattiva reveal e zoom non essenziali", () => {
    const stylesheetPath = join(process.cwd(), "src/styles/globals.css");
    const stylesheet = readFileSync(stylesheetPath, "utf8");

    expect(stylesheet).toContain("@media (prefers-reduced-motion: reduce)");
    expect(stylesheet).toContain("[data-reveal]");
    expect(stylesheet).toContain(".image-hover:hover img");
    expect(stylesheet).toContain("transform: none");
  });
});
