import type { Metadata } from "next";

import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { LegalPage } from "@/components/legal/legal-page";
import { businessInfo } from "@/config/business";
import { shippingConfig } from "@/config/commerce";
import { formatEuroMinor } from "@/lib/money";

export const metadata: Metadata = {
  title: "Spedizioni e resi",
  robots: { index: false, follow: false },
};

export default function ShippingReturnsPage() {
  return (
    <LegalPage
      title="Spedizioni e resi"
      intro="Informazioni essenziali sulla consegna delle bottiglie e sulla gestione dei resi."
    >
      <section>
        <Heading as="h2" size="md">
          Spedizioni in Italia
        </Heading>
        <Text tone="muted" className="mt-3">
          Le spedizioni vengono effettuate in Italia tramite corriere espresso{" "}
          {shippingConfig.courier}. La consegna è indicativamente prevista entro{" "}
          {shippingConfig.indicativeDeliveryHoursFromDispatch} ore dalla
          spedizione, con imballaggio protettivo. Assicurazione disponibile su
          richiesta e previa quotazione.
        </Text>
        <Text tone="muted" className="mt-3">
          Spedizione gratuita per ordini superiori a{" "}
          {formatEuroMinor(businessInfo.freeShippingThresholdMinor)}.
        </Text>
      </section>
      <section>
        <Heading as="h2" size="md">
          Resi
        </Heading>
        <Text tone="muted" className="mt-3">
          Il reso può essere richiesto entro {shippingConfig.returnWindowDays}{" "}
          giorni dall’acquisto per{" "}
          {shippingConfig.returnCondition.toLowerCase()}, senza segni di
          manomissione o danneggiamento.
        </Text>
        <h3 className="text-text-strong mt-6 font-serif text-xl">Eccezioni</h3>
        <ul className="text-text-muted mt-4 grid gap-3 pl-5 text-sm leading-relaxed">
          {shippingConfig.returnExceptions.map((exception) => (
            <li key={exception} className="list-disc">
              {exception}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <Heading as="h2" size="md">
          Difetto da tappo
        </Heading>
        <Text tone="muted" className="mt-3">
          In caso di sospetto difetto da tappo è necessario contattarci prima di
          eliminare il prodotto. {shippingConfig.corkDefectProcedure} In assenza
          di questi elementi non sarà possibile procedere alle verifiche o alla
          sostituzione.
        </Text>
      </section>
    </LegalPage>
  );
}
