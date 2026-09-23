import "server-only";

import { z } from "zod";

import { resolveAuthMode } from "@/services/auth/auth-mode";

const optionalSecret = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

const rateLimitSecret = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(32).optional(),
);

const catalogRepository = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.enum(["demo", "supabase"]).default("demo"),
);

const serverEnvironmentSchema = z.object({
  CATALOG_REPOSITORY: catalogRepository,
  AUTH_SERVICE: z.preprocess(
    (value) => resolveAuthMode(value),
    z.enum(["demo", "supabase"]),
  ),
  SUPABASE_SERVICE_ROLE_KEY: optionalSecret,
  RATE_LIMIT_SECRET: rateLimitSecret,
  STRIPE_SECRET_KEY: optionalSecret,
  STRIPE_WEBHOOK_SECRET: optionalSecret,
  EMAIL_PROVIDER: optionalSecret,
  EMAIL_PROVIDER_API_KEY: optionalSecret,
  EMAIL_FROM_ADDRESS: optionalSecret,
  EMAIL_FROM_NAME: optionalSecret,
});

export function getServerEnvironment() {
  return serverEnvironmentSchema.parse({
    CATALOG_REPOSITORY: process.env.CATALOG_REPOSITORY,
    AUTH_SERVICE: process.env.AUTH_SERVICE,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    RATE_LIMIT_SECRET: process.env.RATE_LIMIT_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
    EMAIL_PROVIDER_API_KEY: process.env.EMAIL_PROVIDER_API_KEY,
    EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS,
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
  });
}
