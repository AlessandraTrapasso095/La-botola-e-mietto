import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("Stripe stale webhook session contract", () => {
  const migration = readFileSync(
    resolve(
      "supabase/migrations/0054_ignore_stale_stripe_failure_events.sql",
    ),
    "utf8",
  );

  it("mantiene la RPC fail Stripe security definer con search_path vuoto", () => {
    expect(migration).toContain(
      "create or replace function public.fail_stripe_order_payment",
    );
    expect(migration).toContain("security definer");
    expect(migration).toContain("set search_path = ''");
  });

  it("ignora un failure riferito a una sessione Stripe non più corrente", () => {
    expect(migration).toContain(
      "v_order.stripe_checkout_session_id is not null",
    );
    expect(migration).toContain(
      "v_order.stripe_checkout_session_id <> p_checkout_session_id",
    );

    const mismatchStart = migration.indexOf(
      "v_order.stripe_checkout_session_id <> p_checkout_session_id",
    );

    const returnFalse = migration.indexOf(
      "return false;",
      mismatchStart,
    );

    const inventoryMutation = migration.indexOf(
      "update public.inventory",
      mismatchStart,
    );

    expect(mismatchStart).toBeGreaterThan(-1);
    expect(returnFalse).toBeGreaterThan(mismatchStart);
    expect(inventoryMutation).toBeGreaterThan(returnFalse);
  });

  it("non altera il comportamento di una failure della sessione corrente", () => {
    expect(migration).toContain(
      "if v_order.reservation_released_at is null then",
    );
    expect(migration).toContain("payment_status = 'failed'");
    expect(migration).toContain("reservation_released_at = now()");
  });

  it("mantiene il pagamento già completato immune da failure successivi", () => {
    expect(migration).toContain(
      "if v_order.payment_status = 'paid' then",
    );
  });

  it("mantiene la RPC riservata al service role", () => {
    expect(migration).toContain(
      "from public, anon, authenticated;",
    );
    expect(migration).toContain("to service_role;");
  });
});
