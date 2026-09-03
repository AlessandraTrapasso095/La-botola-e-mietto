import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/features/account/admin-login-form";
import { getServerAdminUser } from "@/server/admin/admin-user";

export const metadata: Metadata = {
  title: "Accesso amministrazione",
};

export default async function AdminLoginPage() {
  const admin = await getServerAdminUser();

  if (admin) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0d0d0d] px-5 py-12 text-white">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-white/10 bg-[#171717] p-7 shadow-2xl sm:p-9">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.18em] text-orange-400 uppercase">
              La Botola e Mietto
            </p>

            <h1 className="mt-4 text-3xl font-semibold">Amministrazione</h1>

            <p className="mt-3 text-sm text-white/50">
              Accedi con un account amministratore.
            </p>
          </div>

          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
