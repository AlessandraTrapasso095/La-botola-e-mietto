import { NextResponse } from "next/server";
import { z } from "zod";

import { confirmAdminBankTransfer } from "@/server/admin/confirm-bank-transfer";

const inputSchema = z.object({
  orderId: z.uuid(),
});

export async function POST(request: Request) {
  try {
    const input = inputSchema.parse(await request.json());

    const result = await confirmAdminBankTransfer(input.orderId);

    return NextResponse.json({
      ok: true,
      paymentStatus: result.paymentStatus,
      paidAt: result.paidAt,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Impossibile confermare il bonifico.";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      {
        status: 400,
      },
    );
  }
}
