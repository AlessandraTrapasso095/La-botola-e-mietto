"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type PaymentMethod = "stripe" | "bank_transfer" | "satispay";

type PendingAction = "approve" | "reject" | null;

function paymentMethodLabel(method: PaymentMethod) {
  switch (method) {
    case "stripe":
      return "Carta / Stripe";
    case "bank_transfer":
      return "Bonifico bancario";
    case "satispay":
      return "Satispay";
  }
}

function formatMoney(amountMinor: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(amountMinor / 100);
}

export function AdminOrderCancellationActions({
  orderId,
  paymentMethod,
  totalGrossAmountMinor,
}: {
  orderId: string;
  paymentMethod: PaymentMethod;
  totalGrossAmountMinor: number;
}) {
  const router = useRouter();

  const [resolutionNote, setResolutionNote] = useState("");
  const [manualRefundReference, setManualRefundReference] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requiresManualRefundReference = paymentMethod !== "stripe";

  async function submit(action: "approve" | "reject") {
    if (loading) {
      return;
    }

    if (
      action === "approve" &&
      requiresManualRefundReference &&
      !manualRefundReference.trim()
    ) {
      setError("Inserisci il riferimento del rimborso effettuato.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/orders/cancellation", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          action,
          resolutionNote: resolutionNote.trim() || undefined,
          manualRefundReference: manualRefundReference.trim() || undefined,
        }),
      });

      const body: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          body &&
          typeof body === "object" &&
          "message" in body &&
          typeof body.message === "string"
            ? body.message
            : "Operazione non riuscita.";

        throw new Error(message);
      }

      setPendingAction(null);
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Operazione non riuscita.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-5 grid gap-5">
      <div className="grid gap-3 rounded-md border border-white/10 bg-black/15 p-4 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs text-white/40">Metodo pagamento</p>
          <p className="mt-1 font-semibold">
            {paymentMethodLabel(paymentMethod)}
          </p>
        </div>

        <div>
          <p className="text-xs text-white/40">Importo ordine</p>
          <p className="mt-1 font-semibold">
            {formatMoney(totalGrossAmountMinor)}
          </p>
        </div>
      </div>

      {requiresManualRefundReference && (
        <div>
          <label
            htmlFor="manual-refund-reference"
            className="mb-2 block text-xs font-medium text-white/60"
          >
            Riferimento rimborso effettuato
          </label>

          <input
            id="manual-refund-reference"
            type="text"
            value={manualRefundReference}
            onChange={(event) => setManualRefundReference(event.target.value)}
            disabled={loading}
            maxLength={500}
            placeholder={
              paymentMethod === "bank_transfer"
                ? "Es. CRO / TRN del bonifico"
                : "Es. riferimento operazione Satispay"
            }
            className="min-h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-orange-400 disabled:opacity-50"
          />

          <p className="mt-2 text-xs leading-5 text-white/40">
            Inserisci il riferimento dell’operazione con cui hai già restituito
            l’importo al cliente.
          </p>
        </div>
      )}

      <div>
        <label
          htmlFor="cancellation-resolution-note"
          className="mb-2 block text-xs font-medium text-white/60"
        >
          Nota amministrativa
        </label>

        <textarea
          id="cancellation-resolution-note"
          value={resolutionNote}
          onChange={(event) => setResolutionNote(event.target.value)}
          disabled={loading}
          maxLength={1000}
          rows={4}
          placeholder="Nota opzionale sulla gestione della richiesta..."
          className="w-full resize-y rounded-md border border-white/10 bg-[#111111] px-3 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-orange-400 disabled:opacity-50"
        />
      </div>

      {pendingAction === null ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setError(null);
              setPendingAction("reject");
            }}
            className="min-h-11 rounded-md border border-red-400/40 px-4 text-sm font-semibold text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Rifiuta richiesta
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setError(null);

              if (
                requiresManualRefundReference &&
                !manualRefundReference.trim()
              ) {
                setError("Inserisci il riferimento del rimborso effettuato.");
                return;
              }

              setPendingAction("approve");
            }}
            className="min-h-11 rounded-md bg-orange-400 px-4 text-sm font-semibold text-black transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {paymentMethod === "stripe"
              ? "Approva e rimborsa"
              : "Conferma rimborso e annulla"}
          </button>
        </div>
      ) : (
        <div className="rounded-md border border-orange-400/30 bg-orange-400/10 p-4">
          <p className="font-semibold text-orange-200">
            {pendingAction === "approve"
              ? paymentMethod === "stripe"
                ? "Confermare il rimborso Stripe?"
                : "Confermare annullamento e rimborso?"
              : "Confermare il rifiuto della richiesta?"}
          </p>

          <p className="mt-2 text-sm leading-6 text-orange-100/60">
            {pendingAction === "approve"
              ? paymentMethod === "stripe"
                ? `Verrà richiesto a Stripe il rimborso dell’ordine per ${formatMoney(
                    totalGrossAmountMinor,
                  )}. Dopo il rimborso l’ordine verrà annullato.`
                : "Confermi di aver già effettuato il rimborso esternamente? L’ordine verrà annullato definitivamente."
              : "L’ordine continuerà normalmente e il cliente vedrà che la richiesta non è stata approvata."}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => setPendingAction(null)}
              className="min-h-11 rounded-md border border-white/10 px-4 text-sm font-semibold text-white/70 transition hover:bg-white/5 disabled:opacity-40"
            >
              Torna indietro
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => submit(pendingAction)}
              className={
                pendingAction === "approve"
                  ? "min-h-11 rounded-md bg-orange-400 px-4 text-sm font-semibold text-black transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-40"
                  : "min-h-11 rounded-md bg-red-500 px-4 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
              }
            >
              {loading
                ? "Operazione in corso..."
                : pendingAction === "approve"
                  ? "Sì, conferma"
                  : "Sì, rifiuta"}
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm leading-6 text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
