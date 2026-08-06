import { type NextRequest } from "next/server";

import { preferencesUpdateInputSchema } from "@/lib/validation/auth";
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

const settingsPolicyVersion = "local-auth-v1";

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);
    const input = await parseAuthInput(request, preferencesUpdateInputSchema);
    const client = await createSupabaseServerClient();
    const { data: authData, error: authError } = await client.auth.getUser();
    if (authError || !authData.user) {
      throw new AuthHttpError(401, "Accesso richiesto.");
    }

    const { error } = await client.rpc("update_account_preferences", {
      marketing_consent_value: input.marketingConsent,
      email_updates_value: input.emailUpdates,
      policy_version_value: settingsPolicyVersion,
    });
    if (error) {
      throw new AuthHttpError(
        400,
        "Aggiornamento delle preferenze non riuscito.",
      );
    }
    return authJson(await loadAccountUser(client, authData.user));
  } catch (error) {
    return authErrorResponse(error);
  }
}
