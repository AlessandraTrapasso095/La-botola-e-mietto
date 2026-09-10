"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { AdminOrderStatus } from "@/server/admin/orders";

function nextStatusFor(status: AdminOrderStatus) {
  switch (status) {
    case "received":
      return {
        value: "preparing" as const,
        label: "Prendi in carico",
      };

    case "preparing":
      return {
        value: "shipped" as const,
        label: "Segna come spedito",
      };

    case "shipped":
      return {
        value: "delivered" as const,
        label: "Segna come consegnato",
      };

    case "delivered":
    case "cancelled":
      return null;
  }
}

export function AdminOrderStatusActions({
  orderId,
  status,
  paymentStatus,
  cancellationRequestStatus,
}: {
  orderId: string;
  status: AdminOrderStatus;
  paymentStatus: "pending" | "authorized" | "paid" | "failed" | "refunded";
  cancellationRequestStatus: "pending" | "approved" | "rejected" | null;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTakeOrderConfirm, setShowTakeOrderConfirm] = useState(false);

  const next = nextStatusFor(status);

  useEffect(() => {
    if (!showTakeOrderConfirm) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !loading) {
        setShowTakeOrderConfirm(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showTakeOrderConfirm, loading]);

  if (!next) {
    return null;
  }

  const nextStatus = next.value;

  const shippingBlocked =
    next.value === "shipped" &&
    paymentStatus !== "paid" &&
    paymentStatus !== "authorized";

  const cancellationBlocked =
    cancellationRequestStatus === "pending" &&
    (next.value === "shipped" || next.value === "delivered");

  const disabled = loading || shippingBlocked || cancellationBlocked;

  async function handleUpdate() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/orders/status", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          nextStatus,
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
            : "Aggiornamento stato non riuscito.";

        throw new Error(message);
      }

      setShowTakeOrderConfirm(false);
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Aggiornamento stato non riuscito.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleMainAction() {
    setError(null);

    if (nextStatus === "preparing") {
      setShowTakeOrderConfirm(true);
      return;
    }

    void handleUpdate();
  }

  return (
    <>
      <div>
        <button
          type="button"
          disabled={disabled}
          onClick={handleMainAction}
          className="min-h-11 w-full rounded-md bg-orange-400 px-4 text-sm font-semibold text-black transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Aggiornamento..." : next.label}
        </button>

        {shippingBlocked && (
          <p className="mt-2 text-xs leading-5 text-amber-300/80">
            Prima di spedire è necessario registrare il pagamento.
          </p>
        )}

        {cancellationBlocked && (
          <p className="mt-2 text-xs leading-5 text-orange-300/80">
            Gestisci prima la richiesta di annullamento.
          </p>
        )}

        {error && !showTakeOrderConfirm && (
          <p className="mt-2 text-xs leading-5 text-red-300">{error}</p>
        )}
      </div>

      {showTakeOrderConfirm ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !loading) {
              setShowTakeOrderConfirm(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="take-order-confirm-title"
            className="w-full max-w-md rounded-xl border border-white/10 bg-[#171717] p-6 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-orange-400 uppercase">
                  Gestione ordine
                </p>

                <h2
                  id="take-order-confirm-title"
                  className="mt-2 text-xl font-semibold text-white"
                >
                  Prendi in carico l&apos;ordine?
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowTakeOrderConfirm(false)}
                disabled={loading}
                aria-label="Chiudi"
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-lg text-white/50 transition hover:border-white/20 hover:text-white disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <p className="mt-5 text-sm leading-6 text-white/60">
              Confermi di voler prendere in carico questo ordine?
            </p>

            <p className="mt-3 text-sm leading-6 text-white/60">
              Lo stato passerà da{" "}
              <strong className="font-semibold text-white">Ricevuto</strong> a{" "}
              <strong className="font-semibold text-white">
                Preso in carico
              </strong>
              .
            </p>

            {error ? (
              <p
                role="alert"
                className="mt-5 rounded-md border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300"
              >
                {error}
              </p>
            ) : null}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowTakeOrderConfirm(false)}
                disabled={loading}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/15 px-5 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white disabled:opacity-50"
              >
                Annulla
              </button>

              <button
                type="button"
                onClick={() => void handleUpdate()}
                disabled={loading}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-orange-400 px-5 text-sm font-semibold text-black transition hover:bg-orange-300 disabled:cursor-wait disabled:opacity-60"
              >
                {loading ? "Aggiornamento…" : "Conferma"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
