import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const root = process.cwd();

function exists(relativePath: string) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath: string) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

describe("production surface hardening contract", () => {
  it("does not expose the internal design system as an application route", () => {
    expect(exists("src/app/(storefront)/design-system/page.tsx")).toBe(false);
  });

  it("does not ship the internal design-system feature bundle", () => {
    expect(exists("src/features/design-system/design-system-dialogs.tsx")).toBe(
      false,
    );
  });

  it("does not publish macOS metadata files anywhere under public", () => {
    const publicRoot = path.join(root, "public");

    const findDsStore = (directory: string): string[] =>
      fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const entryPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
          return findDsStore(entryPath);
        }

        return entry.name === ".DS_Store" ? [entryPath] : [];
      });

    expect(findDsStore(publicRoot)).toEqual([]);
  });

  it("keeps API routes excluded from crawler discovery", () => {
    const robots = read("src/app/robots.ts");

    expect(robots).toContain('disallow: ["/api/"]');
    expect(robots).not.toContain("/design-system");
  });
});
