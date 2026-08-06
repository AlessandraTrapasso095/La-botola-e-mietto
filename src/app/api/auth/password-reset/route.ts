import { type NextRequest } from "next/server";

import { passwordResetInputSchema } from "@/lib/validation/auth";
import {
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
    enforceAuthRateLimit(request, "password-reset", 5);
    const { email } = await parseAuthInput(request, passwordResetInputSchema);
    const client = await createSupabaseServerClient();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: new URL(
        "/auth/confirm?next=/nuova-password",
        request.url,
      ).toString(),
    });
    if (error) {
      throw new Error("Password reset unavailable");
    }
    return authJson(null);
  } catch (error) {
    return authErrorResponse(error);
  }
}
