import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { getLocalSupabaseEnvironment } from "@/server/catalog-import/local-supabase";
import type { Database } from "@/types/database.generated";

describe("Supabase Auth locale e RLS account", () => {
  const environment = getLocalSupabaseEnvironment();
  const database = postgres(environment.DB_URL, { max: 1 });
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
  const primaryEmail = "phase2-auth-primary@example.test";
  const secondaryEmail = "phase2-auth-secondary@example.test";
  const weakPasswordEmail = "phase2-auth-weak@example.test";
  const password = "LocalAuth42!Secure";
  const userIds: string[] = [];

  beforeAll(async () => {
    const existing = await database<{ id: string }[]>`
      select id::text
      from auth.users
      where email in (${primaryEmail}, ${secondaryEmail}, ${weakPasswordEmail})
    `;
    for (const user of existing) {
      await service.auth.admin.deleteUser(user.id);
    }
  });

  afterAll(async () => {
    const technicalUsers = await database<{ id: string }[]>`
      select id::text
      from auth.users
      where email in (${primaryEmail}, ${secondaryEmail}, ${weakPasswordEmail})
    `;
    for (const user of technicalUsers) {
      await service.auth.admin.deleteUser(user.id);
    }
    const [remaining] = await database<{ count: number }[]>`
      select count(*)::int as count
      from auth.users
      where email in (${primaryEmail}, ${secondaryEmail}, ${weakPasswordEmail})
    `;
    expect(remaining?.count).toBe(0);
    await database.end();
  });

  it("registra profilo e consensi separati con conferma email richiesta", async () => {
    const { data, error } = await anonymous.auth.signUp({
      email: primaryEmail,
      password,
      options: {
        data: {
          first_name: "Livia",
          last_name: "Conti",
          privacy_consent: true,
          adult_confirmation: true,
          marketing_consent: false,
          policy_version: "local-auth-v1",
        },
      },
    });
    expect(error).toBeNull();
    expect(data.session).toBeNull();
    expect(data.user).not.toBeNull();
    if (!data.user) return;
    userIds.push(data.user.id);

    const [profile, consents] = await Promise.all([
      service
        .from("profiles")
        .select("first_name, last_name, email, marketing_consent")
        .eq("id", data.user.id)
        .single(),
      service
        .from("consent_records")
        .select("type, granted")
        .eq("profile_id", data.user.id)
        .order("type"),
    ]);
    expect(profile.error).toBeNull();
    expect(profile.data).toMatchObject({
      first_name: "Livia",
      last_name: "Conti",
      email: primaryEmail,
      marketing_consent: false,
    });
    expect(consents.data).toEqual(
      expect.arrayContaining([
        { type: "age_confirmation", granted: true },
        { type: "marketing", granted: false },
        { type: "privacy", granted: true },
      ]),
    );
    expect(consents.data).toHaveLength(3);
  });

  it("non duplica email esistenti e rifiuta password deboli", async () => {
    const duplicate = await anonymous.auth.signUp({
      email: primaryEmail,
      password,
    });
    expect([
      null,
      "over_email_send_rate_limit",
      "user_already_exists",
    ]).toContain(duplicate.error?.code ?? null);

    const [count] = await database<{ count: number }[]>`
      select count(*)::int as count from auth.users where email = ${primaryEmail}
    `;
    expect(count?.count).toBe(1);

    const weakPassword = await anonymous.auth.signUp({
      email: weakPasswordEmail,
      password: "password",
    });
    expect(weakPassword.error).not.toBeNull();
  });

  it("gestisce login, profilo proprio e preferenze senza esporre altri utenti", async () => {
    const primaryId = userIds[0];
    expect(primaryId).toBeDefined();
    if (!primaryId) return;
    expect(
      (
        await service.auth.admin.updateUserById(primaryId, {
          email_confirm: true,
        })
      ).error,
    ).toBeNull();

    const secondary = await service.auth.admin.createUser({
      email: secondaryEmail,
      password,
      email_confirm: true,
      user_metadata: { first_name: "Marco", last_name: "Riva" },
    });
    expect(secondary.error).toBeNull();
    expect(secondary.data.user).not.toBeNull();
    if (!secondary.data.user) return;
    userIds.push(secondary.data.user.id);

    const wrongLogin = await anonymous.auth.signInWithPassword({
      email: primaryEmail,
      password: "WrongPassword42!",
    });
    expect(wrongLogin.error).not.toBeNull();

    const primaryClient = createClient<Database>(
      environment.API_URL,
      environment.ANON_KEY,
      authOptions,
    );
    expect(
      (
        await primaryClient.auth.signInWithPassword({
          email: primaryEmail,
          password,
        })
      ).error,
    ).toBeNull();

    const ownProfiles = await primaryClient
      .from("profiles")
      .select("id, first_name");
    expect(ownProfiles.error).toBeNull();
    expect(ownProfiles.data).toEqual([{ id: primaryId, first_name: "Livia" }]);

    const foreignUpdate = await primaryClient
      .from("profiles")
      .update({ first_name: "Non consentito" })
      .eq("id", secondary.data.user.id)
      .select("id");
    expect(foreignUpdate.error).toBeNull();
    expect(foreignUpdate.data).toEqual([]);

    const ownUpdate = await primaryClient
      .from("profiles")
      .update({ first_name: "Olivia", phone: "+39 340 000 0000" })
      .eq("id", primaryId)
      .select("first_name, phone")
      .single();
    expect(ownUpdate.error).toBeNull();
    expect(ownUpdate.data).toEqual({
      first_name: "Olivia",
      phone: "+39 340 000 0000",
    });

    const preferences = await primaryClient.rpc("update_account_preferences", {
      marketing_consent_value: true,
      email_updates_value: false,
      policy_version_value: "local-auth-v1",
    });
    expect(preferences.error).toBeNull();
    expect(preferences.data?.marketing_consent).toBe(true);
    expect(preferences.data?.email_updates).toBe(false);

    const visibleConsents = await primaryClient
      .from("consent_records")
      .select("profile_id, type, granted")
      .order("created_at");
    expect(visibleConsents.error).toBeNull();
    expect(
      visibleConsents.data?.every((record) => record.profile_id === primaryId),
    ).toBe(true);
    expect(
      visibleConsents.data?.some(
        (record) => record.type === "marketing" && record.granted,
      ),
    ).toBe(true);
  });

  it("nega all’utente anonimo tutte le tabelle account private", async () => {
    for (const table of [
      "profiles",
      "addresses",
      "consent_records",
      "wishlists",
      "wishlist_items",
      "carts",
      "cart_items",
      "orders",
      "order_items",
    ] as const) {
      const response = await anonymous.from(table).select("*").limit(1);
      expect(response.error, table).not.toBeNull();
    }
  });
});
