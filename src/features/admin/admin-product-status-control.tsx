"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { AdminConfirmDialog } from "@/features/admin/admin-confirm-dialog";
import {
  updateAdminProductStatus,
  type AdminManagedProductStatus,
} from "@/server/admin/admin-product-status";

const statusOptions: Array<{
  value: AdminManagedProductStatus;
  label: string;
  description: string;
}> = [
  {
    value: "active",
    label: "Attivo",
    description: "Il prodotto è visibile nello store.",
  },
  {
    value: "draft",
    label: "Bozza",
    description: "Il prodotto resta nel catalogo admin ma non è pubblico.",
  },
  {
    value: "archived",
    label: "Archiviato",
    description: "Il prodotto non è pubblico e viene mantenuto nello storico.",
  },
];

export function AdminProductStatusControl({
  productId,
  currentStatus,
}: {
  productId: string;
  currentStatus: string;
}) {
  const router = useRouter();

  const initialStatus: AdminManagedProductStatus =
    currentStatus === "active" ||
    currentStatus === "draft" ||
    currentStatus === "archived"
      ? currentStatus
      : "draft";

  const [status, setStatus] =
    useState<AdminManagedProductStatus>(initialStatus);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const changed = status !== currentStatus;

  const selected = statusOptions.find((option) => option.value === status);

  function requestSave() {
    if (!changed || isPending) {
      return;
    }

    setError(null);
    setDialogOpen(true);
  }

  function cancelDialog() {
    if (isPending) {
      return;
    }

    setDialogOpen(false);
    setError(null);
  }

  function confirmSave() {
    if (!changed || isPending) {
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        await updateAdminProductStatus(productId, status);

        setDialogOpen(false);
        router.refresh();
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Impossibile aggiornare lo stato prodotto.",
        );
      }
    });
  }

  return (
    <>
      <div className="space-y-4">
        <label className="block space-y-2">
          <span className="text-xs font-medium text-white/45">
            Stato prodotto
          </span>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as AdminManagedProductStatus)
            }
            disabled={isPending}
            className="h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white transition outline-none focus:border-orange-400/60 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <p className="text-xs leading-5 text-white/35">
          {selected?.description}
        </p>

        <button
          type="button"
          onClick={requestSave}
          disabled={!changed || isPending}
          className="inline-flex h-10 items-center justify-center rounded-md bg-orange-500 px-4 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Salva stato
        </button>
      </div>

      <AdminConfirmDialog
        open={dialogOpen}
        eyebrow="Stato prodotto"
        title="Conferma modifica stato"
        description={
          <>
            Stai per impostare questo prodotto come{" "}
            <strong className="font-semibold text-white">
              {selected?.label ?? status}
            </strong>
            .
            <br />
            <br />
            {selected?.description}
          </>
        }
        confirmLabel="Conferma modifica"
        pendingLabel="Aggiornamento…"
        pending={isPending}
        error={error}
        tone={status === "archived" ? "danger" : "default"}
        onConfirm={confirmSave}
        onCancel={cancelDialog}
      />
    </>
  );
}
