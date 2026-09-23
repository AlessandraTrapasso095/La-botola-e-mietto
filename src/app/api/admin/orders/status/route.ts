import { z } from "zod";

import { updateAdminOrderStatus } from "@/server/admin/update-order-status";
import { AuthHttpError, authErrorResponse, authJson } from "@/server/auth/http";

const inputSchema = z.object({
  orderId: z.string().uuid(),
  nextStatus: z.enum(["received", "preparing", "shipped", "delivered"]),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => null);
    const input = inputSchema.safeParse(body);

    if (!input.success) {
      throw new AuthHttpError(400, "Richiesta non valida.");
    }

    const result = await updateAdminOrderStatus(input.data);

    return authJson(result);
  } catch (error) {
    return authErrorResponse(error);
  }
}
