"use client";

import Link from "next/link";

import { BagIcon } from "@/components/icons";
import { Heading } from "@/components/ui/heading";
import { CartLine } from "@/features/commerce/cart-line";
import { useCommerce } from "@/features/commerce/commerce-provider";
import { CartTotals } from "@/features/commerce/cart-summary";

export function CartPageContent() {
  const { cart } = useCommerce();

  if (cart.lines.length === 0) {
    return (
      <div className="border-border-subtle flex min-h-[30rem] flex-col items-center justify-center border px-6 text-center">
        <span className="border-border text-accent flex size-20 items-center justify-center rounded-full border">
          <BagIcon className="size-8" />
        </span>
        <Heading as="h1" className="mt-6">
          Il carrello attende la tua selezione.
        </Heading>
        <p className="text-text-muted mt-4 max-w-md">
          Esplora il catalogo tra distillati, nuove release e bottiglie da
          collezione.
        </p>
        <Link
          href="/catalogo"
          className="border-accent bg-accent hover:bg-accent-soft mt-7 inline-flex min-h-12 items-center border px-8 text-sm font-semibold tracking-[var(--letter-spacing-label)] text-black uppercase transition-colors"
        >
          Esplora il catalogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] xl:gap-20">
      <div>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
              La tua selezione
            </p>
            <Heading as="h1" className="mt-4">
              Carrello
            </Heading>
          </div>
          <p className="text-text-muted text-sm">
            {cart.itemCount} {cart.itemCount === 1 ? "bottiglia" : "bottiglie"}
          </p>
        </div>
        <div className="mt-8">
          {cart.lines.map((line) => (
            <CartLine key={line.product.slug} line={line} />
          ))}
        </div>
      </div>
      <aside aria-label="Riepilogo ordine">
        <div className="border-border-subtle bg-surface sticky top-28 border p-6">
          <h2 className="text-text-strong font-serif text-2xl">Riepilogo</h2>
          <CartTotals className="mt-6" checkoutLink={false} />
        </div>
      </aside>
    </div>
  );
}
