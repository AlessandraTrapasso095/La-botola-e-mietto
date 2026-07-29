import type { Metadata } from "next";

import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { LegalPage } from "@/components/legal/legal-page";
import { businessInfo } from "@/config/business";

export const metadata: Metadata = {
  title: "Privacy policy",
  robots: { index: false, follow: false },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="Informazioni sul trattamento dei dati personali e sui diritti degli interessati."
    >
      <section>
        <Heading as="h2" size="md">
          Titolare del trattamento
        </Heading>
        <Text tone="muted" className="mt-3">
          Il titolare è {businessInfo.legalName}, Partita IVA{" "}
          {businessInfo.vatNumber}, con sede in {businessInfo.address.street},{" "}
          {businessInfo.address.postalCode} {businessInfo.address.city} (
          {businessInfo.address.province}). Per richieste relative alla privacy
          è possibile scrivere a {businessInfo.email}.
        </Text>
      </section>
      <section>
        <Heading as="h2" size="md">
          Dati forniti volontariamente
        </Heading>
        <Text tone="muted" className="mt-3">
          Nome, recapiti e contenuto dei messaggi inviati attraverso i canali di
          contatto vengono utilizzati per rispondere alle richieste
          dell’interessato. L’iscrizione alla newsletter richiede un consenso
          distinto.
        </Text>
      </section>
      <section>
        <Heading as="h2" size="md">
          Dati di navigazione e preferenze
        </Heading>
        <Text tone="muted" className="mt-3">
          Il sito utilizza funzioni necessarie per ricordare la conferma
          dell’età e le preferenze cookie. Eventuali categorie facoltative
          restano disattivate fino a una scelta espressa.
        </Text>
      </section>
      <section>
        <Heading as="h2" size="md">
          Diritti dell’interessato
        </Heading>
        <Text tone="muted" className="mt-3">
          È possibile richiedere accesso, rettifica, cancellazione, limitazione
          o opposizione al trattamento, nei casi previsti dalla normativa
          applicabile, utilizzando i recapiti del titolare.
        </Text>
      </section>
    </LegalPage>
  );
}
