import "server-only";

import { AuthHttpError } from "@/server/auth/http";
import { createSupabaseServerClient } from "@/server/supabase";

export async function hideCancelledAccountOrder(orderId: string) {
  const client = await createSupabaseServerClient();

  const userResponse = await client.auth.getUser();

  if (userResponse.error || !userResponse.data.user) {
    throw new AuthHttpError(401, "Accesso richiesto.");
  }

  const response = await client.rpc("hide_cancelled_account_order", {
    p_order_id: orderId,
  });

  if (response.error) {
    throw new AuthHttpError(
      409,
      response.error.message ||
        "Non è stato possibile eliminare l’ordine dalla cronologia.",
    );
  }

  return {
    hidden: true,
  };
}
