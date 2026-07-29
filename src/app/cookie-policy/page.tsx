import type { Metadata } from "next";

import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { LegalPage } from "@/components/legal/legal-page";
import { cookieConsentConfig } from "@/config/consent";
import { CookiePreferencesButton } from "@/features/cookie-consent/cookie-preferences-button";

export const metadata: Metadata = {
  title: "Cookie policy",
  robots: { index: false, follow: false },
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie policy"
      intro="Informazioni sulle tecnologie utilizzate e sulle preferenze disponibili."
    >
      <section>
        <Heading as="h2" size="md">
          Stato attuale
        </Heading>
        <Text tone="muted" className="mt-3">
          Sono utilizzate esclusivamente funzioni necessarie per ricordare la
          conferma dell’età, le preferenze cookie richieste e le scelte di
          navigazione salvate nel browser. Non sono attivi strumenti facoltativi
          di statistica o marketing.
        </Text>
      </section>
      <section>
        <Heading as="h2" size="md">
          Categorie
        </Heading>
        <dl className="mt-5 grid gap-5">
          {Object.values(cookieConsentConfig.categories).map((category) => (
            <div
              key={category.label}
              className="border-border-subtle border-b pb-5"
            >
              <dt className="text-text-strong font-semibold">
                {category.label}
              </dt>
              <dd className="text-text-muted mt-2 text-sm leading-relaxed">
                {category.description}
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <section>
        <Heading as="h2" size="md">
          Durata e gestione
        </Heading>
        <Text tone="muted" className="mt-3">
          Le preferenze sono conservate per un massimo di{" "}
          {cookieConsentConfig.validityDays} giorni e possono essere modificate
          in qualsiasi momento.
        </Text>
        <CookiePreferencesButton className="text-accent-soft mt-4" />
      </section>
    </LegalPage>
  );
}
