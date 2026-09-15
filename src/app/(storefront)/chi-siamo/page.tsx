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
  description: `La storia, la passione e la selezione di ${businessInfo.brandName}.`,
  alternates: { canonical: "/chi-siamo" },
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <Section spacing="editorial" className="pt-12 sm:pt-16 lg:pt-20">
        <Container>
          <div>
            <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
              La nostra storia
            </p>

            <Heading
              as="h1"
              size="xl"
              className="mt-4 max-w-[1500px] leading-[1.02]"
            >
              Oltre 40 anni di esperienza, una passione diventata progetto.
            </Heading>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start lg:gap-16 xl:gap-24">
            <div>
              <Text tone="muted" size="lg" className="max-w-2xl leading-8">
                La mia attività nasce inizialmente nel mondo della vendita
                dolciaria, dopo oltre 40 anni di lavoro, esperienza e passione
                nel commercio. Nel tempo, la curiosità e la voglia di scoprire
                nuovi mondi mi hanno portato ad avvicinarmi sempre di più al
                settore del beverage.
              </Text>

              <Text tone="muted" className="mt-5 max-w-2xl leading-7">
                Quello che inizialmente era solo un interesse è diventato,
                bottiglia dopo bottiglia, una vera passione. Tra un buon whisky,
                un calice e la scoperta di nuove etichette, ho iniziato ad
                appassionarmi a un mondo fatto di ricerca, collezionismo,
                cultura, tradizione e continua scoperta.
              </Text>

              <Text tone="muted" className="mt-5 max-w-2xl leading-7">
                Mi piace andare alla ricerca di prodotti particolari, conoscere
                la loro storia e scoprire realtà nuove, cercando sempre qualcosa
                che possa suscitare curiosità e interesse.
              </Text>

              <Text tone="muted" className="mt-5 max-w-2xl leading-7">
                Con il sostegno della mia famiglia, ho deciso di trasformare
                questa passione in un progetto da coltivare ogni giorno,
                mettendoci dedizione, curiosità ed entusiasmo e portando con me
                l&apos;esperienza maturata in 40 anni di lavoro.
              </Text>

              <Text tone="muted" className="mt-5 max-w-2xl leading-7">
                Oggi porto avanti questo sogno con la stessa curiosità di quando
                ho iniziato, sempre alla ricerca della prossima bottiglia, della
                prossima etichetta e della prossima storia da raccontare.
              </Text>

              <div className="mt-8 border-l border-[color:var(--color-accent)]/40 pl-5">
                <p className="text-text-strong font-serif text-2xl italic">
                  Benvenuti nel mio mondo. 🥃
                </p>
              </div>
            </div>

            <div className="border-border-subtle relative min-h-[34rem] overflow-hidden border sm:min-h-[40rem] lg:min-h-[48rem]">
              <Image
                src={demoMedia.curation.src}
                alt={demoMedia.curation.alt}
                fill
                priority
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover"
                style={{ objectPosition: demoMedia.curation.position }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
            </div>
          </div>
        </Container>
      </Section>

      <Section className="border-border-subtle bg-surface/50 border-y">
        <Container className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
              La nostra selezione
            </p>

            <Heading as="h2" size="lg" className="mt-4">
              Bottiglie scelte per carattere, qualità e unicità.
            </Heading>
          </div>

          <div>
            <Text tone="muted" size="lg">
              Il catalogo nasce da una ricerca continua di whisky, distillati,
              vini ed etichette capaci di distinguersi per provenienza,
              carattere e qualità.
            </Text>

            <Text tone="muted" className="mt-5">
              La selezione privilegia prodotti particolari e realtà
              interessanti, dalle grandi referenze alle bottiglie meno
              conosciute, con l&apos;obiettivo di offrire proposte che possano
              incuriosire sia gli appassionati e i collezionisti sia chi vuole
              semplicemente scoprire qualcosa di nuovo.
            </Text>

            <Text tone="muted" className="mt-5">
              Ogni etichetta viene scelta con attenzione, cercando un equilibrio
              tra qualità, autenticità e capacità di sorprendere: una selezione
              pensata per chi cerca una bottiglia da degustare, da regalare o da
              aggiungere alla propria collezione.
            </Text>

            <Link
              href="/catalogo"
              className="animated-underline text-accent-soft mt-8 inline-flex min-h-11 items-center gap-2 text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase"
            >
              Esplora il catalogo
              <ArrowRightIcon className="size-5" />
            </Link>
          </div>
        </Container>
      </Section>

      <Section>
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
