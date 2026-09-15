"use server";

import { revalidatePath } from "next/cache";

import { getServerAdminUser } from "@/server/admin/admin-user";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

export type AdminPromotionCodeDiscountType = "percentage" | "fixed";

export type AdminPromotionCode = {
  id: string;
  code: string;
  description: string | null;
  discountType: AdminPromotionCodeDiscountType;
  discountValue: number;
  currency: string;
  minimumOrderGrossAmountMinor: number;
  startsAt: string | null;
  endsAt: string | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminPromotionCodeInput = {
  code: string;
  description?: string | null;
  discountType: AdminPromotionCodeDiscountType;
  discountValue: number;
  minimumOrderGrossAmountMinor?: number;
  startsAt?: string | null;
  endsAt?: string | null;
  usageLimit?: number | null;
  isActive?: boolean;
};

function normalizeNullableText(value: string | null | undefined) {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}

function normalizeCode(value: string) {
  return value.trim().toUpperCase();
}

function normalizeDate(value: string | null | undefined) {
  const normalized = normalizeNullableText(value);

  if (!normalized) {
    return null;
  }

  const parsed = new Date(normalized);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Inserisci una data valida.");
  }

  return parsed.toISOString();
}

function validatePromotionCodeInput(input: AdminPromotionCodeInput) {
  const code = normalizeCode(input.code);

  if (!/^[A-Z0-9_-]{3,32}$/.test(code)) {
    throw new Error(
      "Il codice deve contenere da 3 a 32 caratteri: lettere, numeri, trattino o underscore.",
    );
  }

  if (input.discountType !== "percentage" && input.discountType !== "fixed") {
    throw new Error("Tipo di sconto non valido.");
  }

  if (!Number.isSafeInteger(input.discountValue) || input.discountValue <= 0) {
    throw new Error("Inserisci un valore di sconto valido.");
  }

  if (input.discountType === "percentage" && input.discountValue > 90) {
    throw new Error(
      "La percentuale di sconto deve essere compresa tra 1 e 90.",
    );
  }

  const minimumOrderGrossAmountMinor = input.minimumOrderGrossAmountMinor ?? 0;

  if (
    !Number.isSafeInteger(minimumOrderGrossAmountMinor) ||
    minimumOrderGrossAmountMinor < 0
  ) {
    throw new Error("L’importo minimo ordine non è valido.");
  }

  const usageLimit = input.usageLimit ?? null;

  if (
    usageLimit !== null &&
    (!Number.isSafeInteger(usageLimit) || usageLimit <= 0)
  ) {
    throw new Error(
      "Il limite di utilizzi deve essere un numero intero maggiore di zero.",
    );
  }

  const startsAt = normalizeDate(input.startsAt);
  const endsAt = normalizeDate(input.endsAt);

  if (
    startsAt &&
    endsAt &&
    new Date(endsAt).getTime() <= new Date(startsAt).getTime()
  ) {
    throw new Error(
      "La data di fine deve essere successiva alla data di inizio.",
    );
  }

  return {
    code,
    description: normalizeNullableText(input.description),
    discountType: input.discountType,
    discountValue: input.discountValue,
    minimumOrderGrossAmountMinor,
    startsAt,
    endsAt,
    usageLimit,
    isActive: input.isActive ?? true,
  };
}

function mapPromotionCodeError(error: { message: string; code?: string }) {
  if (
    error.code === "23505" ||
    error.message.toLowerCase().includes("duplicate")
  ) {
    return "Esiste già un codice promozionale con questo codice.";
  }

  return `Impossibile aggiornare il codice promozionale: ${error.message}`;
}

async function requireAdmin() {
  const adminUser = await getServerAdminUser();

  if (!adminUser) {
    throw new Error("Accesso amministratore richiesto.");
  }

  return adminUser;
}

function revalidatePromotionCodePaths() {
  revalidatePath("/admin/sconti");
  revalidatePath("/checkout");
}

export async function getAdminPromotionCodes(): Promise<AdminPromotionCode[]> {
  await requireAdmin();

  const admin = createSupabaseAdminClient();

  const codesResponse = await admin
    .from("promotion_codes")
    .select(
      `
        id,
        code,
        description,
        discount_type,
        discount_value,
        currency,
        minimum_order_gross_amount_minor,
        starts_at,
        ends_at,
        usage_limit,
        is_active,
        created_at,
        updated_at
      `,
    )
    .order("created_at", { ascending: false });

  if (codesResponse.error) {
    throw new Error(
      `Impossibile caricare i codici promozionali: ${codesResponse.error.message}`,
    );
  }

  const rows = codesResponse.data ?? [];
  const ids = rows.map((row) => row.id);

  const usageCountByPromotionCode = new Map<string, number>();

  if (ids.length > 0) {
    const usageResponse = await admin
      .from("orders")
      .select("promotion_code_id,status,payment_status")
      .in("promotion_code_id", ids)
      .neq("status", "cancelled")
      .in("payment_status", ["pending", "authorized", "paid"]);

    if (usageResponse.error) {
      throw new Error(
        `Impossibile caricare gli utilizzi dei codici promozionali: ${usageResponse.error.message}`,
      );
    }

    for (const order of usageResponse.data ?? []) {
      if (!order.promotion_code_id) {
        continue;
      }

      usageCountByPromotionCode.set(
        order.promotion_code_id,
        (usageCountByPromotionCode.get(order.promotion_code_id) ?? 0) + 1,
      );
    }
  }

  return rows.map((row) => ({
    id: row.id,
    code: row.code,
    description: row.description,
    discountType: row.discount_type as AdminPromotionCodeDiscountType,
    discountValue: Number(row.discount_value),
    currency: row.currency,
    minimumOrderGrossAmountMinor: Number(row.minimum_order_gross_amount_minor),
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    usageLimit: row.usage_limit,
    usageCount: usageCountByPromotionCode.get(row.id) ?? 0,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function createAdminPromotionCode(input: AdminPromotionCodeInput) {
  await requireAdmin();

  const normalized = validatePromotionCodeInput(input);

  const admin = createSupabaseAdminClient();

  const { data, error } = await admin
    .from("promotion_codes")
    .insert({
      code: normalized.code,
      description: normalized.description,
      discount_type: normalized.discountType,
      discount_value: normalized.discountValue,
      currency: "EUR",
      minimum_order_gross_amount_minor: normalized.minimumOrderGrossAmountMinor,
      starts_at: normalized.startsAt,
      ends_at: normalized.endsAt,
      usage_limit: normalized.usageLimit,
      is_active: normalized.isActive,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(mapPromotionCodeError(error));
  }

  revalidatePromotionCodePaths();

  return data.id;
}

export async function updateAdminPromotionCode(
  promotionCodeId: string,
  input: AdminPromotionCodeInput,
) {
  await requireAdmin();

  if (!promotionCodeId) {
    throw new Error("Codice promozionale non valido.");
  }

  const normalized = validatePromotionCodeInput(input);

  const admin = createSupabaseAdminClient();

  const { data, error } = await admin
    .from("promotion_codes")
    .update({
      code: normalized.code,
      description: normalized.description,
      discount_type: normalized.discountType,
      discount_value: normalized.discountValue,
      minimum_order_gross_amount_minor: normalized.minimumOrderGrossAmountMinor,
      starts_at: normalized.startsAt,
      ends_at: normalized.endsAt,
      usage_limit: normalized.usageLimit,
      is_active: normalized.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", promotionCodeId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(mapPromotionCodeError(error));
  }

  if (!data) {
    throw new Error("Codice promozionale non trovato.");
  }

  revalidatePromotionCodePaths();

  return data.id;
}

export async function setAdminPromotionCodeActive(
  promotionCodeId: string,
  isActive: boolean,
) {
  await requireAdmin();

  if (!promotionCodeId) {
    throw new Error("Codice promozionale non valido.");
  }

  const admin = createSupabaseAdminClient();

  const { data, error } = await admin
    .from("promotion_codes")
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", promotionCodeId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(mapPromotionCodeError(error));
  }

  if (!data) {
    throw new Error("Codice promozionale non trovato.");
  }

  revalidatePromotionCodePaths();

  return data.id;
}
