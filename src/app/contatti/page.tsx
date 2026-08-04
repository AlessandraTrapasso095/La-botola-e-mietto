import type { Metadata } from "next";

import { ArrowUpRightIcon, InstagramIcon } from "@/components/icons";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import { businessAddressLine, businessInfo } from "@/config/business";
import { socialLinks } from "@/config/social";
import { ContactForm } from "@/features/contact/contact-form";

export const metadata: Metadata = {
  title: "Contatti",
  description: `Contatti di ${businessInfo.brandName}.`,
};

export default function ContactsPage() {
  return (
    <main id="main-content">
      <Section spacing="editorial">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
                Contatti
              </p>
              <Heading as="h1" size="xl" className="mt-4">
                Parliamo della tua prossima selezione.
              </Heading>
              <Text tone="muted" className="mt-5">
                Per informazioni su disponibilità, confezioni regalo o bottiglie
                da collezione puoi scriverci, telefonarci oppure utilizzare il
                modulo.
              </Text>
              <address className="border-border-subtle mt-9 grid gap-5 border-t pt-7 not-italic">
                <div>
                  <span className="text-text-muted block text-sm">
                    Titolare
                  </span>
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
                <div className="flex flex-col items-start">
                  <a
                    className="animated-underline text-accent-soft inline-flex min-h-11 items-center"
                    href={`mailto:${businessInfo.email}`}
                  >
                    {businessInfo.email}
                  </a>
                  <a
                    className="animated-underline text-accent-soft inline-flex min-h-11 items-center"
                    href={`tel:${businessInfo.phone.replace(/\s/g, "")}`}
                  >
                    {businessInfo.phone}
                  </a>
                </div>
                <a
                  href={socialLinks.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={socialLinks.instagram.ariaLabel}
                  className="animated-underline text-accent-soft inline-flex min-h-11 w-fit items-center gap-2 text-sm"
                >
                  <InstagramIcon className="size-5" />
                  {socialLinks.instagram.handle}
                </a>
              </address>
            </div>
            <ContactForm />
          </div>
        </Container>
      </Section>
      <Section className="border-border-subtle bg-surface/45 border-y">
        <Container className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
              Dove trovarci
            </p>
            <Heading as="h2" className="mt-4">
              Campo San Martino, Padova.
            </Heading>
            <Text tone="muted" className="mt-4">
              {businessAddressLine}
            </Text>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessAddressLine)}`}
            target="_blank"
            rel="noreferrer"
            className="border-border hover:border-accent hover:text-accent-soft inline-flex min-h-12 items-center justify-center gap-2 border px-6 text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase transition-colors"
          >
            Apri le indicazioni
            <ArrowUpRightIcon className="size-5" />
          </a>
        </Container>
      </Section>
    </main>
  );
}
