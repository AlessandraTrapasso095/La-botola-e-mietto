import { type NextRequest } from "next/server";

import { hideAccountOrderInputSchema } from "@/lib/validation/checkout";
import {
  authErrorResponse,
  authJson,
  parseAuthInput,
  requireSameOrigin,
  requireSupabaseAuthMode,
} from "@/server/auth/http";
import { hideCancelledAccountOrder } from "@/server/account/hide-order";

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);

    const input = await parseAuthInput(request, hideAccountOrderInputSchema);

    const result = await hideCancelledAccountOrder(input.orderId);

    return authJson(result, 200);
  } catch (error) {
    return authErrorResponse(error);
  }
}
