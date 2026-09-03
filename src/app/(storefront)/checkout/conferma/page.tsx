import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/features/catalog/breadcrumbs";

export const metadata: Metadata = {
  title: "Pagamento ricevuto",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutConfirmationPage() {
  return (
    <main id="main-content">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Conferma pagamento" }]}
      />

      <Section spacing="standard">
        <Container>
          <div className="border-border-subtle bg-surface mx-auto max-w-3xl border px-6 py-16 text-center sm:px-12">
            <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
              Pagamento completato
            </p>

            <Heading as="h1" className="mt-4">
              Grazie per il tuo ordine.
            </Heading>

            <p className="text-text-muted mx-auto mt-5 max-w-xl">
              Stripe ha completato il pagamento. Stiamo registrando la conferma
              definitiva dell’ordine.
            </p>

            <p className="text-text-muted mx-auto mt-3 max-w-xl text-sm">
              Il pagamento viene verificato automaticamente dal nostro sistema.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link
                href="/account/ordini"
                className="border-accent bg-accent hover:bg-accent-soft inline-flex min-h-12 items-center justify-center border px-8 text-sm font-semibold tracking-[var(--letter-spacing-label)] text-black uppercase transition-colors"
              >
                Visualizza i miei ordini
              </Link>

              <Link
                href="/catalogo"
                className="border-border text-text-strong hover:border-accent inline-flex min-h-12 items-center justify-center border px-8 text-sm font-semibold tracking-[var(--letter-spacing-label)] uppercase transition-colors"
              >
                Torna al catalogo
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
