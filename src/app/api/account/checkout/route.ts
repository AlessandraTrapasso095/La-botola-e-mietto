import { type NextRequest } from "next/server";

import { checkoutInputSchema } from "@/lib/validation/checkout";
import {
  authErrorResponse,
  authJson,
  parseAuthInput,
  requireSameOrigin,
  requireSupabaseAuthMode,
} from "@/server/auth/http";
import { checkoutAccountCart } from "@/server/checkout/account-checkout";
import { createSupabaseServerClient } from "@/server/supabase";

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);

    const input = await parseAuthInput(request, checkoutInputSchema);
    const client = await createSupabaseServerClient();
    const result = await checkoutAccountCart(client, input);

    return authJson(result, 201);
  } catch (error) {
    return authErrorResponse(error);
  }
}
