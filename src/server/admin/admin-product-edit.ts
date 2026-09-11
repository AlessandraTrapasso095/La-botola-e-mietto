"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getServerAdminUser } from "@/server/admin/admin-user";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

const nullablePositiveInteger = z.union([
  z.number().int().positive(),
  z.null(),
]);

const nullableAlcohol = z.union([z.number().min(0).max(100), z.null()]);

const adminProductEditSchema = z.object({
  productId: z.string().uuid(),
  code: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1).max(300),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(300)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  brandId: z.string().uuid().nullable(),
  categoryId: z.string().uuid(),
  subcategoryId: z.string().uuid().nullable(),
  description: z.string().max(10000),
  tastingNotes: z.string().max(10000),
  serviceNotes: z.string().max(10000),
  origin: z.string().max(500),
  producer: z.string().max(500),
  country: z.string().max(200),
  capacityMl: nullablePositiveInteger,
  capacityLabel: z.string().trim().min(1).max(100),
  packQuantity: nullablePositiveInteger,
  alcoholPercentage: nullableAlcohol,
  isNew: z.boolean(),
  isLimited: z.boolean(),
  netAmountMinor: z.number().int().nonnegative(),
  vatRateBasisPoints: z.number().int().min(0).max(10000),
});

export type AdminProductEditInput = z.infer<typeof adminProductEditSchema>;

export async function updateAdminProduct(input: AdminProductEditInput) {
  const adminUser = await getServerAdminUser();

  if (!adminUser) {
    throw new Error("Accesso amministratore richiesto.");
  }

  const data = adminProductEditSchema.parse(input);

  const admin = createSupabaseAdminClient();

  const { error } = await admin.rpc(
    "admin_update_product" as never,
    {
      p_product_id: data.productId,
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
      throw new Error("Codice o slug già utilizzato da un altro prodotto.");
    }

    throw new Error(`Impossibile aggiornare il prodotto: ${error.message}`);
  }

  revalidatePath("/admin/prodotti");
  revalidatePath(`/admin/prodotti/${data.productId}`);
  revalidatePath(`/prodotti/${data.slug}`);
  revalidatePath("/");
  revalidatePath("/prodotti");
}
