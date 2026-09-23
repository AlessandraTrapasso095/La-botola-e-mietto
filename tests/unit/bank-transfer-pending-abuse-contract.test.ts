import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("pending bank transfer abuse protection", () => {
  const migration = readFileSync(
    resolve(
      "supabase/migrations/0056_limit_pending_bank_transfer_orders.sql",
    ),
    "utf8",
  );

  it("protegge un account da più bonifici pending attivi", () => {
    expect(migration).toContain(
      "orders_one_pending_bank_transfer_per_profile_uidx",
    );

    expect(migration).toContain(
      "on public.orders(profile_id)",
    );

    expect(migration).toContain(
      "payment_method = 'bank_transfer'",
    );

    expect(migration).toContain(
      "payment_status = 'pending'",
    );

    expect(migration).toContain(
      "reservation_released_at is null",
    );
  });

  it("serializza atomicamente i tentativi dello stesso account", () => {
    expect(migration).toContain(
      "pg_catalog.pg_advisory_xact_lock",
    );

    expect(migration).toContain(
      "pg_catalog.hashtextextended",
    );
  });

  it("controlla la presenza di un bonifico pending prima dell'inserimento", () => {
    expect(migration).toContain(
      "create trigger orders_single_pending_bank_transfer",
    );

    expect(migration).toContain(
      "before insert or update of",
    );

    expect(migration).toContain(
      "existing_order.profile_id = new.profile_id",
    );
  });

  it("non considera bloccante un ordine cancellato o già rilasciato", () => {
    expect(migration).toContain(
      "existing_order.status <> 'cancelled'",
    );

    expect(migration).toContain(
      "existing_order.reservation_released_at is null",
    );
  });

  it("restituisce un errore applicativo comprensibile", () => {
    expect(migration).toContain(
      "Hai già un ordine con bonifico in attesa di pagamento.",
    );
  });

  it("non espone direttamente la funzione trigger agli utenti", () => {
    expect(migration).toContain(
      "from public, anon, authenticated",
    );
  });
});
