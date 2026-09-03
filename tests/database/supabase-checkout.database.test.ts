import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

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

    const login = await primary.auth.signInWithPassword({
      email: primaryEmail,
      password,
    });

    expect(login.error).toBeNull();
  });

  beforeEach(async () => {
    await service.from("offers").delete().eq("product_id", productId);

    await service.from("orders").delete().eq("profile_id", primaryId);

    await service.from("carts").delete().eq("profile_id", primaryId);

    await service
      .from("inventory")
      .update({
        stock_quantity: 10,
        reserved_quantity: 0,
      })
      .eq("product_id", productId);

    await service
      .from("prices")
      .update({
        net_amount_minor: 1_000,
        vat_rate_basis_points: 2_200,
      })
      .eq("product_id", productId)
      .is("valid_to", null);
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

  async function createStripeOrder(quantity = 1) {
    await prepareCart(quantity);

    const result = await primary.rpc("checkout_account_cart", {
      p_shipping_address_id: shippingAddressId,
      p_billing_address_id: billingAddressId,
      p_shipping_method: "tnt",
      p_payment_method: "stripe",
    });

    expect(result.error).toBeNull();
    expect(result.data).toHaveLength(1);

    const order = result.data?.[0];

    if (!order) {
      throw new Error("Ordine Stripe non restituito.");
    }

    return order;
  }

  async function getOrderSourceCart(orderId: string) {
    const result = await service
      .from("orders")
      .select("source_cart_id")
      .eq("id", orderId)
      .single();

    expect(result.error).toBeNull();

    const cartId = result.data?.source_cart_id;

    if (!cartId) {
      throw new Error("Ordine senza source_cart_id.");
    }

    return cartId;
  }

  async function getCart(cartId: string) {
    const result = await service
      .from("carts")
      .select("id, status")
      .eq("id", cartId)
      .single();

    expect(result.error).toBeNull();

    return result.data;
  }

  async function getCartItems(cartId: string) {
    const result = await service
      .from("cart_items")
      .select("product_id, quantity")
      .eq("cart_id", cartId);

    expect(result.error).toBeNull();

    return result.data ?? [];
  }

  async function getInventory() {
    const result = await service
      .from("inventory")
      .select("stock_quantity, reserved_quantity, available_quantity")
      .eq("product_id", productId)
      .single();

    expect(result.error).toBeNull();

    return result.data;
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

  it("Stripe pending mantiene il carrello attivo e pieno", async () => {
    const order = await createStripeOrder(2);

    expect(order.order_number).toMatch(/^LBM-\d{8}-\d{6}$/);
    expect(order.order_status).toBe("received");
    expect(order.payment_status).toBe("pending");
    expect(order.shipping_method).toBe("tnt");
    expect(order.payment_method).toBe("stripe");

    expect(order.subtotal_net_amount_minor).toBe(2_000);
    expect(order.vat_amount_minor).toBe(440);
    expect(order.shipping_gross_amount_minor).toBe(750);
    expect(order.total_gross_amount_minor).toBe(3_190);

    const cartId = await getOrderSourceCart(order.order_id);
    const cart = await getCart(cartId);
    const items = await getCartItems(cartId);

    expect(cart?.status).toBe("active");

    expect(items).toEqual([
      {
        product_id: productId,
        quantity: 2,
      },
    ]);

    expect(await getInventory()).toMatchObject({
      stock_quantity: 10,
      reserved_quantity: 2,
      available_quantity: 8,
    });
  });

  it("un secondo tentativo Stripe riutilizza lo stesso ordine", async () => {
    const first = await createStripeOrder(1);

    const second = await primary.rpc("checkout_account_cart", {
      p_shipping_address_id: shippingAddressId,
      p_billing_address_id: billingAddressId,
      p_shipping_method: "tnt",
      p_payment_method: "stripe",
    });

    expect(second.error).toBeNull();
    expect(second.data).toHaveLength(1);

    expect(second.data?.[0]?.order_id).toBe(first.order_id);
    expect(second.data?.[0]?.order_number).toBe(first.order_number);

    const cartId = await getOrderSourceCart(first.order_id);

    const orderCount = await service
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("source_cart_id", cartId);

    expect(orderCount.error).toBeNull();
    expect(orderCount.count).toBe(1);

    expect(await getInventory()).toMatchObject({
      reserved_quantity: 1,
      available_quantity: 9,
    });
  });

  it("Stripe pagato converte definitivamente il carrello", async () => {
    const order = await createStripeOrder(1);
    const cartId = await getOrderSourceCart(order.order_id);

    const completed = await service.rpc("complete_stripe_order_payment", {
      p_order_id: order.order_id,
      p_checkout_session_id: `cs_test_${testRunId}`,
      p_payment_intent_id: `pi_test_${testRunId}`,
    });

    expect(completed.error).toBeNull();

    const storedOrder = await service
      .from("orders")
      .select(
        "payment_status, stripe_checkout_session_id, stripe_payment_intent_id",
      )
      .eq("id", order.order_id)
      .single();

    expect(storedOrder.error).toBeNull();

    expect(storedOrder.data).toMatchObject({
      payment_status: "paid",
      stripe_checkout_session_id: `cs_test_${testRunId}`,
      stripe_payment_intent_id: `pi_test_${testRunId}`,
    });

    expect((await getCart(cartId))?.status).toBe("converted");
    expect(await getCartItems(cartId)).toEqual([]);
  });

  it("la conferma Stripe è idempotente se il webhook arriva due volte", async () => {
    const order = await createStripeOrder(2);

    const sessionId = `cs_test_idempotent_${testRunId}`;
    const paymentIntentId = `pi_test_idempotent_${testRunId}`;

    const first = await service.rpc("complete_stripe_order_payment", {
      p_order_id: order.order_id,
      p_checkout_session_id: sessionId,
      p_payment_intent_id: paymentIntentId,
    });

    expect(first.error).toBeNull();

    const inventoryAfterFirst = await getInventory();

    const second = await service.rpc("complete_stripe_order_payment", {
      p_order_id: order.order_id,
      p_checkout_session_id: sessionId,
      p_payment_intent_id: paymentIntentId,
    });

    expect(second.error).toBeNull();

    const inventoryAfterSecond = await getInventory();

    expect(inventoryAfterSecond).toEqual(inventoryAfterFirst);

    const cartId = await getOrderSourceCart(order.order_id);

    expect((await getCart(cartId))?.status).toBe("converted");
    expect(await getCartItems(cartId)).toEqual([]);
  });

  it("Stripe fallito mantiene il carrello e libera la prenotazione stock", async () => {
    const order = await createStripeOrder(2);
    const cartId = await getOrderSourceCart(order.order_id);

    expect(await getInventory()).toMatchObject({
      reserved_quantity: 2,
      available_quantity: 8,
    });

    const failed = await service.rpc("fail_stripe_order_payment", {
      p_order_id: order.order_id,
      p_checkout_session_id: `cs_test_failed_${testRunId}`,
    });

    expect(failed.error).toBeNull();

    const storedOrder = await service
      .from("orders")
      .select("payment_status, reservation_released_at")
      .eq("id", order.order_id)
      .single();

    expect(storedOrder.error).toBeNull();
    expect(storedOrder.data?.payment_status).toBe("failed");
    expect(storedOrder.data?.reservation_released_at).not.toBeNull();

    expect((await getCart(cartId))?.status).toBe("active");

    expect(await getCartItems(cartId)).toEqual([
      {
        product_id: productId,
        quantity: 2,
      },
    ]);

    expect(await getInventory()).toMatchObject({
      stock_quantity: 10,
      reserved_quantity: 0,
      available_quantity: 10,
    });

    const repeated = await service.rpc("fail_stripe_order_payment", {
      p_order_id: order.order_id,
      p_checkout_session_id: `cs_test_failed_${testRunId}`,
    });

    expect(repeated.error).toBeNull();

    expect(await getInventory()).toMatchObject({
      reserved_quantity: 0,
      available_quantity: 10,
    });
  });

  it("il bonifico converte immediatamente il carrello", async () => {
    await prepareCart(1);

    const result = await primary.rpc("checkout_account_cart", {
      p_shipping_address_id: shippingAddressId,
      p_billing_address_id: billingAddressId,
      p_shipping_method: "tnt",
      p_payment_method: "bank_transfer",
    });

    expect(result.error).toBeNull();

    const order = result.data?.[0];

    if (!order) {
      throw new Error("Ordine con bonifico non restituito.");
    }

    expect(order.payment_method).toBe("bank_transfer");
    expect(order.payment_status).toBe("pending");

    const cartId = await getOrderSourceCart(order.order_id);

    expect((await getCart(cartId))?.status).toBe("converted");
    expect(await getCartItems(cartId)).toEqual([]);
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

    const order = result.data?.[0];

    if (!order) {
      throw new Error("Ordine Satispay non restituito.");
    }

    const cartId = await getOrderSourceCart(order.order_id);

    expect((await getCart(cartId))?.status).toBe("active");
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
  });

  it("permette di usare lo stesso indirizzo di spedizione anche per la fatturazione", async () => {
    await prepareCart(1);

    const result = await primary.rpc("checkout_account_cart", {
      p_shipping_address_id: shippingAddressId,
      p_billing_address_id: shippingAddressId,
      p_shipping_method: "tnt",
      p_payment_method: "bank_transfer",
    });

    expect(result.error).toBeNull();
    expect(result.data).toHaveLength(1);
  });
});
