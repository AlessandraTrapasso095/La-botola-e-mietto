import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Logo } from "@/components/ui/logo";
import { Section } from "@/components/ui/section";

export function AuthPageShell({
  eyebrow,
  title,
  introduction,
  children,
}: {
  eyebrow: string;
  title: string;
  introduction: string;
  children: ReactNode;
}) {
  return (
    <main id="main-content">
      <Section spacing="editorial">
        <Container className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-36">
            <Logo wordmarkClassName="text-xl" />
            <p className="text-accent mt-10 text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
              {eyebrow}
            </p>
            <Heading as="h1" size="xl" className="mt-4 max-w-xl">
              {title}
            </Heading>
            <p className="text-text-muted mt-5 max-w-lg leading-relaxed">
              {introduction}
            </p>
            <Link
              href="/catalogo"
              className="animated-underline text-accent-soft mt-8 inline-flex min-h-11 items-center text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase"
            >
              Torna alla selezione
            </Link>
          </div>
          {children}
        </Container>
      </Section>
    </main>
  );
}
