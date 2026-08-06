import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

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

function mapSlugs(rows: { slug: string }[] | null) {
  return { slugs: (rows ?? []).map((row) => row.slug) };
}

export async function readAccountWishlist(client: SupabaseClient<Database>) {
  await requireAccountUser(client);
  const { data, error } = await client.rpc("account_wishlist_slugs");
  if (error) {
    throw new AuthHttpError(500, "Preferiti non disponibili.");
  }
  return mapSlugs(data);
}

export async function loadCurrentAccountWishlist() {
  return readAccountWishlist(await createSupabaseServerClient());
}

export async function mergeAccountWishlist(
  client: SupabaseClient<Database>,
  slugs: readonly string[],
) {
  await requireAccountUser(client);
  const { data, error } = await client.rpc("merge_account_wishlist", {
    product_slugs: [...slugs],
  });
  if (error) {
    throw new AuthHttpError(
      500,
      "Sincronizzazione dei preferiti non riuscita.",
    );
  }
  return mapSlugs(data);
}

export async function addAccountWishlistProduct(
  client: SupabaseClient<Database>,
  slug: string,
) {
  const wishlist = await mergeAccountWishlist(client, [slug]);
  if (!wishlist.slugs.includes(slug)) {
    throw new AuthHttpError(404, "Prodotto non disponibile.");
  }
  return wishlist;
}

export async function removeAccountWishlistProduct(
  client: SupabaseClient<Database>,
  slug: string,
) {
  await requireAccountUser(client);
  const { data, error } = await client.rpc("remove_account_wishlist_item", {
    product_slug: slug,
  });
  if (error) {
    throw new AuthHttpError(500, "Rimozione dai preferiti non riuscita.");
  }
  return mapSlugs(data);
}
