import { createSupabaseAdminClient } from "@/server/supabase-admin";
import { getServerAdminUser } from "@/server/admin/admin-user";
import { safelySendPaymentReceivedEmail } from "@/server/email/safe-send";

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
    throw new Error("Accesso amministratore richiesto.");
  }

  const client = createSupabaseAdminClient();

  const response = await client.rpc("confirm_admin_bank_transfer", {
    p_order_id: orderId,
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  const row = response.data?.[0];

  if (!row) {
    throw new Error("Conferma del bonifico non disponibile.");
  }

  if (row.payment_status !== "paid" || !row.paid_at) {
    throw new Error("Il pagamento non risulta confermato.");
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
