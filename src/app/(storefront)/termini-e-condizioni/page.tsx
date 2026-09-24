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
      intro="Condizioni che regolano l’accesso al catalogo e gli acquisti effettuati sul sito."
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
          Tempi indicativi di consegna, modalità di imballaggio, condizioni per
          i resi ed eventuali eccezioni sono riepilogati nella pagina Spedizioni
          e resi.
        </Text>
      </section>
    </LegalPage>
  );
}
