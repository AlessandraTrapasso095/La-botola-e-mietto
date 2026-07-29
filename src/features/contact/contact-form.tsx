"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Inserisci nome e cognome."),
  email: z.string().email("Inserisci un indirizzo email valido."),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(20, "Scrivi almeno 20 caratteri."),
  privacy: z.boolean().refine((accepted) => accepted, {
    message: "Conferma di aver letto la privacy policy.",
  }),
});

type ContactFormValues = z.infer<typeof contactSchema>;
type SubmissionState = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      privacy: false,
    },
  });

  const submit = handleSubmit(async () => {
    setSubmissionState("loading");
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 650));
      setSubmissionState("success");
      reset();
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
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="contact-name"
          label="Nome e cognome"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          id="contact-email"
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
      <Input
        id="contact-phone"
        label="Telefono, facoltativo"
        type="tel"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register("phone")}
      />
      <label className="grid gap-2">
        <span className="text-text-strong text-sm font-semibold">
          Come possiamo aiutarti?
        </span>
        <textarea
          rows={6}
          className="border-border-subtle bg-background focus:border-accent min-h-36 resize-y border p-4 outline-none"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
          {...register("message")}
        />
        {errors.message ? (
          <span id="contact-message-error" className="text-danger text-sm">
            {errors.message.message}
          </span>
        ) : null}
      </label>
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          className="accent-accent mt-1 size-5 shrink-0"
          aria-invalid={Boolean(errors.privacy)}
          {...register("privacy")}
        />
        <span>
          Ho letto la privacy policy relativa alla richiesta di contatto.
          {errors.privacy ? (
            <span className="text-danger mt-1 block">
              {errors.privacy.message}
            </span>
          ) : null}
        </span>
      </label>
      <Button type="submit" size="lg" disabled={submissionState === "loading"}>
        {submissionState === "loading" ? "Invio in corso…" : "Invia richiesta"}
      </Button>
      <div className="min-h-6 text-sm" aria-live="polite">
        {submissionState === "success" ? (
          <p className="text-accent-soft">
            Grazie, la tua richiesta è stata ricevuta.
          </p>
        ) : null}
        {submissionState === "error" ? (
          <p className="text-danger">
            Non è stato possibile inviare la richiesta. Riprova o contattaci
            direttamente.
          </p>
        ) : null}
      </div>
    </form>
  );
}
