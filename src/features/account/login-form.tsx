"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { accountRoutes } from "@/config/account";
import { useAccount } from "@/features/account/account-provider";
import { PasswordField } from "@/features/account/password-field";

const loginSchema = z.object({
  email: z.string().trim().email("Inserisci un indirizzo email valido."),
  password: z.string().min(8, "Inserisci una password di almeno 8 caratteri."),
  rememberMe: z.boolean(),
});

type LoginValues = z.infer<typeof loginSchema>;
type LoginState = "idle" | "loading" | "error" | "success";

export function LoginForm({
  returnTo = accountRoutes.dashboard,
}: {
  returnTo?: string;
}) {
  const router = useRouter();
  const { signIn } = useAccount();
  const [submissionState, setSubmissionState] = useState<LoginState>("idle");
  const [submissionError, setSubmissionError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  });

  const submit = handleSubmit(async ({ email, password }) => {
    setSubmissionState("loading");
    setSubmissionError("");
    try {
      await signIn(email, password);
      setSubmissionState("success");
      window.setTimeout(() => {
        router.refresh();
        router.replace(returnTo);
      }, 250);
    } catch (error) {
      setSubmissionState("error");
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "Non è stato possibile completare l’accesso.",
      );
    }
  });

  return (
    <form
      className="border-border-subtle bg-surface grid gap-5 border p-6 sm:p-9"
      onSubmit={submit}
      noValidate
    >
      <div>
        <p className="text-text-strong font-serif text-2xl">Accedi</p>
        <p className="text-text-muted mt-2 text-sm">
          Ritrova preferiti, indirizzi e selezioni personali.
        </p>
      </div>
      <Input
        id="login-email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <PasswordField
        id="login-password"
        label="Password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <label className="flex min-h-11 items-center gap-3">
          <input
            type="checkbox"
            className="accent-accent size-5"
            {...register("rememberMe")}
          />
          Ricordami
        </label>
        <Link
          href={accountRoutes.forgotPassword}
          className="animated-underline text-accent-soft inline-flex min-h-11 items-center"
        >
          Password dimenticata?
        </Link>
      </div>
      <Button
        type="submit"
        size="lg"
        fullWidth
        disabled={submissionState === "loading"}
      >
        {submissionState === "loading" ? "Accesso in corso…" : "Accedi"}
      </Button>
      <div className="min-h-6 text-sm" aria-live="polite">
        {submissionState === "error" ? (
          <p className="text-danger" role="alert">
            {submissionError}
          </p>
        ) : null}
        {submissionState === "success" ? (
          <p className="text-accent-soft">Accesso effettuato.</p>
        ) : null}
      </div>
      <div className="border-border-subtle border-t pt-6 text-center">
        <p className="text-text-muted text-sm">Non hai ancora un account?</p>
        <Link
          href={accountRoutes.register}
          className="border-border hover:border-accent hover:text-accent-soft mt-4 inline-flex min-h-12 w-full items-center justify-center border px-6 text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase transition-colors"
        >
          Registrati
        </Link>
      </div>
    </form>
  );
}
