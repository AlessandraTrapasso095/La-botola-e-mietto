"use client";

import Link from "next/link";
import { useState } from "react";
import { z } from "zod";

import { ArrowRightIcon } from "@/components/icons";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

const newsletterSchema = z.object({
  email: z.string().trim().email("Inserisci un indirizzo email valido."),
  privacyAccepted: z.literal(true, {
    error: "Conferma di aver letto l’informativa privacy.",
  }),
});

type NewsletterState = "idle" | "loading" | "success" | "error";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [submissionState, setSubmissionState] =
    useState<NewsletterState>("idle");
  const [feedback, setFeedback] = useState("");

  async function submitNewsletter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = newsletterSchema.safeParse({ email, privacyAccepted });

    if (!validation.success) {
      setSubmissionState("error");
      setFeedback(validation.error.issues[0]?.message ?? "Verifica i dati.");
      return;
    }

    setSubmissionState("loading");
    setFeedback("Iscrizione in corso…");

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 650));
      setSubmissionState("success");
      setFeedback(
        "Grazie. Ti aggiorneremo sulle nuove etichette e sulle storie della boutique.",
      );
      setEmail("");
      setPrivacyAccepted(false);
    } catch {
      setSubmissionState("error");
      setFeedback(
        "Non è stato possibile completare l’iscrizione. Riprova tra poco.",
      );
    }
  }

  return (
    <section
      id="newsletter"
      className="border-border-subtle bg-surface border-y"
    >
      <Container className="grid gap-8 py-16 md:grid-cols-[1fr_1fr] md:items-center md:py-20">
        <div>
          <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
            Lettere dalla cantina
          </p>
          <Heading className="mt-4">
            Nuove etichette, storie e degustazioni.
          </Heading>
        </div>
        {submissionState === "success" ? (
          <div role="status" className="border-border border p-6">
            <p className="text-text-strong font-serif text-xl">
              Grazie per il tuo interesse.
            </p>
            <p className="text-text-muted mt-2 text-sm">{feedback}</p>
            <button
              type="button"
              className="animated-underline text-accent-soft mt-4 min-h-11 text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase"
              onClick={() => {
                setSubmissionState("idle");
                setFeedback("");
              }}
            >
              Iscrivi un altro indirizzo
            </button>
          </div>
        ) : (
          <form
            className="grid gap-3 sm:grid-cols-[1fr_auto]"
            onSubmit={submitNewsletter}
            noValidate
          >
            <div>
              <label htmlFor="newsletter-email" className="sr-only">
                Indirizzo email
              </label>
              <input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (submissionState === "error") setSubmissionState("idle");
                }}
                aria-invalid={submissionState === "error"}
                aria-describedby="newsletter-feedback"
                placeholder="Il tuo indirizzo email"
                className="border-border-subtle bg-background placeholder:text-text-muted focus:border-accent min-h-14 w-full border px-4 transition-colors outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={submissionState === "loading"}
              className="bg-accent hover:bg-accent-soft flex min-h-14 items-center justify-center gap-2 px-6 text-xs font-semibold tracking-[var(--letter-spacing-label)] text-black uppercase transition-colors"
            >
              {submissionState === "loading" ? "Iscrizione…" : "Iscriviti"}
              <ArrowRightIcon className="size-5" />
            </button>
            <label className="text-text-muted flex items-start gap-3 text-xs leading-relaxed sm:col-span-2">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(event) => {
                  setPrivacyAccepted(event.target.checked);
                  if (submissionState === "error") setSubmissionState("idle");
                }}
                className="accent-accent mt-0.5 size-5 shrink-0"
              />
              <span>
                Ho letto la{" "}
                <Link
                  href="/privacy-policy"
                  className="animated-underline text-text"
                >
                  privacy policy
                </Link>{" "}
                e desidero ricevere aggiornamenti editoriali.
              </span>
            </label>
            <p
              id="newsletter-feedback"
              className="min-h-5 text-xs sm:col-span-2"
              aria-live="polite"
            >
              {submissionState === "error" || submissionState === "loading" ? (
                <span
                  className={
                    submissionState === "error"
                      ? "text-danger"
                      : "text-text-muted"
                  }
                >
                  {feedback}
                </span>
              ) : null}
            </p>
          </form>
        )}
      </Container>
    </section>
  );
}
