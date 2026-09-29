import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const source = readFileSync(
  "src/app/api/auth/password-reset/route.ts",
  "utf8",
);

describe("password reset redirect contract", () => {
  it("costruisce il callback dalla request origin pubblica", () => {
    expect(source).toContain("getRequestOrigin");
    expect(source).toContain("const origin = getRequestOrigin(request)");
    expect(source).toContain('"/auth/confirm?next=/nuova-password"');
    expect(source).toContain("origin,");
    expect(source).not.toContain("request.url,");
  });
});
