import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { getLocalSupabaseEnvironment } from "@/server/catalog-import/local-supabase";
import type { Database } from "@/types/database.generated";

describe("wishlist Supabase locale e RLS", () => {
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
  const primaryEmail = "phase2-wishlist-primary@example.test";
  const secondaryEmail = "phase2-wishlist-secondary@example.test";
  const password = "LocalWishlist42!Secure";
  const inactiveCode = "WISHLIST-INACTIVE";
  let primaryId = "";
  let secondaryId = "";
  let inactiveProductId = "";
  let primary = anonymous;
  let secondary = anonymous;

  beforeAll(async () => {
    const existing = await database<{ id: string }[]>`
      select id::text from auth.users
      where email in (${primaryEmail}, ${secondaryEmail})
    `;
    for (const user of existing) await service.auth.admin.deleteUser(user.id);

    const [primaryUser, secondaryUser] = await Promise.all([
      service.auth.admin.createUser({
        email: primaryEmail,
        password,
        email_confirm: true,
        user_metadata: { first_name: "Livia", last_name: "Conti" },
      }),
      service.auth.admin.createUser({
        email: secondaryEmail,
        password,
        email_confirm: true,
        user_metadata: { first_name: "Marco", last_name: "Riva" },
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
    const inactive = await service
      .from("products")
      .insert({
        code: inactiveCode,
        name: "Prodotto tecnico inattivo",
        slug: "prodotto-tecnico-inattivo",
        category_id: category.data!.id,
        capacity_label: "70 cl",
        status: "draft",
      })
      .select("id")
      .single();
    expect(inactive.error).toBeNull();
    inactiveProductId = inactive.data?.id ?? "";

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
    if (inactiveProductId) {
      await service.from("products").delete().eq("id", inactiveProductId);
    }
    for (const userId of [primaryId, secondaryId].filter(Boolean)) {
      await service.auth.admin.deleteUser(userId);
    }
    const [remaining] = await database<{ count: number }[]>`
      select count(*)::int as count from auth.users
      where email in (${primaryEmail}, ${secondaryEmail})
    `;
    expect(remaining?.count).toBe(0);
    await database.end();
  });

  it("nega accesso anonimo e non accetta identità dal browser", async () => {
    expect(
      (await anonymous.rpc("account_wishlist_slugs")).error,
    ).not.toBeNull();
    expect(
      (
        await anonymous.rpc("merge_account_wishlist", {
          product_slugs: ["caprisius"],
        })
      ).error,
    ).not.toBeNull();

    const forcedIdentity = await primary.from("wishlists").insert({
      profile_id: secondaryId,
    });
    expect(forcedIdentity.error).not.toBeNull();
    expect(
      (await anonymous.from("wishlists").select("id")).error,
    ).not.toBeNull();
    expect((await anonymous.from("carts").select("id")).error).not.toBeNull();
    expect((await anonymous.from("orders").select("id")).error).not.toBeNull();
  });

  it("mantiene i prodotti inattivi fuori dal catalogo pubblico", async () => {
    const hiddenProduct = await anonymous
      .from("catalog_products_view")
      .select("slug")
      .eq("slug", "prodotto-tecnico-inattivo");
    expect(hiddenProduct.error).toBeNull();
    expect(hiddenProduct.data).toEqual([]);
  });

  it("aggiunge una sola volta anche con richieste simultanee", async () => {
    const responses = await Promise.all([
      primary.rpc("merge_account_wishlist", {
        product_slugs: ["caprisius", "caprisius"],
      }),
      primary.rpc("merge_account_wishlist", {
        product_slugs: ["caprisius"],
      }),
    ]);
    expect(responses.every((response) => response.error === null)).toBe(true);

    const wishlist = await primary.rpc("account_wishlist_slugs");
    expect(wishlist.error).toBeNull();
    expect(wishlist.data).toEqual([{ slug: "caprisius" }]);
    const items = await service
      .from("wishlist_items")
      .select("wishlist_id, product_id", { count: "exact" })
      .eq(
        "wishlist_id",
        (
          await service
            .from("wishlists")
            .select("id")
            .eq("profile_id", primaryId)
            .single()
        ).data!.id,
      );
    expect(items.count).toBe(1);
  });

  it("esclude prodotti inesistenti e inattivi durante il merge", async () => {
    const merged = await primary.rpc("merge_account_wishlist", {
      product_slugs: [
        "caprisius",
        "prodotto-inesistente",
        "prodotto-tecnico-inattivo",
      ],
    });
    expect(merged.error).toBeNull();
    expect(merged.data).toEqual([{ slug: "caprisius" }]);
  });

  it("isola gli utenti e persiste dopo un nuovo login", async () => {
    const secondaryMerge = await secondary.rpc("merge_account_wishlist", {
      product_slugs: ["glen-grant-12yo-0-70-2-bicchieri"],
    });
    expect(secondaryMerge.error).toBeNull();

    const primaryVisible = await primary.rpc("account_wishlist_slugs");
    const secondaryVisible = await secondary.rpc("account_wishlist_slugs");
    expect(primaryVisible.data).toEqual([{ slug: "caprisius" }]);
    expect(secondaryVisible.data).toEqual([
      { slug: "glen-grant-12yo-0-70-2-bicchieri" },
    ]);

    const secondaryWishlist = await service
      .from("wishlists")
      .select("id")
      .eq("profile_id", secondaryId)
      .single();
    expect(secondaryWishlist.error).toBeNull();
    const foreignItems = await primary
      .from("wishlist_items")
      .select("product_id")
      .eq("wishlist_id", secondaryWishlist.data!.id);
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
    expect((await primary.rpc("account_wishlist_slugs")).data).toEqual([
      { slug: "caprisius" },
    ]);
  });

  it("rimuove il prodotto senza alterare wishlist altrui", async () => {
    const removed = await primary.rpc("remove_account_wishlist_item", {
      product_slug: "caprisius",
    });
    expect(removed.error).toBeNull();
    expect(removed.data).toEqual([]);
    expect((await secondary.rpc("account_wishlist_slugs")).data).toEqual([
      { slug: "glen-grant-12yo-0-70-2-bicchieri" },
    ]);
  });
});
