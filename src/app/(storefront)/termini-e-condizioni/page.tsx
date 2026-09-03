import type { Metadata } from "next";

import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { LegalPage } from "@/components/legal/legal-page";
import { businessInfo } from "@/config/business";

export const metadata: Metadata = {
  title: "Termini e condizioni",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Termini e condizioni"
      intro="Principi che regolano l’accesso al catalogo e la futura conclusione degli acquisti."
    >
      <section>
        <Heading as="h2" size="md">
          Venditore
        </Heading>
        <Text tone="muted" className="mt-3">
          Il venditore è {businessInfo.legalName}, Partita IVA{" "}
          {businessInfo.vatNumber}, con sede a {businessInfo.address.city} (
          {businessInfo.address.province}), Italia.
        </Text>
      </section>
      <section>
        <Heading as="h2" size="md">
          Prodotti, disponibilità e prezzi
        </Heading>
        <Text tone="muted" className="mt-3">
          Le informazioni di prodotto descrivono capacità, gradazione e
          caratteristiche disponibili. Prezzi, disponibilità e condizioni
          applicabili vengono confermati prima della conclusione dell’ordine.
        </Text>
      </section>
      <section>
        <Heading as="h2" size="md">
          Vendita responsabile
        </Heading>
        <Text tone="muted" className="mt-3">
          La vendita di bevande alcoliche è riservata ai maggiori di 18 anni. La
          conferma dell’età è distinta dall’accettazione delle condizioni di
          vendita, dalla privacy e dalle preferenze cookie.
        </Text>
      </section>
      <section>
        <Heading as="h2" size="md">
          Consegna, recesso e garanzie
        </Heading>
        <Text tone="muted" className="mt-3">
          Tempi indicativi, imballaggio, resi ed eccezioni sono riepilogati
          nella pagina Spedizioni e resi. Le condizioni definitive dovranno
          specificare anche pagamenti, conclusione del contratto, garanzie,
          responsabilità, legge applicabile e risoluzione delle controversie.
        </Text>
      </section>
    </LegalPage>
  );
}
