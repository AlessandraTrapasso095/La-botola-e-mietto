import type { Metadata } from "next";
import Link from "next/link";

import {
  getAdminCustomers,
  type AdminCustomerMarketingFilter,
} from "@/server/admin/admin-customers";

export const metadata: Metadata = {
  title: "Clienti",
};

type SearchParams = Record<string, string | string[] | undefined>;

function getSingleParam(searchParams: SearchParams, key: string) {
  const value = searchParams[key];

  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function parsePage(value: string) {
  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function parseMarketing(value: string): AdminCustomerMarketingFilter {
  if (value === "consented" || value === "not_consented") {
    return value;
  }

  return "all";
}

function buildPageHref(current: URLSearchParams, page: number) {
  const params = new URLSearchParams(current);

  params.set("page", String(page));

  return `/admin/clienti?${params.toString()}`;
}

function formatMoney(amountMinor: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(amountMinor / 100);
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const query = getSingleParam(params, "q").trim();
  const marketing = parseMarketing(getSingleParam(params, "marketing"));
  const requestedPage = parsePage(getSingleParam(params, "page"));

  const result = await getAdminCustomers({
    query,
    marketing,
    page: requestedPage,
  });

  const currentParams = new URLSearchParams();

  if (query) currentParams.set("q", query);
  if (marketing !== "all") currentParams.set("marketing", marketing);

  const from =
    result.totalCount === 0 ? 0 : (result.page - 1) * result.pageSize + 1;
  const to = Math.min(result.page * result.pageSize, result.totalCount);

  const hasFilters = Boolean(query) || marketing !== "all";

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-orange-400 uppercase">
          Customer Management
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-white">Clienti</h1>

        <p className="mt-2 max-w-2xl text-sm text-white/50">
          Consulta anagrafica, consenso marketing e storico commerciale dei
          clienti registrati.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          label="Clienti totali"
          value={result.summary.totalCustomers}
        />

        <SummaryCard
          label="Consenso marketing"
          value={result.summary.marketingConsentedCount}
        />

        <SummaryCard
          label="Con almeno un ordine"
          value={result.summary.customersWithOrdersCount}
        />

        <SummaryCard
          label="Clienti paganti"
          value={result.summary.paidCustomersCount}
          emphasis
        />

        <SummaryCard
          label="Totale acquistato"
          value={formatMoney(result.summary.paidGrossAmountMinor)}
        />
      </div>

      <form
        method="get"
        className="grid gap-4 rounded-lg border border-white/10 bg-[#171717] p-5 md:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)_auto]"
      >
        <label className="space-y-2">
          <span className="text-xs font-medium text-white/50">
            Cerca cliente
          </span>

          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Nome, cognome, email o telefono..."
            className="h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white transition outline-none placeholder:text-white/25 focus:border-orange-400/60"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-medium text-white/50">
            Consenso marketing
          </span>

          <select
            name="marketing"
            defaultValue={marketing}
            className="h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none focus:border-orange-400/60"
          >
            <option value="all">Tutti</option>
            <option value="consented">Consenso attivo</option>
            <option value="not_consented">Consenso assente</option>
          </select>
        </label>

        <div className="flex items-end gap-3">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-md bg-orange-500 px-5 text-sm font-semibold text-black transition hover:bg-orange-400"
          >
            Applica
          </button>

          {hasFilters ? (
            <Link
              href="/admin/clienti"
              className="inline-flex h-11 items-center justify-center rounded-md border border-white/10 px-5 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              Azzera
            </Link>
          ) : null}
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#171717]">
        <div className="flex flex-col gap-2 border-b border-white/10 px-5 py-4 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>
            {result.totalCount === 0
              ? "Nessun cliente trovato"
              : `Risultati ${from.toLocaleString("it-IT")}-${to.toLocaleString(
                  "it-IT",
                )} di ${result.totalCount.toLocaleString("it-IT")}`}
          </span>

          <span>
            Pagina {result.page} di {result.totalPages}
          </span>
        </div>

        {result.customers.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-medium text-white/80">
              Nessun cliente corrisponde ai criteri.
            </p>

            <p className="mt-2 text-sm text-white/40">
              Modifica la ricerca o azzera i filtri.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <table className="w-full table-fixed divide-y divide-white/10 text-[13px]">
              <colgroup>
                <col className="w-[29%]" />
                <col className="w-[15%]" />
                <col className="w-[14%]" />
                <col className="w-[14%]" />
                <col className="w-[18%]" />
                <col className="w-[10%]" />
              </colgroup>

              <thead className="bg-white/[0.03]">
                <tr className="text-left text-xs font-semibold tracking-wide text-white/40 uppercase">
                  <th className="px-4 py-4">Cliente</th>
                  <th className="px-4 py-4">Marketing</th>
                  <th className="px-4 py-4">Ordini</th>
                  <th className="px-4 py-4">Acquistato</th>
                  <th className="px-4 py-4">Attività</th>
                  <th className="px-4 py-4 text-right">Azioni</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {result.customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="transition hover:bg-white/[0.025]"
                  >
                    <td className="px-4 py-4 align-top">
                      <p className="font-semibold text-white">
                        {[customer.firstName, customer.lastName]
                          .filter(Boolean)
                          .join(" ") || "Cliente"}
                      </p>

                      <p className="mt-1 truncate text-white/60">
                        {customer.email}
                      </p>

                      <p className="mt-1 truncate text-xs text-white/35">
                        {customer.phone || "Telefono non indicato"}
                      </p>
                    </td>

                    <td className="px-4 py-4 align-top">
                      {customer.marketingConsent ? (
                        <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[11px] font-semibold text-emerald-300">
                          Attivo
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] font-semibold text-white/40">
                          Assente
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4 align-top">
                      <p className="font-semibold text-white">
                        {customer.orderCount.toLocaleString("it-IT")} totali
                      </p>

                      <p className="mt-1 text-xs font-medium text-emerald-300">
                        {customer.paidOrderCount.toLocaleString("it-IT")} pagati
                      </p>
                    </td>

                    <td className="px-4 py-4 align-top font-semibold text-orange-300">
                      {formatMoney(customer.paidGrossAmountMinor)}
                    </td>

                    <td className="px-4 py-4 align-top">
                      <p className="text-white/65">
                        Ultimo: {formatDate(customer.lastOrderAt)}
                      </p>

                      <p className="mt-1 text-xs text-white/35">
                        Registrato: {formatDate(customer.createdAt)}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-right align-top">
                      <Link
                        href={`/admin/clienti/${customer.id}`}
                        className="inline-flex min-h-9 items-center justify-center rounded-md border border-white/10 px-3 text-xs font-semibold text-white/70 transition hover:border-orange-400/30 hover:text-white"
                      >
                        Dettaglio
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {result.totalPages > 1 ? (
        <div className="flex items-center justify-between gap-4">
          <div>
            {result.page > 1 ? (
              <Link
                href={buildPageHref(currentParams, result.page - 1)}
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/10 px-4 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                Precedente
              </Link>
            ) : null}
          </div>

          <p className="text-sm text-white/40">
            Pagina {result.page} di {result.totalPages}
          </p>

          <div>
            {result.page < result.totalPages ? (
              <Link
                href={buildPageHref(currentParams, result.page + 1)}
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/10 px-4 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                Successiva
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: number | string;
  emphasis?: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#171717] p-5">
      <p className="text-xs font-medium tracking-wide text-white/40 uppercase">
        {label}
      </p>

      <p
        className={
          emphasis
            ? "mt-2 text-2xl font-semibold text-orange-300"
            : "mt-2 text-2xl font-semibold text-white"
        }
      >
        {typeof value === "number" ? value.toLocaleString("it-IT") : value}
      </p>
    </div>
  );
}
