import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import { businessInfo } from "@/config/business";
import { demoMedia } from "@/content/demo-assets/media";

export const metadata: Metadata = {
  title: "Chi siamo",
  description: `La selezione e l’approccio di ${businessInfo.brandName}.`,
  alternates: { canonical: "/chi-siamo" },
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <Section spacing="editorial">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <div>
            <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
              La nostra selezione
            </p>
            <Heading as="h1" size="xl" className="mt-4">
              Una boutique costruita intorno alle bottiglie.
            </Heading>
            <Text tone="muted" size="lg" className="mt-6">
              La Botola e Mietto nasce da una collaborazione di due personalità
              distinte e differenti che trovano la forza in comune di creare un
              concetto di innovazione.
            </Text>
            <Text tone="muted" className="mt-5">
              Si uniscono per selezionare un cerchio ristretto di prodotti,
              gusti, sapori e profumi da sperimentare loro stessi e trasmettere
              al prossimo.
            </Text>
            <Text tone="muted" className="mt-5">
              Una squadra dinamica e intraprendente alla ricerca di nuove sfide,
              travolti da passione e amore per il mondo dello spirits, propone
              prodotti eccellenti e accuratamente selezionati.
            </Text>
            <Text tone="muted" className="mt-5">
              Attraverso le loro creazioni fotografiche vivono il sentimento e
              l&apos;arte per il proprio lavoro.
            </Text>
            <Text tone="muted" className="mt-5">
              Presente da oltre 30 anni nel settore Beverage &amp; Food.
            </Text>
            <Link
              href="/catalogo"
              className="animated-underline text-accent-soft mt-8 inline-flex min-h-11 items-center gap-2 text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase"
            >
              Esplora il catalogo
              <ArrowRightIcon className="size-5" />
            </Link>
          </div>
          <div className="border-border-subtle relative min-h-[32rem] overflow-hidden border lg:min-h-[44rem]">
            <Image
              src={demoMedia.curation.src}
              alt={demoMedia.curation.alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              style={{ objectPosition: demoMedia.curation.position }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
          </div>
        </Container>
      </Section>

      <Section className="border-border-subtle bg-surface/50 border-y">
        <Container className="grid gap-8 md:grid-cols-3">
          {[
            ["Ricerca", "Etichette ordinate per stile, origine e carattere."],
            ["Consulenza", "Un contatto diretto per regali e selezioni."],
            [
              "Cura",
              "Imballaggi protettivi e assistenza prima della spedizione.",
            ],
          ].map(([title, description]) => (
            <article key={title} className="border-border-subtle border-t pt-6">
              <h2 className="text-text-strong font-serif text-2xl">{title}</h2>
              <p className="text-text-muted mt-3 text-sm leading-relaxed">
                {description}
              </p>
            </article>
          ))}
        </Container>
      </Section>
    </main>
  );
}
