import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(file: string) {
  return readFileSync(path.join(process.cwd(), file), "utf8");
}

describe("promotion code flexible format contract", () => {
  it("consente caratteri come percentuale nell'admin", () => {
    const client = source(
      "src/features/admin/admin-promotion-code-manager.tsx",
    );
    const server = source(
      "src/server/admin/admin-promotion-codes.ts",
    );

    expect(client).toContain(
      "parsed.code.length < 1 || parsed.code.length > 64",
    );
    expect(server).toContain(
      "code.length < 1 || code.length > 64",
    );

    expect(client).not.toContain("^[A-Z0-9_-]{3,32}$");
    expect(server).not.toContain("^[A-Z0-9_-]{3,32}$");
  });

  it("consente caratteri come percentuale nel checkout", () => {
    const validation = source("src/lib/validation/checkout.ts");

    expect(validation).not.toContain(
      ".regex(/^[A-Za-z0-9_-]+$/)",
    );

    expect(validation).toContain(".min(1)");
    expect(validation).toContain(".max(64)");
  });

  it("aggiorna database e checkout RPC", () => {
    const migration = source(
      "supabase/migrations/0058_allow_flexible_promotion_codes.sql",
    );

    expect(migration).toContain(
      "char_length(code) between 1 and 64",
    );

    expect(migration).toContain(
      "if char_length(v_normalized_promotion_code) > 64 then",
    );

    expect(migration).not.toContain(
      "!~ '^[A-Z0-9_-]{3,32}$'",
    );
  });
});
