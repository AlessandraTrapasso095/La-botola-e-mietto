import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("legacy Satispay repair", () => {
  const migration = readFileSync(
    resolve(
      "supabase/migrations/0028_retire_legacy_satispay_pending_orders.sql",
    ),
    "utf8",
  );

  it("interviene solo sugli ordini Satispay legacy pending", () => {
    expect(migration).toContain("o.payment_method = 'satispay'");

    expect(migration).toContain("o.payment_status = 'pending'");

    expect(migration).toContain("o.status = 'received'");
  });

  it("interviene solo se il carrello collegato è ancora active", () => {
    expect(migration).toContain("c.status = 'active'");
  });

  it("rilascia le quantità riservate", () => {
    expect(migration).toContain("reserved_quantity = greatest(");

    expect(migration).toContain(
      "inventory.reserved_quantity - reserved.quantity",
    );
  });

  it("annulla il legacy order e libera source_cart_id", () => {
    expect(migration).toContain("status = 'cancelled'");

    expect(migration).toContain("payment_status = 'failed'");

    expect(migration).toContain("source_cart_id = null");
  });

  it("non converte il carrello active", () => {
    expect(migration).not.toContain("update public.carts");
  });
});
