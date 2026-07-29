import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { SiteNotice } from "@/components/ui/site-notice";
import { Text } from "@/components/ui/text";

type LegalPageProps = {
  title: string;
  intro: string;
  children: ReactNode;
};

export function LegalPage({ children, intro, title }: LegalPageProps) {
  return (
    <main id="main-content">
      <Section spacing="compact" className="border-border-subtle border-b">
        <Container className="max-w-[var(--container-reading)]">
          <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
            Informazioni
          </p>
          <Heading as="h1" size="xl" className="mt-4">
            {title}
          </Heading>
          <Text tone="muted" className="mt-5">
            {intro}
          </Text>
        </Container>
      </Section>
      <Section>
        <Container className="max-w-[var(--container-reading)]">
          <SiteNotice tone="accent" className="mb-10">
            <strong className="text-text-strong block">
              Contenuto da validare e aggiornare prima della pubblicazione.
            </strong>
            <Text tone="muted" size="sm" className="mt-2">
              Le informazioni sono in revisione e non costituiscono consulenza
              legale.
            </Text>
          </SiteNotice>
          <div className="legal-content grid gap-8">{children}</div>
        </Container>
      </Section>
    </main>
  );
}
