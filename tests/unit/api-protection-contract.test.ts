import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("API protection contract", () => {
  const bankTransfer = source(
    "src/app/api/admin/orders/payment/bank-transfer/route.ts",
  );

  const shipping = source("src/app/api/admin/orders/shipping/route.ts");

  const status = source("src/app/api/admin/orders/status/route.ts");

  const bankTransferServer = source(
    "src/server/admin/confirm-bank-transfer.ts",
  );

  const shippingServer = source("src/server/admin/ship-order.ts");

  const statusServer = source("src/server/admin/update-order-status.ts");

  const catalogProducts = source("src/app/api/catalog/products/route.ts");

  const catalogSearch = source("src/app/api/catalog/search/route.ts");

  const stripeWebhook = source("src/app/api/stripe/webhook/route.ts");

  const adminMutationRoutes = [bankTransfer, shipping, status];

  it("protegge le mutazioni ordine admin con auth mode e same-origin", () => {
    for (const route of adminMutationRoutes) {
      expect(route).toContain("requireSupabaseAuthMode();");

      expect(route).toContain("requireSameOrigin(request);");

      const authModeIndex = route.indexOf("requireSupabaseAuthMode();");

      const originIndex = route.indexOf("requireSameOrigin(request);");

      const bodyIndex = route.indexOf("request.json()");

      expect(authModeIndex).toBeGreaterThan(-1);
      expect(originIndex).toBeGreaterThan(authModeIndex);
      expect(bodyIndex).toBeGreaterThan(originIndex);
    }
  });

  it("mantiene validazione strutturata dei payload admin", () => {
    for (const route of adminMutationRoutes) {
      expect(route).toContain("inputSchema.safeParse(");

      expect(route).toContain("authErrorResponse(error)");
    }
  });

  it("mantiene l'autorizzazione admin anche negli helper privilegiati", () => {
    for (const helper of [bankTransferServer, shippingServer, statusServer]) {
      expect(helper).toContain("getServerAdminUser");

      expect(helper).toContain("Accesso amministratore richiesto.");
    }
  });

  it("mantiene pubblica la lettura catalogo ma con input limitato", () => {
    expect(catalogProducts).not.toContain("requireSupabaseAuthMode");

    expect(catalogProducts).toContain("safeParse");

    expect(catalogProducts).toContain(".max(50)");

    expect(catalogSearch).not.toContain("requireSupabaseAuthMode");

    expect(catalogSearch).toContain(".min(2).max(120)");

    expect(catalogSearch).toContain("productLimit: 7");

    expect(catalogSearch).toContain("brandLimit: 4");

    expect(catalogSearch).toContain("categoryLimit: 4");
  });

  it("mantiene il webhook Stripe pubblico ma autenticato dalla firma", () => {
    expect(stripeWebhook).not.toContain("requireSameOrigin");

    expect(stripeWebhook).not.toContain("requireSupabaseAuthMode");

    expect(stripeWebhook).toContain('request.headers.get("stripe-signature")');

    expect(stripeWebhook).toContain("await request.text()");

    expect(stripeWebhook).toContain("webhooks.constructEvent");

    expect(stripeWebhook).toContain("STRIPE_WEBHOOK_SECRET");
  });
});
