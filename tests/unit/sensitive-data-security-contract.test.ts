import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { resolveAuthMode } from "@/services/auth/auth-mode";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("sensitive data security contract", () => {
  it("impedisce l'autenticazione demo in produzione", () => {
    expect(resolveAuthMode("supabase", "production")).toBe("supabase");

    expect(() => resolveAuthMode("demo", "production")).toThrow(
      "AUTH_SERVICE deve essere impostato su supabase in produzione.",
    );
  });

  it("mantiene la modalità demo disponibile fuori produzione", () => {
    expect(resolveAuthMode("demo", "development")).toBe("demo");
    expect(resolveAuthMode(undefined, "test")).toBe("demo");
  });

  it("non duplica indirizzi email sensibili nei metadata del delivery log", () => {
    const accountSecurity = source("src/server/email/account-security.ts");

    expect(accountSecurity).not.toContain("old_email:");
    expect(accountSecurity).not.toContain("requested_email:");
    expect(accountSecurity).not.toContain(
      `metadata: {
      user_id: userId,
      email,`,
    );

    expect(accountSecurity).toContain('stage: "requested"');
    expect(accountSecurity).toContain('stage: "completed"');
  });

  it("protegge email_deliveries con RLS e service role", () => {
    const migration = source("supabase/migrations/0027_email_delivery_log.sql");

    expect(migration).toContain("alter table public.email_deliveries");
    expect(migration).toContain("enable row level security");
    expect(migration).toContain("from anon, authenticated");
    expect(migration).toContain("to service_role");
  });

  it("non serializza error object nel cleanup immagini client", () => {
    const upload = source("src/features/admin/admin-product-image-upload.ts");

    expect(upload).not.toContain("catch (cleanupError)");

    expect(upload).not.toContain(
      '"[admin-product-image] Pulizia upload incompleto fallita.",\n          cleanupError',
    );
  });

  it("non espone secret server-side nei client component", () => {
    const clientSources = [
      "src/features/account/login-form.tsx",
      "src/features/account/admin-login-form.tsx",
      "src/features/admin/admin-product-image-upload.ts",
    ].map(source);

    for (const clientSource of clientSources) {
      expect(clientSource).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
      expect(clientSource).not.toContain("STRIPE_SECRET_KEY");
      expect(clientSource).not.toContain("STRIPE_WEBHOOK_SECRET");
      expect(clientSource).not.toContain("EMAIL_PROVIDER_API_KEY");
      expect(clientSource).not.toContain("RATE_LIMIT_SECRET");
    }
  });
});
