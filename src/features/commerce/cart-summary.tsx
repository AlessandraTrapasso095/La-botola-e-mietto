"use client";

import Link from "next/link";

import { Divider } from "@/components/ui/divider";
import { businessInfo } from "@/config/business";
import { useCommerce } from "@/features/commerce/commerce-provider";
import { cn } from "@/lib/cn";
import { formatEuroMinor } from "@/lib/money";

export function CartShippingProgress({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { shippingProgress } = useCommerce();

  return (
    <div
      className={cn(
        "cart-shipping-progress border-border-subtle bg-surface border",
        compact ? "p-3" : "p-4",
      )}
    >
      <p className="text-text-strong text-sm">
        {shippingProgress.qualified
          ? "Hai ottenuto la spedizione gratuita in Italia."
          : `Aggiungi ${formatEuroMinor(
              BigInt(shippingProgress.remainingMinor),
            )} per la spedizione gratuita.`}
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
          style={{
            width: `${shippingProgress.percentage}%`,
          }}
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
  compact = false,
}: {
  className?: string;
  checkoutLink?: boolean;
  compact?: boolean;
}) {
  const { cart, cartLoading, setCartOpen, shippingProgress } = useCommerce();

  const checkoutDisabled = cart.lines.length === 0 || cartLoading;

  return (
    <div
      className={cn("cart-totals grid", compact ? "gap-3" : "gap-5", className)}
    >
      <CartShippingProgress compact={compact} />

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

      {checkoutDisabled ? (
        <span
          aria-disabled="true"
          className={cn(
            "border-accent bg-accent inline-flex w-full cursor-not-allowed items-center justify-center rounded-xs border font-semibold tracking-[var(--letter-spacing-label)] text-black uppercase opacity-[var(--opacity-disabled)]",
            compact
              ? "min-h-11 px-4 py-2 text-xs"
              : "min-h-11 px-6 py-3 text-sm",
          )}
        >
          {cartLoading ? "Caricamento carrello…" : "Procedi al checkout"}
        </span>
      ) : (
        <Link
          href="/checkout"
          onClick={() => setCartOpen(false)}
          className={cn(
            "border-accent bg-accent hover:border-accent-soft hover:bg-accent-soft inline-flex w-full items-center justify-center rounded-xs border font-semibold tracking-[var(--letter-spacing-label)] text-black uppercase transition-[color,background-color,border-color,transform] duration-[var(--motion-fast)] ease-[var(--ease-functional)] active:scale-[0.98]",
            compact
              ? "min-h-11 px-4 py-2 text-xs"
              : "min-h-11 px-6 py-3 text-sm",
          )}
        >
          Procedi al checkout
        </Link>
      )}

      {!compact ? (
        <p className="text-text-muted text-center text-xs">
          Spedizione e totale definitivo vengono confermati al checkout.
        </p>
      ) : null}

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
