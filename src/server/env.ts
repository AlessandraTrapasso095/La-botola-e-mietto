import "server-only";

import { z } from "zod";

import { resolveAuthMode } from "@/services/auth/auth-mode";

const optionalSecret = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

const catalogRepository = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.enum(["demo", "supabase"]).default("demo"),
);

const serverEnvironmentSchema = z.object({
  CATALOG_REPOSITORY: catalogRepository,
  AUTH_SERVICE: z.preprocess(resolveAuthMode, z.enum(["demo", "supabase"])),
  SUPABASE_SERVICE_ROLE_KEY: optionalSecret,
  STRIPE_SECRET_KEY: optionalSecret,
  STRIPE_WEBHOOK_SECRET: optionalSecret,
  EMAIL_PROVIDER_API_KEY: optionalSecret,
  EMAIL_FROM_ADDRESS: optionalSecret,
});

export function getServerEnvironment() {
  return serverEnvironmentSchema.parse({
    CATALOG_REPOSITORY: process.env.CATALOG_REPOSITORY,
    AUTH_SERVICE: process.env.AUTH_SERVICE,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    EMAIL_PROVIDER_API_KEY: process.env.EMAIL_PROVIDER_API_KEY,
    EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS,
  });
}
