"use server";

import { revalidatePath } from "next/cache";

import { getServerAdminUser } from "@/server/admin/admin-user";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

function mapOfferError(message: string) {
  if (message.includes("OFFER_DISCOUNT_INVALID")) {
    return "Inserisci una percentuale di sconto compresa tra 1 e 90.";
  }

  if (message.includes("OFFER_PROMOTIONAL_PRICE_INVALID")) {
    return "Il prezzo promozionale calcolato non è valido.";
  }

  if (message.includes("PRODUCT_CURRENT_PRICE_NOT_FOUND")) {
    return "Il prodotto non dispone di un prezzo corrente.";
  }

  if (message.includes("PRODUCT_OFFER_NOT_FOUND")) {
    return "Il prodotto non dispone di un’offerta attiva.";
  }

  if (message.includes("PRODUCT_NOT_FOUND")) {
    return "Prodotto non trovato.";
  }

  if (message.includes("PRODUCT_ID_REQUIRED")) {
    return "Prodotto non valido.";
  }

  return `Impossibile aggiornare l’offerta: ${message}`;
}

function revalidateOfferPaths(productId: string) {
  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/in-offerta");
  revalidatePath("/account");
  revalidatePath("/account/offerte");
  revalidatePath("/prodotto/[slug]", "page");
  revalidatePath("/admin/prodotti");
  revalidatePath(`/admin/prodotti/${productId}`);
}

export async function setAdminProductOffer(
  productId: string,
  discountPercentage: number,
) {
  const adminUser = await getServerAdminUser();

  if (!adminUser) {
    throw new Error("Accesso amministratore richiesto.");
  }

  if (!productId) {
    throw new Error("Prodotto non valido.");
  }

  if (
    !Number.isSafeInteger(discountPercentage) ||
    discountPercentage < 1 ||
    discountPercentage > 90
  ) {
    throw new Error("Inserisci una percentuale di sconto compresa tra 1 e 90.");
  }

  const admin = createSupabaseAdminClient();

  const { data, error } = await admin.rpc("admin_set_product_offer", {
    p_product_id: productId,
    p_discount_percentage: discountPercentage,
  });

  if (error) {
    throw new Error(mapOfferError(error.message));
  }

  revalidateOfferPaths(productId);

  return data;
}

export async function deactivateAdminProductOffer(productId: string) {
  const adminUser = await getServerAdminUser();

  if (!adminUser) {
    throw new Error("Accesso amministratore richiesto.");
  }

  if (!productId) {
    throw new Error("Prodotto non valido.");
  }

  const admin = createSupabaseAdminClient();

  const { data, error } = await admin.rpc("admin_deactivate_product_offer", {
    p_product_id: productId,
  });

  if (error) {
    throw new Error(mapOfferError(error.message));
  }

  revalidateOfferPaths(productId);

  return data;
}
