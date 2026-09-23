import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("shared rate limiting endpoint contract", () => {
  const helper = source("src/server/security/rate-limit.ts");
  const http = source("src/server/auth/http.ts");

  it("non usa più uno stato rate-limit in memoria", () => {
    expect(http).not.toContain("new Map");
    expect(http).not.toContain("rateLimits");
    expect(http).not.toContain("enforceAuthRateLimit");
  });

  it("usa HMAC-SHA256 prima di inviare l'identificatore al database", () => {
    expect(helper).toContain('createHmac("sha256", getRateLimitSecret())');
    expect(helper).toContain("RATE_LIMIT_SECRET");
    expect(helper).toContain("p_identifier_hash: hashIdentifier(identifier)");
    expect(helper).not.toContain('createHash("sha256")');
  });

  it("consuma il limiter soltanto tramite il client service-role", () => {
    expect(helper).toContain("createSupabaseAdminClient()");
    expect(helper).toContain('.rpc("consume_rate_limit"');
  });

  it("fallisce chiuso se il limiter condiviso non è disponibile", () => {
    expect(helper).toContain("new AuthHttpError(");
    expect(helper).toContain("503");
  });

  it("restituisce 429 con Retry-After quando il bucket è esaurito", () => {
    expect(helper).toContain("429");
    expect(helper).toContain('"retry-after"');
    expect(http).toContain("error.headers");
  });

  it("protegge login registrazione e reset tramite rete e account", () => {
    for (const path of [
      "src/app/api/auth/login/route.ts",
      "src/app/api/auth/register/route.ts",
      "src/app/api/auth/password-reset/route.ts",
      "src/app/api/admin/password-reset/route.ts",
    ]) {
      const route = source(path);

      expect(route).toContain("enforceIpRateLimit");
      expect(route).toContain("enforceAccountRateLimit");
    }
  });

  it("applica il bucket account soltanto dopo la normalizzazione dell'input", () => {
    for (const path of [
      "src/app/api/auth/login/route.ts",
      "src/app/api/auth/register/route.ts",
      "src/app/api/auth/password-reset/route.ts",
      "src/app/api/admin/password-reset/route.ts",
    ]) {
      const route = source(path);

      const parseIndex = route.indexOf("await parseAuthInput(");
      const accountLimitIndex = route.indexOf("await enforceAccountRateLimit(");

      expect(parseIndex).toBeGreaterThan(-1);
      expect(accountLimitIndex).toBeGreaterThan(parseIndex);
    }
  });

  it("protegge il checkout dopo l'autenticazione esistente", () => {
    const checkout = source("src/server/checkout/account-checkout.ts");

    const authIndex = checkout.indexOf("await requireAccountUser(client)");

    const limitIndex = checkout.indexOf("await enforceUserRateLimit(");

    expect(authIndex).toBeGreaterThan(-1);
    expect(limitIndex).toBeGreaterThan(authIndex);
  });

  it("protegge la preview promozione dopo l'autenticazione esistente", () => {
    const promotion = source("src/server/checkout/promotion-code-preview.ts");

    const authIndex = promotion.indexOf("await requireAccountUser(client)");

    const limitIndex = promotion.indexOf("await enforceUserRateLimit(");

    expect(authIndex).toBeGreaterThan(-1);
    expect(limitIndex).toBeGreaterThan(authIndex);
  });

  it("protegge la creazione Stripe Session con l'utente autenticato", () => {
    const stripe = source(
      "src/app/api/account/checkout/stripe-session/route.ts",
    );

    const authIndex = stripe.indexOf("userResponse.data.user");

    const limitIndex = stripe.indexOf("await enforceUserRateLimit(");

    expect(authIndex).toBeGreaterThan(-1);
    expect(limitIndex).toBeGreaterThan(authIndex);
    expect(stripe).toContain("rateLimitPolicies.stripeSession");
  });

  it("non applica il limiter utente al webhook Stripe", () => {
    const webhook = source("src/app/api/stripe/webhook/route.ts");

    expect(webhook).not.toContain("enforceUserRateLimit");
    expect(webhook).not.toContain("enforceIpRateLimit");
  });
});
