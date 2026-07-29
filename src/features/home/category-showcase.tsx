import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import { homeCategories } from "@/content/demo-assets/home";
import { cn } from "@/lib/cn";

export function CategoryShowcase() {
  return (
    <Section id="categorie" spacing="editorial">
      <Container>
        <Reveal className="grid gap-5 md:grid-cols-[1fr_0.7fr] md:items-end">
          <div>
            <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
              La cantina
            </p>
            <Heading className="mt-4 max-w-2xl">
              Percorsi di gusto, non semplici categorie.
            </Heading>
          </div>
          <Text tone="muted" className="md:justify-self-end md:text-right">
            Una selezione costruita per origine, stile e occasione: dal primo
            assaggio alla bottiglia destinata a restare.
          </Text>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2">
          {homeCategories.map((category, index) => (
            <Reveal
              key={category.title}
              delayStep={index % 3}
              className={cn(
                index === 0 && "lg:col-span-5 lg:row-span-2",
                index === 1 && "lg:col-span-4",
                index === 2 && "lg:col-span-3",
                index === 3 && "lg:col-span-3",
                index === 4 && "lg:col-span-4",
                index === 5 && "sm:col-span-2 lg:col-span-12",
              )}
            >
              <Link
                href={category.href}
                className={cn(
                  "image-hover border-border-subtle hover:border-accent group relative block min-h-[22rem] overflow-hidden border transition-colors",
                  index === 0 && "lg:min-h-[46rem]",
                  index === 5 && "lg:min-h-[23rem]",
                )}
              >
                <Image
                  src={category.media.src}
                  alt={category.media.alt}
                  fill
                  sizes={
                    index === 0
                      ? "(min-width: 1024px) 42vw, 100vw"
                      : "(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 100vw"
                  }
                  className="object-cover"
                  style={{ objectPosition: category.media.position }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <p className="text-accent text-[0.65rem] font-semibold tracking-[var(--letter-spacing-label)] uppercase">
                    {category.eyebrow}
                  </p>
                  <div className="mt-2 flex items-end justify-between gap-4">
                    <div>
                      <Heading as="h3" size="md">
                        {category.title}
                      </Heading>
                      <Text
                        tone="muted"
                        size="sm"
                        className="mt-2 max-w-md opacity-0 transition-opacity duration-[var(--motion-standard)] group-hover:opacity-100 group-focus-visible:opacity-100 max-lg:opacity-100"
                      >
                        {category.description}
                      </Text>
                    </div>
                    <span className="border-border group-hover:border-accent group-hover:text-accent flex size-11 shrink-0 items-center justify-center border transition-colors">
                      <ArrowRightIcon className="size-5" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
