import { describe, expect, it } from "vitest";

import { getSafeRedirectPath } from "@/lib/auth/safe-redirect";
import { resolveAuthMode } from "@/services/auth/auth-mode";

describe("configurazione autenticazione", () => {
  it("mantiene demo come fallback soltanto fuori produzione", () => {
    expect(resolveAuthMode(undefined, "development")).toBe("demo");
    expect(resolveAuthMode("", "test")).toBe("demo");
    expect(resolveAuthMode("invalid", "development")).toBe("demo");
    expect(resolveAuthMode("supabase", "production")).toBe("supabase");
    expect(resolveAuthMode("demo", "production")).toBe("demo");
  });

  it("fallisce in produzione se AUTH_SERVICE è mancante o invalido", () => {
    expect(() => resolveAuthMode(undefined, "production")).toThrow(
      "AUTH_SERVICE deve essere configurato esplicitamente in produzione.",
    );

    expect(() => resolveAuthMode("", "production")).toThrow(
      "AUTH_SERVICE deve essere configurato esplicitamente in produzione.",
    );

    expect(() => resolveAuthMode("invalid", "production")).toThrow(
      "AUTH_SERVICE deve essere configurato esplicitamente in produzione.",
    );
  });

  it("accetta soltanto redirect interni", () => {
    expect(getSafeRedirectPath("/account/profilo?tab=dati")).toBe(
      "/account/profilo?tab=dati",
    );
    expect(getSafeRedirectPath("https://example.com/account")).toBe("/account");
    expect(getSafeRedirectPath("//example.com/account")).toBe("/account");
  });
});
