import type { Metadata } from "next";

import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Termini e condizioni",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Termini e condizioni"
      intro="Indice provvisorio delle condizioni generali di vendita."
    >
      <section>
        <Heading as="h2" size="md">
          Sezioni da validare
        </Heading>
        <Text tone="muted" className="mt-3">
          Oggetto, disponibilità dei prodotti, prezzi e IVA, conclusione del
          contratto, pagamenti, consegna, diritto di recesso, garanzie,
          responsabilità, legge applicabile e risoluzione delle controversie.
        </Text>
      </section>
      <section>
        <Heading as="h2" size="md">
          Accettazione
        </Heading>
        <Text tone="muted" className="mt-3">
          L’accettazione delle condizioni di vendita viene richiesta
          separatamente durante il checkout e non è collegata alla conferma
          dell’età o alle preferenze cookie.
        </Text>
      </section>
    </LegalPage>
  );
}
