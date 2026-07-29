import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import type { CatalogProductView } from "@/content/catalog/types";
import { ProductCard } from "@/features/catalog/product-card";
import { cn } from "@/lib/cn";

type ProductShelfProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  products: CatalogProductView[];
  tone?: "default" | "surface";
};

export function ProductShelf({
  id,
  eyebrow,
  title,
  description,
  products,
  tone = "default",
}: ProductShelfProps) {
  return (
    <Section
      id={id}
      spacing="editorial"
      className={cn(
        tone === "surface" &&
          "border-border-subtle bg-surface border-y [background-image:radial-gradient(circle_at_80%_10%,rgb(184_119_54_/_8%),transparent_24rem)]",
      )}
    >
      <Container>
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
              {eyebrow}
            </p>
            <Heading className="mt-4">{title}</Heading>
            <Text tone="muted" className="mt-4">
              {description}
            </Text>
          </div>
          <Link
            href="/contatti"
            className="animated-underline text-accent-soft inline-flex min-h-11 items-center gap-2 self-start text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase md:self-auto"
          >
            Richiedi la lista completa
            <ArrowRightIcon className="size-5" />
          </Link>
        </Reveal>

        <div className="scrollbar-hidden -mx-[var(--container-gutter)] mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--container-gutter)] pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
          {products.map((product, index) => (
            <Reveal
              key={product.code}
              delayStep={index}
              className="w-[78vw] max-w-[21rem] shrink-0 snap-start md:w-auto md:max-w-none"
            >
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
