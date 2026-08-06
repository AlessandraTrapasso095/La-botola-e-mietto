import type { CatalogSearchResults, ProductCardView } from "@/types/catalog";

async function readJson<ResponseBody>(response: Response) {
  if (!response.ok) throw new Error("Richiesta catalogo non riuscita.");
  return (await response.json()) as ResponseBody;
}

export async function fetchProductCards(
  slugs: readonly string[],
  signal?: AbortSignal,
) {
  if (slugs.length === 0) return [];
  const uniqueSlugs = [...new Set(slugs)];
  const batches = Array.from(
    { length: Math.ceil(uniqueSlugs.length / 50) },
    (_, index) => uniqueSlugs.slice(index * 50, index * 50 + 50),
  );
  const responses = await Promise.all(
    batches.map(async (batch) => {
      const params = new URLSearchParams({ slugs: batch.join(",") });
      const response = await fetch(`/api/catalog/products?${params}`, {
        signal,
      });
      return readJson<{ products: ProductCardView[] }>(response);
    }),
  );
  return responses.flatMap((response) => response.products);
}

export async function fetchCatalogSearch(query: string, signal?: AbortSignal) {
  const params = new URLSearchParams({ q: query });
  const response = await fetch(`/api/catalog/search?${params}`, { signal });
  return readJson<CatalogSearchResults>(response);
}
