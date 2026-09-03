"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { accountOrderService } from "@/services/account/order-service";

export function HideOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();

  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleHide() {
    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await accountOrderService.hide(orderId);
      router.push("/account/ordini");
      router.refresh();
    } catch (hideError: unknown) {
      setLoading(false);

      setError(
        hideError instanceof Error
          ? hideError.message
          : "Non è stato possibile eliminare l’ordine dalla cronologia.",
      );
    }
  }

  if (confirming) {
    return (
      <div className="border-border-subtle mt-4 border p-4">
        <p className="text-text-strong text-sm font-semibold">
          Eliminare questo ordine dalla cronologia?
        </p>

        <p className="text-text-muted mt-2 text-sm">
          Non comparirà più nella tua area personale. Questa operazione non
          cancella i dati amministrativi dell’ordine.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={handleHide}
            className="inline-flex min-h-11 items-center justify-center border border-red-600 px-5 text-sm font-semibold text-red-600 disabled:opacity-60"
          >
            {loading ? "Eliminazione…" : "Sì, elimina dalla cronologia"}
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
      className="inline-flex min-h-11 items-center justify-center border border-red-600 px-5 text-sm font-semibold text-red-600"
    >
      Elimina dalla cronologia
    </button>
  );
}
