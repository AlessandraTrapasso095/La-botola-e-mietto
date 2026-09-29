import { type NextRequest } from "next/server";

import { getPublicEnvironment } from "@/config/public-env";
import { passwordResetInputSchema } from "@/lib/validation/auth";
import {
  authErrorResponse,
  authJson,
  parseAuthInput,
  requireSameOrigin,
  requireSupabaseAuthMode,
} from "@/server/auth/http";
import {
  enforceAccountRateLimit,
  enforceIpRateLimit,
  rateLimitPolicies,
} from "@/server/security/rate-limit";
import { createSupabaseAdminClient } from "@/server/supabase-admin";
import { createSupabaseServerClient } from "@/server/supabase";

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);
    await enforceIpRateLimit(request, rateLimitPolicies.adminPasswordReset);

    const { email } = await parseAuthInput(request, passwordResetInputSchema);
    await enforceAccountRateLimit(email, rateLimitPolicies.adminPasswordReset);

    const adminClient = createSupabaseAdminClient();

    const profileResponse = await adminClient
      .from("profiles")
      .select("id, role")
      .eq("email", email)
      .maybeSingle();

    /*
     * Risposta volutamente neutra:
     * non riveliamo se l'indirizzo esiste o se è amministratore.
     */
    if (
      profileResponse.error ||
      !profileResponse.data ||
      profileResponse.data.role !== "admin"
    ) {
      return authJson(null);
    }

    const siteUrl = getPublicEnvironment().NEXT_PUBLIC_SITE_URL;

    if (!siteUrl) {
      throw new Error("Configurazione sito non disponibile.");
    }

    const client = await createSupabaseServerClient();

    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: new URL("/auth/confirm?next=/admin/nuova-password", siteUrl).toString(),
    });

    if (error) {
      throw new Error("Admin password reset unavailable");
    }

    return authJson(null);
  } catch (error) {
    return authErrorResponse(error);
  }
}
