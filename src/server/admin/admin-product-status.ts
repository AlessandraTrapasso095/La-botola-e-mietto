"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getServerAdminUser } from "@/server/admin/admin-user";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

const productIdSchema = z.string().uuid();
const productStatusSchema = z.enum(["draft", "active", "archived"]);

function parseProductId(productId: string) {
  const result = productIdSchema.safeParse(productId);

  if (!result.success) {
    throw new Error("Prodotto non valido.");
  }

  return result.data;
}

function parseProductStatus(status: AdminManagedProductStatus) {
  const result = productStatusSchema.safeParse(status);

  if (!result.success) {
    throw new Error("Stato prodotto non valido.");
  }

  return result.data;
}

export type AdminManagedProductStatus = "draft" | "active" | "archived";

const allowedStatuses = new Set<AdminManagedProductStatus>([
  "draft",
  "active",
  "archived",
]);

export async function updateAdminProductStatus(
  productId: string,
  status: AdminManagedProductStatus,
) {
  const adminUser = await getServerAdminUser();

  if (!adminUser) {
    throw new Error("Accesso amministratore richiesto.");
  }

  productId = parseProductId(productId);
  status = parseProductStatus(status);

  if (!allowedStatuses.has(status)) {
    throw new Error("Stato prodotto non valido.");
  }

  const admin = createSupabaseAdminClient();

  const { error } = await admin.rpc(
    "admin_set_product_status" as never,
    {
      p_product_id: productId,
      p_status: status,
    } as never,
  );

  if (error) {
    throw new Error(
      `Impossibile aggiornare lo stato prodotto: ${error.message}`,
    );
  }

  revalidatePath("/admin/prodotti");
  revalidatePath(`/admin/prodotti/${productId}`);
  revalidatePath("/");
  revalidatePath("/prodotti");
}
