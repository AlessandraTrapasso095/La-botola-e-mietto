import { type NextRequest } from "next/server";

import { loginInputSchema } from "@/lib/validation/auth";
import { loadAccountUser } from "@/server/auth/account-user";
import {
  AuthHttpError,
  authErrorResponse,
  authJson,
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
    await enforceIpRateLimit(request, rateLimitPolicies.login);
    const input = await parseAuthInput(request, loginInputSchema);
    await enforceAccountRateLimit(input.email, rateLimitPolicies.login);
    const client = await createSupabaseServerClient();
    const { data, error } = await client.auth.signInWithPassword(input);
    if (error || !data.user) {
      throw new AuthHttpError(
        400,
        "Le credenziali inserite non sono corrette.",
      );
    }
    return authJson(await loadAccountUser(client, data.user));
  } catch (error) {
    return authErrorResponse(error);
  }
}
