"use client";

import Image from "next/image";
import Link from "next/link";

import { CloseIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import type { CartLineView } from "@/features/commerce/commerce-state";
import { useCommerce } from "@/features/commerce/commerce-provider";
import { cn } from "@/lib/cn";
import { formatEuroMinor } from "@/lib/money";

export function CartLine({
  line,
  compact = false,
}: {
  line: CartLineView;
  compact?: boolean;
}) {
  const { removeFromCart, setCartOpen, setCartQuantity } = useCommerce();
  const media = line.product.media[0];

  return (
    <article
      className={cn(
        "cart-line border-border-subtle grid items-start border-b py-5",
        compact
          ? "grid-cols-[4.75rem_minmax(0,1fr)_auto] gap-3 py-4 last:border-b-0 sm:grid-cols-[5.5rem_minmax(0,1fr)_auto] sm:gap-4"
          : "grid-cols-[5.5rem_minmax(0,1fr)_auto] gap-4",
      )}
    >
      <Link
        href={`/prodotto/${line.product.slug}`}
        className="cart-line-media product-packshot-frame relative aspect-[3/4] overflow-hidden"
        onClick={() => setCartOpen(false)}
      >
        <Image
          src={media.thumbnailSrc ?? media.src}
          alt=""
          fill
          sizes="88px"
          className={cn("p-2", compact ? "object-contain" : "product-packshot")}
          style={{ objectPosition: media.position }}
        />
      </Link>
      <div className="cart-line-content min-w-0">
        <p className="text-accent text-[0.62rem] font-semibold tracking-[var(--letter-spacing-label)] uppercase">
          {line.product.brandName}
        </p>
        <Link
          href={`/prodotto/${line.product.slug}`}
          className="cart-line-name text-text-strong mt-1 block font-serif text-lg leading-tight"
          onClick={() => setCartOpen(false)}
        >
          {line.product.name}
        </Link>
        <p className="cart-line-capacity text-text-muted mt-1 text-xs">
          {line.product.capacityLabel}
        </p>
        {line.product.offer ? <Badge className="mt-2">In offerta</Badge> : null}
        <div className="cart-line-quantity mt-3 flex items-center gap-3">
          <label htmlFor={`quantity-${line.product.slug}`} className="sr-only">
            Quantità di {line.product.name}
          </label>
          <select
            id={`quantity-${line.product.slug}`}
            value={line.quantity}
            onChange={(event) =>
              setCartQuantity(line.product.slug, Number(event.target.value))
            }
            className="border-border-subtle bg-surface min-h-10 border px-3 text-sm"
          >
            {[1, 2, 3, 4, 5, 6].map((quantity) => (
              <option key={quantity} value={quantity}>
                {quantity}
              </option>
            ))}
          </select>
          {!compact ? (
            <span className="text-text-muted text-xs">
              {line.product.offer?.previousGrossPrice ? (
                <del className="mr-2">
                  {line.product.offer.previousGrossPrice}
                </del>
              ) : null}
              {line.product.grossPrice} cad.
            </span>
          ) : null}
        </div>
      </div>
      <div className="cart-line-actions flex flex-col items-end justify-between gap-3 self-stretch">
        <IconButton
          size="sm"
          aria-label={`Rimuovi ${line.product.name}`}
          onClick={() => removeFromCart(line.product.slug)}
        >
          <CloseIcon className="size-4" />
        </IconButton>
        <p className="text-text-strong text-sm font-semibold whitespace-nowrap">
          {formatEuroMinor(BigInt(line.lineTotalMinor))}
        </p>
      </div>
    </article>
  );
}
