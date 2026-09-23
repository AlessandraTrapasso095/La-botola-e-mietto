export type CatalogMode = "demo" | "supabase";

export function resolveCatalogMode(
  value: unknown,
  environment = process.env.NODE_ENV,
): CatalogMode {
  if (environment === "production") {
    if (value === "supabase") {
      return "supabase";
    }

    throw new Error(
      "CATALOG_REPOSITORY deve essere impostato su supabase in produzione.",
    );
  }

  if (value === "supabase" || value === "demo") {
    return value;
  }

  return "demo";
}
