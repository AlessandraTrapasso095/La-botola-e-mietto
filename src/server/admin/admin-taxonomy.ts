"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getServerAdminUser } from "@/server/admin/admin-user";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

const statusSchema = z.enum(["draft", "active", "archived"]);

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(300)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const brandSchema = z.object({
  id: z.string().uuid().nullable(),
  name: z.string().trim().min(1).max(300),
  slug: slugSchema,
  country: z.string().max(200),
  description: z.string().max(5000),
  status: statusSchema,
});

const categorySchema = z.object({
  id: z.string().uuid().nullable(),
  parentId: z.string().uuid().nullable(),
  name: z.string().trim().min(1).max(300),
  slug: slugSchema,
  description: z.string().max(5000),
  sortOrder: z.number().int().min(0),
  status: statusSchema,
});

export type AdminBrandInput = z.infer<typeof brandSchema>;

export type AdminCategoryInput = z.infer<typeof categorySchema>;

export async function upsertAdminBrand(input: AdminBrandInput) {
  const adminUser = await getServerAdminUser();

  if (!adminUser) {
    throw new Error("Accesso amministratore richiesto.");
  }

  const data = brandSchema.parse(input);
  const admin = createSupabaseAdminClient();

  const { data: result, error } = await admin.rpc(
    "admin_upsert_brand" as never,
    {
      p_id: data.id,
      p_name: data.name,
      p_slug: data.slug,
      p_country: data.country,
      p_description: data.description,
      p_status: data.status,
    } as never,
  );

  if (error) {
    if (
      error.message.includes("duplicate key value violates unique constraint")
    ) {
      throw new Error("Nome o slug del marchio già utilizzato.");
    }

    throw new Error(`Impossibile salvare il marchio: ${error.message}`);
  }

  revalidateTaxonomyPaths();

  return result;
}

export async function upsertAdminCategory(input: AdminCategoryInput) {
  const adminUser = await getServerAdminUser();

  if (!adminUser) {
    throw new Error("Accesso amministratore richiesto.");
  }

  const data = categorySchema.parse(input);
  const admin = createSupabaseAdminClient();

  const { data: result, error } = await admin.rpc(
    "admin_upsert_category" as never,
    {
      p_id: data.id,
      p_parent_id: data.parentId,
      p_name: data.name,
      p_slug: data.slug,
      p_description: data.description,
      p_sort_order: data.sortOrder,
      p_status: data.status,
    } as never,
  );

  if (error) {
    if (
      error.message.includes("duplicate key value violates unique constraint")
    ) {
      throw new Error("Nome o slug della categoria già utilizzato.");
    }

    throw new Error(`Impossibile salvare la categoria: ${error.message}`);
  }

  revalidateTaxonomyPaths();

  return result;
}

function revalidateTaxonomyPaths() {
  revalidatePath("/admin/prodotti");
  revalidatePath("/");
  revalidatePath("/prodotti");
}

export async function deleteAdminBrand(brandId: string) {
  const adminUser = await getServerAdminUser();

  if (!adminUser) {
    throw new Error("Accesso amministratore richiesto.");
  }

  const id = z.string().uuid().parse(brandId);
  const admin = createSupabaseAdminClient();

  const { error } = await admin.rpc(
    "admin_delete_brand" as never,
    {
      p_brand_id: id,
    } as never,
  );

  if (error) {
    if (error.message.includes("BRAND_IN_USE")) {
      throw new Error(
        "Non puoi eliminare questo marchio perché è associato a uno o più prodotti.",
      );
    }

    throw new Error(`Impossibile eliminare il marchio: ${error.message}`);
  }

  revalidateTaxonomyPaths();
}

export async function deleteAdminCategory(categoryId: string) {
  const adminUser = await getServerAdminUser();

  if (!adminUser) {
    throw new Error("Accesso amministratore richiesto.");
  }

  const id = z.string().uuid().parse(categoryId);
  const admin = createSupabaseAdminClient();

  const { error } = await admin.rpc(
    "admin_delete_category" as never,
    {
      p_category_id: id,
    } as never,
  );

  if (error) {
    if (error.message.includes("CATEGORY_HAS_SUBCATEGORIES")) {
      throw new Error(
        "Non puoi eliminare questa categoria perché contiene ancora delle sottocategorie.",
      );
    }

    if (error.message.includes("CATEGORY_IN_USE")) {
      throw new Error(
        "Non puoi eliminare questo elemento perché è associato a uno o più prodotti.",
      );
    }

    throw new Error(`Impossibile eliminare l’elemento: ${error.message}`);
  }

  revalidateTaxonomyPaths();
}
