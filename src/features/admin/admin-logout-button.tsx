"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ADMIN_ACTIVITY_STORAGE_KEY } from "@/features/admin/admin-session";

type AdminLogoutButtonProps = {
  compact?: boolean;
};

export function AdminLogoutButton({
  compact = false,
}: AdminLogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
      });
    } finally {
      window.localStorage.removeItem(
        ADMIN_ACTIVITY_STORAGE_KEY,
      );

      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className={
        compact
          ? "rounded-md border border-white/10 px-3 py-2 text-xs font-medium text-white/70 transition hover:border-orange-400/40 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          : "w-full rounded-md border border-white/10 px-4 py-3 text-left text-sm font-medium text-white/70 transition hover:border-orange-400/40 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      }
    >
      {loading ? "Uscita…" : "Esci"}
    </button>
  );
}
