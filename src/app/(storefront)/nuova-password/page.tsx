import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { accountRoutes } from "@/config/account";
import { AuthPageShell } from "@/features/account/auth-page-shell";
import { NewPasswordForm } from "@/features/account/new-password-form";
import { getServerAccountUser } from "@/server/auth/account-user";
import { getServerEnvironment } from "@/server/env";

export const metadata: Metadata = {
  title: "Nuova password",
  robots: { index: false, follow: false },
};

export default async function NewPasswordPage() {
  if (
    getServerEnvironment().AUTH_SERVICE === "supabase" &&
    !(await getServerAccountUser())
  ) {
    redirect(`${accountRoutes.forgotPassword}?errore=collegamento-non-valido`);
  }

  return (
    <AuthPageShell
      eyebrow="Sicurezza account"
      title="Scegli una nuova password."
      introduction="Usa una combinazione unica e conservala in un gestore di password affidabile."
    >
      <NewPasswordForm />
    </AuthPageShell>
  );
}
