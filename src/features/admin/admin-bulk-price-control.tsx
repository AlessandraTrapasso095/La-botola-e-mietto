"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { AdminConfirmDialog } from "@/features/admin/admin-confirm-dialog";
import { useAdminProductSelection } from "@/features/admin/admin-product-selection";
import {
  applyAdminBulkPriceAdjustment,
  previewAdminBulkPriceAdjustment,
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
  const { selectedIds, selectedCount, clearSelection } =
    useAdminProductSelection();

  const [scopeMode, setScopeMode] = useState<"selected" | "filtered">("selected");
  const [adjustmentMode, setAdjustmentMode] =
    useState<"increase" | "decrease">("increase");
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

  const selectedMode = scopeMode === "selected";

  function input() {
    return {
      ...filters,
      operation: adjustmentMode,
      percentage: parsedPercentage,
      productIds: selectedMode ? selectedIds : null,
    };
  }

  function requestPreview() {
    if (!validPercentage || isPending) {
      setError("Inserisci una percentuale maggiore di 0 e non superiore a 100.");
      return;
    }

    if (selectedMode && selectedCount === 0) {
      setError("Seleziona almeno un prodotto dalla lista.");
      return;
    }

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const result = await previewAdminBulkPriceAdjustment(input());
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
        const result = await applyAdminBulkPriceAdjustment(input());

        setDialogOpen(false);
        setPreview(null);
        setSuccess(
          `Prezzi aggiornati correttamente per ${result.updatedCount.toLocaleString(
            "it-IT",
          )} prodotti.`,
        );
        if (selectedMode) {
          clearSelection();
        }
        router.refresh();
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Impossibile applicare la modifica.",
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
            Modifica prezzi in blocco
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/50">
            Aumenta o riduci in percentuale i prezzi di {scopeLabel}. Prima di
            salvare vedrai sempre un’anteprima dei nuovi prezzi.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <div className="mb-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setAdjustmentMode("increase");
                setPreview(null);
                setError(null);
                setSuccess(null);
              }}
              className={[
                "rounded-xl border px-4 py-4 text-left transition",
                adjustmentMode === "increase"
                  ? "border-emerald-400/50 bg-emerald-500/10"
                  : "border-white/10 bg-[#111111] hover:bg-white/[0.04]",
              ].join(" ")}
            >
              <p className="text-sm font-semibold text-white">
                Aumento prezzo
              </p>
              <p className="mt-1 text-xs leading-5 text-white/40">
                Aumenta il prezzo dei prodotti della percentuale indicata.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setAdjustmentMode("decrease");
                setPreview(null);
                setError(null);
                setSuccess(null);
              }}
              className={[
                "rounded-xl border px-4 py-4 text-left transition",
                adjustmentMode === "decrease"
                  ? "border-red-400/50 bg-red-500/10"
                  : "border-white/10 bg-[#111111] hover:bg-white/[0.04]",
              ].join(" ")}
            >
              <p className="text-sm font-semibold text-white">
                Riduzione prezzo
              </p>
              <p className="mt-1 text-xs leading-5 text-white/40">
                Riduce il prezzo dei prodotti della percentuale indicata.
              </p>
            </button>
          </div>

          <div className="mb-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setScopeMode("selected");
                setPreview(null);
                setError(null);
                setSuccess(null);
              }}
              className={[
                "rounded-xl border px-4 py-4 text-left transition",
                selectedMode
                  ? "border-orange-400/50 bg-orange-500/10"
                  : "border-white/10 bg-[#111111] hover:bg-white/[0.04]",
              ].join(" ")}
            >
              <p className="text-sm font-semibold text-white">
                Solo prodotti selezionati
              </p>
              <p className="mt-1 text-xs leading-5 text-white/40">
                {selectedCount === 0
                  ? "Spunta dalla lista i prodotti che vuoi modificare."
                  : `${selectedCount.toLocaleString("it-IT")} ${
                      selectedCount === 1
                        ? "prodotto selezionato"
                        : "prodotti selezionati"
                    }`}
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setScopeMode("filtered");
                setPreview(null);
                setError(null);
                setSuccess(null);
              }}
              className={[
                "rounded-xl border px-4 py-4 text-left transition",
                !selectedMode
                  ? "border-orange-400/50 bg-orange-500/10"
                  : "border-white/10 bg-[#111111] hover:bg-white/[0.04]",
              ].join(" ")}
            >
              <p className="text-sm font-semibold text-white">
                Tutti i risultati filtrati
              </p>
              <p className="mt-1 text-xs leading-5 text-white/40">
                Coinvolge {filteredProductCount.toLocaleString("it-IT")} prodotti.
                Usa questa opzione solo per modifiche davvero massive.
              </p>
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[220px_1fr_auto] lg:items-end">
            <label className="space-y-2">
              <span className="text-xs font-medium text-white/50">
                {adjustmentMode === "increase"
                  ? "Aumento percentuale"
                  : "Riduzione percentuale"}
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
                {selectedMode
                  ? selectedCount === 0
                    ? "Nessun prodotto selezionato"
                    : `${selectedCount.toLocaleString("it-IT")} selezionati`
                  : scopeLabel}
              </p>
              <p className="mt-1 text-xs text-white/30">
                {selectedMode
                  ? "Spunta i prodotti direttamente nella lista qui sotto."
                  : "Verranno coinvolti tutti i prodotti che rispettano i filtri correnti."}
              </p>
            </div>

            <button
              type="button"
              disabled={
                !validPercentage ||
                isPending ||
                (selectedMode && selectedCount === 0)
              }
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
                    {adjustmentMode === "increase"
                      ? `Applica aumento del ${parsedPercentage}%`
                      : `Applica riduzione del ${parsedPercentage}%`}
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
        title={
          adjustmentMode === "increase"
            ? `Confermi l’aumento del ${parsedPercentage}%?`
            : `Confermi la riduzione del ${parsedPercentage}%?`
        }
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
