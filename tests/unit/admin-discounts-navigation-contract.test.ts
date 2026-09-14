import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/app/admin/(dashboard)/layout.tsx"),
  "utf8",
);

describe("admin discounts navigation contract", () => {
  it("espone la voce Sconti nella navigazione admin", () => {
    expect(source).toContain('href="/admin/sconti"');
    expect(source).toMatch(
      /href="\/admin\/sconti"[\s\S]*?>[\s\S]*?Sconti[\s\S]*?<\/Link>/,
    );
  });
});
