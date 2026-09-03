"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { accountOrderService } from "@/services/account/order-service";

export function CancelOrderButton({
  orderId,
  requiresAdminApproval = false,
}: {
  orderId: string;
  requiresAdminApproval?: boolean;
}) {
  const router = useRouter();

  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCancel() {
    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await accountOrderService.cancel(orderId);
      router.refresh();
    } catch (cancelError: unknown) {
      setLoading(false);

      setError(
        cancelError instanceof Error
          ? cancelError.message
          : "Non è stato possibile elaborare la richiesta.",
      );
    }
  }

  if (confirming) {
    return (
      <div className="border-border-subtle mt-4 w-full border p-4">
        <p className="text-text-strong text-sm font-semibold">
          {requiresAdminApproval
            ? "Vuoi richiedere l’annullamento dell’ordine?"
            : "Vuoi davvero annullare questo ordine?"}
        </p>

        <p className="text-text-muted mt-2 text-sm">
          {requiresAdminApproval
            ? "L’ordine è già stato pagato. La richiesta verrà inviata e dovrà essere approvata prima che l’ordine venga annullato."
            : "L’ordine verrà annullato e non potrà più essere pagato. I prodotti resteranno disponibili nel tuo carrello."}
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={handleCancel}
            className="inline-flex min-h-11 items-center justify-center border border-red-600 px-5 text-sm font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Operazione in corso…"
              : requiresAdminApproval
                ? "Sì, invia richiesta"
                : "Sì, annulla ordine"}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => setConfirming(false)}
            className="border-border inline-flex min-h-11 items-center justify-center border px-5 text-sm font-semibold"
          >
            Torna indietro
          </button>
        </div>

        {error ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="inline-flex min-h-12 items-center justify-center border border-red-600 px-7 text-sm font-semibold text-red-600"
    >
      {requiresAdminApproval ? "Richiedi annullamento" : "Annulla ordine"}
    </button>
  );
}
