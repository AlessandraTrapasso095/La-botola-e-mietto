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
      intro="Riepilogo operativo provvisorio basato sulle informazioni fornite dal cliente."
    >
      <section>
        <Heading as="h2" size="md">
          Spedizioni in Italia
        </Heading>
        <Text tone="muted" className="mt-3">
          Corriere indicato: {shippingConfig.courier}. Consegna indicativa entro{" "}
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
          Finestra indicativa di {shippingConfig.returnWindowDays} giorni per
          bottiglie integre e sigillate. Eccezioni, costi, modalità di
          autorizzazione e indirizzo di rientro devono essere validati.
        </Text>
      </section>
      <section>
        <Heading as="h2" size="md">
          Difetto da tappo
        </Heading>
        <Text tone="muted" className="mt-3">
          È prevista una procedura specifica con conservazione di bottiglia,
          contenuto residuo e tappo. Condizioni e rimedi devono essere
          verificati prima della pubblicazione.
        </Text>
      </section>
    </LegalPage>
  );
}
