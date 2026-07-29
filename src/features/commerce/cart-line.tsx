"use client";

import Image from "next/image";
import Link from "next/link";

import { CloseIcon } from "@/components/icons";
import { IconButton } from "@/components/ui/icon-button";
import type { CartLineView } from "@/features/commerce/commerce-state";
import { useCommerce } from "@/features/commerce/commerce-provider";
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
    <article className="border-border-subtle grid grid-cols-[5.5rem_1fr_auto] gap-4 border-b py-5">
      <Link
        href={`/prodotto/${line.product.slug}`}
        className="bg-surface relative aspect-[3/4] overflow-hidden"
        onClick={() => setCartOpen(false)}
      >
        <Image
          src={media.src}
          alt=""
          fill
          sizes="88px"
          className="object-cover"
          style={{ objectPosition: media.position }}
        />
      </Link>
      <div className="min-w-0">
        <p className="text-accent text-[0.62rem] font-semibold tracking-[var(--letter-spacing-label)] uppercase">
          {line.product.brandName}
        </p>
        <Link
          href={`/prodotto/${line.product.slug}`}
          className="text-text-strong mt-1 block font-serif text-lg leading-tight"
          onClick={() => setCartOpen(false)}
        >
          {line.product.name}
        </Link>
        <p className="text-text-muted mt-1 text-xs">
          {line.product.capacityLabel}
        </p>
        <div className="mt-3 flex items-center gap-3">
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
              {line.product.grossPrice} cad.
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col items-end justify-between gap-3">
        <IconButton
          size="sm"
          aria-label={`Rimuovi ${line.product.name}`}
          onClick={() => removeFromCart(line.product.slug)}
        >
          <CloseIcon className="size-4" />
        </IconButton>
        <p className="text-text-strong text-sm font-semibold">
          {formatEuroMinor(BigInt(line.lineTotalMinor))}
        </p>
      </div>
    </article>
  );
}
