"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { AdminConfirmDialog } from "@/features/admin/admin-confirm-dialog";
import { deleteAdminProduct } from "@/server/admin/admin-product-delete";
import { updateAdminProductStatus } from "@/server/admin/admin-product-status";

type DialogMode = "archive" | "delete" | null;

export function AdminProductActions({
  productId,
  productName,
  currentStatus,
}: {
  productId: string;
  productName: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const alreadyArchived = currentStatus === "archived";
  const deleteConfirmed = deleteConfirmation.trim().toUpperCase() === "ELIMINA";

  function closeDialog() {
    if (isPending) return;

    setDialogMode(null);
    setDeleteConfirmation("");
    setError(null);
  }

  function confirmArchive() {
    if (isPending || alreadyArchived) return;

    setError(null);

    startTransition(async () => {
      try {
        await updateAdminProductStatus(productId, "archived");
        setDialogMode(null);
        router.refresh();
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Non è stato possibile archiviare il prodotto.",
        );
      }
    });
  }

  function confirmDelete() {
    if (isPending || !deleteConfirmed) return;

    setError(null);

    startTransition(async () => {
      const result = await deleteAdminProduct(productId);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setDialogMode(null);
      router.push("/admin/prodotti");
    });
  }

  return (
    <>
      <section className="rounded-xl border border-white/10 bg-[#171717] p-5 sm:p-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-orange-400 uppercase">
            Azioni prodotto
          </p>

          <h2 className="mt-2 text-lg font-semibold text-white">
            Cosa vuoi fare con questo prodotto?
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
            Se non vuoi più mostrarlo nello store, archivialo. Usa
            l’eliminazione definitiva solo se vuoi cancellarlo completamente.
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-amber-400/15 bg-amber-400/[0.06] p-4">
            <p className="text-sm font-semibold text-amber-200">
              Archivia prodotto
            </p>

            <p className="mt-2 text-xs leading-5 text-white/45">
              Il prodotto non sarà più pubblico, ma resterà nell’admin e potrai
              riattivarlo in qualsiasi momento.
            </p>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setDialogMode("archive");
              }}
              disabled={alreadyArchived || isPending}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md border border-amber-300/25 bg-amber-400/10 px-4 text-sm font-semibold text-amber-100 transition hover:bg-amber-400/15 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
              {alreadyArchived ? "Prodotto già archiviato" : "Archivia prodotto"}
            </button>
          </div>

          <div className="rounded-lg border border-red-400/20 bg-red-500/[0.06] p-4">
            <p className="text-sm font-semibold text-red-300">
              Elimina definitivamente
            </p>

            <p className="mt-2 text-xs leading-5 text-white/45">
              Cancella il prodotto in modo permanente. Se esistono ordini o
              movimenti di magazzino collegati, il sistema impedirà
              l’eliminazione per proteggere lo storico.
            </p>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setDeleteConfirmation("");
                setDialogMode("delete");
              }}
              disabled={isPending}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-red-500 px-4 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Elimina definitivamente
            </button>
          </div>
        </div>
      </section>

      <AdminConfirmDialog
        open={dialogMode === "archive"}
        eyebrow="Archivia prodotto"
        title="Vuoi archiviare questo prodotto?"
        description={
          <>
            <strong className="font-semibold text-white">{productName}</strong>{" "}
            non sarà più visibile nello store, ma resterà salvato nell’admin e
            potrà essere riattivato.
          </>
        }
        confirmLabel="Sì, archivia prodotto"
        pendingLabel="Archiviazione…"
        pending={isPending}
        error={error}
        tone="default"
        onConfirm={confirmArchive}
        onCancel={closeDialog}
      />

      <AdminConfirmDialog
        open={dialogMode === "delete"}
        eyebrow="Eliminazione definitiva"
        title="Eliminare davvero questo prodotto?"
        description={
          <div className="space-y-4">
            <p>
              Stai per eliminare definitivamente{" "}
              <strong className="font-semibold text-white">{productName}</strong>.
              Questa operazione non può essere annullata.
            </p>

            <div>
              <label
                htmlFor="delete-product-confirmation"
                className="block text-xs font-medium text-white/60"
              >
                Per confermare, scrivi <strong>ELIMINA</strong>
              </label>

              <input
                id="delete-product-confirmation"
                value={deleteConfirmation}
                onChange={(event) => {
                  setDeleteConfirmation(event.target.value);
                  setError(null);
                }}
                disabled={isPending}
                autoComplete="off"
                className="mt-2 h-11 w-full rounded-md border border-red-400/25 bg-[#111111] px-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-red-400/60 disabled:opacity-50"
                placeholder="Scrivi ELIMINA"
              />
            </div>

            {!deleteConfirmed && deleteConfirmation ? (
              <p className="text-xs text-red-300">
                Scrivi esattamente ELIMINA per abilitare la cancellazione.
              </p>
            ) : null}
          </div>
        }
        confirmLabel={
          deleteConfirmed
            ? "Elimina definitivamente"
            : "Scrivi ELIMINA per confermare"
        }
        pendingLabel="Eliminazione…"
        pending={isPending}
        confirmDisabled={!deleteConfirmed}
        error={error}
        tone="danger"
        onConfirm={confirmDelete}
        onCancel={closeDialog}
      />
    </>
  );
}
