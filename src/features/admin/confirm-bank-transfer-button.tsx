"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ConfirmBankTransferButton({ orderId }: { orderId: string }) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !submitting) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, submitting]);

  async function confirmPayment() {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/orders/payment/bank-transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "Impossibile confermare il bonifico.");
      }

      setOpen(false);
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Impossibile confermare il bonifico.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-500 px-4 text-sm font-semibold text-black transition hover:bg-emerald-400"
      >
        Conferma bonifico ricevuto
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !submitting) {
              setOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-bank-transfer-title"
            className="w-full max-w-md rounded-xl border border-white/10 bg-[#171717] p-6 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-emerald-400 uppercase">
                  Pagamento
                </p>

                <h2
                  id="confirm-bank-transfer-title"
                  className="mt-2 text-xl font-semibold text-white"
                >
                  Conferma ricezione bonifico
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={submitting}
                aria-label="Chiudi"
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-lg text-white/50 transition hover:border-white/20 hover:text-white disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <p className="mt-5 text-sm leading-6 text-white/60">
              Confermi di aver verificato l&apos;effettivo accredito del
              bonifico per questo ordine?
            </p>

            <p className="mt-3 text-sm leading-6 text-white/60">
              Una volta confermato, il pagamento verrà contrassegnato come{" "}
              <strong className="font-semibold text-white">Pagato</strong>. Lo
              stato dell&apos;ordine resterà invariato.
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
                onClick={() => setOpen(false)}
                disabled={submitting}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/15 px-5 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white disabled:opacity-50"
              >
                Annulla
              </button>

              <button
                type="button"
                onClick={confirmPayment}
                disabled={submitting}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-500 px-5 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60"
              >
                {submitting ? "Conferma in corso…" : "Conferma pagamento"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
