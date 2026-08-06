import { describe, expect, it } from "vitest";

import { getSafeRedirectPath } from "@/lib/auth/safe-redirect";
import { resolveAuthMode } from "@/services/auth/auth-mode";

describe("configurazione autenticazione", () => {
  it("mantiene demo come fallback anche per valori invalidi", () => {
    expect(resolveAuthMode(undefined)).toBe("demo");
    expect(resolveAuthMode("")).toBe("demo");
    expect(resolveAuthMode("invalid")).toBe("demo");
    expect(resolveAuthMode("supabase")).toBe("supabase");
  });

  it("accetta soltanto redirect interni", () => {
    expect(getSafeRedirectPath("/account/profilo?tab=dati")).toBe(
      "/account/profilo?tab=dati",
    );
    expect(getSafeRedirectPath("https://example.com/account")).toBe("/account");
    expect(getSafeRedirectPath("//example.com/account")).toBe("/account");
  });
});
