"use client";

import Link from "next/link";
import { useState } from "react";

import { ADMIN_ACTIVITY_STORAGE_KEY } from "@/features/admin/admin-session";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AdminLoginForm() {
  const [email, setEmail] = useState(() =>
    typeof window !== "undefined"
      ? (window.localStorage.getItem("lbm-admin-login-email") ?? "")
      : "",
  );

  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(() =>
    typeof window !== "undefined"
      ? Boolean(window.localStorage.getItem("lbm-admin-login-email"))
      : false,
  );
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const client = createSupabaseBrowserClient();

      const login = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (login.error || !login.data.user) {
        throw new Error("Credenziali non valide.");
      }

      const profile = await client
        .from("profiles")
        .select("role")
        .eq("id", login.data.user.id)
        .single();

      if (profile.error || profile.data?.role !== "admin") {
        await client.auth.signOut();

        throw new Error(
          "Questo account non è autorizzato ad accedere all’amministrazione.",
        );
      }

      if (rememberMe) {
        window.localStorage.setItem("lbm-admin-login-email", email);
      } else {
        window.localStorage.removeItem("lbm-admin-login-email");
      }

      window.localStorage.setItem(
        ADMIN_ACTIVITY_STORAGE_KEY,
        String(Date.now()),
      );

      window.location.replace("/admin");
    } catch (loginError: unknown) {
      setLoading(false);

      setError(
        loginError instanceof Error
          ? loginError.message
          : "Accesso non riuscito.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
      <div>
        <label
          htmlFor="admin-email"
          className="mb-2 block text-sm font-medium text-white/70"
        >
          Email
        </label>

        <input
          id="admin-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-h-12 w-full rounded-md border border-white/10 bg-[#111111] px-4 text-white transition outline-none focus:border-orange-400"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-4">
          <label
            htmlFor="admin-password"
            className="text-sm font-medium text-white/70"
          >
            Password
          </label>

          <button
            type="button"
            className="text-xs font-medium text-orange-300 transition hover:text-orange-200"
            aria-controls="admin-password"
            aria-pressed={passwordVisible}
            onClick={() => setPasswordVisible((current) => !current)}
          >
            {passwordVisible ? "Nascondi" : "Mostra"}
          </button>
        </div>

        <input
          id="admin-password"
          type={passwordVisible ? "text" : "password"}
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="min-h-12 w-full rounded-md border border-white/10 bg-[#111111] px-4 text-white transition outline-none focus:border-orange-400"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-white/60">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className="size-4 accent-orange-400"
          />

          <span>Ricordami</span>
        </label>

        <Link
          href="/admin/password-dimenticata"
          className="inline-flex min-h-10 items-center text-sm font-medium text-orange-300 transition hover:text-orange-200"
        >
          Password dimenticata?
        </Link>
      </div>

      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="min-h-12 rounded-md bg-orange-400 px-5 text-sm font-semibold text-black transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Accesso…" : "Accedi"}
      </button>
    </form>
  );
}
