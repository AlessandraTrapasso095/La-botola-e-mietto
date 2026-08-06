import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { getPublicEnvironment } from "@/config/public-env";
import { getSafeRedirectPath } from "@/lib/auth/safe-redirect";
import { getRequestOrigin } from "@/server/auth/http";
import { getServerEnvironment } from "@/server/env";
import type { Database } from "@/types/database.generated";

const allowedTypes = new Set<EmailOtpType>([
  "email",
  "recovery",
  "signup",
  "invite",
  "email_change",
]);

export async function GET(request: NextRequest) {
  const destination = request.nextUrl.clone();
  destination.search = "";

  if (getServerEnvironment().AUTH_SERVICE !== "supabase") {
    destination.pathname = "/accedi";
    return NextResponse.redirect(destination);
  }

  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const requestedType = request.nextUrl.searchParams.get(
    "type",
  ) as EmailOtpType;
  const nextPath = getSafeRedirectPath(
    request.nextUrl.searchParams.get("next"),
    "/account",
  );
  if (!tokenHash || !allowedTypes.has(requestedType)) {
    destination.pathname = "/accedi";
    destination.searchParams.set("errore", "collegamento-non-valido");
    return NextResponse.redirect(destination);
  }

  const environment = getPublicEnvironment();
  const requestOrigin = getRequestOrigin(request);
  if (
    !environment.NEXT_PUBLIC_SUPABASE_URL ||
    !environment.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    !requestOrigin
  ) {
    destination.pathname = "/accedi";
    destination.searchParams.set("errore", "collegamento-non-valido");
    return NextResponse.redirect(destination);
  }

  const successDestination = new URL(nextPath, requestOrigin);
  const response = NextResponse.redirect(successDestination);
  const client = createServerClient<Database>(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );
  const { error } = await client.auth.verifyOtp({
    token_hash: tokenHash,
    type: requestedType,
  });
  if (error) {
    destination.pathname =
      requestedType === "recovery" ? "/password-dimenticata" : "/accedi";
    destination.searchParams.set("errore", "collegamento-non-valido");
    return NextResponse.redirect(destination);
  }

  return response;
}
