import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { getLocalSupabaseEnvironment } from "@/server/catalog-import/local-supabase";
import type { Database } from "@/types/database.generated";

describe("carrello Supabase locale e RLS", () => {
  const environment = getLocalSupabaseEnvironment();
  const database = postgres(environment.DB_URL, { max: 1 });

  const options = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  } as const;

  const anonymous = createClient<Database>(
    environment.API_URL,
    environment.ANON_KEY,
    options,
  );

  const service = createClient<Database>(
    environment.API_URL,
    environment.SERVICE_ROLE_KEY,
    options,
  );

  const primaryEmail = "phase2-cart-primary@example.test";
  const secondaryEmail = "phase2-cart-secondary@example.test";
  const password = "LocalCart42!Secure";

  const availableCode = "CART-AVAILABLE";
  const availableSlug = "prodotto-tecnico-carrello";
  const inactiveCode = "CART-INACTIVE";
  const inactiveSlug = "prodotto-tecnico-carrello-inattivo";

  let primaryId = "";
  let secondaryId = "";
  let availableProductId = "";
  let inactiveProductId = "";

  let primary = anonymous;
  let secondary = anonymous;

  beforeAll(async () => {
    const existing = await database<{ id: string }[]>`
      select id::text
      from auth.users
      where email in (${primaryEmail}, ${secondaryEmail})
    `;

    for (const user of existing) {
      await service.auth.admin.deleteUser(user.id);
    }

    await service
      .from("products")
      .delete()
      .in("code", [availableCode, inactiveCode]);

    const [primaryUser, secondaryUser] = await Promise.all([
      service.auth.admin.createUser({
        email: primaryEmail,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: "Livia",
          last_name: "Conti",
        },
      }),
      service.auth.admin.createUser({
        email: secondaryEmail,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: "Marco",
          last_name: "Riva",
        },
      }),
    ]);

    expect(primaryUser.error).toBeNull();
    expect(secondaryUser.error).toBeNull();

    primaryId = primaryUser.data.user?.id ?? "";
    secondaryId = secondaryUser.data.user?.id ?? "";

    const category = await service
      .from("categories")
      .select("id")
      .is("parent_id", null)
      .eq("status", "active")
      .limit(1)
      .single();

    expect(category.error).toBeNull();

    const availableProduct = await service
      .from("products")
      .insert({
        code: availableCode,
        name: "Prodotto tecnico carrello",
        slug: availableSlug,
        category_id: category.data!.id,
        capacity_label: "70 cl",
        status: "active",
      })
      .select("id")
      .single();

    expect(availableProduct.error).toBeNull();
    availableProductId = availableProduct.data?.id ?? "";

    const inactiveProduct = await service
      .from("products")
      .insert({
        code: inactiveCode,
        name: "Prodotto tecnico carrello inattivo",
        slug: inactiveSlug,
        category_id: category.data!.id,
        capacity_label: "70 cl",
        status: "draft",
      })
      .select("id")
      .single();

    expect(inactiveProduct.error).toBeNull();
    inactiveProductId = inactiveProduct.data?.id ?? "";

    const inventoryInsert = await service.from("inventory").insert([
      {
        product_id: availableProductId,
        stock_quantity: 3,
        reserved_quantity: 0,
      },
      {
        product_id: inactiveProductId,
        stock_quantity: 5,
        reserved_quantity: 0,
      },
    ]);

    expect(inventoryInsert.error).toBeNull();

    primary = createClient<Database>(
      environment.API_URL,
      environment.ANON_KEY,
      options,
    );

    secondary = createClient<Database>(
      environment.API_URL,
      environment.ANON_KEY,
      options,
    );

    expect(
      (
        await primary.auth.signInWithPassword({
          email: primaryEmail,
          password,
        })
      ).error,
    ).toBeNull();

    expect(
      (
        await secondary.auth.signInWithPassword({
          email: secondaryEmail,
          password,
        })
      ).error,
    ).toBeNull();
  });

  afterAll(async () => {
    for (const userId of [primaryId, secondaryId].filter(Boolean)) {
      await service.auth.admin.deleteUser(userId);
    }

    if (availableProductId || inactiveProductId) {
      await service
        .from("products")
        .delete()
        .in("id", [availableProductId, inactiveProductId].filter(Boolean));
    }

    const [remainingUsers] = await database<{ count: number }[]>`
      select count(*)::int as count
      from auth.users
      where email in (${primaryEmail}, ${secondaryEmail})
    `;

    const [remainingProducts] = await database<{ count: number }[]>`
      select count(*)::int as count
      from public.products
      where code in (${availableCode}, ${inactiveCode})
    `;

    expect(remainingUsers?.count).toBe(0);
    expect(remainingProducts?.count).toBe(0);

    await database.end();
  });

  it("nega accesso anonimo e impedisce di forzare un altro utente", async () => {
    expect((await anonymous.rpc("account_cart_lines")).error).not.toBeNull();

    expect(
      (
        await anonymous.rpc("merge_account_cart_items", {
          local_items: [
            {
              slug: availableSlug,
              quantity: 1,
            },
          ],
        })
      ).error,
    ).not.toBeNull();

    const forcedCart = await primary.from("carts").insert({
      profile_id: secondaryId,
      status: "active",
      currency: "EUR",
    });

    expect(forcedCart.error).not.toBeNull();
    expect((await anonymous.from("carts").select("id")).error).not.toBeNull();
    expect(
      (await anonymous.from("cart_items").select("cart_id")).error,
    ).not.toBeNull();
  });

  it("crea automaticamente il carrello e aggiunge un prodotto", async () => {
    const added = await primary.rpc("add_account_cart_item", {
      product_slug: availableSlug,
      requested_quantity: 1,
    });

    expect(added.error).toBeNull();
    expect(added.data).toEqual([
      {
        slug: availableSlug,
        quantity: 1,
      },
    ]);

    const cart = await service
      .from("carts")
      .select("id, profile_id, status, currency")
      .eq("profile_id", primaryId)
      .eq("status", "active")
      .single();

    expect(cart.error).toBeNull();
    expect(cart.data?.profile_id).toBe(primaryId);
    expect(cart.data?.currency).toBe("EUR");
  });

  it("incrementa la quantità senza superare la disponibilità", async () => {
    const incremented = await primary.rpc("add_account_cart_item", {
      product_slug: availableSlug,
      requested_quantity: 2,
    });

    expect(incremented.error).toBeNull();
    expect(incremented.data).toEqual([
      {
        slug: availableSlug,
        quantity: 3,
      },
    ]);

    const capped = await primary.rpc("add_account_cart_item", {
      product_slug: availableSlug,
      requested_quantity: 2,
    });

    expect(capped.error).toBeNull();
    expect(capped.data).toEqual([
      {
        slug: availableSlug,
        quantity: 3,
      },
    ]);
  });

  it("imposta una quantità esatta e rimuove con quantità zero", async () => {
    const changed = await primary.rpc("set_account_cart_item_quantity", {
      product_slug: availableSlug,
      requested_quantity: 2,
    });

    expect(changed.error).toBeNull();
    expect(changed.data).toEqual([
      {
        slug: availableSlug,
        quantity: 2,
      },
    ]);

    const removed = await primary.rpc("set_account_cart_item_quantity", {
      product_slug: availableSlug,
      requested_quantity: 0,
    });

    expect(removed.error).toBeNull();
    expect(removed.data).toEqual([]);
  });

  it("esclude prodotti inesistenti e inattivi durante il merge", async () => {
    const merged = await primary.rpc("merge_account_cart_items", {
      local_items: [
        {
          slug: availableSlug,
          quantity: 2,
        },
        {
          slug: "prodotto-inesistente",
          quantity: 1,
        },
        {
          slug: inactiveSlug,
          quantity: 1,
        },
      ],
    });

    expect(merged.error).toBeNull();
    expect(merged.data).toEqual([
      {
        slug: availableSlug,
        quantity: 2,
      },
    ]);
  });

  it("rende il merge idempotente e non raddoppia le quantità", async () => {
    const firstMerge = await primary.rpc("merge_account_cart_items", {
      local_items: [
        {
          slug: availableSlug,
          quantity: 3,
        },
        {
          slug: availableSlug,
          quantity: 2,
        },
      ],
    });

    expect(firstMerge.error).toBeNull();
    expect(firstMerge.data).toEqual([
      {
        slug: availableSlug,
        quantity: 3,
      },
    ]);

    const secondMerge = await primary.rpc("merge_account_cart_items", {
      local_items: [
        {
          slug: availableSlug,
          quantity: 3,
        },
      ],
    });

    expect(secondMerge.error).toBeNull();
    expect(secondMerge.data).toEqual([
      {
        slug: availableSlug,
        quantity: 3,
      },
    ]);
  });

  it("isola i carrelli tra utenti e persiste dopo un nuovo login", async () => {
    const secondaryCart = await secondary.rpc(
      "set_account_cart_item_quantity",
      {
        product_slug: availableSlug,
        requested_quantity: 1,
      },
    );

    expect(secondaryCart.error).toBeNull();
    expect(secondaryCart.data).toEqual([
      {
        slug: availableSlug,
        quantity: 1,
      },
    ]);

    const primaryVisible = await primary.rpc("account_cart_lines");
    const secondaryVisible = await secondary.rpc("account_cart_lines");

    expect(primaryVisible.data).toEqual([
      {
        slug: availableSlug,
        quantity: 3,
      },
    ]);

    expect(secondaryVisible.data).toEqual([
      {
        slug: availableSlug,
        quantity: 1,
      },
    ]);

    const secondaryDatabaseCart = await service
      .from("carts")
      .select("id")
      .eq("profile_id", secondaryId)
      .eq("status", "active")
      .single();

    expect(secondaryDatabaseCart.error).toBeNull();

    const foreignItems = await primary
      .from("cart_items")
      .select("product_id, quantity")
      .eq("cart_id", secondaryDatabaseCart.data!.id);

    expect(foreignItems.error).toBeNull();
    expect(foreignItems.data).toEqual([]);

    await primary.auth.signOut();

    expect(
      (
        await primary.auth.signInWithPassword({
          email: primaryEmail,
          password,
        })
      ).error,
    ).toBeNull();

    expect((await primary.rpc("account_cart_lines")).data).toEqual([
      {
        slug: availableSlug,
        quantity: 3,
      },
    ]);
  });

  it("rimuove un prodotto senza alterare il carrello altrui", async () => {
    const removed = await primary.rpc("remove_account_cart_item", {
      product_slug: availableSlug,
    });

    expect(removed.error).toBeNull();
    expect(removed.data).toEqual([]);

    expect((await secondary.rpc("account_cart_lines")).data).toEqual([
      {
        slug: availableSlug,
        quantity: 1,
      },
    ]);
  });
});
