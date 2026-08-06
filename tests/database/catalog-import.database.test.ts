import { existsSync } from "node:fs";
import path from "node:path";

import { createClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { readCatalogSource } from "@/server/catalog-import/catalog-source";
import {
  createCatalogDatabaseClient,
  importCatalogToDatabase,
} from "@/server/catalog-import/catalog-database";
import { getLocalSupabaseEnvironment } from "@/server/catalog-import/local-supabase";
import type { CatalogImportSource } from "@/server/catalog-import/types";
import type { Database } from "@/types/database.generated";

const rootDirectory = process.cwd();
const workbookPath = path.join(
  rootDirectory,
  "reference-private/catalog/listino_completo_la_botola.xlsx",
);
const canRunDatabaseTests = existsSync(workbookPath);

describe.skipIf(!canRunDatabaseTests)("database catalogo locale", () => {
  const environment = getLocalSupabaseEnvironment();
  const database = createCatalogDatabaseClient(environment.DB_URL);
  let source: CatalogImportSource;

  beforeAll(async () => {
    source = await readCatalogSource({
      workbookPath,
      sourceImageDirectory: path.join(
        rootDirectory,
        "reference-private/product-images/immagini_prodotti",
      ),
      publicDirectory: path.join(rootDirectory, "public"),
    });
  });

  afterAll(async () => {
    await database.end();
  });

  it("mantiene la seconda importazione idempotente", async () => {
    await importCatalogToDatabase(source, {
      databaseUrl: environment.DB_URL,
      runId: "database-test-first",
    });
    const secondRun = await importCatalogToDatabase(source, {
      databaseUrl: environment.DB_URL,
      runId: "database-test-second",
    });

    expect(secondRun.products).toMatchObject({
      created: 0,
      updated: 0,
      unchanged: 2123,
    });
    expect(secondRun.prices.unchanged).toBe(2123);
    expect(secondRun.inventories.unchanged).toBe(2122);
    expect(secondRun.databaseCounts.products).toBe(2123);
  });

  it("lascia AB1293 senza inventario e AB6837 senza immagine", async () => {
    const [state] = await database<
      [
        {
          duplicate_inventory: number;
          ak47_images: number;
          ak47_products: number;
        },
      ]
    >`
      select
        (
          select count(*)::int from public.inventory
          join public.products on products.id = inventory.product_id
          where products.code = 'AB1293'
        ) as duplicate_inventory,
        (
          select count(*)::int from public.product_images
          join public.products on products.id = product_images.product_id
          where products.code = 'AB6837'
        ) as ak47_images,
        (
          select count(*)::int from public.products where code = 'AB6837'
        ) as ak47_products
    `;

    expect(state).toEqual({
      duplicate_inventory: 0,
      ak47_images: 0,
      ak47_products: 1,
    });
  });

  it("esegue rollback completo in caso di errore critico", async () => {
    const reference = source.rows[0];
    expect(reference).toBeDefined();
    if (!reference) return;

    const conflictingSource: CatalogImportSource = {
      rowsRead: 1,
      duplicateCodes: [],
      issues: [],
      rows: [
        {
          ...reference,
          rowNumber: 2,
          code: "ROLLBACK001",
          name: "Prodotto rollback",
          brandSlug: "rollback-brand",
          brandName: "Rollback Brand",
        },
      ],
    };

    await expect(
      importCatalogToDatabase(conflictingSource, {
        databaseUrl: environment.DB_URL,
        runId: "rollback-test",
      }),
    ).rejects.toThrow();

    const [state] = await database<[{ brands: number; products: number }]>`
      select
        (select count(*)::int from public.brands where slug = 'rollback-brand') as brands,
        (select count(*)::int from public.products where code = 'ROLLBACK001') as products
    `;
    expect(state).toEqual({ brands: 0, products: 0 });
  });
});

describe.skipIf(!canRunDatabaseTests)("RLS locale", () => {
  const environment = getLocalSupabaseEnvironment();
  const authOptions = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  } as const;
  const anonymous = createClient<Database>(
    environment.API_URL,
    environment.ANON_KEY,
    authOptions,
  );
  const service = createClient<Database>(
    environment.API_URL,
    environment.SERVICE_ROLE_KEY,
    authOptions,
  );
  const userIds: string[] = [];

  afterAll(async () => {
    if (userIds.length) {
      await service.from("orders").delete().in("profile_id", userIds);
    }
    for (const userId of userIds) {
      await service.auth.admin.deleteUser(userId);
    }
  });

  it("espone solo il catalogo attivo e nega modifiche anonime", async () => {
    const { data, error } = await anonymous
      .from("products")
      .select("id, code")
      .limit(1);
    expect(error).toBeNull();
    expect(data).toHaveLength(1);

    const { error: updateError } = await anonymous
      .from("products")
      .update({ name: "Modifica anonima" })
      .eq("code", "AB6837");
    expect(updateError).not.toBeNull();
  });

  it("isola carrelli, wishlist e ordini tra utenti", async () => {
    const password = "Local-only-password-42!";
    const emails = [
      "phase2-user-one@example.test",
      "phase2-user-two@example.test",
    ];
    const users = [];

    for (const email of emails) {
      const { data, error } = await service.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      expect(error).toBeNull();
      expect(data.user).not.toBeNull();
      if (data.user) {
        users.push(data.user);
        userIds.push(data.user.id);
      }
    }
    expect(users).toHaveLength(2);
    const [firstUser, secondUser] = users;
    if (!firstUser || !secondUser) return;

    const { error: cartError } = await service
      .from("carts")
      .insert([{ profile_id: firstUser.id }, { profile_id: secondUser.id }]);
    expect(cartError).toBeNull();
    expect(
      (
        await service
          .from("wishlists")
          .insert([{ profile_id: firstUser.id }, { profile_id: secondUser.id }])
      ).error,
    ).toBeNull();
    expect(
      (
        await service.from("orders").insert([
          {
            order_number: "LOCAL-RLS-ONE",
            profile_id: firstUser.id,
            subtotal_net_amount_minor: 1000,
            vat_amount_minor: 220,
            shipping_gross_amount_minor: 0,
            total_gross_amount_minor: 1220,
            shipping_address: {},
            billing_address: {},
          },
          {
            order_number: "LOCAL-RLS-TWO",
            profile_id: secondUser.id,
            subtotal_net_amount_minor: 2000,
            vat_amount_minor: 440,
            shipping_gross_amount_minor: 0,
            total_gross_amount_minor: 2440,
            shipping_address: {},
            billing_address: {},
          },
        ])
      ).error,
    ).toBeNull();

    const firstClient = createClient<Database>(
      environment.API_URL,
      environment.ANON_KEY,
      authOptions,
    );
    expect(
      (
        await firstClient.auth.signInWithPassword({
          email: emails[0] ?? "",
          password,
        })
      ).error,
    ).toBeNull();

    const [carts, wishlists, orders, adminCarts] = await Promise.all([
      firstClient.from("carts").select("profile_id"),
      firstClient.from("wishlists").select("profile_id"),
      firstClient.from("orders").select("profile_id"),
      service.from("carts").select("profile_id"),
    ]);

    expect(carts.data?.map((row) => row.profile_id)).toEqual([firstUser.id]);
    expect(wishlists.data?.map((row) => row.profile_id)).toEqual([
      firstUser.id,
    ]);
    expect(orders.data?.map((row) => row.profile_id)).toEqual([firstUser.id]);
    expect(adminCarts.data).toHaveLength(2);
  });
});
