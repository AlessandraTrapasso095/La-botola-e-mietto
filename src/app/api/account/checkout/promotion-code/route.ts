import { type NextRequest } from "next/server";

import { promotionCodePreviewInputSchema } from "@/lib/validation/checkout";
import {
  authErrorResponse,
  authJson,
  parseAuthInput,
  requireSameOrigin,
  requireSupabaseAuthMode,
} from "@/server/auth/http";
import { previewPromotionCode } from "@/server/checkout/promotion-code-preview";
import { createSupabaseServerClient } from "@/server/supabase";

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);

    const input = await parseAuthInput(
      request,
      promotionCodePreviewInputSchema,
    );

    const client = await createSupabaseServerClient();

    const result = await previewPromotionCode(client, input);

    return authJson(result);
  } catch (error) {
    return authErrorResponse(error);
  }
}
