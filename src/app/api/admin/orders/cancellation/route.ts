import { type NextRequest } from "next/server";
import { z } from "zod";

import {
  authErrorResponse,
  authJson,
  parseAuthInput,
  requireSameOrigin,
  requireSupabaseAuthMode,
} from "@/server/auth/http";
import { resolveAdminOrderCancellation } from "@/server/admin/resolve-order-cancellation";
import {
  safelySendCancellationApprovedEmail,
  safelySendCancellationRejectedEmail,
} from "@/server/email/safe-send";

const adminCancellationSchema = z.object({
  orderId: z.string().uuid(),
  action: z.enum(["approve", "reject"]),
  resolutionNote: z.string().trim().max(1_000).optional(),
  manualRefundReference: z.string().trim().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);

    const input = await parseAuthInput(request, adminCancellationSchema);

    const result = await resolveAdminOrderCancellation(input);

    if (result.action === "approved") {
      await safelySendCancellationApprovedEmail(input.orderId);
    } else {
      await safelySendCancellationRejectedEmail(input.orderId);
    }

    return authJson(result, 200);
  } catch (error) {
    return authErrorResponse(error);
  }
}
