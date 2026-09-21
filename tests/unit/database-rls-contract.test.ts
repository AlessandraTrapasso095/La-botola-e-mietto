import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

function migration(file: string) {
  return fs.readFileSync(
    path.join(process.cwd(), "supabase/migrations", file),
    "utf8",
  );
}

const foundation = migration("0001_foundation.sql");
const localAuth = migration("0004_local_auth.sql");
const projection = migration("0008_catalog_projection.sql");
const emailDeliveries = migration("0027_email_delivery_log.sql");
const inventoryMovements = migration(
  "0041_inventory_fulfillment_integrity.sql",
);
const promotionCodes = migration("0044_promotion_codes.sql");
const marketingCampaigns = migration("0048_email_marketing_campaigns.sql");

describe("database RLS security contract", () => {
  it("mantiene RLS attiva sulle tabelle fondamentali", () => {
    const tables = [
      "profiles",
      "addresses",
      "brands",
      "categories",
      "products",
      "product_images",
      "inventory",
      "prices",
      "offers",
      "wishlists",
      "wishlist_items",
      "carts",
      "cart_items",
      "orders",
      "order_items",
      "consent_records",
    ];

    for (const table of tables) {
      expect(foundation).toContain(
        `alter table public.${table} enable row level security;`,
      );
    }
  });

  it("limita i dati account al proprietario autenticato", () => {
    expect(foundation).toContain('create policy "Users read own profile"');
    expect(foundation).toContain("using (id = auth.uid())");

    expect(foundation).toContain('create policy "Users manage own addresses"');
    expect(foundation).toContain(
      "using (profile_id = auth.uid()) with check (profile_id = auth.uid())",
    );

    expect(foundation).toContain('create policy "Users read own orders"');
    expect(foundation).toContain("using (profile_id = auth.uid());");

    expect(localAuth).toContain('create policy "Users record own consents"');
    expect(localAuth).toContain("profile_id = auth.uid()");
  });

  it("mantiene il catalogo pubblico in sola lettura", () => {
    expect(foundation).toContain(
      "grant select on public.products to anon, authenticated;",
    );
    expect(foundation).toContain(
      "grant select on public.inventory to anon, authenticated;",
    );
    expect(foundation).toContain(
      "grant select on public.prices to anon, authenticated;",
    );
    expect(foundation).toContain(
      "grant select on public.offers to anon, authenticated;",
    );

    expect(foundation).not.toContain("grant insert on public.products to anon");
    expect(foundation).not.toContain(
      "grant update on public.products to authenticated",
    );
    expect(foundation).not.toContain(
      "grant delete on public.products to authenticated",
    );
  });

  it("mantiene privata la projection interna del catalogo", () => {
    expect(projection).toContain(
      "revoke all on public.catalog_products_source_view from anon, authenticated;",
    );

    expect(projection).toContain(
      "revoke all on public.catalog_products_projection from anon, authenticated;",
    );

    expect(projection).toContain(
      "with (security_invoker = false, security_barrier = true)",
    );

    expect(projection).toContain(
      "grant select on public.catalog_products_view to anon, authenticated;",
    );
  });

  it("mantiene email deliveries service-role only", () => {
    expect(emailDeliveries).toContain("enable row level security;");

    expect(emailDeliveries).toContain("from anon, authenticated;");

    expect(emailDeliveries).toContain("to service_role;");
  });

  it("mantiene inventory movements service-role only", () => {
    expect(inventoryMovements).toContain(
      "alter table public.inventory_movements enable row level security;",
    );

    expect(inventoryMovements).toContain("from public, anon, authenticated;");

    expect(inventoryMovements).toContain("to service_role;");
  });

  it("mantiene promotion codes non accessibili direttamente al client", () => {
    expect(promotionCodes).toContain("alter table public.promotion_codes");

    expect(promotionCodes).toContain("enable row level security;");

    expect(promotionCodes).toContain("from anon, authenticated;");
  });

  it("mantiene lo storico marketing service-role only", () => {
    expect(marketingCampaigns).toContain(
      "alter table public.email_marketing_campaigns",
    );

    expect(marketingCampaigns).toContain("enable row level security;");

    expect(marketingCampaigns).toContain("from public, anon, authenticated;");

    expect(marketingCampaigns).toContain("to service_role;");
  });
});
