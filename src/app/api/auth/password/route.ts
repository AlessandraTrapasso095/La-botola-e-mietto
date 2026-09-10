import { type NextRequest } from "next/server";

import { passwordUpdateInputSchema } from "@/lib/validation/auth";
import {
  AuthHttpError,
  authErrorResponse,
  authJson,
  parseAuthInput,
  requireSameOrigin,
  requireSupabaseAuthMode,
} from "@/server/auth/http";
import { createSupabaseServerClient } from "@/server/supabase";
import { safelySendPasswordChangedEmail } from "@/server/email/safe-send";

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);
    const { password } = await parseAuthInput(
      request,
      passwordUpdateInputSchema,
    );
    const client = await createSupabaseServerClient();
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) {
      throw new AuthHttpError(401, "Accesso richiesto.");
    }
    const { data: updatedUserData, error } = await client.auth.updateUser({
      password,
    });
    if (error) {
      if (error.code === "same_password") {
        throw new AuthHttpError(
          400,
          "La nuova password deve essere diversa da quella precedente.",
        );
      }

      throw new AuthHttpError(
        400,
        "Aggiornamento della password non riuscito.",
      );
    }
    const passwordChangeOccurrenceId =
      updatedUserData.user.updated_at ?? new Date().toISOString();

    await safelySendPasswordChangedEmail(
      userData.user.id,
      passwordChangeOccurrenceId,
    );

    return authJson(null);
  } catch (error) {
    return authErrorResponse(error);
  }
}
