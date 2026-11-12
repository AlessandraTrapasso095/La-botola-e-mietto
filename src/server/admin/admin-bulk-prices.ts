"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getServerAdminUser } from "@/server/admin/admin-user";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

const filtersSchema = z.object({
  query: z.string().max(200).default(""),
  status: z.enum(["all", "active", "draft", "archived"]).default("all"),
  brandId: z.string().uuid().nullable().default(null),
  categoryId: z.string().uuid().nullable().default(null),
  availability: z.enum(["all", "available", "unavailable"]).default("all"),
});

const inputSchema = filtersSchema.extend({
  percentage: z.number().finite().positive().max(100),
});

export type AdminBulkPriceFilters = z.infer<typeof filtersSchema>;

export type AdminBulkPricePreviewItem = {
  productId: string;
  code: string;
  name: string;
  currentNetAmountMinor: number;
  newNetAmountMinor: number;
  vatRateBasisPoints: number;
  hasActiveOffer: boolean;
};

export type AdminBulkPricePreview = {
  totalCount: number;
  activeOfferCount: number;
  items: AdminBulkPricePreviewItem[];
};

async function requireAdmin() {
  const user = await getServerAdminUser();

  if (!user) {
    throw new Error("Accesso amministratore richiesto.");
  }
}

function rpcParams(input: z.infer<typeof inputSchema>) {
  return {
    p_percentage: input.percentage,
    p_query: input.query || null,
    p_status: input.status,
    p_brand_id: input.brandId,
    p_category_id: input.categoryId,
    p_availability: input.availability,
  };
}

export async function previewAdminBulkPriceIncrease(
  rawInput: z.input<typeof inputSchema>,
): Promise<AdminBulkPricePreview> {
  await requireAdmin();

  const input = inputSchema.parse(rawInput);
  const admin = createSupabaseAdminClient();

  const { data, error } = await admin.rpc(
    "admin_preview_bulk_price_increase_v2" as never,
    rpcParams(input) as never,
  );

  if (error) {
    console.error("[admin-bulk-prices] preview failed", { code: error.code });
    throw new Error("Impossibile preparare l’anteprima dei nuovi prezzi.");
  }

  const payload = (data ?? {}) as {
    total_count?: number | string;
    active_offer_count?: number | string;
    items?: Array<{
      product_id: string;
      code: string;
      name: string;
      current_net_amount_minor: number | string;
      new_net_amount_minor: number | string;
      vat_rate_basis_points: number;
      has_active_offer: boolean;
    }>;
  };

  const items = (payload.items ?? []).map((row) => ({
    productId: row.product_id,
    code: row.code,
    name: row.name,
    currentNetAmountMinor: Number(row.current_net_amount_minor),
    newNetAmountMinor: Number(row.new_net_amount_minor),
    vatRateBasisPoints: row.vat_rate_basis_points,
    hasActiveOffer: row.has_active_offer,
  }));

  return {
    totalCount: Number(payload.total_count ?? 0),
    activeOfferCount: Number(payload.active_offer_count ?? 0),
    items,
  };
}

export async function applyAdminBulkPriceIncrease(
  rawInput: z.input<typeof inputSchema>,
): Promise<{ updatedCount: number }> {
  await requireAdmin();

  const input = inputSchema.parse(rawInput);
  const admin = createSupabaseAdminClient();

  const { data, error } = await admin.rpc(
    "admin_apply_bulk_price_increase" as never,
    rpcParams(input) as never,
  );

  if (error) {
    console.error("[admin-bulk-prices] apply failed", { code: error.code });
    throw new Error("Impossibile applicare l’aumento dei prezzi.");
  }

  revalidatePath("/admin/prodotti");
  revalidatePath("/catalogo");
  revalidatePath("/in-offerta");
  revalidatePath("/");

  return { updatedCount: Number(data ?? 0) };
}
