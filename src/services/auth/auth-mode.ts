export type AuthMode = "demo" | "supabase";

export function resolveAuthMode(value: unknown): AuthMode {
  return value === "supabase" ? "supabase" : "demo";
}
