import type { Metadata } from "next";

import { AuthPageShell } from "@/features/account/auth-page-shell";
import { RegisterForm } from "@/features/account/register-form";

export const metadata: Metadata = {
  title: "Registrati",
  description: "Crea la tua area personale La Botola e Mietto.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <AuthPageShell
      eyebrow="Un invito alla scoperta"
      title="Costruisci la tua collezione personale."
      introduction="Salva le etichette che ti incuriosiscono e crea uno spazio dedicato alle tue scelte."
    >
      <RegisterForm />
    </AuthPageShell>
  );
}
