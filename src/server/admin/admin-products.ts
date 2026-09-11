import "server-only";

import { createSupabaseAdminClient } from "@/server/supabase-admin";

export type AdminProductListItem = {
  id: string;
  code: string;
  name: string;
  status: string;
  brandName: string | null;
  categoryName: string | null;
  stockQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
};

export async function getAdminProducts(): Promise<AdminProductListItem[]> {
  const admin = createSupabaseAdminClient();

  const response = await admin
    .from("products")
    .select(
      `
      id,
      code,
      name,
      status,
      deleted_at,
      brands (
        name
      ),
      categories!products_category_id_fkey (
        name
      ),
      inventory (
        stock_quantity,
        reserved_quantity,
        available_quantity
      )
    `,
    )
    .is("deleted_at", null)
    .order("name", { ascending: true })
    .limit(250);

  if (response.error) {
    throw new Error(
      `Impossibile caricare i prodotti admin: ${response.error.message}`,
    );
  }

  return (response.data ?? []).map((product) => {
    const brand = Array.isArray(product.brands)
      ? product.brands[0]
      : product.brands;

    const category = Array.isArray(product.categories)
      ? product.categories[0]
      : product.categories;

    const inventory = Array.isArray(product.inventory)
      ? product.inventory[0]
      : product.inventory;

    return {
      id: product.id,
      code: product.code,
      name: product.name,
      status: product.status,
      brandName: brand?.name ?? null,
      categoryName: category?.name ?? null,
      stockQuantity: inventory?.stock_quantity ?? 0,
      reservedQuantity: inventory?.reserved_quantity ?? 0,
      availableQuantity: inventory?.available_quantity ?? 0,
    };
  });
}
