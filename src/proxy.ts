import { NextResponse, type NextRequest } from "next/server";

import { getSafeRedirectPath } from "@/lib/auth/safe-redirect";
import {
  copyResponseCookies,
  refreshSupabaseSession,
} from "@/lib/supabase/proxy";
import { resolveAuthMode } from "@/services/auth/auth-mode";

export async function proxy(request: NextRequest) {
  if (resolveAuthMode(process.env.AUTH_SERVICE) !== "supabase") {
    return NextResponse.next();
  }

  const { response, user } = await refreshSupabaseSession(request);
  const pathname = request.nextUrl.pathname;
  const accountRoute =
    pathname === "/account" || pathname.startsWith("/account/");
  const guestRoute = pathname === "/accedi" || pathname === "/registrati";

  if (accountRoute && !user) {
    const destination = request.nextUrl.clone();
    destination.pathname = "/accedi";
    destination.search = "";
    destination.searchParams.set(
      "ritorno",
      getSafeRedirectPath(`${pathname}${request.nextUrl.search}`),
    );
    return copyResponseCookies(response, NextResponse.redirect(destination));
  }

  if (guestRoute && user) {
    const destination = request.nextUrl.clone();
    destination.pathname = "/account";
    destination.search = "";
    return copyResponseCookies(response, NextResponse.redirect(destination));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|woff2)$).*)",
  ],
};
