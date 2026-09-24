import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
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
          <div className="legal-content grid gap-8">{children}</div>
        </Container>
      </Section>
    </main>
  );
}
