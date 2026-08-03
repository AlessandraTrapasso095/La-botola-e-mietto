"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { accountRoutes } from "@/config/account";
import { useAccount } from "@/features/account/account-provider";

const resetSchema = z.object({
  email: z.string().trim().email("Inserisci un indirizzo email valido."),
});

type ResetValues = z.infer<typeof resetSchema>;
type ResetState = "idle" | "loading" | "success" | "error";

export function PasswordResetForm() {
  const { requestPasswordReset } = useAccount();
  const [submissionState, setSubmissionState] = useState<ResetState>("idle");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: "" },
  });

  const submit = handleSubmit(async ({ email }) => {
    setSubmissionState("loading");
    try {
      await requestPasswordReset(email);
      setSubmissionState("success");
    } catch {
      setSubmissionState("error");
    }
  });

  return (
    <form
      className="border-border-subtle bg-surface grid gap-5 border p-6 sm:p-9"
      onSubmit={submit}
      noValidate
    >
      <div>
        <p className="text-text-strong font-serif text-2xl">
          Recupera la password
        </p>
        <p className="text-text-muted mt-2 text-sm">
          Inserisci l’indirizzo associato al tuo account.
        </p>
      </div>
      <Input
        id="reset-email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Button
        type="submit"
        size="lg"
        fullWidth
        disabled={submissionState === "loading"}
      >
        {submissionState === "loading" ? "Invio in corso…" : "Invia istruzioni"}
      </Button>
      <div className="min-h-12 text-sm" aria-live="polite">
        {submissionState === "success" ? (
          <p className="text-accent-soft">
            Se l’indirizzo è associato a un account, riceverai le istruzioni per
            procedere.
          </p>
        ) : null}
        {submissionState === "error" ? (
          <p className="text-danger">
            Non è stato possibile inviare le istruzioni. Riprova.
          </p>
        ) : null}
      </div>
      <Link
        href={accountRoutes.signIn}
        className="animated-underline text-accent-soft inline-flex min-h-11 items-center justify-center text-sm"
      >
        Torna all’accesso
      </Link>
    </form>
  );
}
