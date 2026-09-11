"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { AdminConfirmDialog } from "@/features/admin/admin-confirm-dialog";
import { deleteAdminProductImage } from "@/server/admin/admin-product-images";

export function AdminProductImageDeleteButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function closeDialog() {
    if (pending) return;

    setDialogOpen(false);
    setError(null);
  }

  async function confirmDelete() {
    setPending(true);
    setError(null);

    try {
      await deleteAdminProductImage({ productId });
      setDialogOpen(false);
      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Impossibile eliminare l’immagine.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setDialogOpen(true);
        }}
        className="inline-flex min-h-11 items-center justify-center rounded-md border border-red-400/25 px-5 text-sm font-medium text-red-300 transition hover:border-red-400/40 hover:bg-red-400/10"
      >
        Elimina immagine
      </button>

      <AdminConfirmDialog
        open={dialogOpen}
        eyebrow="Immagine prodotto"
        title="Eliminare l’immagine?"
        description={
          <>
            Stai per eliminare l’immagine associata a{" "}
            <strong className="font-semibold text-white">{productName}</strong>.
            <br />
            <br />
            Il prodotto tornerà a mostrare l’immagine segnaposto. Sei sicuro di
            voler continuare?
          </>
        }
        confirmLabel="Sì, elimina"
        pendingLabel="Eliminazione…"
        pending={pending}
        error={error}
        tone="danger"
        onConfirm={() => {
          void confirmDelete();
        }}
        onCancel={closeDialog}
      />
    </>
  );
}
