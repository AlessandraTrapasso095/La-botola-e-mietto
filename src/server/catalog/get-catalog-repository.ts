import "server-only";

import type { CatalogRepository } from "@/server/catalog/catalog-repository";
import { DemoCatalogRepository } from "@/server/catalog/demo-catalog-repository";
import { SupabaseCatalogRepository } from "@/server/catalog/supabase-catalog-repository";
import { getServerEnvironment } from "@/server/env";

const repositories: Partial<Record<"demo" | "supabase", CatalogRepository>> =
  {};

export function getCatalogRepository(): CatalogRepository {
  const repositoryName = getServerEnvironment().CATALOG_REPOSITORY;
  const currentRepository = repositories[repositoryName];
  if (currentRepository) return currentRepository;

  const selectedRepository: CatalogRepository =
    repositoryName === "supabase"
      ? new SupabaseCatalogRepository()
      : new DemoCatalogRepository();
  repositories[repositoryName] = selectedRepository;

  return selectedRepository;
}
