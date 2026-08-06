import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { CheckoutInput, CheckoutResult } from "@/lib/validation/checkout";
import { AuthHttpError } from "@/server/auth/http";
import { createSupabaseServerClient } from "@/server/supabase";
import type { Database } from "@/types/database.generated";

async function requireAccountUser(client: SupabaseClient<Database>) {
  const { data, error } = await client.auth.getUser();

  if (error || !data.user) {
    throw new AuthHttpError(401, "Accesso richiesto.");
  }

  return data.user;
}

function mapCheckoutResult(
  row: Database["public"]["Functions"]["checkout_account_cart"]["Returns"][number],
): CheckoutResult {
  return {
    orderId: row.order_id,
    orderNumber: row.order_number,
    orderStatus: row.order_status,
    paymentStatus: row.payment_status,
    shippingMethod: row.shipping_method,
    paymentMethod: row.payment_method,
    subtotalNetAmountMinor: row.subtotal_net_amount_minor,
    vatAmountMinor: row.vat_amount_minor,
    shippingGrossAmountMinor: row.shipping_gross_amount_minor,
    totalGrossAmountMinor: row.total_gross_amount_minor,
    createdAt: row.created_at,
  };
}

function checkoutError(error: { message: string }) {
  const message = error.message;

  if (message.includes("Carrello vuoto")) {
    return new AuthHttpError(400, "Il carrello è vuoto.");
  }

  if (message.includes("Indirizzo di spedizione non valido")) {
    return new AuthHttpError(
      400,
      "L’indirizzo di spedizione selezionato non è disponibile.",
    );
  }

  if (message.includes("Indirizzo di fatturazione non valido")) {
    return new AuthHttpError(
      400,
      "L’indirizzo di fatturazione selezionato non è disponibile.",
    );
  }

  if (
    message.includes(
      "Uno o più prodotti non sono più disponibili nella quantità richiesta",
    )
  ) {
    return new AuthHttpError(
      409,
      "Uno o più prodotti non sono più disponibili nella quantità richiesta.",
    );
  }

  if (message.includes("Metodo di spedizione non valido")) {
    return new AuthHttpError(400, "Metodo di spedizione non valido.");
  }

  if (message.includes("Metodo di pagamento non valido")) {
    return new AuthHttpError(400, "Metodo di pagamento non valido.");
  }

  return new AuthHttpError(
    500,
    "Non è stato possibile completare il checkout.",
  );
}

export async function checkoutAccountCart(
  client: SupabaseClient<Database>,
  input: CheckoutInput,
): Promise<CheckoutResult> {
  await requireAccountUser(client);

  const shippingAddressId =
    input.shippingMethod === "store_pickup"
      ? input.billingAddressId
      : input.shippingAddressId;

  if (!shippingAddressId) {
    throw new AuthHttpError(400, "Seleziona un indirizzo di spedizione.");
  }

  const { data, error } = await client.rpc("checkout_account_cart", {
    p_shipping_address_id: shippingAddressId,
    p_billing_address_id: input.billingAddressId,
    p_shipping_method: input.shippingMethod,
    p_payment_method: input.paymentMethod,
  });

  if (error) {
    throw checkoutError(error);
  }

  const result = data?.[0];

  if (!result) {
    throw new AuthHttpError(
      500,
      "Il checkout non ha restituito un ordine valido.",
    );
  }

  return mapCheckoutResult(result);
}

export async function checkoutCurrentAccountCart(input: CheckoutInput) {
  return checkoutAccountCart(await createSupabaseServerClient(), input);
}
