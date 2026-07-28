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
      intro="Struttura provvisoria per l’informativa sul trattamento dei dati personali."
    >
      <section>
        <Heading as="h2" size="md">
          Titolare del trattamento
        </Heading>
        <Text tone="muted" className="mt-3">
          {businessInfo.legalName}, Partita IVA {businessInfo.vatNumber}. I
          recapiti correnti sono disponibili nella pagina Contatti.
        </Text>
      </section>
      <section>
        <Heading as="h2" size="md">
          Ambiti da definire
        </Heading>
        <Text tone="muted" className="mt-3">
          Finalità, basi giuridiche, tempi di conservazione, responsabili,
          trasferimenti, diritti dell’interessato e servizi di terze parti
          saranno completati dopo la selezione definitiva dello stack operativo.
        </Text>
      </section>
    </LegalPage>
  );
}
