"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { AdminConfirmDialog } from "@/features/admin/admin-confirm-dialog";
import { updateAdminProductStock } from "@/server/admin/admin-product-stock";

export function AdminProductStockControl({
  productId,
  currentStockQuantity,
  reservedQuantity,
}: {
  productId: string;
  currentStockQuantity: number;
  reservedQuantity: number;
}) {
  const router = useRouter();

  const [stockQuantity, setStockQuantity] = useState(
    String(currentStockQuantity),
  );
  const [note, setNote] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const parsedStockQuantity =
    stockQuantity.trim() === "" ? Number.NaN : Number(stockQuantity);

  const quantityIsValid =
    Number.isSafeInteger(parsedStockQuantity) && parsedStockQuantity >= 0;

  const changed =
    quantityIsValid && parsedStockQuantity !== currentStockQuantity;

  const newAvailableQuantity = quantityIsValid
    ? parsedStockQuantity - reservedQuantity
    : null;

  function validate() {
    if (!quantityIsValid) {
      return "Inserisci una quantità intera uguale o superiore a zero.";
    }

    if (parsedStockQuantity < reservedQuantity) {
      return `Lo stock totale non può essere inferiore ai ${reservedQuantity} articoli riservati.`;
    }

    if (!changed) {
      return "La quantità inserita coincide con lo stock attuale.";
    }

    const normalizedNote = note.trim();

    if (normalizedNote.length < 3 || normalizedNote.length > 500) {
      return "Inserisci una motivazione compresa tra 3 e 500 caratteri.";
    }

    return null;
  }

  function requestSave() {
    if (isPending) {
      return;
    }

    const error = validate();

    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    setActionError(null);
    setDialogOpen(true);
  }

  function cancelDialog() {
    if (isPending) {
      return;
    }

    setDialogOpen(false);
    setActionError(null);
  }

  function confirmSave() {
    const error = validate();

    if (error || isPending) {
      setValidationError(error);
      setDialogOpen(false);
      return;
    }

    setActionError(null);

    startTransition(async () => {
      try {
        await updateAdminProductStock(productId, parsedStockQuantity, note);

        setDialogOpen(false);
        setNote("");
        router.refresh();
      } catch (caught) {
        setActionError(
          caught instanceof Error
            ? caught.message
            : "Impossibile aggiornare lo stock.",
        );
      }
    });
  }

  return (
    <>
      <div className="mt-6 border-t border-white/10 pt-6">
        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="text-xs font-medium text-white/45">
              Nuovo stock totale
            </span>

            <input
              type="number"
              name="stockQuantity"
              min={reservedQuantity}
              step="1"
              inputMode="numeric"
              value={stockQuantity}
              onChange={(event) => {
                setStockQuantity(event.target.value);
                setValidationError(null);
              }}
              disabled={isPending}
              className="h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white transition outline-none focus:border-orange-400/60 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>

          <div className="rounded-md border border-white/10 bg-[#111111] px-4 py-3">
            <div className="flex items-center justify-between gap-4 text-xs">
              <span className="text-white/40">
                Disponibili dopo la modifica
              </span>

              <span
                className={
                  newAvailableQuantity !== null && newAvailableQuantity > 0
                    ? "font-semibold text-emerald-300"
                    : "font-semibold text-red-300"
                }
              >
                {newAvailableQuantity ?? "—"}
              </span>
            </div>
          </div>

          <label className="block space-y-2">
            <span className="text-xs font-medium text-white/45">
              Motivazione della modifica
            </span>

            <textarea
              name="stockNote"
              rows={3}
              maxLength={500}
              value={note}
              onChange={(event) => {
                setNote(event.target.value);
                setValidationError(null);
              }}
              disabled={isPending}
              placeholder="Es. Carico merce ricevuta dal fornitore"
              className="w-full resize-y rounded-md border border-white/10 bg-[#111111] px-3 py-3 text-sm text-white placeholder:text-white/20 focus:border-orange-400/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>

          <p className="text-xs leading-5 text-white/35">
            La quantità riservata non verrà modificata. Ogni regolazione sarà
            registrata nello storico del magazzino.
          </p>

          {validationError ? (
            <p
              role="alert"
              className="rounded-md border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300"
            >
              {validationError}
            </p>
          ) : null}

          <button
            type="button"
            onClick={requestSave}
            disabled={!changed || isPending}
            className="inline-flex h-10 items-center justify-center rounded-md bg-orange-500 px-4 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Aggiorna stock
          </button>
        </div>
      </div>

      <AdminConfirmDialog
        open={dialogOpen}
        eyebrow="Magazzino"
        title="Conferma modifica stock"
        description={
          <>
            Lo stock totale passerà da{" "}
            <strong className="font-semibold text-white">
              {currentStockQuantity}
            </strong>{" "}
            a{" "}
            <strong className="font-semibold text-white">
              {parsedStockQuantity}
            </strong>
            .
            <br />
            <br />
            Gli articoli riservati resteranno{" "}
            <strong className="font-semibold text-white">
              {reservedQuantity}
            </strong>{" "}
            e i disponibili diventeranno{" "}
            <strong className="font-semibold text-white">
              {newAvailableQuantity}
            </strong>
            .
          </>
        }
        confirmLabel="Conferma modifica"
        pendingLabel="Aggiornamento…"
        pending={isPending}
        error={actionError}
        tone={parsedStockQuantity < currentStockQuantity ? "danger" : "success"}
        onConfirm={confirmSave}
        onCancel={cancelDialog}
      />
    </>
  );
}
