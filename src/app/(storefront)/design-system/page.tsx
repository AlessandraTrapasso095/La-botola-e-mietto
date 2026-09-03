import type { Metadata } from "next";
import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/ui/section";
import { Select } from "@/components/ui/select";
import { SiteNotice } from "@/components/ui/site-notice";
import { Text } from "@/components/ui/text";
import { DesignSystemDialogs } from "@/features/design-system/design-system-dialogs";

export const metadata: Metadata = {
  title: "Design system",
  description: "Riferimento interno Obsidian & Gilt.",
  robots: {
    index: false,
    follow: false,
  },
};

const palette = [
  { name: "Obsidian", color: "#131313", text: "#f3f0ea" },
  { name: "Graphite", color: "#20201f", text: "#f3f0ea" },
  { name: "Ivory", color: "#e5e2e1", text: "#131313" },
  { name: "Champagne", color: "#e6c45b", text: "#2f2506" },
  { name: "Bronze", color: "#b87736", text: "#131313" },
] as const;

export default function DesignSystemPage() {
  return (
    <main id="main-content">
      <Section spacing="compact" className="border-border-subtle border-b">
        <Container>
          <Badge>Riferimento interno</Badge>
          <Heading as="h1" size="xl" className="mt-5">
            Obsidian &amp; Gilt
          </Heading>
          <Text tone="muted" className="mt-4 max-w-2xl">
            Fondazione visiva, accessibile e responsive per La Botola e Mietto.
          </Text>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-16">
          <section aria-labelledby="palette-title">
            <Heading id="palette-title" size="md">
              Palette
            </Heading>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {palette.map((swatch) => (
                <div
                  key={swatch.name}
                  className="border-border-subtle flex aspect-square items-end border p-5"
                  style={{
                    backgroundColor: swatch.color,
                    color: swatch.text,
                  }}
                >
                  <span className="font-semibold">{swatch.name}</span>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          <section aria-labelledby="typography-title" className="grid gap-7">
            <Heading id="typography-title" size="md">
              Tipografia
            </Heading>
            <Heading as="h2" size="display">
              Titolo display Playfair
            </Heading>
            <Heading as="h3" size="lg">
              Heading editoriale
            </Heading>
            <Text size="lg">
              Manrope mantiene leggibilità e ritmo arioso nei testi lunghi e
              nelle interfacce.
            </Text>
            <Text tone="muted">
              Testo secondario avorio attenuato, senza perdere contrasto.
            </Text>
          </section>

          <Divider />

          <section aria-labelledby="controls-title">
            <Heading id="controls-title" size="md">
              Controlli
            </Heading>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button>Primario</Button>
              <Button variant="secondary">Secondario</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="quiet">Quiet</Button>
              <Button disabled>Disabilitato</Button>
            </div>
            <div className="mt-8 grid max-w-3xl gap-6 md:grid-cols-2">
              <Input
                id="design-email"
                label="Email"
                type="email"
                placeholder="nome@esempio.it"
                hint="Focus visibile e descrizione associata."
              />
              <Select id="design-category" label="Categoria" defaultValue="">
                <option value="" disabled>
                  Seleziona
                </option>
                <option>Whisky</option>
                <option>Rum</option>
                <option>Gin</option>
              </Select>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              <Badge>Novità</Badge>
              <Badge variant="neutral">Collezione</Badge>
              <Badge variant="danger">Non disponibile</Badge>
            </div>
          </section>

          <Divider />

          <section aria-labelledby="dialog-title">
            <Heading id="dialog-title" size="md">
              Dialog, age gate e overlay
            </Heading>
            <div className="mt-7">
              <DesignSystemDialogs />
            </div>
            <div className="mt-7 grid min-h-32 place-items-center bg-[var(--overlay-color)] text-center">
              <Text>Overlay carbone con blur controllato</Text>
            </div>
          </section>

          <Divider />

          <section aria-labelledby="card-title">
            <Heading id="card-title" size="md">
              Card e hover immagine
            </Heading>
            <article className="image-hover border-border-subtle mt-7 grid max-w-3xl overflow-hidden border md:grid-cols-2">
              <div className="relative min-h-72">
                <Image
                  src="/images/placeholder-bottle.svg"
                  alt="Bottiglia dimostrativa"
                  fill
                  sizes="(min-width: 768px) 24rem, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="bg-surface grid content-center gap-4 p-8">
                <Badge>Card prodotto</Badge>
                <Heading as="h3" size="md">
                  Etichetta in preparazione
                </Heading>
                <Text tone="muted">
                  Il bordo transita verso champagne e l’immagine usa uno zoom
                  massimo di 1.04.
                </Text>
              </div>
            </article>
          </section>

          <Divider />

          <section aria-labelledby="motion-title">
            <Heading id="motion-title" size="md">
              Motion
            </Heading>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {[
                ["Fast", "180 ms", "motion-demo-fast"],
                ["Standard", "340 ms", "motion-demo-standard"],
                ["Editorial", "720 ms", "motion-demo-editorial"],
              ].map(([name, duration, className]) => (
                <button
                  key={name}
                  className={`motion-demo border-border-subtle bg-surface min-h-32 border p-6 text-left ${className}`}
                >
                  <span className="text-text-strong block font-semibold">
                    {name}
                  </span>
                  <span className="text-text-muted mt-2 block">{duration}</span>
                </button>
              ))}
            </div>
            <SiteNotice className="mt-7">
              <Heading as="h3" size="sm">
                Reduced motion
              </Heading>
              <Text tone="muted" size="sm" className="mt-2">
                Reveal, zoom e animazioni non essenziali vengono rimossi con
                <code className="text-accent-soft ml-1">
                  prefers-reduced-motion
                </code>
                .
              </Text>
            </SiteNotice>
          </section>

          <Divider />

          <section aria-labelledby="reveal-title" className="min-h-[28rem]">
            <Heading id="reveal-title" size="md">
              Scroll reveal
            </Heading>
            <div className="mt-36">
              <Reveal>
                <SiteNotice tone="accent">
                  <Heading as="h3" size="sm">
                    Reveal editoriale
                  </Heading>
                  <Text tone="muted" className="mt-2">
                    Opacità e traslazione leggera, senza spostare il layout.
                  </Text>
                </SiteNotice>
              </Reveal>
            </div>
          </section>
        </Container>
      </Section>
    </main>
  );
}
