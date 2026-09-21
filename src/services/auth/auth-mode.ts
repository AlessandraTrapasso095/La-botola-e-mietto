export type AuthMode = "demo" | "supabase";

export function resolveAuthMode(
  value: unknown,
  environment = process.env.NODE_ENV,
): AuthMode {
  if (value === "supabase" || value === "demo") {
    return value;
  }

  if (environment === "production") {
    throw new Error(
      "AUTH_SERVICE deve essere configurato esplicitamente in produzione.",
    );
  }

  return "demo";
}
