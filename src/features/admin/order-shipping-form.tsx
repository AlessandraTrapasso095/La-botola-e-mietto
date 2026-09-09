"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminOrderShippingForm({
  orderId,
  disabled = false,
}: {
  orderId: string;
  disabled?: boolean;
}) {
  const router = useRouter();

  const [carrier, setCarrier] = useState("TNT");
  const [trackingCode, setTrackingCode] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading || disabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/orders/shipping", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          carrier,
          trackingCode,
          trackingUrl,
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
            : "Registrazione spedizione non riuscita.";

        throw new Error(message);
      }

      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Registrazione spedizione non riuscita.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div>
        <label
          htmlFor="shipping-carrier"
          className="mb-2 block text-xs font-medium text-white/60"
        >
          Corriere
        </label>

        <input
          id="shipping-carrier"
          name="carrier"
          type="text"
          value={carrier}
          onChange={(event) => setCarrier(event.target.value)}
          disabled={disabled || loading}
          required
          maxLength={100}
          className="min-h-11 w-full rounded-md border border-white/10 bg-black/20 px-3 text-sm text-white transition outline-none placeholder:text-white/30 focus:border-orange-400 disabled:opacity-50"
          placeholder="Es. TNT"
        />
      </div>

      <div>
        <label
          htmlFor="tracking-code"
          className="mb-2 block text-xs font-medium text-white/60"
        >
          Codice tracking
        </label>

        <input
          id="tracking-code"
          name="trackingCode"
          type="text"
          value={trackingCode}
          onChange={(event) => setTrackingCode(event.target.value)}
          disabled={disabled || loading}
          required
          maxLength={200}
          className="min-h-11 w-full rounded-md border border-white/10 bg-black/20 px-3 text-sm text-white transition outline-none placeholder:text-white/30 focus:border-orange-400 disabled:opacity-50"
          placeholder="Inserisci il codice tracking"
        />
      </div>

      <div>
        <label
          htmlFor="tracking-url"
          className="mb-2 block text-xs font-medium text-white/60"
        >
          Link tracking
        </label>

        <input
          id="tracking-url"
          name="trackingUrl"
          type="url"
          value={trackingUrl}
          onChange={(event) => setTrackingUrl(event.target.value)}
          disabled={disabled || loading}
          required
          maxLength={2000}
          className="min-h-11 w-full rounded-md border border-white/10 bg-black/20 px-3 text-sm text-white transition outline-none placeholder:text-white/30 focus:border-orange-400 disabled:opacity-50"
          placeholder="https://..."
        />
      </div>

      <button
        type="submit"
        disabled={disabled || loading}
        className="min-h-11 w-full rounded-md bg-orange-400 px-4 text-sm font-semibold text-black transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Registrazione..." : "Conferma spedizione"}
      </button>

      {error && (
        <p className="text-xs leading-5 text-red-300" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
