import { type NextRequest } from "next/server";

import { profileUpdateInputSchema } from "@/lib/validation/auth";
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

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);
    const input = await parseAuthInput(request, profileUpdateInputSchema);
    const client = await createSupabaseServerClient();
    const { data: authData, error: authError } = await client.auth.getUser();
    if (authError || !authData.user) {
      throw new AuthHttpError(401, "Accesso richiesto.");
    }

    const { error } = await client
      .from("profiles")
      .update({
        first_name: input.firstName,
        last_name: input.lastName,
        phone: input.phone || null,
        birth_date: input.birthDate || null,
      })
      .eq("id", authData.user.id);
    if (error) {
      throw new AuthHttpError(400, "Aggiornamento del profilo non riuscito.");
    }
    return authJson(await loadAccountUser(client, authData.user));
  } catch (error) {
    return authErrorResponse(error);
  }
}
