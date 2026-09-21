import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

function source(relativePath: string) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

const proxySession = source("src/lib/supabase/proxy.ts");
const adminSession = source("src/features/admin/admin-session.ts");
const adminGuard = source("src/features/admin/admin-inactivity-guard.tsx");
const adminLogout = source("src/features/admin/admin-logout-button.tsx");
const accountShell = source("src/features/account/account-shell.tsx");
const logoutRoute = source("src/app/api/auth/logout/route.ts");

describe("session security contract", () => {
  it("valida la sessione Supabase lato server con getUser", () => {
    expect(proxySession).toContain("client.auth.getUser()");
    expect(proxySession).not.toContain("client.auth.getSession()");
  });

  it("propaga i cookie Supabase con le opzioni originali", () => {
    expect(proxySession).toContain(
      "response.cookies.set(name, value, options)",
    );
    expect(proxySession).toContain("copyResponseCookies");
  });

  it("mantiene il timeout amministratore a 15 minuti", () => {
    expect(adminSession).toContain(
      "ADMIN_INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000",
    );
  });

  it("sincronizza l'attività admin tra tab e rivaluta al ritorno", () => {
    expect(adminGuard).toContain(
      'window.addEventListener("storage", handleStorage)',
    );
    expect(adminGuard).toContain('"visibilitychange"');
    expect(adminGuard).toContain("ADMIN_ACTIVITY_STORAGE_KEY");
  });

  it("il timeout admin effettua un vero logout server-side", () => {
    expect(adminGuard).toContain('fetch("/api/auth/logout"');
    expect(adminGuard).toContain('method: "POST"');
    expect(adminGuard).toContain('credentials: "same-origin"');
  });

  it("anche il logout manuale admin invalida la sessione", () => {
    expect(adminLogout).toContain('fetch("/api/auth/logout"');
    expect(adminLogout).toContain('credentials: "same-origin"');
  });

  it("il logout account usa il servizio auth e non cancella solo stato locale", () => {
    expect(accountShell).toContain("await signOut()");
    expect(accountShell).toContain("router.refresh()");
    expect(accountShell).toContain("router.replace(accountRoutes.signIn)");
  });

  it("la route logout richiede same-origin e chiama Supabase signOut", () => {
    expect(logoutRoute).toContain("requireSameOrigin(request)");
    expect(logoutRoute).toContain("client.auth.signOut()");
  });
});
