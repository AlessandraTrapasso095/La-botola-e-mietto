import "server-only";

import { createHmac } from "node:crypto";

import type { NextRequest } from "next/server";

import { AuthHttpError } from "@/server/auth/http";
import { getServerEnvironment } from "@/server/env";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

type RateLimitPolicy = {
  scope: string;
  limit: number;
  windowSeconds: number;
};

export const rateLimitPolicies = {
  login: {
    scope: "auth:login",
    limit: 10,
    windowSeconds: 300,
  },
  register: {
    scope: "auth:register",
    limit: 10,
    windowSeconds: 300,
  },
  passwordReset: {
    scope: "auth:password-reset",
    limit: 5,
    windowSeconds: 300,
  },
  adminPasswordReset: {
    scope: "admin:password-reset",
    limit: 5,
    windowSeconds: 300,
  },
  checkout: {
    scope: "checkout:create",
    limit: 10,
    windowSeconds: 300,
  },
  promotionPreview: {
    scope: "checkout:promotion-preview",
    limit: 20,
    windowSeconds: 300,
  },
  stripeSession: {
    scope: "checkout:stripe-session",
    limit: 10,
    windowSeconds: 300,
  },
} as const satisfies Record<string, RateLimitPolicy>;

function getRateLimitSecret() {
  const { RATE_LIMIT_SECRET } = getServerEnvironment();

  if (RATE_LIMIT_SECRET) {
    return RATE_LIMIT_SECRET;
  }

  if (process.env.NODE_ENV !== "production") {
    return "local-rate-limit-secret-development-only";
  }

  throw new AuthHttpError(
    503,
    "Servizio temporaneamente non disponibile. Riprova tra poco.",
  );
}

function hashIdentifier(identifier: string) {
  return createHmac("sha256", getRateLimitSecret())
    .update(identifier)
    .digest("hex");
}

function getRequestIp(request: NextRequest) {
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();

  return forwarded || "local";
}

async function consumeRateLimit(policy: RateLimitPolicy, identifier: string) {
  const admin = createSupabaseAdminClient();

  const { data, error } = await admin.rpc("consume_rate_limit", {
    p_scope: policy.scope,
    p_identifier_hash: hashIdentifier(identifier),
    p_limit: policy.limit,
    p_window_seconds: policy.windowSeconds,
  });

  if (error) {
    console.error(
      "[rate-limit] impossibile verificare il limite condiviso",
      error.message,
    );

    throw new AuthHttpError(
      503,
      "Servizio temporaneamente non disponibile. Riprova tra poco.",
    );
  }

  const result = data?.[0];

  if (!result) {
    throw new AuthHttpError(
      503,
      "Servizio temporaneamente non disponibile. Riprova tra poco.",
    );
  }

  if (!result.allowed) {
    throw new AuthHttpError(
      429,
      "Troppe richieste. Attendi qualche minuto e riprova.",
      {
        "retry-after": String(Math.max(result.retry_after_seconds, 1)),
      },
    );
  }
}

export async function enforceIpRateLimit(
  request: NextRequest,
  policy: RateLimitPolicy,
) {
  await consumeRateLimit(policy, `ip:${getRequestIp(request)}`);
}

export async function enforceAccountRateLimit(
  email: string,
  policy: RateLimitPolicy,
) {
  await consumeRateLimit(policy, `account:${email}`);
}

export async function enforceUserRateLimit(
  userId: string,
  policy: RateLimitPolicy,
) {
  await consumeRateLimit(policy, `user:${userId}`);
}
