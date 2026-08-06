import {
  authErrorResponse,
  authJson,
  requireSupabaseAuthMode,
} from "@/server/auth/http";
import { loadAccountUser } from "@/server/auth/account-user";
import { createSupabaseServerClient } from "@/server/supabase";

export async function GET() {
  try {
    requireSupabaseAuthMode();
    const client = await createSupabaseServerClient();
    const { data, error } = await client.auth.getUser();
    if (error || !data.user)
      return authJson({ message: "Accesso richiesto." }, 401);
    return authJson(await loadAccountUser(client, data.user));
  } catch (error) {
    return authErrorResponse(error);
  }
}
