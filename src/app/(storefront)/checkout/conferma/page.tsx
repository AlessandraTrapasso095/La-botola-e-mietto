import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/features/catalog/breadcrumbs";
import { StripeConfirmationCartClear } from "@/features/checkout/stripe-confirmation-cart-clear";
import { verifyStripeCheckoutConfirmation } from "@/server/stripe/checkout-confirmation";

export const metadata: Metadata = {
  title: "Conferma pagamento",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CheckoutConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{
    session_id?: string;
  }>;
}) {
  const params = await searchParams;

  const confirmation = await verifyStripeCheckoutConfirmation(
    params.session_id,
  );

  if (!confirmation.valid) {
    return (
      <main id="main-content">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Conferma pagamento" },
          ]}
        />

        <Section spacing="standard">
          <Container>
            <div className="border-border-subtle bg-surface mx-auto max-w-3xl border px-6 py-16 text-center sm:px-12">
              <p className="text-danger text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
                Pagamento non verificato
              </p>

              <Heading as="h1" className="mt-4">
                Non possiamo confermare questo pagamento.
              </Heading>

              <p className="text-text-muted mx-auto mt-5 max-w-xl">
                La sessione Stripe non è valida oppure non è disponibile. Il
                carrello non è stato modificato.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <Link
                  href="/checkout"
                  className="border-accent bg-accent hover:bg-accent-soft inline-flex min-h-12 items-center justify-center border px-8 text-sm font-semibold tracking-[var(--letter-spacing-label)] text-black uppercase transition-colors"
                >
                  Torna al checkout
                </Link>

                <Link
                  href="/account/ordini"
                  className="border-border text-text-strong hover:border-accent inline-flex min-h-12 items-center justify-center border px-8 text-sm font-semibold tracking-[var(--letter-spacing-label)] uppercase transition-colors"
                >
                  I miei ordini
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      </main>
    );
  }

  if (!confirmation.paid) {
    return (
      <main id="main-content">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Conferma pagamento" },
          ]}
        />

        <Section spacing="standard">
          <Container>
            <div className="border-border-subtle bg-surface mx-auto max-w-3xl border px-6 py-16 text-center sm:px-12">
              <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
                Pagamento in verifica
              </p>

              <Heading as="h1" className="mt-4">
                Stiamo verificando il pagamento.
              </Heading>

              <p className="text-text-muted mx-auto mt-5 max-w-xl">
                Stripe non risulta ancora aver completato il pagamento. Il
                carrello non verrà svuotato finché il pagamento non sarà
                confermato.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <Link
                  href="/account/ordini"
                  className="border-accent bg-accent hover:bg-accent-soft inline-flex min-h-12 items-center justify-center border px-8 text-sm font-semibold tracking-[var(--letter-spacing-label)] text-black uppercase transition-colors"
                >
                  Visualizza i miei ordini
                </Link>

                <Link
                  href="/checkout"
                  className="border-border text-text-strong hover:border-accent inline-flex min-h-12 items-center justify-center border px-8 text-sm font-semibold tracking-[var(--letter-spacing-label)] uppercase transition-colors"
                >
                  Torna al checkout
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      </main>
    );
  }

  return (
    <main id="main-content">
      <StripeConfirmationCartClear />

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

            {confirmation.orderNumber ? (
              <p className="text-text-muted mx-auto mt-5 max-w-xl">
                Ordine{" "}
                <strong className="text-text-strong">
                  {confirmation.orderNumber}
                </strong>
              </p>
            ) : null}

            <p className="text-text-muted mx-auto mt-3 max-w-xl">
              Stripe ha confermato il pagamento. Il tuo ordine è stato
              registrato correttamente.
            </p>

            <p className="text-text-muted mx-auto mt-3 max-w-xl text-sm">
              Riceverai gli aggiornamenti sullo stato dell’ordine via email.
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
