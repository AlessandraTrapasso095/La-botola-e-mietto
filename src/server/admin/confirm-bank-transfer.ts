import { getServerAdminUser } from "@/server/admin/admin-user";
import { AuthHttpError } from "@/server/auth/http";
import { safelySendPaymentReceivedEmail } from "@/server/email/safe-send";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

export type ConfirmBankTransferResult = {
  orderId: string;
  orderNumber: string;
  orderStatus: "received" | "preparing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "paid";
  paidAt: string;
};

export async function confirmAdminBankTransfer(
  orderId: string,
): Promise<ConfirmBankTransferResult> {
  const admin = await getServerAdminUser();

  if (!admin) {
    throw new AuthHttpError(403, "Accesso amministratore richiesto.");
  }

  const client = createSupabaseAdminClient();

  const response = await client.rpc("confirm_admin_bank_transfer", {
    p_order_id: orderId,
  });

  if (response.error) {
    console.error("[admin-bank-transfer] conferma RPC fallita", {
      orderId,
      code: response.error.code,
    });

    throw new AuthHttpError(
      409,
      "Non è stato possibile confermare il bonifico. Aggiorna la pagina e riprova.",
    );
  }

  const row = response.data?.[0];

  if (!row) {
    throw new AuthHttpError(409, "Conferma del bonifico non disponibile.");
  }

  if (row.payment_status !== "paid" || !row.paid_at) {
    throw new AuthHttpError(409, "Il pagamento non risulta confermato.");
  }

  await safelySendPaymentReceivedEmail(row.order_id);

  return {
    orderId: row.order_id,
    orderNumber: row.order_number,
    orderStatus: row.order_status,
    paymentStatus: "paid",
    paidAt: row.paid_at,
  };
}
