import { type NextRequest } from "next/server";

import { registrationInputSchema } from "@/lib/validation/auth";
import { loadAccountUser } from "@/server/auth/account-user";
import {
  AuthHttpError,
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

const registrationPolicyVersion = "local-auth-v1";

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);
    await enforceIpRateLimit(request, rateLimitPolicies.register);
    const input = await parseAuthInput(request, registrationInputSchema);
    await enforceAccountRateLimit(input.email, rateLimitPolicies.register);
    const requestOrigin = getRequestOrigin(request);
    if (!requestOrigin) throw new AuthHttpError(400, "Richiesta non valida.");
    const client = await createSupabaseServerClient();
    const { data, error } = await client.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        emailRedirectTo: new URL("/auth/confirm", requestOrigin).toString(),
        data: {
          first_name: input.firstName,
          last_name: input.lastName,
          privacy_consent: input.privacyConsent,
          marketing_consent: input.marketingConsent,
          adult_confirmation: input.adultConfirmation,
          policy_version: registrationPolicyVersion,
        },
      },
    });
    if (error || !data.user) {
      throw new AuthHttpError(
        400,
        "Non è stato possibile creare l’account. Controlla i dati e riprova.",
      );
    }

    if (!data.session) {
      return authJson({ status: "confirmation-required", user: null }, 201);
    }

    return authJson(
      {
        status: "authenticated",
        user: await loadAccountUser(client, data.user),
      },
      201,
    );
  } catch (error) {
    return authErrorResponse(error);
  }
}
