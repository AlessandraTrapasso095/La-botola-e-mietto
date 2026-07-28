import "server-only";

import { z } from "zod";

const optionalSecret = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

const serverEnvironmentSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: optionalSecret,
  STRIPE_SECRET_KEY: optionalSecret,
  STRIPE_WEBHOOK_SECRET: optionalSecret,
});

export function getServerEnvironment() {
  return serverEnvironmentSchema.parse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  });
}
