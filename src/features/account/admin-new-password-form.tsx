"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { passwordSchema } from "@/lib/validation/auth";

export function AdminNewPasswordForm() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");

    const parsed = passwordSchema.safeParse(password);

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Password non valida.");
      return;
    }

    if (password !== confirmation) {
      setError("Le password non coincidono.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/password", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          password,
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
            : "Aggiornamento password non riuscito.";

        throw new Error(message);
      }

      setSuccess(true);

      window.setTimeout(() => {
        router.replace("/admin/login");
        router.refresh();
      }, 700);
    } catch (caughtError) {
      setLoading(false);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Il collegamento non è più valido.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5" noValidate>
      <div>
        <div className="mb-2 flex items-center justify-between gap-4">
          <label
            htmlFor="admin-new-password"
            className="text-sm font-medium text-white/70"
          >
            Nuova password
          </label>

          <button
            type="button"
            className="text-xs font-medium text-orange-300 hover:text-orange-200"
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? "Nascondi" : "Mostra"}
          </button>
        </div>

        <input
          id="admin-new-password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="min-h-12 w-full rounded-md border border-white/10 bg-[#111111] px-4 text-white transition outline-none focus:border-orange-400"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-4">
          <label
            htmlFor="admin-new-password-confirmation"
            className="text-sm font-medium text-white/70"
          >
            Conferma nuova password
          </label>

          <button
            type="button"
            className="text-xs font-medium text-orange-300 hover:text-orange-200"
            onClick={() => setShowConfirmation((current) => !current)}
          >
            {showConfirmation ? "Nascondi" : "Mostra"}
          </button>
        </div>

        <input
          id="admin-new-password-confirmation"
          type={showConfirmation ? "text" : "password"}
          autoComplete="new-password"
          required
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          className="min-h-12 w-full rounded-md border border-white/10 bg-[#111111] px-4 text-white transition outline-none focus:border-orange-400"
        />
      </div>

      <p className="text-xs leading-5 text-white/40">
        Almeno 8 caratteri, una maiuscola, una minuscola, un numero e un
        simbolo.
      </p>

      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="text-sm text-emerald-300">
          Password aggiornata. Ti riportiamo alla pagina di accesso…
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading || success}
        className="min-h-12 rounded-md bg-orange-400 px-5 text-sm font-semibold text-black transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Aggiornamento…" : "Salva nuova password"}
      </button>
    </form>
  );
}
