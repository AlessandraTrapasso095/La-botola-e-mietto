"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";

export default function SearchError({ reset }: { reset: () => void }) {
  return (
    <main id="main-content">
      <Section spacing="editorial">
        <Container className="max-w-3xl text-center">
          <Heading as="h1" size="xl">
            La ricerca non è disponibile
          </Heading>
          <Text tone="muted" className="mt-4">
            Si è verificato un problema temporaneo. Riprova tra pochi istanti.
          </Text>
          <Button className="mt-7" onClick={reset}>
            Riprova
          </Button>
        </Container>
      </Section>
    </main>
  );
}
