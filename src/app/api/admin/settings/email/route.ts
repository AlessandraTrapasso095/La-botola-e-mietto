import { type NextRequest } from "next/server";
import { z } from "zod";

import { getServerAdminUser } from "@/server/admin/admin-user";
import {
  AuthHttpError,
  authErrorResponse,
  authJson,
  parseAuthInput,
  requireSameOrigin,
  requireSupabaseAuthMode,
} from "@/server/auth/http";
import { createSupabaseServerClient } from "@/server/supabase";
import { safelySendAdminEmailChangeRequestedEmail } from "@/server/email/safe-send";

const schema = z.object({
  email: z
    .string()
    .trim()
    .email("Inserisci un indirizzo email valido.")
    .max(320),
});

export async function POST(request: NextRequest) {
  try {
    requireSupabaseAuthMode();
    requireSameOrigin(request);

    const adminUser = await getServerAdminUser();

    if (!adminUser) {
      throw new AuthHttpError(403, "Accesso amministratore richiesto.");
    }

    const input = await parseAuthInput(request, schema);

    if (input.email.toLowerCase() === adminUser.email.toLowerCase()) {
      return authJson({
        updated: false,
        unchanged: true,
      });
    }

    const client = await createSupabaseServerClient();

    const { data: updatedUserData, error } = await client.auth.updateUser({
      email: input.email,
    });

    if (error) {
      throw new AuthHttpError(
        400,
        "Non è stato possibile avviare la modifica dell’email.",
      );
    }

    const emailChangeOccurrenceId =
      updatedUserData.user.updated_at ?? new Date().toISOString();

    await safelySendAdminEmailChangeRequestedEmail(
      adminUser.id,
      input.email,
      emailChangeOccurrenceId,
    );

    return authJson({
      updated: true,
      verificationRequired: true,
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
