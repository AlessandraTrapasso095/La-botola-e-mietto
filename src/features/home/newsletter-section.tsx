"use client";

import { useState } from "react";

import { ArrowRightIcon } from "@/components/icons";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export function NewsletterSection() {
  const [submitted, setSubmitted] = useState(false);

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
        {submitted ? (
          <div role="status" className="border-border border p-6">
            <p className="text-text-strong font-serif text-xl">
              Grazie per il tuo interesse.
            </p>
            <p className="text-text-muted mt-2 text-sm">
              Le novità della boutique saranno condivise con misura.
            </p>
          </div>
        ) : (
          <form
            className="grid gap-3 sm:grid-cols-[1fr_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <div>
              <label htmlFor="newsletter-email" className="sr-only">
                Indirizzo email
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="Il tuo indirizzo email"
                className="border-border-subtle bg-background placeholder:text-text-muted focus:border-accent min-h-14 w-full border px-4 transition-colors outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-accent text-accent-contrast hover:bg-accent-soft flex min-h-14 items-center justify-center gap-2 px-6 text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase transition-colors"
            >
              Iscriviti
              <ArrowRightIcon className="size-5" />
            </button>
            <p className="text-text-muted text-xs leading-relaxed sm:col-span-2">
              Prima dell’iscrizione vengono presentati consenso e informativa
              dedicati.
            </p>
          </form>
        )}
      </Container>
    </section>
  );
}
