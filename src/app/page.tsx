import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon, ShieldIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import { businessInfo } from "@/config/business";
import { primaryCatalogCategories } from "@/config/catalog";
import { shippingConfig } from "@/config/commerce";
import { formatEuroMinor } from "@/lib/money";

const collectionCards = [
  {
    title: "Whisky e Whiskey",
    subtitle: "Single malt, bourbon e selezioni dal mondo",
  },
  {
    title: "Rum e Rhum",
    subtitle: "Tradizioni caraibiche e agricole",
  },
  {
    title: "Vini e Bollicine",
    subtitle: "Tenute, champagne e spumanti",
  },
] as const;

export default function HomePage() {
  return (
    <main id="main-content">
      <section className="relative isolate min-h-[44rem] overflow-hidden lg:min-h-[50rem]">
        <Image
          src="/images/placeholder-hero.svg"
          alt="Composizione editoriale provvisoria con una bottiglia illuminata da luce ambrata"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[68%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(14,14,14,0.96)_0%,rgba(14,14,14,0.8)_42%,rgba(14,14,14,0.2)_78%),linear-gradient(0deg,#131313_0%,transparent_40%)]" />
        <Container className="flex min-h-[44rem] items-center py-20 lg:min-h-[50rem]">
          <div className="max-w-3xl">
            <Badge>Catalogo in preparazione</Badge>
            <Heading as="h1" size="display" className="mt-7">
              Curatela, carattere,{" "}
              <span className="text-accent-soft italic">rarità.</span>
            </Heading>
            <Text size="lg" tone="muted" className="mt-7 max-w-xl">
              Una nuova esperienza digitale dedicata a distillati, vini, liquori
              ed etichette di pregio selezionate in Italia.
            </Text>
            <div className="mt-9 flex flex-col gap-3 md:flex-row">
              <Button size="lg" disabled>
                Catalogo presto disponibile
              </Button>
              <Link
                href="/contatti"
                className="border-border text-text-strong hover:border-accent hover:text-accent-soft inline-flex min-h-12 items-center justify-center gap-2 rounded-xs border px-8 py-4 text-sm font-semibold tracking-[var(--letter-spacing-label)] uppercase transition-colors"
              >
                Contattaci
                <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Section id="collezioni" spacing="editorial">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
              Selezioni
            </p>
            <Heading className="mt-4">Collezioni da esplorare</Heading>
            <Text tone="muted" className="mt-4">
              Una tassonomia pensata per accompagnare sia l’appassionato sia il
              collezionista in un catalogo di oltre duemila referenze.
            </Text>
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-12">
            {collectionCards.map((collection, index) => (
              <Reveal
                key={collection.title}
                delayStep={index}
                className={
                  index === 0 ? "md:col-span-6 md:row-span-2" : "md:col-span-6"
                }
              >
                <article
                  className={`image-hover border-border-subtle group relative min-h-80 overflow-hidden border ${
                    index === 0 ? "md:min-h-[42rem]" : "md:min-h-[20.4rem]"
                  }`}
                >
                  <Image
                    src={
                      index === 0
                        ? "/images/placeholder-cellar.svg"
                        : "/images/placeholder-bottle.svg"
                    }
                    alt=""
                    fill
                    sizes={
                      index === 0
                        ? "(min-width: 768px) 50vw, 100vw"
                        : "(min-width: 768px) 50vw, 100vw"
                    }
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute right-0 bottom-0 left-0 p-7 sm:p-9">
                    <Heading as="h3" size="md">
                      {collection.title}
                    </Heading>
                    <Text tone="muted" size="sm" className="mt-2">
                      {collection.subtitle}
                    </Text>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section
        id="selezione"
        spacing="editorial"
        className="border-border-subtle bg-surface border-y"
      >
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal>
              <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
                Fondazione del catalogo
              </p>
              <Heading className="mt-4">
                Oltre 2.000 referenze, una struttura pensata per crescere.
              </Heading>
              <Text tone="muted" className="mt-6">
                La base tecnica conserva prezzi netti al centesimo, aliquota IVA
                configurabile, disponibilità e categorie senza usare valori
                monetari in virgola mobile.
              </Text>
              <div className="mt-8 flex flex-wrap gap-2">
                {primaryCatalogCategories.slice(0, 10).map((category) => (
                  <Badge key={category} variant="neutral">
                    {category}
                  </Badge>
                ))}
              </div>
            </Reveal>
            <Reveal delayStep={1}>
              <div className="border-border-subtle bg-background grid gap-8 border p-7 sm:p-10">
                <div className="flex items-start gap-4">
                  <ShieldIcon className="text-accent mt-1 shrink-0" />
                  <div>
                    <Heading as="h3" size="sm">
                      Acquisto responsabile
                    </Heading>
                    <Text tone="muted" size="sm" className="mt-2">
                      Age gate e preferenze cookie sono consensi distinti,
                      accessibili e persistenti.
                    </Text>
                  </div>
                </div>
                <div className="border-border-subtle flex items-start gap-4 border-t pt-8">
                  <span className="text-accent font-serif text-3xl" aria-hidden>
                    €
                  </span>
                  <div>
                    <Heading as="h3" size="sm">
                      Spedizione gratuita
                    </Heading>
                    <Text tone="muted" size="sm" className="mt-2">
                      Per ordini superiori a{" "}
                      {formatEuroMinor(businessInfo.freeShippingThresholdMinor)}{" "}
                      sul territorio italiano.
                    </Text>
                  </div>
                </div>
                <div className="border-border-subtle flex items-start gap-4 border-t pt-8">
                  <span className="text-accent font-serif text-3xl" aria-hidden>
                    72
                  </span>
                  <div>
                    <Heading as="h3" size="sm">
                      Consegna indicativa
                    </Heading>
                    <Text tone="muted" size="sm" className="mt-2">
                      Entro {shippingConfig.indicativeDeliveryHoursFromDispatch}{" "}
                      ore dalla spedizione tramite {shippingConfig.courier}.
                    </Text>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section spacing="editorial">
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
              Milestone 0
            </p>
            <Heading className="mt-4">
              La nuova cantina digitale prende forma.
            </Heading>
            <Text tone="muted" className="mt-5">
              Questa è una homepage tecnica provvisoria: i contenuti editoriali,
              le fotografie definitive e il catalogo verranno integrati nelle
              prossime fasi.
            </Text>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
