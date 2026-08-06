import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { AuthHttpError } from "@/server/auth/http";
import { createSupabaseServerClient } from "@/server/supabase";
import type { Database } from "@/types/database.generated";

type CartRow = {
  slug: string;
  quantity: number;
};

async function requireAccountUser(client: SupabaseClient<Database>) {
  const { data, error } = await client.auth.getUser();

  if (error || !data.user) {
    throw new AuthHttpError(401, "Accesso richiesto.");
  }

  return data.user;
}

function mapCartRows(rows: CartRow[] | null) {
  return {
    items: (rows ?? []).map((row) => ({
      slug: row.slug,
      quantity: row.quantity,
    })),
  };
}

export async function readAccountCart(client: SupabaseClient<Database>) {
  await requireAccountUser(client);

  const { data, error } = await client.rpc("account_cart_lines");

  if (error) {
    throw new AuthHttpError(500, "Carrello non disponibile.");
  }

  return mapCartRows(data);
}

export async function loadCurrentAccountCart() {
  return readAccountCart(await createSupabaseServerClient());
}

export async function addAccountCartProduct(
  client: SupabaseClient<Database>,
  slug: string,
  quantity: number,
) {
  await requireAccountUser(client);

  const { data, error } = await client.rpc("add_account_cart_item", {
    product_slug: slug,
    requested_quantity: quantity,
  });

  if (error) {
    if (error.message.includes("Prodotto non disponibile")) {
      throw new AuthHttpError(404, "Prodotto non disponibile.");
    }

    if (error.message.includes("Quantità non valida")) {
      throw new AuthHttpError(400, "Quantità non valida.");
    }

    throw new AuthHttpError(500, "Aggiornamento del carrello non riuscito.");
  }

  return mapCartRows(data);
}

export async function setAccountCartProductQuantity(
  client: SupabaseClient<Database>,
  slug: string,
  quantity: number,
) {
  await requireAccountUser(client);

  const { data, error } = await client.rpc("set_account_cart_item_quantity", {
    product_slug: slug,
    requested_quantity: quantity,
  });

  if (error) {
    if (error.message.includes("Prodotto non disponibile")) {
      throw new AuthHttpError(404, "Prodotto non disponibile.");
    }

    if (error.message.includes("Quantità non valida")) {
      throw new AuthHttpError(400, "Quantità non valida.");
    }

    throw new AuthHttpError(500, "Aggiornamento del carrello non riuscito.");
  }

  return mapCartRows(data);
}

export async function removeAccountCartProduct(
  client: SupabaseClient<Database>,
  slug: string,
) {
  await requireAccountUser(client);

  const { data, error } = await client.rpc("remove_account_cart_item", {
    product_slug: slug,
  });

  if (error) {
    throw new AuthHttpError(500, "Rimozione dal carrello non riuscita.");
  }

  return mapCartRows(data);
}

export async function mergeAccountCart(
  client: SupabaseClient<Database>,
  items: readonly { slug: string; quantity: number }[],
) {
  await requireAccountUser(client);

  const { data, error } = await client.rpc("merge_account_cart_items", {
    local_items: items.map((item) => ({
      slug: item.slug,
      quantity: item.quantity,
    })),
  });

  if (error) {
    throw new AuthHttpError(500, "Sincronizzazione del carrello non riuscita.");
  }

  return mapCartRows(data);
}
