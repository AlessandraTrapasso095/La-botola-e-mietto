import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AdminInactivityGuard } from "@/features/admin/admin-inactivity-guard";
import { AdminLogoutButton } from "@/features/admin/admin-logout-button";
import { getServerAdminUser } from "@/server/admin/admin-user";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await getServerAdminUser();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <AdminInactivityGuard />

      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-white/10 bg-[#171717] lg:flex">
        <div className="border-b border-white/10 px-6 py-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-orange-400 uppercase">
            La Botola e Mietto
          </p>

          <p className="mt-2 text-xl font-semibold">Admin</p>
        </div>

        <nav className="grid flex-1 content-start gap-1 p-4 text-sm">
          <Link
            href="/admin"
            className="rounded-md px-4 py-3 text-white/80 transition hover:bg-white/5 hover:text-white"
          >
            Dashboard
          </Link>

          <Link
            href="/admin/ordini"
            className="rounded-md px-4 py-3 text-white/80 transition hover:bg-white/5 hover:text-white"
          >
            Ordini
          </Link>

          <Link
            href="/admin/richieste-annullamento"
            className="rounded-md px-4 py-3 text-white/80 transition hover:bg-white/5 hover:text-white"
          >
            Richieste annullamento
          </Link>

          <Link
            href="/admin/prodotti"
            className="rounded-md px-4 py-3 text-white/80 transition hover:bg-white/5 hover:text-white"
          >
            Prodotti
          </Link>

          <Link
            href="/admin/clienti"
            className="rounded-md px-4 py-3 text-white/80 transition hover:bg-white/5 hover:text-white"
          >
            Clienti
          </Link>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 px-1">
            <p className="truncate text-sm font-medium text-white/90">
              {admin.firstName} {admin.lastName}
            </p>
            <p className="text-xs text-white/40">Amministratore</p>
          </div>

          <AdminLogoutButton />
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="flex min-h-16 items-center justify-between border-b border-white/10 bg-[#171717] px-5 sm:px-8">
          <div>
            <p className="text-sm font-medium text-white/90">
              Pannello amministrativo
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">
                {admin.firstName} {admin.lastName}
              </p>

              <p className="text-xs text-white/50">
                Amministratore
              </p>
            </div>

            <div className="lg:hidden">
              <AdminLogoutButton compact />
            </div>
          </div>
        </header>

        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
