import { type NextRequest } from "next/server";

import { checkoutInputSchema } from "@/lib/validation/checkout";
import {
  authErrorResponse,
  authJson,
  parseAuthInput,
  requireSameOrigin,
  requireSupabaseAuthMode,
} from "@/server/auth/http";
import { checkoutAccountCart } from "@/server/checkout/account-checkout";
import { safelySendNewOrderEmails } from "@/server/email/safe-send";
import { createSupabaseServerClient } from "@/server/supabase";

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);

    const input = await parseAuthInput(request, checkoutInputSchema);
    const client = await createSupabaseServerClient();
    const result = await checkoutAccountCart(client, input);

    /*
     * Stripe viene notificato soltanto dopo la conferma
     * reale del pagamento tramite webhook.
     *
     * Il bonifico genera invece subito l'ordine e quindi
     * la relativa email di conferma con le istruzioni
     * necessarie al pagamento.
     */
    if (result.paymentMethod !== "stripe") {
      await safelySendNewOrderEmails(result.orderId);
    }

    return authJson(result, 201);
  } catch (error) {
    return authErrorResponse(error);
  }
}
