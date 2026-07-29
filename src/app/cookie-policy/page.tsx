import type { Metadata } from "next";

import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Cookie policy",
  robots: { index: false, follow: false },
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie policy"
      intro="Struttura predisposta per documentare cookie e tecnologie effettivamente installati."
    >
      <section>
        <Heading as="h2" size="md">
          Stato attuale
        </Heading>
        <Text tone="muted" className="mt-3">
          Non sono attualmente utilizzati strumenti facoltativi di analisi o
          marketing. La conferma dell’età e le preferenze espresse dall’utente
          sono gestite separatamente.
        </Text>
      </section>
      <section>
        <Heading as="h2" size="md">
          Categorie predisposte
        </Heading>
        <Text tone="muted" className="mt-3">
          Necessari, preferenze, misurazione e marketing. L’elenco definitivo
          verrà generato solo dopo un audit dei servizi realmente attivi.
        </Text>
      </section>
    </LegalPage>
  );
}
