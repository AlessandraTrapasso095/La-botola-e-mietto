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
  if (value === "active" || value === "draft" || value === "archived") {
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
    <div className="min-w-0 space-y-6 sm:space-y-8">
      <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
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

        <div className="flex flex-col gap-3 sm:items-end">
          <Link
            href="/admin/prodotti/nuovo"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-5 text-sm font-semibold text-black transition hover:bg-orange-400 sm:w-auto"
          >
            <span className="text-xl leading-none">+</span>
            Nuovo prodotto
          </Link>

          <div className="w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm text-white/60 sm:w-auto sm:text-right">
            {result.totalCount.toLocaleString("it-IT")}{" "}
            {result.totalCount === 1 ? "prodotto" : "prodotti"}
          </div>
        </div>
      </div>

      <form
        method="get"
        className="grid min-w-0 gap-4 rounded-lg border border-white/10 bg-[#171717] p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3 xl:grid-cols-6"
      >
        <label className="min-w-0 space-y-2 sm:col-span-2">
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
            <option value="archived">Archiviati</option>
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

        <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2 lg:col-span-3 xl:col-span-6 xl:flex">
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center rounded-md bg-orange-500 px-5 text-sm font-semibold text-black transition hover:bg-orange-400 xl:w-auto"
          >
            Applica filtri
          </button>

          {hasFilters ? (
            <Link
              href="/admin/prodotti"
              className="inline-flex h-11 w-full items-center justify-center rounded-md border border-white/10 px-5 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white xl:w-auto"
            >
              Azzera filtri
            </Link>
          ) : null}
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#171717]">
        <div className="flex min-w-0 flex-col gap-2 border-b border-white/10 px-4 py-4 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-5">
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

        <div className="divide-y divide-white/10 lg:hidden">
          {result.products.map((product) => (
            <article key={product.id} className="min-w-0 p-4 sm:p-5">
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="font-mono text-xs break-all text-white/40">
                    {product.code}
                  </p>

                  <h2 className="mt-2 font-semibold break-words text-white">
                    {product.name}
                  </h2>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusBadge status={product.status} />

                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                        product.availableQuantity > 0
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-red-500/10 text-red-300",
                      ].join(" ")}
                    >
                      {product.availableQuantity > 0
                        ? `${product.availableQuantity} disponibili`
                        : "Esaurito"}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/admin/prodotti/${product.id}`}
                  className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-md bg-orange-500 px-4 text-sm font-semibold text-black transition hover:bg-orange-400 sm:w-auto"
                >
                  Apri
                </Link>
              </div>

              <dl className="mt-4 grid min-w-0 grid-cols-2 gap-3">
                <div className="min-w-0 rounded-md border border-white/[0.07] bg-[#111111] p-3">
                  <dt className="text-[11px] text-white/35">Marchio</dt>

                  <dd className="mt-1 text-sm break-words text-white/70">
                    {product.brandName ?? "—"}
                  </dd>
                </div>

                <div className="min-w-0 rounded-md border border-white/[0.07] bg-[#111111] p-3">
                  <dt className="text-[11px] text-white/35">Categoria</dt>

                  <dd className="mt-1 text-sm break-words text-white/70">
                    {product.categoryName ?? "—"}
                  </dd>
                </div>

                {product.reservedQuantity > 0 ? (
                  <div className="col-span-2 min-w-0 rounded-md border border-white/[0.07] bg-[#111111] p-3">
                    <dt className="text-[11px] text-white/35">
                      Quantità riservata
                    </dt>

                    <dd className="mt-1 text-sm font-medium text-white/70">
                      {product.reservedQuantity}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </article>
          ))}
        </div>

        <div className="hidden lg:block">
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
          <div className="grid grid-cols-2 gap-3 border-t border-white/10 px-4 py-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:px-5">
            {result.page > 1 ? (
              <Link
                href={buildPageHref(currentParams, result.page - 1)}
                className="inline-flex min-h-10 w-full items-center justify-center rounded-md border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white sm:w-auto sm:justify-self-start"
              >
                ← Precedente
              </Link>
            ) : (
              <span />
            )}

            <span className="col-span-2 row-start-1 text-center text-xs text-white/40 sm:col-span-1 sm:col-start-2">
              {result.page} / {result.totalPages}
            </span>

            {result.page < result.totalPages ? (
              <Link
                href={buildPageHref(currentParams, result.page + 1)}
                className="inline-flex min-h-10 w-full items-center justify-center rounded-md border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white sm:w-auto sm:justify-self-end"
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
  const config =
    status === "active"
      ? {
          label: "Attivo",
          className: "bg-emerald-500/10 text-emerald-300",
        }
      : status === "archived"
        ? {
            label: "Archiviato",
            className: "bg-red-500/10 text-red-300",
          }
        : {
            label: "Bozza",
            className: "bg-white/10 text-white/50",
          };

  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        config.className,
      ].join(" ")}
    >
      {config.label}
    </span>
  );
}
