export type AuthMode = "demo" | "supabase";

export function resolveAuthMode(
  value: unknown,
  environment = process.env.NODE_ENV,
): AuthMode {
  if (environment === "production") {
    if (value === "supabase") {
      return "supabase";
    }

    throw new Error(
      "AUTH_SERVICE deve essere impostato su supabase in produzione.",
    );
  }

  if (value === "supabase" || value === "demo") {
    return value;
  }

  return "demo";
}
