import { type NextRequest } from "next/server";

import { cancelAccountOrderInputSchema } from "@/lib/validation/checkout";
import {
  authErrorResponse,
  authJson,
  parseAuthInput,
  requireSameOrigin,
  requireSupabaseAuthMode,
} from "@/server/auth/http";
import { cancelAccountOrder } from "@/server/account/cancel-order";

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);

    const input = await parseAuthInput(
      request,
      cancelAccountOrderInputSchema,
    );

    const result = await cancelAccountOrder(input.orderId);

    return authJson(result, 200);
  } catch (error) {
    return authErrorResponse(error);
  }
}
