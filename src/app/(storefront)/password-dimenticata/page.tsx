import type { Metadata } from "next";

import { AuthPageShell } from "@/features/account/auth-page-shell";
import { PasswordResetForm } from "@/features/account/password-reset-form";

export const metadata: Metadata = {
  title: "Password dimenticata",
  description: "Richiedi le istruzioni per recuperare la password.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell
      eyebrow="Assistenza account"
      title="Ritrova l’accesso al tuo spazio personale."
      introduction="Ti invieremo le indicazioni necessarie all’indirizzo associato al tuo account."
    >
      <PasswordResetForm />
    </AuthPageShell>
  );
}
