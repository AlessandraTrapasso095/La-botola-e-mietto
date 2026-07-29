"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { businessInfo } from "@/config/business";
import { useCommerce } from "@/features/commerce/commerce-provider";
import { formatEuroMinor } from "@/lib/money";
import { cn } from "@/lib/cn";

export function CartShippingProgress() {
  const { shippingProgress } = useCommerce();

  return (
    <div className="border-border-subtle bg-surface border p-4">
      <p className="text-text-strong text-sm">
        {shippingProgress.qualified
          ? "Hai ottenuto la spedizione gratuita in Italia."
          : `Aggiungi ${formatEuroMinor(BigInt(shippingProgress.remainingMinor))} per la spedizione gratuita.`}
      </p>
      <div
        className="bg-surface-strong mt-3 h-1.5 overflow-hidden"
        role="progressbar"
        aria-label="Avanzamento spedizione gratuita"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={shippingProgress.percentage}
      >
        <div
          className="bg-accent h-full transition-[width] duration-[var(--motion-standard)]"
          style={{ width: `${shippingProgress.percentage}%` }}
        />
      </div>
      <p className="text-text-muted mt-2 text-xs">
        Soglia {formatEuroMinor(businessInfo.freeShippingThresholdMinor)}
      </p>
    </div>
  );
}

export function CartTotals({
  className,
  checkoutLink = true,
}: {
  className?: string;
  checkoutLink?: boolean;
}) {
  const { cart, setCartOpen, shippingProgress } = useCommerce();

  return (
    <div className={cn("grid gap-5", className)}>
      <CartShippingProgress />
      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-text-muted">Subtotale</span>
          <strong className="text-text-strong">
            {formatEuroMinor(BigInt(cart.subtotalMinor))}
          </strong>
        </div>
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-text-muted">Spedizione</span>
          <span className="text-text-strong">
            {shippingProgress.qualified ? "Gratuita" : "Calcolata nel checkout"}
          </span>
        </div>
        <Divider />
        <div className="flex items-end justify-between gap-4">
          <span className="text-text-strong font-serif text-xl">Totale</span>
          <div className="text-right">
            <strong className="text-text-strong text-xl">
              {formatEuroMinor(BigInt(cart.subtotalMinor))}
            </strong>
            <p className="text-text-muted text-[0.65rem] uppercase">
              IVA inclusa
            </p>
          </div>
        </div>
      </div>
      <Button fullWidth disabled>
        Procedi al checkout
      </Button>
      <p className="text-text-muted text-center text-xs">
        Spedizione e totale definitivo vengono confermati al checkout.
      </p>
      {checkoutLink ? (
        <Link
          href="/carrello"
          className="animated-underline text-accent-soft mx-auto min-h-11 text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase"
          onClick={() => setCartOpen(false)}
        >
          Vai al carrello
        </Link>
      ) : null}
    </div>
  );
}
