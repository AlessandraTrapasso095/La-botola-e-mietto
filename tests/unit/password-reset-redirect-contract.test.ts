import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(path, "utf8");
}

describe("Supabase email redirect contract", () => {
  const customerReset = source("src/app/api/auth/password-reset/route.ts");
  const adminReset = source("src/app/api/admin/password-reset/route.ts");
  const registration = source("src/app/api/auth/register/route.ts");

  it("usa NEXT_PUBLIC_SITE_URL per il reset cliente", () => {
    expect(customerReset).toContain("getPublicEnvironment");
    expect(customerReset).toContain(
      "getPublicEnvironment().NEXT_PUBLIC_SITE_URL",
    );
    expect(customerReset).toContain(
      '"/auth/confirm?next=/nuova-password"',
    );
    expect(customerReset).toContain("siteUrl,");
    expect(customerReset).not.toContain("request.url,");
    expect(customerReset).not.toContain("getRequestOrigin(request)");
  });

  it("usa NEXT_PUBLIC_SITE_URL per il reset admin", () => {
    expect(adminReset).toContain("getPublicEnvironment");
    expect(adminReset).toContain(
      "getPublicEnvironment().NEXT_PUBLIC_SITE_URL",
    );
    expect(adminReset).toContain(
      '"/auth/confirm?next=/admin/nuova-password"',
    );
    expect(adminReset).not.toContain("getRequestOrigin(request)");
  });

  it("usa NEXT_PUBLIC_SITE_URL per la conferma registrazione", () => {
    expect(registration).toContain("getPublicEnvironment");
    expect(registration).toContain(
      "getPublicEnvironment().NEXT_PUBLIC_SITE_URL",
    );
    expect(registration).toContain(
      'new URL("/auth/confirm", siteUrl).toString()',
    );
    expect(registration).not.toContain("getRequestOrigin(request)");
  });
});
