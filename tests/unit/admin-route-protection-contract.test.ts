import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("admin route protection contract", () => {
  const proxy = source("src/proxy.ts");

  const dashboardLayout = source("src/app/admin/(dashboard)/layout.tsx");

  const adminUser = source("src/server/admin/admin-user.ts");

  const orders = source("src/server/admin/orders.ts");

  const settings = source("src/server/admin/settings.ts");

  const dashboard = source("src/server/admin/dashboard.ts");

  const passwordReset = source("src/app/api/admin/password-reset/route.ts");

  it("blocca nel proxy le route admin protette quando manca la sessione", () => {
    expect(proxy).toContain("const adminRoute =");
    expect(proxy).toContain('pathname === "/admin"');
    expect(proxy).toContain('pathname.startsWith("/admin/")');
    expect(proxy).toContain("adminRoute && !adminGuestRoute && !user");
    expect(proxy).toContain('destination.pathname = "/admin/login"');
    expect(proxy).toContain(
      "getSafeRedirectPath(`${pathname}${request.nextUrl.search}`)",
    );
  });

  it("mantiene accessibili le sole route admin necessarie prima del login", () => {
    expect(proxy).toContain("const adminGuestRoute =");
    expect(proxy).toContain('pathname === "/admin/login"');
    expect(proxy).toContain('pathname === "/admin/password-dimenticata"');
    expect(proxy).toContain('pathname === "/admin/nuova-password"');
  });

  it("verifica comunque il ruolo admin nel layout dashboard", () => {
    expect(dashboardLayout).toContain("getServerAdminUser");
    expect(dashboardLayout).toContain(
      "const admin = await getServerAdminUser();",
    );
    expect(dashboardLayout).toContain('redirect("/admin/login")');
  });

  it("determina il ruolo admin lato server e non dalla UI", () => {
    expect(adminUser).toContain("auth.getUser()");
    expect(adminUser).toContain('profile.role !== "admin"');
  });

  it("protegge internamente le letture privilegiate degli ordini", () => {
    expect(orders).toContain("getServerAdminUser");

    expect(
      orders.match(/await getServerAdminUser\(\)/g)?.length,
    ).toBeGreaterThanOrEqual(2);

    expect(orders).toContain(
      'throw new Error("Accesso amministratore richiesto.")',
    );
  });

  it("protegge internamente le impostazioni amministratore", () => {
    expect(settings).toContain("const adminUser = await getServerAdminUser();");

    expect(settings).toContain(
      'throw new Error("Accesso amministratore richiesto.")',
    );

    expect(settings).toContain('.eq("role", "admin")');
  });

  it("la dashboard usa la lettura ordini già protetta", () => {
    expect(dashboard).toContain("getServerAdminOrders");
    expect(dashboard).toContain("const orders = await getServerAdminOrders();");
  });

  it("mantiene il reset password admin pre-login ma protetto dagli abusi", () => {
    expect(passwordReset).not.toContain("getServerAdminUser");

    expect(passwordReset).toContain("requireSupabaseAuthMode()");
    expect(passwordReset).toContain("requireSameOrigin(request)");

    expect(passwordReset).toContain(
      "enforceIpRateLimit(request, rateLimitPolicies.adminPasswordReset)",
    );

    expect(passwordReset).toContain(
      "enforceAccountRateLimit(email, rateLimitPolicies.adminPasswordReset)",
    );

    expect(passwordReset).toContain('profileResponse.data.role !== "admin"');

    expect(
      passwordReset.match(/return authJson\(null\);/g)?.length,
    ).toBeGreaterThanOrEqual(2);
  });
});
