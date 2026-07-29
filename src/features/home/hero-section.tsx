import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { demoMedia } from "@/content/demo-assets/media";

const secondaryCtaClasses =
  "border-border text-text-strong hover:border-accent hover:text-accent-soft inline-flex min-h-12 items-center justify-center gap-2 rounded-xs border px-7 py-4 text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase transition-[color,border-color,transform] duration-[var(--motion-fast)] active:scale-[0.98]";

export function HeroSection() {
  return (
    <section className="hero-section relative isolate min-h-[46rem] overflow-hidden md:min-h-[50rem] xl:max-h-[62rem] xl:min-h-[calc(100svh-2.5rem)]">
      <Image
        src={demoMedia.hero.src}
        alt={demoMedia.hero.alt}
        fill
        priority
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="hero-media -z-30 object-cover object-[62%_center] md:object-[68%_center]"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(12,12,12,0.98)_0%,rgba(12,12,12,0.88)_42%,rgba(12,12,12,0.22)_78%),linear-gradient(0deg,#131313_0%,transparent_42%)] max-md:bg-[linear-gradient(0deg,rgba(12,12,12,0.98)_0%,rgba(12,12,12,0.78)_56%,rgba(12,12,12,0.18)_100%)]" />
      <div className="hero-glow absolute inset-0 -z-10" />

      <Container className="flex min-h-[46rem] items-end pb-16 md:min-h-[50rem] md:items-center md:pb-0 xl:max-h-[62rem] xl:min-h-[calc(100svh-2.5rem)]">
        <div className="hero-copy max-w-3xl pt-32">
          <Badge className="bg-background/45 backdrop-blur-md">
            Boutique italiana di distillati
          </Badge>
          <Heading as="h1" size="display" className="mt-6 max-w-[13ch]">
            Ogni bottiglia racconta{" "}
            <span className="text-accent-soft italic">una storia rara.</span>
          </Heading>
          <p className="text-text-muted mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
            Distillati, etichette di pregio e bottiglie da collezione scelti con
            esperienza, curiosità e attenzione per ogni dettaglio.
          </p>
          <div className="mt-8 flex flex-col gap-3 min-[27rem]:flex-row">
            <Link
              href="/#categorie"
              className="bg-accent text-accent-contrast hover:bg-accent-soft inline-flex min-h-12 items-center justify-center gap-2 rounded-xs border border-[var(--color-accent)] px-7 py-4 text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase transition-[background-color,transform] duration-[var(--motion-fast)] active:scale-[0.98]"
            >
              Esplora la selezione
              <ArrowRightIcon className="size-5" />
            </Link>
            <Link href="/#distillati-rari" className={secondaryCtaClasses}>
              Scopri le rarità
            </Link>
          </div>
        </div>
      </Container>

      <div className="absolute right-[var(--container-gutter)] bottom-8 hidden items-center gap-4 lg:flex">
        <span className="bg-accent block h-px w-12" />
        <span className="text-text-muted text-[0.65rem] tracking-[var(--letter-spacing-label)] uppercase">
          Scorri per esplorare
        </span>
      </div>
    </section>
  );
}
