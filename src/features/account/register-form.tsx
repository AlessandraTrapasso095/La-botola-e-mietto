"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { accountRoutes } from "@/config/account";
import { useAccount } from "@/features/account/account-provider";
import { PasswordField } from "@/features/account/password-field";

const passwordRequirements = {
  length: (password: string) => password.length >= 8,
  uppercase: (password: string) => /[A-Z]/.test(password),
  lowercase: (password: string) => /[a-z]/.test(password),
  number: (password: string) => /\d/.test(password),
  symbol: (password: string) => /[^A-Za-z0-9]/.test(password),
} as const;

const registrationSchema = z
  .object({
    firstName: z.string().trim().min(2, "Inserisci il nome."),
    lastName: z.string().trim().min(2, "Inserisci il cognome."),
    email: z.string().trim().email("Inserisci un indirizzo email valido."),
    password: z
      .string()
      .refine(passwordRequirements.length, "Usa almeno 8 caratteri.")
      .refine(passwordRequirements.uppercase, "Aggiungi una lettera maiuscola.")
      .refine(passwordRequirements.lowercase, "Aggiungi una lettera minuscola.")
      .refine(passwordRequirements.number, "Aggiungi un numero.")
      .refine(passwordRequirements.symbol, "Aggiungi un simbolo."),
    passwordConfirmation: z.string(),
    privacyConsent: z.boolean().refine((accepted) => accepted, {
      message: "Accetta l’informativa privacy per continuare.",
    }),
    marketingConsent: z.boolean(),
    adultConfirmation: z.boolean().refine((confirmed) => confirmed, {
      message: "Conferma di avere almeno 18 anni.",
    }),
  })
  .refine((values) => values.password === values.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Le password non coincidono.",
  });

type RegistrationValues = z.infer<typeof registrationSchema>;
type RegistrationState =
  | "idle"
  | "loading"
  | "error"
  | "success"
  | "confirmation";

const requirementLabels = [
  ["length", "Almeno 8 caratteri"],
  ["uppercase", "Una lettera maiuscola"],
  ["lowercase", "Una lettera minuscola"],
  ["number", "Un numero"],
  ["symbol", "Un simbolo"],
] as const;

export function RegisterForm() {
  const router = useRouter();
  const { registerAccount } = useAccount();
  const [submissionState, setSubmissionState] =
    useState<RegistrationState>("idle");
  const [submissionError, setSubmissionError] = useState("");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      privacyConsent: false,
      marketingConsent: false,
      adultConfirmation: false,
    },
  });
  const password = useWatch({ control, name: "password", defaultValue: "" });

  const submit = handleSubmit(async (values) => {
    setSubmissionState("loading");
    setSubmissionError("");
    try {
      const result = await registerAccount({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        privacyConsent: values.privacyConsent,
        marketingConsent: values.marketingConsent,
        adultConfirmation: values.adultConfirmation,
      });
      if (result.status === "confirmation-required") {
        setSubmissionState("confirmation");
        return;
      }
      setSubmissionState("success");
      window.setTimeout(() => {
        router.refresh();
        router.replace(accountRoutes.dashboard);
      }, 350);
    } catch {
      setSubmissionState("error");
      setSubmissionError(
        "Non è stato possibile creare l’account. Riprova tra poco.",
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
        <p className="text-text-strong font-serif text-2xl">Registrati</p>
        <p className="text-text-muted mt-2 text-sm">
          Crea il tuo spazio personale dedicato alla selezione.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="registration-first-name"
          label="Nome"
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Input
          id="registration-last-name"
          label="Cognome"
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>
      <Input
        id="registration-email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <PasswordField
        id="registration-password"
        label="Password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <ul
        className="grid gap-1 text-xs sm:grid-cols-2"
        aria-label="Requisiti password"
      >
        {requirementLabels.map(([requirement, label]) => {
          const met = passwordRequirements[requirement](password);
          return (
            <li
              key={requirement}
              className={met ? "text-accent-soft" : "text-text-muted"}
            >
              <span aria-hidden="true">{met ? "✓" : "○"}</span> {label}
            </li>
          );
        })}
      </ul>
      <PasswordField
        id="registration-password-confirmation"
        label="Conferma password"
        autoComplete="new-password"
        error={errors.passwordConfirmation?.message}
        {...register("passwordConfirmation")}
      />
      <ConsentField
        error={errors.privacyConsent?.message}
        input={
          <input
            type="checkbox"
            className="accent-accent mt-0.5 size-5 shrink-0"
            {...register("privacyConsent")}
          />
        }
      >
        Ho letto e accetto la{" "}
        <Link href="/privacy-policy" className="text-accent-soft underline">
          privacy policy
        </Link>
        .
      </ConsentField>
      <ConsentField
        input={
          <input
            type="checkbox"
            className="accent-accent mt-0.5 size-5 shrink-0"
            {...register("marketingConsent")}
          />
        }
      >
        Desidero ricevere novità, selezioni e inviti della boutique.
      </ConsentField>
      <ConsentField
        error={errors.adultConfirmation?.message}
        input={
          <input
            type="checkbox"
            className="accent-accent mt-0.5 size-5 shrink-0"
            {...register("adultConfirmation")}
          />
        }
      >
        Confermo di avere almeno 18 anni.
      </ConsentField>
      <Button
        type="submit"
        size="lg"
        fullWidth
        disabled={submissionState === "loading"}
      >
        {submissionState === "loading" ? "Creazione in corso…" : "Crea account"}
      </Button>
      <div className="min-h-6 text-sm" aria-live="polite">
        {submissionState === "error" ? (
          <p className="text-danger">{submissionError}</p>
        ) : null}
        {submissionState === "success" ? (
          <p className="text-accent-soft">
            Account creato. Apertura dell’area personale…
          </p>
        ) : null}
        {submissionState === "confirmation" ? (
          <p className="text-accent-soft" role="status">
            Controlla la tua email e conferma l’indirizzo per accedere.
          </p>
        ) : null}
      </div>
      <p className="border-border-subtle border-t pt-6 text-center text-sm">
        <span className="text-text-muted">Hai già un account? </span>
        <Link
          href={accountRoutes.signIn}
          className="text-accent-soft underline-offset-4 hover:underline"
        >
          Accedi
        </Link>
      </p>
    </form>
  );
}

function ConsentField({
  children,
  error,
  input,
}: {
  children: React.ReactNode;
  error?: string;
  input: React.ReactNode;
}) {
  return (
    <label className="text-text-muted flex items-start gap-3 text-sm leading-relaxed">
      {input}
      <span>
        {children}
        {error ? (
          <span className="text-danger mt-1 block" role="alert">
            {error}
          </span>
        ) : null}
      </span>
    </label>
  );
}
