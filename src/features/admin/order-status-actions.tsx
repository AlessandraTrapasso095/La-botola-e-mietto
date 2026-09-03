"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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

  const next = nextStatusFor(status);

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

  return (
    <div>
      <button
        type="button"
        disabled={disabled}
        onClick={handleUpdate}
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

      {error && <p className="mt-2 text-xs leading-5 text-red-300">{error}</p>}
    </div>
  );
}
