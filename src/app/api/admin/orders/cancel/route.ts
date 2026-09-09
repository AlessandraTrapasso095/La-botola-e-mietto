import { type NextRequest } from "next/server";
import { z } from "zod";

import { cancelAdminReceivedOrder } from "@/server/admin/cancel-received-order";
import {
  authErrorResponse,
  authJson,
  parseAuthInput,
  requireSameOrigin,
  requireSupabaseAuthMode,
} from "@/server/auth/http";

const schema = z.object({
  orderId: z.string().uuid(),

  customerNote: z.string().trim().min(3).max(1_500),

  manualRefundReference: z.string().trim().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);

    const input = await parseAuthInput(request, schema);

    const result = await cancelAdminReceivedOrder(input);

    return authJson(result);
  } catch (error) {
    return authErrorResponse(error);
  }
}
