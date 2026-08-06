import { type NextRequest } from "next/server";

import {
  AuthHttpError,
  authErrorResponse,
  authJson,
  requireSameOrigin,
  requireSupabaseAuthMode,
} from "@/server/auth/http";
import { createSupabaseServerClient } from "@/server/supabase";

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);
    const client = await createSupabaseServerClient();
    const { error } = await client.auth.signOut();
    if (error) throw new AuthHttpError(400, "Disconnessione non riuscita.");
    return authJson(null);
  } catch (error) {
    return authErrorResponse(error);
  }
}
