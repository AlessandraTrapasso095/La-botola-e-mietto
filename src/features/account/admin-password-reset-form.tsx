"use client";

import Link from "next/link";
import { useState } from "react";

export function AdminPasswordResetForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (state === "loading") {
      return;
    }

    setState("loading");

    try {
      const response = await fetch("/api/admin/password-reset", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (!response.ok) {
        throw new Error("Reset non disponibile.");
      }

      setState("success");
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5" noValidate>
      <div>
        <label
          htmlFor="admin-reset-email"
          className="mb-2 block text-sm font-medium text-white/70"
        >
          Email amministratore
        </label>

        <input
          id="admin-reset-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-h-12 w-full rounded-md border border-white/10 bg-[#111111] px-4 text-white transition outline-none focus:border-orange-400"
        />
      </div>

      <button
        type="submit"
        disabled={state === "loading"}
        className="min-h-12 rounded-md bg-orange-400 px-5 text-sm font-semibold text-black transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "loading" ? "Invio…" : "Invia email di recupero"}
      </button>

      <div className="min-h-12 text-sm" aria-live="polite">
        {state === "success" ? (
          <p className="text-emerald-300">
            Se l’indirizzo è associato a un account amministratore, riceverai
            un’email con il link per impostare una nuova password.
          </p>
        ) : null}

        {state === "error" ? (
          <p className="text-red-400" role="alert">
            Non è stato possibile inviare le istruzioni. Riprova.
          </p>
        ) : null}
      </div>

      <Link
        href="/admin/login"
        className="inline-flex min-h-11 items-center justify-center text-sm font-medium text-orange-300 transition hover:text-orange-200"
      >
        ← Torna all’accesso
      </Link>
    </form>
  );
}
