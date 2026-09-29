import { type NextRequest } from "next/server";

import { passwordResetInputSchema } from "@/lib/validation/auth";
import {
  authErrorResponse,
  authJson,
  getRequestOrigin,
  parseAuthInput,
  requireSameOrigin,
  requireSupabaseAuthMode,
} from "@/server/auth/http";
import { createSupabaseServerClient } from "@/server/supabase";
import {
  enforceAccountRateLimit,
  enforceIpRateLimit,
  rateLimitPolicies,
} from "@/server/security/rate-limit";

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);
    await enforceIpRateLimit(request, rateLimitPolicies.passwordReset);
    const { email } = await parseAuthInput(request, passwordResetInputSchema);
    await enforceAccountRateLimit(email, rateLimitPolicies.passwordReset);
    const origin = getRequestOrigin(request);

    if (!origin) {
      throw new Error("Origine della richiesta non disponibile.");
    }

    const client = await createSupabaseServerClient();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: new URL(
        "/auth/confirm?next=/nuova-password",
        origin,
      ).toString(),
    });
    if (error) {
      throw new Error("Password reset unavailable");
    }
    return authJson(null);
  } catch (error) {
    return authErrorResponse(error);
  }
}
