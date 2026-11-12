"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { AdminConfirmDialog } from "@/features/admin/admin-confirm-dialog";
import {
  applyAdminBulkPriceIncrease,
  previewAdminBulkPriceIncrease,
  type AdminBulkPriceFilters,
  type AdminBulkPricePreview,
} from "@/server/admin/admin-bulk-prices";

function formatMoney(amountMinor: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(amountMinor / 100);
}

function grossMinor(netMinor: number, vatRateBasisPoints: number) {
  return Math.round(netMinor * (1 + vatRateBasisPoints / 10_000));
}

export function AdminBulkPriceControl({
  filters,
  filteredProductCount,
}: {
  filters: AdminBulkPriceFilters;
  filteredProductCount: number;
}) {
  const router = useRouter();

  const [percentage, setPercentage] = useState("5");
  const [preview, setPreview] = useState<AdminBulkPricePreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const parsedPercentage = Number(percentage.replace(",", "."));
  const validPercentage =
    Number.isFinite(parsedPercentage) &&
    parsedPercentage > 0 &&
    parsedPercentage <= 100;

  const scopeLabel = useMemo(() => {
    const hasFilters =
      Boolean(filters.query) ||
      filters.status !== "all" ||
      Boolean(filters.brandId) ||
      Boolean(filters.categoryId) ||
      filters.availability !== "all";

    return hasFilters
      ? `${filteredProductCount.toLocaleString("it-IT")} prodotti filtrati`
      : `tutti i ${filteredProductCount.toLocaleString("it-IT")} prodotti`;
  }, [filters, filteredProductCount]);

  function input() {
    return {
      ...filters,
      percentage: parsedPercentage,
    };
  }

  function requestPreview() {
    if (!validPercentage || isPending) {
      setError("Inserisci una percentuale maggiore di 0 e non superiore a 100.");
      return;
    }

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const result = await previewAdminBulkPriceIncrease(input());
        setPreview(result);
      } catch (caught) {
        setPreview(null);
        setError(
          caught instanceof Error
            ? caught.message
            : "Impossibile preparare l’anteprima.",
        );
      }
    });
  }

  function requestApply() {
    if (!preview || preview.totalCount === 0 || !validPercentage || isPending) {
      return;
    }

    setDialogOpen(true);
    setError(null);
  }

  function confirmApply() {
    if (!preview || !validPercentage || isPending) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await applyAdminBulkPriceIncrease(input());

        setDialogOpen(false);
        setPreview(null);
        setSuccess(
          `Prezzi aggiornati correttamente per ${result.updatedCount.toLocaleString(
            "it-IT",
          )} prodotti.`,
        );
        router.refresh();
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Impossibile applicare l’aumento.",
        );
      }
    });
  }

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-orange-400/30 bg-gradient-to-br from-orange-500/[0.10] via-[#171717] to-[#171717]">
        <div className="border-b border-orange-400/15 px-5 py-5 sm:px-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-orange-300 uppercase">
            Modifica rapida
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Aumenta prezzi in blocco
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/50">
            Applica un aumento percentuale a {scopeLabel}. Prima di salvare
            vedrai sempre un’anteprima dei nuovi prezzi.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[220px_1fr_auto] lg:items-end">
            <label className="space-y-2">
              <span className="text-xs font-medium text-white/50">
                Aumento percentuale
              </span>

              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={percentage}
                  disabled={isPending}
                  onChange={(event) => {
                    setPercentage(event.target.value);
                    setPreview(null);
                    setError(null);
                    setSuccess(null);
                  }}
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#111111] px-4 pr-10 text-base font-semibold text-white outline-none transition focus:border-orange-400/60 disabled:opacity-50"
                />

                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/35">
                  %
                </span>
              </div>
            </label>

            <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-xs text-white/40">Prodotti interessati</p>
              <p className="mt-1 text-base font-semibold text-white">
                {scopeLabel}
              </p>
              <p className="mt-1 text-xs text-white/30">
                Per restringere l’aumento usa prima i filtri prodotti qui sopra.
              </p>
            </div>

            <button
              type="button"
              disabled={!validPercentage || isPending}
              onClick={requestPreview}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-5 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40 lg:w-auto"
            >
              {isPending ? "Calcolo…" : "Mostra anteprima"}
            </button>
          </div>

          {error ? (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </div>
          ) : null}

          {success ? (
            <div
              role="status"
              className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300"
            >
              {success}
            </div>
          ) : null}

          {preview ? (
            <div className="mt-6 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-[#111111] p-4">
                  <p className="text-xs text-white/40">Saranno modificati</p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {preview.totalCount.toLocaleString("it-IT")}
                  </p>
                  <p className="mt-1 text-xs text-white/30">prodotti</p>
                </div>

                <div
                  className={[
                    "rounded-xl border p-4",
                    preview.activeOfferCount > 0
                      ? "border-amber-400/20 bg-amber-400/[0.07]"
                      : "border-white/10 bg-[#111111]",
                  ].join(" ")}
                >
                  <p className="text-xs text-white/40">Con offerta attiva</p>
                  <p className="mt-1 text-2xl font-semibold text-amber-200">
                    {preview.activeOfferCount.toLocaleString("it-IT")}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-white/35">
                    Le offerte attive non vengono modificate automaticamente.
                  </p>
                </div>
              </div>

              {preview.items.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <div className="border-b border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-sm font-semibold text-white">
                      Esempio dei nuovi prezzi
                    </p>
                    <p className="mt-1 text-xs text-white/35">
                      Sono mostrati al massimo 10 prodotti. I valori includono
                      l’IVA configurata su ciascun prodotto.
                    </p>
                  </div>

                  <div className="divide-y divide-white/10">
                    {preview.items.map((item) => (
                      <div
                        key={item.productId}
                        className="grid gap-3 px-4 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">
                            {item.name}
                          </p>
                          <p className="mt-1 font-mono text-xs text-white/35">
                            {item.code}
                            {item.hasActiveOffer ? " · OFFERTA ATTIVA" : ""}
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-xs text-white/35">Prima</p>
                          <p className="mt-1 text-sm text-white/60 line-through">
                            {formatMoney(
                              grossMinor(
                                item.currentNetAmountMinor,
                                item.vatRateBasisPoints,
                              ),
                            )}
                          </p>
                        </div>

                        <div className="text-left sm:min-w-24 sm:text-right">
                          <p className="text-xs text-emerald-300/60">Dopo</p>
                          <p className="mt-1 text-base font-semibold text-emerald-300">
                            {formatMoney(
                              grossMinor(
                                item.newNetAmountMinor,
                                item.vatRateBasisPoints,
                              ),
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-[#111111] px-4 py-5 text-sm text-white/45">
                  Nessun prodotto corrisponde ai filtri selezionati.
                </div>
              )}

              {preview.totalCount > 0 ? (
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={requestApply}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-500 px-6 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    Applica aumento del {parsedPercentage}%
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      <AdminConfirmDialog
        open={dialogOpen}
        eyebrow="Modifica massiva prezzi"
        title={`Confermi l’aumento del ${parsedPercentage}%?`}
        description={
          <>
            Stai per modificare il prezzo di{" "}
            <strong className="font-semibold text-white">
              {preview?.totalCount.toLocaleString("it-IT") ?? 0} prodotti
            </strong>
            .
            <br />
            <br />
            Lo storico dei prezzi sarà conservato. Le offerte già attive non
            verranno modificate automaticamente.
          </>
        }
        confirmLabel="Sì, aggiorna i prezzi"
        pendingLabel="Aggiornamento…"
        pending={isPending}
        error={error}
        tone="danger"
        onConfirm={confirmApply}
        onCancel={() => {
          if (!isPending) setDialogOpen(false);
        }}
      />
    </>
  );
}
