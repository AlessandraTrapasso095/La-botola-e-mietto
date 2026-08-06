import { execFileSync } from "node:child_process";

import { z } from "zod";

const localSupabaseEnvironmentSchema = z.object({
  ANON_KEY: z.string().min(1),
  API_URL: z.url(),
  DB_URL: z.url(),
  SERVICE_ROLE_KEY: z.string().min(1),
});

export type LocalSupabaseEnvironment = z.infer<
  typeof localSupabaseEnvironmentSchema
>;

function parseEnvironmentOutput(output: string) {
  return Object.fromEntries(
    output
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separatorIndex = line.indexOf("=");
        const key = line.slice(0, separatorIndex);
        const value = line.slice(separatorIndex + 1).replace(/^"|"$/g, "");
        return [key, value];
      }),
  );
}

function assertLocalUrl(value: string, label: string) {
  const url = new URL(value);
  if (url.hostname !== "127.0.0.1" && url.hostname !== "localhost") {
    throw new Error(`${label} deve puntare esclusivamente a Supabase locale.`);
  }
}

export function getLocalSupabaseEnvironment(): LocalSupabaseEnvironment {
  const output = execFileSync(
    "npx",
    ["--no-install", "supabase", "status", "-o", "env"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
  const environment = localSupabaseEnvironmentSchema.parse(
    parseEnvironmentOutput(output),
  );

  assertLocalUrl(environment.API_URL, "API_URL");
  assertLocalUrl(environment.DB_URL, "DB_URL");

  return environment;
}
