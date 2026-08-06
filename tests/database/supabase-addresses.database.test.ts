import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { getLocalSupabaseEnvironment } from "@/server/catalog-import/local-supabase";
import type { Database } from "@/types/database.generated";

describe("indirizzi Supabase locali e RLS", () => {
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
  const primaryEmail = "phase2-address-primary@example.test";
  const secondaryEmail = "phase2-address-secondary@example.test";
  const password = "LocalAddress42!Secure";
  let primaryId = "";
  let secondaryId = "";
  let primary = anonymous;

  const addressValues = {
    label_value: "Casa",
    first_name_value: "Livia",
    last_name_value: "Conti",
    company_value: "",
    street_value: "Via Roma",
    street_number_value: "12/A",
    line2_value: "",
    postal_code_value: "35100",
    city_value: "Padova",
    province_value: "PD",
    country_code_value: "IT",
    phone_value: "+39 340 000 0000",
    type_value: "shipping" as const,
    is_default_shipping_value: true,
    is_default_billing_value: true,
  };

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
    primary = createClient<Database>(
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
  });

  afterAll(async () => {
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

  it("nega lettura e scrittura anonime", async () => {
    expect(
      (await anonymous.from("addresses").select("id")).error,
    ).not.toBeNull();
    expect(
      (
        await anonymous.from("addresses").insert({
          profile_id: primaryId,
          type: "shipping",
          label: "Non consentito",
          first_name: "Utente",
          last_name: "Anonimo",
          street: "Via Roma",
          street_number: "1",
          postal_code: "35100",
          city: "Padova",
          province: "PD",
          phone: "+39 340 000 0000",
        })
      ).error,
    ).not.toBeNull();
  });

  it("crea, modifica e legge esclusivamente indirizzi propri", async () => {
    const created = await primary.rpc("upsert_account_address", addressValues);
    expect(created.error).toBeNull();
    expect(created.data).toMatchObject({
      profile_id: primaryId,
      is_default_shipping: true,
      is_default_billing: true,
    });

    const updated = await primary.rpc("upsert_account_address", {
      ...addressValues,
      address_id_value: created.data!.id,
      city_value: "Abano Terme",
    });
    expect(updated.error).toBeNull();
    expect(updated.data?.city).toBe("Abano Terme");

    await service.from("addresses").insert({
      profile_id: secondaryId,
      type: "billing",
      label: "Ufficio",
      first_name: "Marco",
      last_name: "Riva",
      street: "Via Milano",
      street_number: "4",
      postal_code: "20100",
      city: "Milano",
      province: "MI",
      phone: "+39 340 000 0001",
    });
    const visible = await primary.from("addresses").select("profile_id");
    expect(visible.error).toBeNull();
    expect(visible.data).toEqual([{ profile_id: primaryId }]);
  });

  it("sostituisce atomicamente i default di spedizione e fatturazione", async () => {
    const second = await primary.rpc("upsert_account_address", {
      ...addressValues,
      label_value: "Cantina",
      street_value: "Via delle Vigne",
      street_number_value: "18",
      is_default_billing_value: false,
    });
    expect(second.error).toBeNull();

    let defaults = await primary
      .from("addresses")
      .select("id, is_default_shipping, is_default_billing")
      .is("deleted_at", null)
      .order("created_at");
    expect(
      defaults.data?.filter((address) => address.is_default_shipping),
    ).toHaveLength(1);
    expect(
      defaults.data?.find((address) => address.id === second.data?.id),
    ).toMatchObject({
      is_default_shipping: true,
      is_default_billing: false,
    });

    const promoted = await primary.rpc("upsert_account_address", {
      ...addressValues,
      address_id_value: second.data!.id,
      label_value: "Cantina",
      street_value: "Via delle Vigne",
      street_number_value: "18",
    });
    expect(promoted.error).toBeNull();
    defaults = await primary
      .from("addresses")
      .select("id, is_default_shipping, is_default_billing")
      .is("deleted_at", null);
    expect(
      defaults.data?.filter((address) => address.is_default_shipping),
    ).toHaveLength(1);
    expect(
      defaults.data?.filter((address) => address.is_default_billing),
    ).toHaveLength(1);
    expect(
      defaults.data?.find((address) => address.id === second.data?.id),
    ).toMatchObject({
      is_default_shipping: true,
      is_default_billing: true,
    });
  });

  it("impedisce di forzare user_id o modificare indirizzi altrui", async () => {
    const foreignInsert = await primary.from("addresses").insert({
      profile_id: secondaryId,
      type: "shipping",
      label: "Forzato",
      first_name: "Livia",
      last_name: "Conti",
      street: "Via Roma",
      street_number: "1",
      postal_code: "35100",
      city: "Padova",
      province: "PD",
      phone: "+39 340 000 0000",
    });
    expect(foreignInsert.error).not.toBeNull();

    const foreignAddress = await service
      .from("addresses")
      .select("id")
      .eq("profile_id", secondaryId)
      .single();
    const foreignUpdate = await primary
      .from("addresses")
      .update({ city: "Non consentito" })
      .eq("id", foreignAddress.data!.id)
      .select("id");
    expect(foreignUpdate.error).toBeNull();
    expect(foreignUpdate.data).toEqual([]);
  });

  it("elimina senza assegnare automaticamente un nuovo default", async () => {
    const currentDefault = await primary
      .from("addresses")
      .select("id")
      .eq("is_default_shipping", true)
      .is("deleted_at", null)
      .single();
    const removed = await primary.rpc("delete_account_address", {
      address_id_value: currentDefault.data!.id,
    });
    expect(removed.error).toBeNull();
    expect(removed.data).toBe(true);

    const remainingDefaults = await primary
      .from("addresses")
      .select("id")
      .or("is_default_shipping.eq.true,is_default_billing.eq.true")
      .is("deleted_at", null);
    expect(remainingDefaults.data).toEqual([]);
  });
});
