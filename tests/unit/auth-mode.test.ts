import { describe, expect, it } from "vitest";

import { getSafeRedirectPath } from "@/lib/auth/safe-redirect";
import { resolveAuthMode } from "@/services/auth/auth-mode";

describe("configurazione autenticazione", () => {
  it("mantiene demo come fallback soltanto fuori produzione", () => {
    expect(resolveAuthMode(undefined, "development")).toBe("demo");
    expect(resolveAuthMode("", "test")).toBe("demo");
    expect(resolveAuthMode("invalid", "development")).toBe("demo");
    expect(resolveAuthMode("demo", "development")).toBe("demo");
  });

  it("consente soltanto Supabase in produzione", () => {
    expect(resolveAuthMode("supabase", "production")).toBe("supabase");

    for (const value of [undefined, "", "invalid", "demo"]) {
      expect(() => resolveAuthMode(value, "production")).toThrow(
        "AUTH_SERVICE deve essere impostato su supabase in produzione.",
      );
    }
  });

  it("accetta soltanto redirect interni", () => {
    expect(getSafeRedirectPath("/account/profilo?tab=dati")).toBe(
      "/account/profilo?tab=dati",
    );
    expect(getSafeRedirectPath("https://example.com/account")).toBe("/account");
    expect(getSafeRedirectPath("//example.com/account")).toBe("/account");
  });
});
