import { type NextRequest } from "next/server";
import { z } from "zod";

import { shipAdminOrder } from "@/server/admin/ship-order";
import {
  AuthHttpError,
  authErrorResponse,
  authJson,
  requireSameOrigin,
  requireSupabaseAuthMode,
} from "@/server/auth/http";

const inputSchema = z.object({
  orderId: z.string().uuid(),
  carrier: z.string().trim().min(1).max(100),
  trackingCode: z.string().trim().min(1).max(200),
  trackingUrl: z.string().trim().url().max(2_000),
});

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);
    const body: unknown = await request.json().catch(() => null);
    const input = inputSchema.safeParse(body);

    if (!input.success) {
      throw new AuthHttpError(400, "Dati di spedizione non validi.");
    }

    const result = await shipAdminOrder(input.data);

    return authJson(result);
  } catch (error) {
    return authErrorResponse(error);
  }
}
