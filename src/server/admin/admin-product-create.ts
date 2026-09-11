"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getServerAdminUser } from "@/server/admin/admin-user";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

const schema = z.object({
  code: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1).max(500),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(500)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  brandId: z.string().uuid().nullable(),
  categoryId: z.string().uuid(),
  subcategoryId: z.string().uuid().nullable(),
  description: z.string().max(20000),
  tastingNotes: z.string().max(20000),
  serviceNotes: z.string().max(20000),
  origin: z.string().max(500),
  producer: z.string().max(500),
  country: z.string().max(300),
  capacityMl: z.number().int().positive().nullable(),
  capacityLabel: z.string().trim().min(1).max(100),
  packQuantity: z.number().int().positive(),
  alcoholPercentage: z.number().min(0).max(100).nullable(),
  isNew: z.boolean(),
  isLimited: z.boolean(),
  netAmountMinor: z.number().int().nonnegative(),
  vatRateBasisPoints: z.number().int().min(0).max(10000),
});

export type AdminProductCreateInput = z.infer<typeof schema>;

export async function createAdminProduct(input: AdminProductCreateInput) {
  const adminUser = await getServerAdminUser();

  if (!adminUser) {
    throw new Error("Accesso amministratore richiesto.");
  }

  const data = schema.parse(input);
  const admin = createSupabaseAdminClient();

  const { data: productId, error } = await admin.rpc(
    "admin_create_product" as never,
    {
      p_code: data.code,
      p_name: data.name,
      p_slug: data.slug,
      p_brand_id: data.brandId,
      p_category_id: data.categoryId,
      p_subcategory_id: data.subcategoryId,
      p_description: data.description,
      p_tasting_notes: data.tastingNotes,
      p_service_notes: data.serviceNotes,
      p_origin: data.origin,
      p_producer: data.producer,
      p_country: data.country,
      p_capacity_ml: data.capacityMl,
      p_capacity_label: data.capacityLabel,
      p_pack_quantity: data.packQuantity,
      p_alcohol_percentage: data.alcoholPercentage,
      p_is_new: data.isNew,
      p_is_limited: data.isLimited,
      p_net_amount_minor: data.netAmountMinor,
      p_vat_rate_basis_points: data.vatRateBasisPoints,
    } as never,
  );

  if (error) {
    if (
      error.message.includes("duplicate key value violates unique constraint")
    ) {
      throw new Error(
        "Esiste già un prodotto con questo codice o con questo slug.",
      );
    }

    throw new Error(`Impossibile creare il prodotto: ${error.message}`);
  }

  if (!productId || typeof productId !== "string") {
    throw new Error(
      "Il prodotto è stato creato ma non è stato possibile recuperarne l’identificativo.",
    );
  }

  revalidatePath("/admin/prodotti");
  revalidatePath("/prodotti");

  return productId;
}
