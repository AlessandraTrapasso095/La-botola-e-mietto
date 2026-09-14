"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { AdminConfirmDialog } from "@/features/admin/admin-confirm-dialog";
import {
  deactivateAdminProductOffer,
  setAdminProductOffer,
} from "@/server/admin/admin-product-offer";
import type { AdminProductOffer } from "@/server/admin/admin-products";

function formatMoney(amountMinor: number | null, currency = "EUR") {
  if (amountMinor === null) {
    return "—";
  }

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
  }).format(amountMinor / 100);
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

function calculateDiscountPercentage(
  regularNetAmountMinor: number | null,
  promotionalNetAmountMinor: number | null,
) {
  if (
    regularNetAmountMinor === null ||
    promotionalNetAmountMinor === null ||
    regularNetAmountMinor <= 0 ||
    promotionalNetAmountMinor >= regularNetAmountMinor
  ) {
    return null;
  }

  return Math.round(
    ((regularNetAmountMinor - promotionalNetAmountMinor) /
      regularNetAmountMinor) *
      100,
  );
}

type DialogMode = "set" | "deactivate" | null;

export function AdminProductOfferControl({
  productId,
  currentNetAmountMinor,
  vatRateBasisPoints,
  currency,
  offer,
}: {
  productId: string;
  currentNetAmountMinor: number | null;
  vatRateBasisPoints: number | null;
  currency: string | null;
  offer: AdminProductOffer | null;
}) {
  const router = useRouter();

  const currentDiscountPercentage = calculateDiscountPercentage(
    currentNetAmountMinor,
    offer?.promotionalNetAmountMinor ?? null,
  );

  const [discountPercentage, setDiscountPercentage] = useState(
    String(currentDiscountPercentage ?? 10),
  );
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const parsedDiscountPercentage =
    discountPercentage.trim() === "" ? Number.NaN : Number(discountPercentage);

  const discountIsValid =
    Number.isSafeInteger(parsedDiscountPercentage) &&
    parsedDiscountPercentage >= 1 &&
    parsedDiscountPercentage <= 90;

  const promotionalNetAmountMinor = useMemo(() => {
    if (currentNetAmountMinor === null || !discountIsValid) {
      return null;
    }

    return Math.round(
      (currentNetAmountMinor * (100 - parsedDiscountPercentage)) / 100,
    );
  }, [currentNetAmountMinor, discountIsValid, parsedDiscountPercentage]);

  const regularGrossAmountMinor = calculateGrossMinor(
    currentNetAmountMinor,
    vatRateBasisPoints,
  );

  const promotionalGrossAmountMinor = calculateGrossMinor(
    promotionalNetAmountMinor,
    vatRateBasisPoints,
  );

  const activeOfferGrossAmountMinor = calculateGrossMinor(
    offer?.promotionalNetAmountMinor ?? null,
    vatRateBasisPoints,
  );

  function validateOffer() {
    if (currentNetAmountMinor === null) {
      return "Il prodotto non dispone di un prezzo corrente.";
    }

    if (!discountIsValid) {
      return "Inserisci una percentuale di sconto compresa tra 1 e 90.";
    }

    if (
      promotionalNetAmountMinor === null ||
      promotionalNetAmountMinor <= 0 ||
      promotionalNetAmountMinor >= currentNetAmountMinor
    ) {
      return "Il prezzo promozionale calcolato non è valido.";
    }

    return null;
  }

  function requestSetOffer() {
    if (isPending) {
      return;
    }

    const error = validateOffer();

    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    setActionError(null);
    setDialogMode("set");
  }

  function requestDeactivateOffer() {
    if (!offer || isPending) {
      return;
    }

    setValidationError(null);
    setActionError(null);
    setDialogMode("deactivate");
  }

  function cancelDialog() {
    if (isPending) {
      return;
    }

    setDialogMode(null);
    setActionError(null);
  }

  function confirmSetOffer() {
    const error = validateOffer();

    if (error || isPending) {
      setValidationError(error);
      setDialogMode(null);
      return;
    }

    setActionError(null);

    startTransition(async () => {
      try {
        await setAdminProductOffer(productId, parsedDiscountPercentage);

        setDialogMode(null);
        router.refresh();
      } catch (caught) {
        setActionError(
          caught instanceof Error
            ? caught.message
            : "Impossibile aggiornare l’offerta.",
        );
      }
    });
  }

  function confirmDeactivateOffer() {
    if (!offer || isPending) {
      return;
    }

    setActionError(null);

    startTransition(async () => {
      try {
        await deactivateAdminProductOffer(productId);

        setDialogMode(null);
        router.refresh();
      } catch (caught) {
        setActionError(
          caught instanceof Error
            ? caught.message
            : "Impossibile disattivare l’offerta.",
        );
      }
    });
  }

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.75fr_1.3fr_auto] xl:items-stretch">
        <div className="min-w-0 rounded-md border border-white/10 bg-[#111111] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-white/40">Stato offerta</p>

              <p
                className={[
                  "mt-1 text-sm font-semibold",
                  offer ? "text-emerald-300" : "text-white/60",
                ].join(" ")}
              >
                {offer ? "Offerta attiva" : "Nessuna offerta attiva"}
              </p>
            </div>

            {offer ? (
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                Attiva
              </span>
            ) : null}
          </div>

          {offer ? (
            <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <div>
                <p className="text-xs text-white/40">Prezzo di listino</p>
                <p className="mt-1 text-sm text-white/80">
                  {formatMoney(regularGrossAmountMinor, currency ?? "EUR")}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/40">Prezzo in offerta</p>
                <p className="mt-1 text-sm font-semibold text-emerald-300">
                  {offer.promotionalNetAmountMinor === null
                    ? "Non disponibile"
                    : formatMoney(
                        activeOfferGrossAmountMinor,
                        currency ?? "EUR",
                      )}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/40">Sconto rilevato</p>
                <p className="mt-1 text-sm text-white/80">
                  {currentDiscountPercentage === null
                    ? "Non disponibile"
                    : `${currentDiscountPercentage}%`}
                </p>
              </div>

              <div>
                <p className="text-xs text-white/40">Tipo</p>
                <p className="mt-1 text-sm text-white/80">
                  {offer.promotionalNetAmountMinor === null
                    ? "Offerta importata"
                    : "Sconto prodotto"}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <label className="flex min-w-0 flex-col justify-center rounded-md border border-white/10 bg-[#111111] p-4">
          <span className="text-xs font-medium text-white/45">
            Percentuale di sconto
          </span>

          <div className="relative mt-3">
            <input
              type="number"
              name="discountPercentage"
              min="1"
              max="90"
              step="1"
              inputMode="numeric"
              value={discountPercentage}
              onChange={(event) => {
                setDiscountPercentage(event.target.value);
                setValidationError(null);
              }}
              disabled={isPending || currentNetAmountMinor === null}
              className="h-11 w-full rounded-md border border-white/10 bg-[#0d0d0d] px-3 pr-10 text-sm text-white transition outline-none focus:border-orange-400/60 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-white/35">
              %
            </span>
          </div>

          <p className="mt-3 text-xs leading-5 text-white/30">
            Inserisci un valore da 1 a 90.
          </p>
        </label>

        <div className="flex min-w-0 flex-col justify-center rounded-md border border-white/10 bg-[#111111] p-4">
          <p className="text-xs font-medium text-white/45">Anteprima prezzo</p>

          <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <span className="text-sm text-white/40 line-through">
              {formatMoney(regularGrossAmountMinor, currency ?? "EUR")}
            </span>

            <span className="text-xl font-semibold text-emerald-300">
              {formatMoney(promotionalGrossAmountMinor, currency ?? "EUR")}
            </span>

            {discountIsValid ? (
              <span className="rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-300">
                -{parsedDiscountPercentage}%
              </span>
            ) : null}
          </div>

          <p className="mt-3 text-xs leading-5 text-white/30">
            Il prezzo promozionale viene calcolato dal prezzo netto corrente. Il
            prezzo mostrato al cliente include l’IVA configurata sul prodotto.
          </p>
        </div>

        <div className="flex min-w-[180px] flex-col justify-center gap-3">
          <button
            type="button"
            onClick={requestSetOffer}
            disabled={
              isPending || currentNetAmountMinor === null || !discountIsValid
            }
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-orange-500 px-5 text-sm font-semibold whitespace-nowrap text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {offer ? "Aggiorna offerta" : "Attiva offerta"}
          </button>

          {offer ? (
            <button
              type="button"
              onClick={requestDeactivateOffer}
              disabled={isPending}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-red-400/25 px-5 text-sm font-semibold whitespace-nowrap text-red-300 transition hover:border-red-400/50 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Disattiva offerta
            </button>
          ) : null}
        </div>

        {validationError ? (
          <p
            role="alert"
            className="rounded-md border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300 xl:col-span-4"
          >
            {validationError}
          </p>
        ) : null}
      </div>

      <AdminConfirmDialog
        open={dialogMode === "set"}
        eyebrow="Offerta prodotto"
        title={offer ? "Conferma modifica offerta" : "Conferma nuova offerta"}
        description={
          <>
            Stai per applicare uno sconto del{" "}
            <strong className="font-semibold text-white">
              {parsedDiscountPercentage}%
            </strong>
            .
            <br />
            <br />
            Il prezzo lordo passerà da{" "}
            <strong className="font-semibold text-white">
              {formatMoney(regularGrossAmountMinor, currency ?? "EUR")}
            </strong>{" "}
            a{" "}
            <strong className="font-semibold text-emerald-300">
              {formatMoney(promotionalGrossAmountMinor, currency ?? "EUR")}
            </strong>
            .
            {offer ? (
              <>
                <br />
                <br />
                L’offerta attiva precedente verrà conservata nello storico e
                disattivata.
              </>
            ) : null}
          </>
        }
        confirmLabel={offer ? "Conferma modifica" : "Attiva offerta"}
        pendingLabel="Aggiornamento…"
        pending={isPending}
        error={actionError}
        tone="success"
        onConfirm={confirmSetOffer}
        onCancel={cancelDialog}
      />

      <AdminConfirmDialog
        open={dialogMode === "deactivate"}
        eyebrow="Offerta prodotto"
        title="Disattiva offerta"
        description={
          <>
            Stai per disattivare l’offerta attualmente associata al prodotto.
            <br />
            <br />
            Il prodotto tornerà al normale prezzo di listino. La riga
            dell’offerta verrà mantenuta nello storico e non sarà eliminata.
          </>
        }
        confirmLabel="Disattiva offerta"
        pendingLabel="Disattivazione…"
        pending={isPending}
        error={actionError}
        tone="danger"
        onConfirm={confirmDeactivateOffer}
        onCancel={cancelDialog}
      />
    </>
  );
}
