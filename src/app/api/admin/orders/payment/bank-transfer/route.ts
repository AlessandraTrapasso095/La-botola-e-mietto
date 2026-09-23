import { type NextRequest } from "next/server";
import { z } from "zod";

import { confirmAdminBankTransfer } from "@/server/admin/confirm-bank-transfer";
import {
  AuthHttpError,
  authErrorResponse,
  authJson,
  requireSameOrigin,
  requireSupabaseAuthMode,
} from "@/server/auth/http";

const inputSchema = z.object({
  orderId: z.uuid(),
});

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);
    const payload: unknown = await request.json().catch(() => null);
    const input = inputSchema.safeParse(payload);

    if (!input.success) {
      throw new AuthHttpError(400, "Richiesta non valida.");
    }

    const result = await confirmAdminBankTransfer(input.data.orderId);

    return authJson({
      ok: true,
      paymentStatus: result.paymentStatus,
      paidAt: result.paidAt,
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
