import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  PromotionCodePreviewInput,
  PromotionCodePreviewResult,
} from "@/lib/validation/checkout";
import { AuthHttpError } from "@/server/auth/http";
import { createSupabaseAdminClient } from "@/server/supabase-admin";
import type { Database } from "@/types/database.generated";

async function requireAccountUser(client: SupabaseClient<Database>) {
  const { data, error } = await client.auth.getUser();

  if (error || !data.user) {
    throw new AuthHttpError(401, "Accesso richiesto.");
  }

  return data.user;
}

function promotionCodeError(error: { message: string }) {
  const message = error.message;

  if (
    message.includes("Codice promozionale") ||
    message.includes("Importo minimo ordine") ||
    message.includes("Valuta non supportata")
  ) {
    return new AuthHttpError(400, message);
  }

  return new AuthHttpError(
    500,
    "Non è stato possibile verificare il codice promozionale.",
  );
}

export async function previewPromotionCode(
  client: SupabaseClient<Database>,
  input: PromotionCodePreviewInput,
): Promise<PromotionCodePreviewResult> {
  await requireAccountUser(client);

  const code = input.code.trim().toUpperCase();

  const admin = createSupabaseAdminClient();

  const { data, error } = await admin.rpc("validate_promotion_code", {
    p_code: code,
    p_subtotal_gross_amount_minor: input.subtotalGrossAmountMinor,
    p_currency: "EUR",
  });

  if (error) {
    throw promotionCodeError(error);
  }

  const result = data?.[0];

  if (!result) {
    throw new AuthHttpError(400, "Codice promozionale non valido.");
  }

  return {
    code: result.promotion_code,
    discountGrossAmountMinor: Number(result.discount_gross_amount_minor),
  };
}
