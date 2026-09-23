import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { resolveCatalogMode } from "@/server/catalog/catalog-mode";
import { resolveAuthMode } from "@/services/auth/auth-mode";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("environment security contract", () => {
  it("consente soltanto auth Supabase in produzione", () => {
    expect(resolveAuthMode("supabase", "production")).toBe("supabase");

    expect(() => resolveAuthMode("demo", "production")).toThrow(
      "AUTH_SERVICE deve essere impostato su supabase in produzione.",
    );
  });

  it("consente soltanto catalogo Supabase in produzione", () => {
    expect(resolveCatalogMode("supabase", "production")).toBe("supabase");

    expect(() => resolveCatalogMode("demo", "production")).toThrow(
      "CATALOG_REPOSITORY deve essere impostato su supabase in produzione.",
    );
  });

  it("mantiene le modalità demo disponibili soltanto fuori produzione", () => {
    expect(resolveAuthMode("demo", "development")).toBe("demo");
    expect(resolveCatalogMode("demo", "development")).toBe("demo");
  });

  it("documenta tutte le variabili server-side operative", () => {
    const example = source(".env.example");

    for (const name of [
      "SUPABASE_SERVICE_ROLE_KEY=",
      "RATE_LIMIT_SECRET=",
      "STRIPE_SECRET_KEY=",
      "STRIPE_WEBHOOK_SECRET=",
      "EMAIL_PROVIDER=",
      "EMAIL_PROVIDER_API_KEY=",
      "EMAIL_FROM_ADDRESS=",
      "EMAIL_FROM_NAME=",
    ]) {
      expect(example).toContain(name);
    }
  });

  it("non documenta una Stripe publishable key inutilizzata", () => {
    const example = source(".env.example");

    expect(example).not.toContain("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
  });

  it("fa controllare al doctor tutte le integrazioni operative", () => {
    const doctor = source("scripts/doctor.mjs");

    for (const name of [
      '"RATE_LIMIT_SECRET"',
      '"STRIPE_SECRET_KEY"',
      '"STRIPE_WEBHOOK_SECRET"',
      '"EMAIL_PROVIDER"',
      '"EMAIL_PROVIDER_API_KEY"',
      '"EMAIL_FROM_ADDRESS"',
      '"EMAIL_FROM_NAME"',
    ]) {
      expect(doctor).toContain(name);
    }
  });

  it("mantiene i secret server-side fuori dalle variabili NEXT_PUBLIC", () => {
    const example = source(".env.example");

    for (const name of [
      "SUPABASE_SERVICE_ROLE_KEY",
      "RATE_LIMIT_SECRET",
      "STRIPE_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET",
      "EMAIL_PROVIDER_API_KEY",
    ]) {
      expect(example).not.toContain(`NEXT_PUBLIC_${name}`);
    }
  });
});
