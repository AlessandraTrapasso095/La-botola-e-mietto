import { type NextRequest } from "next/server";

import { cartMergeInputSchema } from "@/lib/validation/cart";
import {
  authErrorResponse,
  authJson,
  parseAuthInput,
  requireSameOrigin,
  requireSupabaseAuthMode,
} from "@/server/auth/http";
import { mergeAccountCart } from "@/server/cart/account-cart";
import { createSupabaseServerClient } from "@/server/supabase";

export async function PUT(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);

    const { items } = await parseAuthInput(request, cartMergeInputSchema);

    return authJson(
      await mergeAccountCart(await createSupabaseServerClient(), items),
    );
  } catch (error) {
    return authErrorResponse(error);
  }
}
