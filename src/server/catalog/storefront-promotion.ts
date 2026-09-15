import "server-only";

import { createSupabaseAdminClient } from "@/server/supabase-admin";

export type StorefrontPromotion = {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  currency: string;
  minimumOrderGrossAmountMinor: number;
};

export async function getStorefrontPromotion(): Promise<StorefrontPromotion | null> {
  const admin = createSupabaseAdminClient();
  const now = new Date();

  const codesResponse = await admin
    .from("promotion_codes")
    .select(
      `
        id,
        code,
        discount_type,
        discount_value,
        currency,
        minimum_order_gross_amount_minor,
        starts_at,
        ends_at,
        usage_limit,
        created_at
      `,
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (codesResponse.error) {
    throw new Error(
      `Impossibile caricare la promozione storefront: ${codesResponse.error.message}`,
    );
  }

  const candidates = (codesResponse.data ?? []).filter((promotion) => {
    if (promotion.starts_at && new Date(promotion.starts_at) > now) {
      return false;
    }

    if (promotion.ends_at && new Date(promotion.ends_at) <= now) {
      return false;
    }

    return true;
  });

  if (candidates.length === 0) {
    return null;
  }

  const ids = candidates.map((promotion) => promotion.id);

  const usageResponse = await admin
    .from("orders")
    .select("promotion_code_id,status,payment_status")
    .in("promotion_code_id", ids)
    .neq("status", "cancelled")
    .in("payment_status", ["pending", "authorized", "paid"]);

  if (usageResponse.error) {
    throw new Error(
      `Impossibile verificare gli utilizzi delle promozioni storefront: ${usageResponse.error.message}`,
    );
  }

  const usageCountByCode = new Map<string, number>();

  for (const order of usageResponse.data ?? []) {
    if (!order.promotion_code_id) {
      continue;
    }

    usageCountByCode.set(
      order.promotion_code_id,
      (usageCountByCode.get(order.promotion_code_id) ?? 0) + 1,
    );
  }

  const promotion = candidates.find((candidate) => {
    if (candidate.usage_limit === null) {
      return true;
    }

    return (usageCountByCode.get(candidate.id) ?? 0) < candidate.usage_limit;
  });

  if (!promotion) {
    return null;
  }

  if (
    promotion.discount_type !== "percentage" &&
    promotion.discount_type !== "fixed"
  ) {
    return null;
  }

  return {
    code: promotion.code,
    discountType: promotion.discount_type,
    discountValue: Number(promotion.discount_value),
    currency: promotion.currency,
    minimumOrderGrossAmountMinor: Number(
      promotion.minimum_order_gross_amount_minor,
    ),
  };
}
