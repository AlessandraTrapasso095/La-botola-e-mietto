"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type PaymentMethod = "stripe" | "bank_transfer" | "satispay";

type PaymentStatus = "pending" | "authorized" | "paid" | "failed" | "refunded";

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

export function AdminReceivedOrderCancellation({
  orderId,
  paymentMethod,
  paymentStatus,
}: {
  orderId: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [customerNote, setCustomerNote] = useState("");
  const [manualRefundReference, setManualRefundReference] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paymentAlreadyAcquired =
    paymentStatus === "paid" || paymentStatus === "authorized";

  const requiresManualRefund =
    paymentAlreadyAcquired && paymentMethod !== "stripe";

  async function handleCancellation() {
    const note = customerNote.trim();

    if (note.length < 3) {
      setError("Inserisci una motivazione da comunicare al cliente.");
      return;
    }

    if (requiresManualRefund && !manualRefundReference.trim()) {
      setError("Inserisci il riferimento del rimborso effettuato.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/orders/cancel", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          customerNote: note,
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
            : "Annullamento ordine non riuscito.";

        throw new Error(message);
      }

      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Annullamento ordine non riuscito.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        className="mt-3 min-h-11 w-full rounded-md border border-red-400/40 px-4 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
      >
        Annulla ordine
      </button>
    );
  }

  return (
    <div className="mt-4 rounded-md border border-red-400/30 bg-red-400/5 p-4">
      <p className="font-semibold text-red-300">Annullamento ordine</p>

      <p className="mt-2 text-sm leading-6 text-white/50">
        Questa operazione annullerà definitivamente l’ordine. La motivazione
        inserita sarà visibile al cliente.
      </p>

      <div className="mt-5">
        <label
          htmlFor="admin-cancellation-customer-note"
          className="mb-2 block text-xs font-medium text-white/60"
        >
          Motivo dell’annullamento per il cliente
        </label>

        <textarea
          id="admin-cancellation-customer-note"
          rows={4}
          maxLength={1500}
          value={customerNote}
          disabled={loading}
          onChange={(event) => setCustomerNote(event.target.value)}
          placeholder="Es. Il prodotto richiesto non è più disponibile. Ci scusiamo per il disagio."
          className="w-full resize-y rounded-md border border-white/10 bg-[#111111] px-3 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-400 disabled:opacity-50"
        />

        <p className="mt-2 text-xs text-white/35">
          Questo testo verrà mostrato direttamente nell’area ordine del cliente.
        </p>
      </div>

      {requiresManualRefund && (
        <div className="mt-5">
          <label
            htmlFor="admin-direct-cancel-refund-reference"
            className="mb-2 block text-xs font-medium text-white/60"
          >
            Riferimento rimborso effettuato
          </label>

          <input
            id="admin-direct-cancel-refund-reference"
            type="text"
            maxLength={500}
            value={manualRefundReference}
            disabled={loading}
            onChange={(event) => setManualRefundReference(event.target.value)}
            placeholder={
              paymentMethod === "bank_transfer"
                ? "CRO / TRN del bonifico"
                : "Riferimento operazione Satispay"
            }
            className="min-h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-400 disabled:opacity-50"
          />
        </div>
      )}

      <div className="mt-5 rounded-md border border-white/10 bg-black/20 p-3 text-xs leading-5 text-white/50">
        <p>
          Pagamento:{" "}
          <span className="font-semibold text-white/70">
            {paymentMethodLabel(paymentMethod)}
          </span>
        </p>

        {paymentAlreadyAcquired ? (
          <p className="mt-1">
            {paymentMethod === "stripe"
              ? "Il rimborso verrà richiesto automaticamente a Stripe."
              : "Conferma di avere già effettuato il rimborso prima di procedere."}
          </p>
        ) : (
          <p className="mt-1">
            Il pagamento non risulta acquisito: non sarà necessario emettere un
            rimborso.
          </p>
        )}
      </div>

      {!confirming ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setOpen(false);
              setConfirming(false);
              setError(null);
            }}
            className="min-h-11 rounded-md border border-white/10 px-4 text-sm font-semibold text-white/70 transition hover:bg-white/5 disabled:opacity-40"
          >
            Torna indietro
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              if (customerNote.trim().length < 3) {
                setError("Inserisci una motivazione da comunicare al cliente.");
                return;
              }

              if (requiresManualRefund && !manualRefundReference.trim()) {
                setError("Inserisci il riferimento del rimborso effettuato.");
                return;
              }

              setError(null);
              setConfirming(true);
            }}
            className="min-h-11 rounded-md bg-red-500 px-4 text-sm font-semibold text-white transition hover:bg-red-400 disabled:opacity-40"
          >
            Continua con l’annullamento
          </button>
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-red-400/30 bg-red-400/10 p-4">
          <p className="font-semibold text-red-200">
            Confermare definitivamente?
          </p>

          <p className="mt-2 text-sm leading-6 text-red-100/60">
            L’ordine passerà allo stato Annullato e non potrà più essere preso
            in carico o spedito.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => setConfirming(false)}
              className="min-h-11 rounded-md border border-white/10 px-4 text-sm font-semibold text-white/70 transition hover:bg-white/5 disabled:opacity-40"
            >
              No, torna indietro
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleCancellation}
              className="min-h-11 rounded-md bg-red-500 px-4 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Annullamento..." : "Sì, annulla ordine"}
            </button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-4 text-xs leading-5 text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
