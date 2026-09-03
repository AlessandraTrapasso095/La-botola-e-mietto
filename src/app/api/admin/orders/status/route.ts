import { NextResponse } from "next/server";
import { z } from "zod";

import { AuthHttpError } from "@/server/auth/http";
import { updateAdminOrderStatus } from "@/server/admin/update-order-status";

const inputSchema = z.object({
  orderId: z.string().uuid(),
  nextStatus: z.enum(["received", "preparing", "shipped", "delivered"]),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const input = inputSchema.parse(body);

    const result = await updateAdminOrderStatus(input);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AuthHttpError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: error.status,
        },
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Richiesta non valida.",
        },
        {
          status: 400,
        },
      );
    }

    console.error("Admin order status update failed:", error);

    return NextResponse.json(
      {
        message: "Aggiornamento stato ordine non riuscito.",
      },
      {
        status: 500,
      },
    );
  }
}
