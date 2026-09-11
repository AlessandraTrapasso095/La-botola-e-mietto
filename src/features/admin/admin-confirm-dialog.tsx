"use client";

import { useEffect } from "react";

type AdminConfirmDialogProps = {
  open: boolean;
  eyebrow?: string;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  pendingLabel?: string;
  pending?: boolean;
  error?: string | null;
  tone?: "default" | "danger" | "success";
  onConfirm: () => void;
  onCancel: () => void;
};

export function AdminConfirmDialog({
  open,
  eyebrow = "Conferma",
  title,
  description,
  confirmLabel,
  cancelLabel = "Annulla",
  pendingLabel = "Operazione in corso…",
  pending = false,
  error = null,
  tone = "default",
  onConfirm,
  onCancel,
}: AdminConfirmDialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) {
        onCancel();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, pending, onCancel]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const confirmClass =
    tone === "danger"
      ? "bg-red-500 hover:bg-red-400"
      : tone === "success"
        ? "bg-emerald-500 hover:bg-emerald-400"
        : "bg-orange-500 hover:bg-orange-400";

  const eyebrowClass =
    tone === "danger"
      ? "text-red-400"
      : tone === "success"
        ? "text-emerald-400"
        : "text-orange-400";

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !pending) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-dialog-title"
        className="w-full max-w-md rounded-xl border border-white/10 bg-[#171717] p-6 shadow-2xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className={[
                "text-xs font-semibold tracking-[0.16em] uppercase",
                eyebrowClass,
              ].join(" ")}
            >
              {eyebrow}
            </p>

            <h2
              id="admin-confirm-dialog-title"
              className="mt-2 text-xl font-semibold text-white"
            >
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            aria-label="Chiudi"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-lg text-white/50 transition hover:border-white/20 hover:text-white disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <div className="mt-5 text-sm leading-6 text-white/60">
          {description}
        </div>

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
            onClick={onCancel}
            disabled={pending}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/15 px-5 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={[
              "inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-semibold text-black transition disabled:cursor-wait disabled:opacity-60",
              confirmClass,
            ].join(" ")}
          >
            {pending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
