import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { getLocalSupabaseEnvironment } from "@/server/catalog-import/local-supabase";
import type { Database } from "@/types/database.generated";

describe("checkout Supabase locale e RLS", () => {
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

  const testRunId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const primaryEmail = `phase2-checkout-primary-${testRunId}@example.test`;
  const secondaryEmail = `phase2-checkout-secondary-${testRunId}@example.test`;
  const password = "LocalCheckout42!Secure";

  const productCode = `CHECKOUT-TECHNICAL-${testRunId}`;
  const productSlug = `prodotto-tecnico-checkout-${testRunId}`;

  let primaryId = "";
  let secondaryId = "";
  let productId = "";
  let shippingAddressId = "";
  let billingAddressId = "";
  let secondaryBillingAddressId = "";

  let primary = anonymous;

  beforeAll(async () => {
    const existing = await database<{ id: string }[]>`
      select id::text
      from auth.users
      where email in (${primaryEmail}, ${secondaryEmail})
    `;

    for (const user of existing) {
      await service.auth.admin.deleteUser(user.id);
    }

    await service.from("products").delete().eq("code", productCode);

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

    const product = await service
      .from("products")
      .insert({
        code: productCode,
        name: "Prodotto tecnico checkout",
        slug: productSlug,
        category_id: category.data!.id,
        capacity_label: "70 cl",
        status: "active",
      })
      .select("id")
      .single();

    expect(product.error).toBeNull();
    productId = product.data?.id ?? "";

    const inventory = await service.from("inventory").insert({
      product_id: productId,
      stock_quantity: 10,
      reserved_quantity: 0,
    });

    expect(inventory.error).toBeNull();

    const price = await service.from("prices").insert({
      product_id: productId,
      net_amount_minor: 1_000,
      vat_rate_basis_points: 2_200,
      currency: "EUR",
    });

    expect(price.error).toBeNull();

    const primaryAddresses = await service
      .from("addresses")
      .insert([
        {
          profile_id: primaryId,
          type: "shipping",
          label: "Casa",
          first_name: "Livia",
          last_name: "Conti",
          street: "Via Roma",
          street_number: "1",
          phone: "+39 333 000 0001",
          postal_code: "00100",
          city: "Roma",
          province: "RM",
          country_code: "IT",
          is_default_shipping: true,
          is_default_billing: false,
        },
        {
          profile_id: primaryId,
          type: "billing",
          label: "Casa",
          first_name: "Livia",
          last_name: "Conti",
          street: "Via Roma",
          street_number: "1",
          phone: "+39 333 000 0001",
          postal_code: "00100",
          city: "Roma",
          province: "RM",
          country_code: "IT",
          is_default_shipping: false,
          is_default_billing: true,
        },
      ])
      .select("id, type");

    expect(primaryAddresses.error).toBeNull();

    shippingAddressId =
      primaryAddresses.data?.find((address) => address.type === "shipping")
        ?.id ?? "";

    billingAddressId =
      primaryAddresses.data?.find((address) => address.type === "billing")
        ?.id ?? "";

    const secondaryAddress = await service
      .from("addresses")
      .insert({
        profile_id: secondaryId,
        type: "billing",
        label: "Casa",
        first_name: "Marco",
        last_name: "Riva",
        street: "Via Milano",
        street_number: "2",
        phone: "+39 333 000 0002",
        postal_code: "20100",
        city: "Milano",
        province: "MI",
        country_code: "IT",
        is_default_shipping: false,
        is_default_billing: true,
      })
      .select("id")
      .single();

    expect(secondaryAddress.error).toBeNull();
    secondaryBillingAddressId = secondaryAddress.data?.id ?? "";

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

    if (productId) {
      await service.from("products").delete().eq("id", productId);
    }

    await database.end();
  });

  async function prepareCart(quantity: number) {
    const result = await primary.rpc("set_account_cart_item_quantity", {
      product_slug: productSlug,
      requested_quantity: quantity,
    });

    expect(result.error).toBeNull();
  }

  it("nega il checkout all'utente anonimo", async () => {
    const result = await anonymous.rpc("checkout_account_cart", {
      p_shipping_address_id: shippingAddressId,
      p_billing_address_id: billingAddressId,
      p_shipping_method: "tnt",
      p_payment_method: "stripe",
    });

    expect(result.error).not.toBeNull();
  });

  it("rifiuta un indirizzo appartenente a un altro utente", async () => {
    await prepareCart(1);

    const result = await primary.rpc("checkout_account_cart", {
      p_shipping_address_id: shippingAddressId,
      p_billing_address_id: secondaryBillingAddressId,
      p_shipping_method: "tnt",
      p_payment_method: "bank_transfer",
    });

    expect(result.error).not.toBeNull();
    expect(result.error?.message).toContain(
      "Indirizzo di fatturazione non valido",
    );
  });

  it("crea un ordine TNT con spedizione a 7,50 euro", async () => {
    await prepareCart(2);

    const result = await primary.rpc("checkout_account_cart", {
      p_shipping_address_id: shippingAddressId,
      p_billing_address_id: billingAddressId,
      p_shipping_method: "tnt",
      p_payment_method: "stripe",
    });

    expect(result.error).toBeNull();
    expect(result.data).toHaveLength(1);

    const order = result.data?.[0];

    expect(order).toBeDefined();

    if (!order) {
      throw new Error("Ordine non restituito dal checkout.");
    }

    expect(order.order_number).toMatch(/^LBM-\d{8}-\d{6}$/);
    expect(order.order_status).toBe("received");
    expect(order.payment_status).toBe("pending");
    expect(order.shipping_method).toBe("tnt");
    expect(order.payment_method).toBe("stripe");
    expect(order.subtotal_net_amount_minor).toBe(2_000);
    expect(order.vat_amount_minor).toBe(440);
    expect(order.shipping_gross_amount_minor).toBe(750);
    expect(order.total_gross_amount_minor).toBe(3_190);

    const storedOrder = await primary
      .from("orders")
      .select(
        "id, shipping_address, billing_address, shipping_method, payment_method",
      )
      .eq("id", order.order_id)
      .single();

    expect(storedOrder.error).toBeNull();
    expect(storedOrder.data?.shipping_method).toBe("tnt");
    expect(storedOrder.data?.payment_method).toBe("stripe");

    const items = await primary
      .from("order_items")
      .select(
        "product_code, product_name, quantity, unit_net_amount_minor, vat_rate_basis_points, unit_gross_amount_minor, line_gross_amount_minor",
      )
      .eq("order_id", order.order_id);

    expect(items.error).toBeNull();
    expect(items.data).toEqual([
      {
        product_code: productCode,
        product_name: "Prodotto tecnico checkout",
        quantity: 2,
        unit_net_amount_minor: 1_000,
        vat_rate_basis_points: 2_200,
        unit_gross_amount_minor: 1_220,
        line_gross_amount_minor: 2_440,
      },
    ]);

    const inventory = await service
      .from("inventory")
      .select("stock_quantity, reserved_quantity, available_quantity")
      .eq("product_id", productId)
      .single();

    expect(inventory.error).toBeNull();
    expect(inventory.data).toMatchObject({
      stock_quantity: 10,
      reserved_quantity: 2,
      available_quantity: 8,
    });

    expect((await primary.rpc("account_cart_lines")).data).toEqual([]);
  });

  it("applica la spedizione gratuita TNT da 60 euro", async () => {
    await service
      .from("prices")
      .update({
        net_amount_minor: 5_000,
        vat_rate_basis_points: 2_200,
      })
      .eq("product_id", productId)
      .is("valid_to", null);

    await prepareCart(1);

    const result = await primary.rpc("checkout_account_cart", {
      p_shipping_address_id: shippingAddressId,
      p_billing_address_id: billingAddressId,
      p_shipping_method: "tnt",
      p_payment_method: "bank_transfer",
    });

    expect(result.error).toBeNull();
    expect(result.data?.[0]).toMatchObject({
      subtotal_net_amount_minor: 5_000,
      vat_amount_minor: 1_100,
      shipping_gross_amount_minor: 0,
      total_gross_amount_minor: 6_100,
    });
  });

  it("mantiene gratuito il ritiro in negozio", async () => {
    await service
      .from("prices")
      .update({
        net_amount_minor: 1_000,
        vat_rate_basis_points: 2_200,
      })
      .eq("product_id", productId)
      .is("valid_to", null);

    await prepareCart(1);

    const result = await primary.rpc("checkout_account_cart", {
      p_shipping_address_id: shippingAddressId,
      p_billing_address_id: billingAddressId,
      p_shipping_method: "store_pickup",
      p_payment_method: "satispay",
    });

    expect(result.error).toBeNull();
    expect(result.data?.[0]).toMatchObject({
      shipping_method: "store_pickup",
      payment_method: "satispay",
      subtotal_net_amount_minor: 1_000,
      vat_amount_minor: 220,
      shipping_gross_amount_minor: 0,
      total_gross_amount_minor: 1_220,
    });
  });

  it("applica il prezzo promozionale attivo", async () => {
    const offer = await service
      .from("offers")
      .insert({
        product_id: productId,
        promotional_net_amount_minor: 800,
        is_active: true,
      })
      .select("id")
      .single();

    expect(offer.error).toBeNull();

    await prepareCart(1);

    const result = await primary.rpc("checkout_account_cart", {
      p_shipping_address_id: shippingAddressId,
      p_billing_address_id: billingAddressId,
      p_shipping_method: "store_pickup",
      p_payment_method: "bank_transfer",
    });

    expect(result.error).toBeNull();
    expect(result.data?.[0]).toMatchObject({
      subtotal_net_amount_minor: 800,
      vat_amount_minor: 176,
      total_gross_amount_minor: 976,
    });

    await service.from("offers").delete().eq("id", offer.data!.id);
  });

  it("non consente di convertire due volte lo stesso carrello", async () => {
    await prepareCart(1);

    const first = await primary.rpc("checkout_account_cart", {
      p_shipping_address_id: shippingAddressId,
      p_billing_address_id: billingAddressId,
      p_shipping_method: "store_pickup",
      p_payment_method: "bank_transfer",
    });

    expect(first.error).toBeNull();

    const second = await primary.rpc("checkout_account_cart", {
      p_shipping_address_id: shippingAddressId,
      p_billing_address_id: billingAddressId,
      p_shipping_method: "store_pickup",
      p_payment_method: "bank_transfer",
    });

    expect(second.error).not.toBeNull();
    expect(second.error?.message).toContain("Carrello vuoto");
  });
});
