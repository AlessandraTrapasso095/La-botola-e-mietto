import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import { businessAddressLine, businessInfo } from "@/config/business";

export const metadata: Metadata = {
  title: "Contatti",
  description: `Contatti di ${businessInfo.brandName}.`,
};

export default function ContactsPage() {
  return (
    <main id="main-content">
      <Section spacing="editorial">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
                Contatti
              </p>
              <Heading as="h1" size="xl" className="mt-4">
                Parliamo della tua prossima selezione.
              </Heading>
              <Text tone="muted" className="mt-5">
                In questa fase puoi contattarci direttamente via email o
                telefono.
              </Text>
            </div>
            <address className="border-border-subtle bg-surface grid gap-5 border p-7 not-italic sm:p-10">
              <div>
                <span className="text-text-muted block text-sm">Titolare</span>
                <span className="text-text-strong mt-1 block text-lg">
                  {businessInfo.ownerName}
                </span>
              </div>
              <div>
                <span className="text-text-muted block text-sm">Sede</span>
                <span className="text-text-strong mt-1 block">
                  {businessAddressLine}
                </span>
              </div>
              <div>
                <span className="text-text-muted block text-sm">Email</span>
                <a
                  className="animated-underline text-accent-soft mt-1 inline-flex min-h-11 items-center"
                  href={`mailto:${businessInfo.email}`}
                >
                  {businessInfo.email}
                </a>
              </div>
              <div>
                <span className="text-text-muted block text-sm">Telefono</span>
                <a
                  className="animated-underline text-accent-soft mt-1 inline-flex min-h-11 items-center"
                  href={`tel:${businessInfo.phone.replace(/\s/g, "")}`}
                >
                  {businessInfo.phone}
                </a>
              </div>
            </address>
          </div>
        </Container>
      </Section>
    </main>
  );
}
