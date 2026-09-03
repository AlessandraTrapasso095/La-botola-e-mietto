import { type NextRequest } from "next/server";

import { stripeCheckoutSessionInputSchema } from "@/lib/validation/checkout";
import {
  authErrorResponse,
  authJson,
  getRequestOrigin,
  parseAuthInput,
  requireSameOrigin,
  requireSupabaseAuthMode,
} from "@/server/auth/http";
import { createSupabaseServerClient } from "@/server/supabase";
import { createOrderStripeCheckoutSession } from "@/server/stripe/order-checkout-session";

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);

    const input = await parseAuthInput(
      request,
      stripeCheckoutSessionInputSchema,
    );

    const origin = getRequestOrigin(request);

    if (!origin) {
      throw new Error("Origine della richiesta non disponibile.");
    }

    const client = await createSupabaseServerClient();
    const userResponse = await client.auth.getUser();

    if (userResponse.error || !userResponse.data.user) {
      return authJson({ message: "Accesso richiesto." }, 401);
    }

    const result = await createOrderStripeCheckoutSession({
      orderId: input.orderId,
      profileId: userResponse.data.user.id,
      origin,
    });

    return authJson(result, 201);
  } catch (error) {
    return authErrorResponse(error);
  }
}
