import type { Metadata } from "next";

import { AuthPageShell } from "@/features/account/auth-page-shell";
import { LoginForm } from "@/features/account/login-form";

export const metadata: Metadata = {
  title: "Accedi",
  description: "Accedi alla tua area personale La Botola e Mietto.",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <AuthPageShell
      eyebrow="Area personale"
      title="La tua selezione, sempre con te."
      introduction="Accedi per ritrovare le bottiglie che ami, seguire le tue richieste e gestire le preferenze personali."
    >
      <LoginForm />
    </AuthPageShell>
  );
}
