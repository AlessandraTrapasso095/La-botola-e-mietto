import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("Stripe checkout concurrency contract", () => {
  const source = readFileSync(
    resolve("src/server/stripe/order-checkout-session.ts"),
    "utf8",
  );

  it("usa una idempotency key deterministica per la prima sessione dell'ordine", () => {
    expect(source).toContain(
      ": `checkout-session-${order.id}`",
    );
  });

  it("non rende diversa la prima idempotency key tra richieste concorrenti", () => {
    const sessionCreate = source.indexOf(
      "stripe.checkout.sessions.create(",
    );

    expect(sessionCreate).toBeGreaterThan(-1);

    const sessionBlock = source.slice(sessionCreate, sessionCreate + 3200);
    const keyStart = sessionBlock.indexOf("idempotencyKey:");

    expect(keyStart).toBeGreaterThan(-1);

    const keyBlock = sessionBlock.slice(keyStart, keyStart + 350);

    expect(keyBlock).toContain("checkout-session-${order.id}");
    expect(keyBlock).not.toContain("Date.now");
    expect(keyBlock).not.toContain("randomUUID");
    expect(keyBlock).not.toContain("Math.random");
    expect(keyBlock).not.toContain("clock_timestamp");
  });

  it("lega una nuova sessione post-expiration alla precedente sessione", () => {
    expect(source).toContain(
      "`checkout-session-${order.id}-after-${previousSessionId}`",
    );
  });

  it("riutilizza direttamente una sessione Stripe ancora open", () => {
    const openGuard = source.indexOf(
      'if (existingSession.status === "open")',
    );
    const createCall = source.indexOf(
      "stripe.checkout.sessions.create(",
    );

    expect(openGuard).toBeGreaterThan(-1);
    expect(createCall).toBeGreaterThan(openGuard);

    const openBranch = source.slice(openGuard, createCall);

    expect(openBranch).toContain(
      "sessionId: existingSession.id",
    );
    expect(openBranch).toContain(
      "redirectUrl: existingSession.url",
    );
  });

  it("crea una nuova sessione dopo una precedente soltanto se expired", () => {
    const expiredGuard = source.indexOf(
      'if (existingSession.status !== "expired")',
    );
    const createCall = source.indexOf(
      "stripe.checkout.sessions.create(",
    );

    expect(expiredGuard).toBeGreaterThan(-1);
    expect(createCall).toBeGreaterThan(expiredGuard);
  });

  it("salva sul database esclusivamente la sessione restituita da Stripe", () => {
    expect(source).toContain(
      "stripe_checkout_session_id: session.id",
    );
    expect(source).toContain(
      "payment_provider_reference: session.id",
    );
  });

  it("limita l'associazione della sessione all'ordine e al proprietario", () => {
    const updateStart = source.indexOf(
      '.from("orders")\n    .update({',
    );

    expect(updateStart).toBeGreaterThan(-1);

    const updateBlock = source.slice(updateStart, updateStart + 650);

    expect(updateBlock).toContain('.eq("id", order.id)');
    expect(updateBlock).toContain('.eq("profile_id", profileId)');
  });

  it("mantiene il vincolo database di unicità sulle Checkout Session Stripe", () => {
    const references = readFileSync(
      resolve("supabase/migrations/0013_stripe_order_references.sql"),
      "utf8",
    );

    expect(references).toContain(
      "orders_stripe_checkout_session_id_key",
    );
    expect(references).toContain(
      "on public.orders (stripe_checkout_session_id)",
    );
  });
});
