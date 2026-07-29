import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import type { DemoMediaAsset } from "@/content/demo-assets/media";

export function CatalogHero({
  eyebrow,
  title,
  description,
  introduction,
  media,
}: {
  eyebrow: string;
  title: string;
  description: string;
  introduction?: string;
  media: DemoMediaAsset;
}) {
  return (
    <section className="border-border-subtle relative min-h-[34rem] overflow-hidden border-b lg:min-h-[40rem]">
      <Image
        src={media.src}
        alt={media.alt}
        fill
        priority
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: media.position }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(8_8_8_/_95%)_0%,rgb(8_8_8_/_78%)_44%,rgb(8_8_8_/_15%)_82%),linear-gradient(0deg,rgb(8_8_8_/_70%)_0%,transparent_48%)]" />
      <Container className="relative flex min-h-[34rem] items-end py-16 lg:min-h-[40rem] lg:items-center">
        <div className="max-w-2xl">
          <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
            {eyebrow}
          </p>
          <Heading as="h1" size="display" className="mt-5">
            {title}
          </Heading>
          <Text size="lg" className="mt-6 max-w-xl">
            {description}
          </Text>
          {introduction ? (
            <Text tone="muted" className="mt-5 max-w-xl">
              {introduction}
            </Text>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
