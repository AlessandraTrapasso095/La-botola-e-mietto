import { NextResponse } from "next/server";
import { z } from "zod";

import { shipAdminOrder } from "@/server/admin/ship-order";
import { AuthHttpError } from "@/server/auth/http";

const inputSchema = z.object({
  orderId: z.string().uuid(),
  carrier: z.string().trim().min(1).max(100),
  trackingCode: z.string().trim().min(1).max(200),
  trackingUrl: z.string().trim().url().max(2_000),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const input = inputSchema.parse(body);

    const result = await shipAdminOrder(input);

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
          message: "Dati di spedizione non validi.",
        },
        {
          status: 400,
        },
      );
    }

    console.error("Admin shipping update failed:", error);

    return NextResponse.json(
      {
        message: "Registrazione della spedizione non riuscita.",
      },
      {
        status: 500,
      },
    );
  }
}
