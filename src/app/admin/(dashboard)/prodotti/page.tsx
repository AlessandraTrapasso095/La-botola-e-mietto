import Link from "next/link";

import {
  getAdminProducts,
  type AdminProductAvailability,
  type AdminProductStatus,
} from "@/server/admin/admin-products";

type SearchParams = Record<string, string | string[] | undefined>;

function getSingleParam(searchParams: SearchParams, key: string) {
  const value = searchParams[key];

  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function parsePage(value: string) {
  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function parseStatus(value: string): AdminProductStatus {
  if (value === "active" || value === "draft") {
    return value;
  }

  return "all";
}

function parseAvailability(value: string): AdminProductAvailability {
  if (value === "available" || value === "unavailable") {
    return value;
  }

  return "all";
}

function buildPageHref(current: URLSearchParams, page: number) {
  const params = new URLSearchParams(current);

  params.set("page", String(page));

  return `/admin/prodotti?${params.toString()}`;
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const query = getSingleParam(params, "q").trim();
  const status = parseStatus(getSingleParam(params, "status"));
  const brandId = getSingleParam(params, "brand");
  const categoryId = getSingleParam(params, "category");
  const availability = parseAvailability(
    getSingleParam(params, "availability"),
  );
  const requestedPage = parsePage(getSingleParam(params, "page"));

  const result = await getAdminProducts({
    query,
    status,
    brandId: brandId || undefined,
    categoryId: categoryId || undefined,
    availability,
    page: requestedPage,
  });

  const currentParams = new URLSearchParams();

  if (query) currentParams.set("q", query);
  if (status !== "all") currentParams.set("status", status);
  if (brandId) currentParams.set("brand", brandId);
  if (categoryId) {
    currentParams.set("category", categoryId);
  }
  if (availability !== "all") {
    currentParams.set("availability", availability);
  }

  const from =
    result.totalCount === 0 ? 0 : (result.page - 1) * result.pageSize + 1;

  const to = Math.min(result.page * result.pageSize, result.totalCount);

  const hasFilters =
    Boolean(query) ||
    status !== "all" ||
    Boolean(brandId) ||
    Boolean(categoryId) ||
    availability !== "all";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-orange-400 uppercase">
            Catalogo
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-white">Prodotti</h1>

          <p className="mt-2 max-w-2xl text-sm text-white/50">
            Cerca e filtra i prodotti presenti nel catalogo di La Botola e
            Mietto.
          </p>
        </div>

        <div className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/60">
          {result.totalCount.toLocaleString("it-IT")}{" "}
          {result.totalCount === 1 ? "prodotto" : "prodotti"}
        </div>
      </div>

      <form
        method="get"
        className="grid gap-4 rounded-lg border border-white/10 bg-[#171717] p-5 md:grid-cols-2 xl:grid-cols-6"
      >
        <label className="space-y-2 md:col-span-2">
          <span className="text-xs font-medium text-white/50">
            Cerca prodotto
          </span>

          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Nome o codice..."
            className="h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white transition outline-none placeholder:text-white/25 focus:border-orange-400/60"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-medium text-white/50">Stato</span>

          <select
            name="status"
            defaultValue={status}
            className="h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none focus:border-orange-400/60"
          >
            <option value="all">Tutti</option>
            <option value="active">Attivi</option>
            <option value="draft">Bozze</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-medium text-white/50">Marchio</span>

          <select
            name="brand"
            defaultValue={brandId}
            className="h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none focus:border-orange-400/60"
          >
            <option value="">Tutti</option>

            {result.brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-medium text-white/50">Categoria</span>

          <select
            name="category"
            defaultValue={categoryId}
            className="h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none focus:border-orange-400/60"
          >
            <option value="">Tutte</option>

            {result.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-medium text-white/50">
            Disponibilità
          </span>

          <select
            name="availability"
            defaultValue={availability}
            className="h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none focus:border-orange-400/60"
          >
            <option value="all">Tutti</option>
            <option value="available">Disponibili</option>
            <option value="unavailable">Esauriti</option>
          </select>
        </label>

        <div className="flex gap-3 md:col-span-2 xl:col-span-6">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-md bg-orange-500 px-5 text-sm font-semibold text-black transition hover:bg-orange-400"
          >
            Applica filtri
          </button>

          {hasFilters ? (
            <Link
              href="/admin/prodotti"
              className="inline-flex h-11 items-center justify-center rounded-md border border-white/10 px-5 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              Azzera filtri
            </Link>
          ) : null}
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#171717]">
        <div className="flex flex-col gap-2 border-b border-white/10 px-5 py-4 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>
            {result.totalCount === 0
              ? "Nessun risultato"
              : `Risultati ${from.toLocaleString("it-IT")}-${to.toLocaleString(
                  "it-IT",
                )} di ${result.totalCount.toLocaleString("it-IT")}`}
          </span>

          <span>
            Pagina {result.page} di {result.totalPages}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/[0.03]">
              <tr className="text-left text-xs font-semibold tracking-wide text-white/40 uppercase">
                <th className="px-5 py-4">Codice</th>
                <th className="px-5 py-4">Prodotto</th>
                <th className="px-5 py-4">Marchio</th>
                <th className="px-5 py-4">Categoria</th>
                <th className="px-5 py-4">Stato</th>
                <th className="px-5 py-4 text-right">Disponibili</th>
                <th className="px-5 py-4" />
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {result.products.map((product) => (
                <tr
                  key={product.id}
                  className="transition hover:bg-white/[0.025]"
                >
                  <td className="px-5 py-4 font-mono text-xs whitespace-nowrap text-white/50">
                    {product.code}
                  </td>

                  <td className="px-5 py-4">
                    <p className="max-w-md font-medium text-white">
                      {product.name}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-white/60">
                    {product.brandName ?? "—"}
                  </td>

                  <td className="px-5 py-4 text-white/60">
                    {product.categoryName ?? "—"}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={product.status} />
                  </td>

                  <td className="px-5 py-4 text-right">
                    <span
                      className={
                        product.availableQuantity > 0
                          ? "text-emerald-300"
                          : "text-red-300"
                      }
                    >
                      {product.availableQuantity}
                    </span>

                    {product.reservedQuantity > 0 ? (
                      <p className="mt-1 text-xs text-white/30">
                        {product.reservedQuantity} riservati
                      </p>
                    ) : null}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/prodotti/${product.id}`}
                      className="text-sm font-medium text-orange-300 transition hover:text-orange-200"
                    >
                      Apri
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {result.products.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-white/45">
              Nessun prodotto corrisponde ai filtri selezionati.
            </p>

            <Link
              href="/admin/prodotti"
              className="mt-4 inline-flex text-sm font-medium text-orange-300 hover:text-orange-200"
            >
              Azzera i filtri
            </Link>
          </div>
        ) : null}

        {result.totalPages > 1 ? (
          <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
            {result.page > 1 ? (
              <Link
                href={buildPageHref(currentParams, result.page - 1)}
                className="rounded-md border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                ← Precedente
              </Link>
            ) : (
              <span />
            )}

            <span className="text-xs text-white/40">
              {result.page} / {result.totalPages}
            </span>

            {result.page < result.totalPages ? (
              <Link
                href={buildPageHref(currentParams, result.page + 1)}
                className="rounded-md border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                Successiva →
              </Link>
            ) : (
              <span />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const active = status === "active";

  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        active
          ? "bg-emerald-500/10 text-emerald-300"
          : "bg-white/10 text-white/50",
      ].join(" ")}
    >
      {active ? "Attivo" : "Bozza"}
    </span>
  );
}
