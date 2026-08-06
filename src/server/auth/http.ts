import "server-only";

import { NextResponse, type NextRequest } from "next/server";
import type { z } from "zod";

import { getServerEnvironment } from "@/server/env";

type RateLimitState = { count: number; resetAt: number };
const rateLimits = new Map<string, RateLimitState>();

export class AuthHttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export function requireSupabaseAuthMode() {
  if (getServerEnvironment().AUTH_SERVICE !== "supabase") {
    throw new AuthHttpError(404, "Risorsa non disponibile.");
  }
}

export function getRequestOrigin(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host =
    forwardedHost?.split(",")[0]?.trim() ?? request.headers.get("host");
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const protocol =
    forwardedProtocol?.split(",")[0]?.trim() ??
    request.nextUrl.protocol.slice(0, -1);
  return host ? `${protocol}://${host}` : null;
}

export function requireSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const expectedOrigin = getRequestOrigin(request);

  if (!origin || !expectedOrigin || origin !== expectedOrigin) {
    throw new AuthHttpError(403, "Richiesta non valida.");
  }
}

export function enforceAuthRateLimit(
  request: NextRequest,
  action: "login" | "register" | "password-reset",
  limit = 10,
) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0];
  const identifier = forwarded?.trim() || "local";
  const key = `${action}:${identifier}`;
  const now = Date.now();
  const current = rateLimits.get(key);
  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + 5 * 60_000 });
    return;
  }
  if (current.count >= limit) {
    throw new AuthHttpError(
      429,
      "Troppe richieste. Attendi qualche minuto e riprova.",
    );
  }
  current.count += 1;
}

export async function parseAuthInput<TSchema extends z.ZodType>(
  request: NextRequest,
  schema: TSchema,
): Promise<z.output<TSchema>> {
  const input: unknown = await request.json().catch(() => null);
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new AuthHttpError(400, "Controlla i dati inseriti e riprova.");
  }
  return result.data;
}

export function authJson(value: unknown, status = 200) {
  return NextResponse.json(value, {
    status,
    headers: { "cache-control": "private, no-store" },
  });
}

export function authErrorResponse(error: unknown) {
  if (error instanceof AuthHttpError) {
    return authJson({ message: error.message }, error.status);
  }
  return authJson(
    { message: "Non è stato possibile completare l’operazione." },
    500,
  );
}
