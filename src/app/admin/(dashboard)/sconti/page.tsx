import type { Metadata } from "next";
import Link from "next/link";

import { AdminPromotionCodeManager } from "@/features/admin/admin-promotion-code-manager";
import {
  getAdminOffers,
  type AdminOfferStatus,
} from "@/server/admin/admin-offers";
import {
  getAdminPromotionCodes,
  type AdminPromotionCode,
} from "@/server/admin/admin-promotion-codes";

export const metadata: Metadata = {
  title: "Sconti",
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

function parseStatus(value: string): AdminOfferStatus {
  if (value === "active" || value === "inactive") {
    return value;
  }

  return "all";
}

function buildPageHref(current: URLSearchParams, page: number) {
  const params = new URLSearchParams(current);

  params.set("page", String(page));

  return `/admin/sconti?${params.toString()}`;
}

function formatMoney(amountMinor: number | null, currency = "EUR") {
  if (amountMinor === null) {
    return "—";
  }

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
  }).format(amountMinor / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function calculateGrossMinor(
  netAmountMinor: number | null,
  vatRateBasisPoints: number | null,
) {
  if (netAmountMinor === null || vatRateBasisPoints === null) {
    return null;
  }

  return Math.round(netAmountMinor * (1 + vatRateBasisPoints / 10_000));
}

function offerStatusClasses(isActive: boolean) {
  return isActive
    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
    : "border-white/10 bg-white/[0.03] text-white/45";
}

function promotionCodeStatusClasses(isActive: boolean) {
  return isActive
    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
    : "border-white/10 bg-white/[0.03] text-white/45";
}

function formatPromotionDiscount(code: AdminPromotionCode) {
  if (code.discountType === "percentage") {
    return `−${code.discountValue}%`;
  }

  return `−${formatMoney(code.discountValue, code.currency)}`;
}

function formatPromotionWindow(code: AdminPromotionCode) {
  if (!code.startsAt && !code.endsAt) {
    return "Sempre valida";
  }

  if (code.startsAt && code.endsAt) {
    return `${formatDate(code.startsAt)} → ${formatDate(code.endsAt)}`;
  }

  if (code.startsAt) {
    return `Dal ${formatDate(code.startsAt)}`;
  }

  return `Fino al ${formatDate(code.endsAt!)}`;
}

function promotionCodeRuntimeStatus(code: AdminPromotionCode) {
  if (!code.isActive) {
    return "Disattivato";
  }

  const now = Date.now();

  if (code.startsAt && new Date(code.startsAt).getTime() > now) {
    return "Programmato";
  }

  if (code.endsAt && new Date(code.endsAt).getTime() <= now) {
    return "Scaduto";
  }

  if (code.usageLimit !== null && code.usageCount >= code.usageLimit) {
    return "Esaurito";
  }

  return "Attivo";
}

export default async function AdminDiscountsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const query = getSingleParam(params, "q").trim();
  const status = parseStatus(getSingleParam(params, "status"));
  const requestedPage = parsePage(getSingleParam(params, "page"));

  const [result, promotionCodes] = await Promise.all([
    getAdminOffers({
      query,
      status,
      page: requestedPage,
    }),
    getAdminPromotionCodes(),
  ]);

  const promotionSummary = {
    totalCount: promotionCodes.length,
    activeCount: promotionCodes.filter((code) => code.isActive).length,
    inactiveCount: promotionCodes.filter((code) => !code.isActive).length,
    usageCount: promotionCodes.reduce(
      (total, code) => total + code.usageCount,
      0,
    ),
  };

  const currentParams = new URLSearchParams();

  if (query) currentParams.set("q", query);
  if (status !== "all") currentParams.set("status", status);

  const from =
    result.totalCount === 0 ? 0 : (result.page - 1) * result.pageSize + 1;

  const to = Math.min(result.page * result.pageSize, result.totalCount);

  const hasFilters = Boolean(query) || status !== "all";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-orange-400 uppercase">
            Promozioni
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-white">Sconti</h1>

          <p className="mt-2 max-w-2xl text-sm text-white/50">
            Controlla le offerte prodotto attive e lo storico delle promozioni.
            Per modificare uno sconto apri il relativo prodotto.
          </p>
        </div>

        <Link
          href="/admin/prodotti"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-orange-500 px-5 text-sm font-semibold text-black transition hover:bg-orange-400"
        >
          Gestisci prodotti
        </Link>
      </div>

      <section className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-orange-400 uppercase">
              Codici promozionali
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Coupon checkout
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-white/45">
              Controlla i codici applicabili al checkout, la loro validità e gli
              utilizzi registrati.
            </p>
          </div>
        </div>

        <AdminPromotionCodeManager promotionCodes={promotionCodes} />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Codici totali"
            value={promotionSummary.totalCount}
          />

          <SummaryCard
            label="Codici attivi"
            value={promotionSummary.activeCount}
            emphasis
          />

          <SummaryCard
            label="Codici disattivati"
            value={promotionSummary.inactiveCount}
          />

          <SummaryCard
            label="Utilizzi registrati"
            value={promotionSummary.usageCount}
          />
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10 bg-[#171717]">
          {promotionCodes.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="font-medium text-white/80">
                Nessun codice promozionale configurato.
              </p>

              <p className="mt-2 text-sm text-white/40">
                I codici creati dall’amministrazione compariranno qui.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] divide-y divide-white/10 text-sm">
                <thead className="bg-white/[0.03]">
                  <tr className="text-left text-xs font-semibold tracking-wide text-white/40 uppercase">
                    <th className="px-5 py-4">Codice</th>
                    <th className="px-5 py-4">Sconto</th>
                    <th className="px-5 py-4">Ordine minimo</th>
                    <th className="px-5 py-4">Utilizzi</th>
                    <th className="px-5 py-4">Validità</th>
                    <th className="px-5 py-4">Stato</th>
                    <th className="px-5 py-4">Aggiornato</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {promotionCodes.map((code) => {
                    const runtimeStatus = promotionCodeRuntimeStatus(code);

                    return (
                      <tr
                        key={code.id}
                        className="transition hover:bg-white/[0.025]"
                      >
                        <td className="px-5 py-4">
                          <p className="font-mono font-semibold text-white">
                            {code.code}
                          </p>

                          <p className="mt-1 max-w-xs text-xs text-white/35">
                            {code.description || "Nessuna descrizione"}
                          </p>
                        </td>

                        <td className="px-5 py-4 font-semibold text-orange-300">
                          {formatPromotionDiscount(code)}
                        </td>

                        <td className="px-5 py-4 text-white/65">
                          {code.minimumOrderGrossAmountMinor === 0
                            ? "Nessun minimo"
                            : formatMoney(
                                code.minimumOrderGrossAmountMinor,
                                code.currency,
                              )}
                        </td>

                        <td className="px-5 py-4 text-white/65">
                          {code.usageLimit === null
                            ? `${code.usageCount} / ∞`
                            : `${code.usageCount} / ${code.usageLimit}`}
                        </td>

                        <td className="px-5 py-4 text-xs leading-5 text-white/50">
                          {formatPromotionWindow(code)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${promotionCodeStatusClasses(
                              code.isActive,
                            )}`}
                          >
                            {runtimeStatus}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-white/55">
                          {formatDate(code.updatedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <div className="border-t border-white/10 pt-2" />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Offerte attive"
          value={result.summary.activeCount}
          emphasis
        />

        <SummaryCard
          label="Offerte archiviate"
          value={result.summary.inactiveCount}
        />

        <SummaryCard label="Righe storico" value={result.summary.totalCount} />

        <SummaryCard
          label="Prodotti coinvolti"
          value={result.summary.involvedProductsCount}
        />
      </div>

      <form
        method="get"
        className="grid gap-4 rounded-lg border border-white/10 bg-[#171717] p-5 md:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)_auto]"
      >
        <label className="space-y-2">
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
          <span className="text-xs font-medium text-white/50">
            Stato offerta
          </span>

          <select
            name="status"
            defaultValue={status}
            className="h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none focus:border-orange-400/60"
          >
            <option value="all">Tutte</option>
            <option value="active">Attive</option>
            <option value="inactive">Archiviate</option>
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
              href="/admin/sconti"
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
              ? "Nessuna offerta trovata"
              : `Risultati ${from.toLocaleString("it-IT")}-${to.toLocaleString(
                  "it-IT",
                )} di ${result.totalCount.toLocaleString("it-IT")}`}
          </span>

          <span>
            Pagina {result.page} di {result.totalPages}
          </span>
        </div>

        {result.offers.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-medium text-white/80">
              Nessuna offerta corrisponde ai filtri selezionati.
            </p>

            <p className="mt-2 text-sm text-white/40">
              Puoi creare o modificare un’offerta dal dettaglio di un prodotto.
            </p>

            <Link
              href="/admin/prodotti"
              className="mt-5 inline-flex text-sm font-medium text-orange-300 transition hover:text-orange-200"
            >
              Vai ai prodotti →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] divide-y divide-white/10 text-sm">
              <thead className="bg-white/[0.03]">
                <tr className="text-left text-xs font-semibold tracking-wide text-white/40 uppercase">
                  <th className="px-5 py-4">Prodotto</th>
                  <th className="px-5 py-4">Listino</th>
                  <th className="px-5 py-4">Promozione</th>
                  <th className="px-5 py-4">Sconto</th>
                  <th className="px-5 py-4">Stato</th>
                  <th className="px-5 py-4">Creata</th>
                  <th className="px-5 py-4">Ultimo aggiornamento</th>
                  <th className="px-5 py-4" />
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {result.offers.map((offer) => {
                  const currency = offer.currency ?? "EUR";

                  const regularGrossAmountMinor = calculateGrossMinor(
                    offer.regularNetAmountMinor,
                    offer.vatRateBasisPoints,
                  );

                  const promotionalGrossAmountMinor = calculateGrossMinor(
                    offer.promotionalNetAmountMinor,
                    offer.vatRateBasisPoints,
                  );

                  return (
                    <tr
                      key={offer.id}
                      className="transition hover:bg-white/[0.025]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-white">
                          {offer.productName}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/35">
                          <span className="font-mono">{offer.productCode}</span>

                          <span>Prodotto: {offer.productStatus}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-medium text-white/70">
                        {formatMoney(regularGrossAmountMinor, currency)}
                      </td>

                      <td className="px-5 py-4 font-semibold text-orange-300">
                        {formatMoney(promotionalGrossAmountMinor, currency)}
                      </td>

                      <td className="px-5 py-4">
                        {offer.discountPercentage === null ? (
                          <span className="text-white/35">—</span>
                        ) : (
                          <span className="font-semibold text-orange-300">
                            −{offer.discountPercentage}%
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${offerStatusClasses(
                            offer.isActive,
                          )}`}
                        >
                          {offer.isActive ? "Attiva" : "Archiviata"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-white/55">
                        {formatDate(offer.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-white/55">
                        {formatDate(offer.updatedAt)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/prodotti/${offer.productId}`}
                          className="text-sm font-medium whitespace-nowrap text-orange-300 transition hover:text-orange-200"
                        >
                          Apri prodotto
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

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

function SummaryCard({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: number;
  emphasis?: boolean;
}) {
  return (
    <div
      className={
        emphasis
          ? "rounded-lg border border-orange-400/20 bg-orange-400/5 p-4"
          : "rounded-lg border border-white/10 bg-[#171717] p-4"
      }
    >
      <p
        className={
          emphasis ? "text-xs text-orange-300/70" : "text-xs text-white/40"
        }
      >
        {label}
      </p>

      <p
        className={
          emphasis
            ? "mt-2 text-2xl font-semibold text-orange-300"
            : "mt-2 text-2xl font-semibold text-white"
        }
      >
        {value.toLocaleString("it-IT")}
      </p>
    </div>
  );
}
