"use server";

import { revalidatePath } from "next/cache";

import { getServerAdminUser } from "@/server/admin/admin-user";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

function mapStockError(message: string) {
  if (message.includes("INVENTORY_STOCK_BELOW_RESERVED")) {
    return "Lo stock totale non può essere inferiore alla quantità riservata.";
  }

  if (message.includes("INVENTORY_STOCK_UNCHANGED")) {
    return "La nuova quantità coincide con lo stock attuale.";
  }

  if (message.includes("PRODUCT_INVENTORY_NOT_FOUND")) {
    return "Magazzino del prodotto non trovato.";
  }

  if (message.includes("INVENTORY_NOTE_INVALID")) {
    return "Inserisci una motivazione compresa tra 3 e 500 caratteri.";
  }

  if (message.includes("INVENTORY_STOCK_INVALID")) {
    return "La quantità di stock inserita non è valida.";
  }

  return `Impossibile aggiornare lo stock: ${message}`;
}

export async function updateAdminProductStock(
  productId: string,
  stockQuantity: number,
  note: string,
) {
  const adminUser = await getServerAdminUser();

  if (!adminUser) {
    throw new Error("Accesso amministratore richiesto.");
  }

  if (!productId) {
    throw new Error("Prodotto non valido.");
  }

  if (!Number.isSafeInteger(stockQuantity) || stockQuantity < 0) {
    throw new Error("La quantità di stock inserita non è valida.");
  }

  const normalizedNote = note.trim();

  if (normalizedNote.length < 3 || normalizedNote.length > 500) {
    throw new Error(
      "Inserisci una motivazione compresa tra 3 e 500 caratteri.",
    );
  }

  const admin = createSupabaseAdminClient();

  const { error } = await admin.rpc("admin_set_product_stock", {
    p_product_id: productId,
    p_stock_quantity: stockQuantity,
    p_note: normalizedNote,
    p_created_by: adminUser.id,
  });

  if (error) {
    throw new Error(mapStockError(error.message));
  }

  revalidatePath("/admin/prodotti");
  revalidatePath(`/admin/prodotti/${productId}`);
  revalidatePath("/");
  revalidatePath("/prodotti");
}
