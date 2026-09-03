import type { Metadata } from "next";

import { AuthPageShell } from "@/features/account/auth-page-shell";
import { LoginForm } from "@/features/account/login-form";
import { getSafeRedirectPath } from "@/lib/auth/safe-redirect";

export const metadata: Metadata = {
  title: "Accedi",
  description: "Accedi alla tua area personale La Botola e Mietto.",
  robots: { index: false, follow: false },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ ritorno?: string }>;
}) {
  const parameters = await searchParams;
  return (
    <AuthPageShell
      eyebrow="Area personale"
      title="La tua selezione, sempre con te."
      introduction="Accedi per ritrovare le bottiglie che ami, seguire le tue richieste e gestire le preferenze personali."
    >
      <LoginForm returnTo={getSafeRedirectPath(parameters.ritorno)} />
    </AuthPageShell>
  );
}
