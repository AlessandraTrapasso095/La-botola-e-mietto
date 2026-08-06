import Image from "next/image";
import Link from "next/link";

import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  InstagramIcon,
  PackageIcon,
  ShieldIcon,
  SparkleIcon,
} from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import { businessInfo } from "@/config/business";
import { shippingConfig } from "@/config/commerce";
import { socialLinks } from "@/config/social";
import { catalogBrands } from "@/content/catalog/brands";
import {
  instagramStories,
  serviceHighlights,
} from "@/content/demo-assets/home";
import { demoMedia } from "@/content/demo-assets/media";
import { formatEuroMinor } from "@/lib/money";

const featuredBrandSlugs = [
  "jack-daniel-s",
  "johnnie-walker",
  "hendrick-s",
  "tanqueray",
  "diplomatico",
  "plantation",
  "ardbeg",
  "glenfiddich",
] as const;

export function BrandSection() {
  const featuredBrands = featuredBrandSlugs.flatMap((slug) => {
    const brand = catalogBrands.find((candidate) => candidate.slug === slug);

    return brand ? [brand] : [];
  });

  return (
    <Section id="marchi" spacing="standard">
      <Container>
        <Reveal className="text-center">
          <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
            Marchi selezionati
          </p>
          <Heading className="mt-4">Nomi che hanno definito uno stile.</Heading>
        </Reveal>
        <Reveal
          data-featured-brand-grid
          className="border-border-subtle mt-12 grid grid-cols-2 border-t border-l md:grid-cols-3 lg:grid-cols-4"
        >
          {featuredBrands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/marchio/${brand.slug}`}
              data-featured-brand-cell
              className="border-border-subtle text-text-muted hover:text-accent-soft flex min-h-24 min-w-0 items-center justify-center overflow-hidden border-r border-b px-3 py-5 text-center transition-colors sm:min-h-28 sm:px-4 md:min-h-32 md:px-5 lg:min-h-36"
            >
              <span
                data-featured-brand-name
                className="line-clamp-2 max-w-full min-w-0 font-serif text-[1.5rem] leading-[1.08] whitespace-normal sm:text-[1.625rem] md:text-[2rem] lg:text-[1.375rem]"
              >
                {brand.name}
              </span>
            </Link>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}

export function CurationStory() {
  return (
    <Section id="la-nostra-selezione" spacing="editorial">
      <Container>
        <Reveal className="border-border-subtle bg-surface grid overflow-hidden border lg:grid-cols-[1.12fr_0.88fr]">
          <div className="image-hover relative min-h-[28rem] lg:min-h-[42rem]">
            <Image
              src={demoMedia.curation.src}
              alt={demoMedia.curation.alt}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
              style={{ objectPosition: demoMedia.curation.position }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/35" />
          </div>
          <div className="flex items-center p-7 sm:p-12 lg:p-16">
            <div>
              <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
                Esperienza e ricerca
              </p>
              <Heading className="mt-4">
                Scegliere bene richiede tempo, ascolto e curiosità.
              </Heading>
              <Text tone="muted" className="mt-6">
                Da oltre trent’anni nel settore beverage e food, Mietto Giuliano
                ricerca bottiglie capaci di distinguersi per provenienza,
                lavorazione e personalità.
              </Text>
              <Text tone="muted" className="mt-4">
                La selezione nasce dall’assaggio e dal confronto: un approccio
                personale, pensato tanto per chi vuole scoprire quanto per chi
                colleziona.
              </Text>
              <Link
                href="/contatti"
                className="animated-underline text-accent-soft mt-7 inline-flex min-h-11 items-center gap-2 text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase"
              >
                Parla con noi
                <ArrowRightIcon className="size-5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

export function ServiceSection() {
  return (
    <Section spacing="standard" className="border-border-subtle border-y">
      <Container>
        <Reveal className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
              Perché sceglierci
            </p>
            <Heading className="mt-4">Una boutique, anche online.</Heading>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {serviceHighlights.map((highlight) => (
              <article
                key={highlight.number}
                className="border-border-subtle border-t pt-5"
              >
                <p className="text-accent font-serif text-lg">
                  {highlight.number}
                </p>
                <h3 className="text-text-strong mt-5 font-serif text-xl">
                  {highlight.title}
                </h3>
                <p className="text-text-muted mt-3 text-sm leading-relaxed">
                  {highlight.description}
                </p>
              </article>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

export function ShippingBanner() {
  return (
    <section className="bg-accent text-black">
      <Container className="grid gap-6 py-9 md:grid-cols-3 md:items-center">
        <div className="flex items-center gap-4">
          <PackageIcon className="size-7 shrink-0" />
          <div>
            <p className="font-serif text-xl font-semibold">
              Spedizione gratuita
            </p>
            <p className="mt-1 text-xs font-semibold tracking-wide uppercase">
              Sopra {formatEuroMinor(businessInfo.freeShippingThresholdMinor)}{" "}
              in Italia
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ShieldIcon className="size-7 shrink-0" />
          <div>
            <p className="font-serif text-xl font-semibold">
              Imballaggio protettivo
            </p>
            <p className="mt-1 text-xs font-semibold tracking-wide uppercase">
              Assicurazione su richiesta
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SparkleIcon className="size-7 shrink-0" />
          <div>
            <p className="font-serif text-xl font-semibold">
              Consegna indicativa
            </p>
            <p className="mt-1 text-xs font-semibold tracking-wide uppercase">
              Entro {shippingConfig.indicativeDeliveryHoursFromDispatch} ore
              dalla spedizione
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function InstagramSection() {
  return (
    <Section spacing="standard">
      <Container>
        <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
              Dietro la selezione
            </p>
            <Heading className="mt-4">La cantina, ogni giorno.</Heading>
          </div>
          <a
            href={socialLinks.instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={socialLinks.instagram.ariaLabel}
            className="animated-underline text-accent-soft inline-flex min-h-11 items-center gap-2 self-start text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase sm:self-auto"
          >
            <InstagramIcon className="size-5" />
            {socialLinks.instagram.handle}
          </a>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-2 md:grid-cols-4">
          {instagramStories.map((story, index) => (
            <Reveal key={story.title} delayStep={index}>
              <a
                href={socialLinks.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${story.title} su Instagram`}
                className="image-hover group relative block aspect-square overflow-hidden"
              >
                <Image
                  src={story.media.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover"
                  style={{ objectPosition: story.position }}
                />
                <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/45 group-focus-visible:bg-black/45" />
                <div className="absolute inset-0 flex items-end justify-between p-4 opacity-0 transition-opacity duration-[var(--motion-standard)] group-hover:opacity-100 group-focus-visible:opacity-100 max-md:opacity-100">
                  <span className="text-text-strong text-xs font-semibold tracking-wide uppercase">
                    {story.title}
                  </span>
                  <ArrowUpRightIcon className="text-accent size-5" />
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
