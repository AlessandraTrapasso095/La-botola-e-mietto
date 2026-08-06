"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { accountRoutes } from "@/config/account";
import { useAccount } from "@/features/account/account-provider";
import { PasswordField } from "@/features/account/password-field";
import { passwordSchema } from "@/lib/validation/auth";

const newPasswordSchema = z
  .object({
    password: passwordSchema,
    passwordConfirmation: z.string(),
  })
  .refine((values) => values.password === values.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Le password non coincidono.",
  });

type NewPasswordValues = z.infer<typeof newPasswordSchema>;

export function NewPasswordForm() {
  const router = useRouter();
  const { updatePassword } = useAccount();
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: "", passwordConfirmation: "" },
  });

  const submit = handleSubmit(async ({ password }) => {
    setSubmitting(true);
    setFeedback("");
    try {
      await updatePassword(password);
      setFeedback("Password aggiornata.");
      window.setTimeout(() => router.replace(accountRoutes.dashboard), 300);
    } catch {
      setFeedback("Il collegamento non è più valido. Richiedine uno nuovo.");
      setSubmitting(false);
    }
  });

  return (
    <form
      className="border-border-subtle bg-surface grid gap-5 border p-6 sm:p-9"
      onSubmit={submit}
      noValidate
    >
      <p className="text-text-strong font-serif text-2xl">Nuova password</p>
      <PasswordField
        id="new-password"
        label="Nuova password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <PasswordField
        id="new-password-confirmation"
        label="Conferma nuova password"
        autoComplete="new-password"
        error={errors.passwordConfirmation?.message}
        {...register("passwordConfirmation")}
      />
      <Button type="submit" size="lg" fullWidth disabled={submitting}>
        {submitting ? "Aggiornamento in corso…" : "Aggiorna password"}
      </Button>
      <p className="text-accent-soft min-h-6 text-sm" aria-live="polite">
        {feedback}
      </p>
    </form>
  );
}
