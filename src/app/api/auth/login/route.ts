import { type NextRequest } from "next/server";

import { loginInputSchema } from "@/lib/validation/auth";
import { loadAccountUser } from "@/server/auth/account-user";
import {
  AuthHttpError,
  authErrorResponse,
  authJson,
  enforceAuthRateLimit,
  parseAuthInput,
  requireSameOrigin,
  requireSupabaseAuthMode,
} from "@/server/auth/http";
import { createSupabaseServerClient } from "@/server/supabase";

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);
    enforceAuthRateLimit(request, "login");
    const input = await parseAuthInput(request, loginInputSchema);
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
