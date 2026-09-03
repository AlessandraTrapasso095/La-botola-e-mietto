import type { Metadata } from "next";

import { AdminNewPasswordForm } from "@/features/account/admin-new-password-form";

export const metadata: Metadata = {
  title: "Nuova password amministrazione",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminNewPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0d0d0d] px-5 py-12 text-white">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-white/10 bg-[#171717] p-7 shadow-2xl sm:p-9">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.18em] text-orange-400 uppercase">
              La Botola e Mietto
            </p>

            <h1 className="mt-4 text-3xl font-semibold">Nuova password</h1>

            <p className="mt-3 text-sm leading-6 text-white/50">
              Scegli la nuova password per l’accesso all’amministrazione.
            </p>
          </div>

          <AdminNewPasswordForm />
        </div>
      </div>
    </main>
  );
}
