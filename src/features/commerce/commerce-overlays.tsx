"use client";

import Link from "next/link";

import { BagIcon } from "@/components/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { CartLine } from "@/features/commerce/cart-line";
import { useCommerce } from "@/features/commerce/commerce-provider";
import { CartTotals } from "@/features/commerce/cart-summary";

export function CommerceOverlays() {
  const { cart, cartOpen, setCartOpen, toast } = useCommerce();

  return (
    <>
      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className="commerce-drawer bg-background inset-y-0 top-0 right-0 left-auto flex h-dvh max-h-none w-full max-w-md translate-x-0 translate-y-0 flex-col rounded-none border-y-0 border-r-0 p-0 sm:w-[min(100%,30rem)]">
          <div className="border-border-subtle border-b px-5 py-6 pr-16 sm:px-7">
            <DialogTitle>Il tuo carrello</DialogTitle>
            <DialogDescription className="mt-1">
              {cart.itemCount === 0
                ? "La selezione è pronta per la tua prima bottiglia."
                : `${cart.itemCount} ${cart.itemCount === 1 ? "bottiglia" : "bottiglie"} nella tua selezione.`}
            </DialogDescription>
          </div>

          {cart.lines.length > 0 ? (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-7">
                {cart.lines.map((line) => (
                  <CartLine key={line.product.slug} line={line} compact />
                ))}
              </div>
              <div className="border-border-subtle bg-surface/35 border-t p-5 sm:p-7">
                <CartTotals />
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-7 text-center">
              <span className="border-border text-accent flex size-20 items-center justify-center rounded-full border">
                <BagIcon className="size-8" />
              </span>
              <p className="text-text-strong mt-6 font-serif text-2xl">
                Inizia la tua selezione
              </p>
              <p className="text-text-muted mt-3 max-w-sm text-sm">
                Esplora distillati, nuove release e bottiglie da collezione.
              </p>
              <Link
                href="/catalogo"
                className="border-accent bg-accent text-accent-contrast hover:border-accent-soft hover:bg-accent-soft mt-6 inline-flex min-h-12 items-center justify-center border px-8 py-4 text-sm font-semibold tracking-[var(--letter-spacing-label)] uppercase transition-colors"
                onClick={() => setCartOpen(false)}
              >
                Esplora il catalogo
              </Link>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-4 bottom-5 z-[calc(var(--z-dialog)+1)] flex justify-center"
      >
        {toast ? (
          <p
            key={toast.id}
            className="border-accent/50 bg-surface-elevated text-text-strong animate-[toast-in_var(--motion-standard)_var(--ease-editorial)] border px-5 py-3 text-sm shadow-[var(--shadow-ambient)]"
          >
            {toast.message}
          </p>
        ) : null}
      </div>
    </>
  );
}
