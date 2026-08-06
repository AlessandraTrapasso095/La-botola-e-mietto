"use client";

import Link from "next/link";
import { useState } from "react";

import { BagIcon, HeartIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { businessInfo } from "@/config/business";
import { shippingConfig } from "@/config/commerce";
import type { CatalogProductSummaryView } from "@/content/catalog/types";
import { ProductPrice } from "@/features/catalog/product-price";
import { useCommerce } from "@/features/commerce/commerce-provider";
import { cn } from "@/lib/cn";
import { formatEuroMinor } from "@/lib/money";

export function ProductPurchasePanel({
  product,
}: {
  product: CatalogProductSummaryView;
}) {
  const [quantity, setQuantity] = useState(1);
  const [shareMessage, setShareMessage] = useState("");
  const { addToCart, isWishlisted, isWishlistPending, toggleWishlist } =
    useCommerce();
  const wished = isWishlisted(product.slug);
  const wishlistPending = isWishlistPending(product.slug);
  const inventoryUnknown = product.stockQuantity === null;
  const isAvailable = (product.stockQuantity ?? 0) > 0;

  const shareProduct = async () => {
    const shareData = {
      title: product.name,
      text: `Scopri ${product.name} su La Botola e Mietto.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(shareData.url);
        setShareMessage("Link copiato");
      }
    } catch {
      setShareMessage("");
    }
  };

  return (
    <div className="lg:sticky lg:top-28">
      <div className="flex flex-wrap gap-2">
        {product.badges.map((badge) => (
          <Badge key={badge}>{badge}</Badge>
        ))}
      </div>
      {product.brandSlug && product.brandName ? (
        <p className="text-accent mt-6 text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
          <Link
            href={`/marchio/${product.brandSlug}`}
            className="animated-underline"
          >
            {product.brandName}
          </Link>
        </p>
      ) : null}
      <h1 className="text-text-strong mt-3 font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] font-semibold">
        {product.name}
      </h1>
      <p className="text-text-muted mt-4 text-sm">
        <Link
          href={`/categoria/${product.categorySlug}`}
          className="animated-underline"
        >
          {product.categoryName}
        </Link>{" "}
        · {product.capacityLabel}
        {product.alcoholPercentage
          ? ` · ${product.alcoholPercentage}% Vol.`
          : ""}
      </p>

      <div className="border-border-subtle mt-8 border-y py-6">
        <ProductPrice product={product} size="lg" />
        <p className="mt-4 flex items-center gap-2 text-sm">
          <span
            className={cn(
              "size-2 rounded-full",
              isAvailable ? "bg-emerald-400" : "bg-text-muted",
            )}
          />
          {inventoryUnknown
            ? "Disponibilità da verificare"
            : isAvailable
              ? "Disponibile · pronta per la spedizione"
              : "Temporaneamente non disponibile"}
        </p>
      </div>

      <div className="mt-7 grid grid-cols-[7.5rem_1fr] gap-3">
        <label className="grid gap-2">
          <span className="text-text-muted text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
            Quantità
          </span>
          <select
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="border-border-subtle bg-surface min-h-12 border px-4"
          >
            {[1, 2, 3, 4, 5, 6].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-2">
          <span aria-hidden="true" className="text-xs">
            &nbsp;
          </span>
          <Button
            fullWidth
            size="lg"
            disabled={!isAvailable}
            onClick={() => addToCart(product, quantity)}
          >
            <BagIcon className="size-5" />
            Aggiungi al carrello
          </Button>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto] gap-3">
        <Button
          variant="secondary"
          fullWidth
          aria-pressed={wished}
          aria-busy={wishlistPending}
          disabled={wishlistPending}
          onClick={() => toggleWishlist(product)}
        >
          <HeartIcon className={cn("size-5", wished && "fill-current")} />
          {wished ? "Nei preferiti" : "Aggiungi ai preferiti"}
        </Button>
        <IconButton aria-label="Condividi prodotto" onClick={shareProduct}>
          <span aria-hidden="true" className="text-lg">
            ↗
          </span>
        </IconButton>
      </div>
      <p
        className="text-accent mt-2 min-h-5 text-right text-xs"
        aria-live="polite"
      >
        {shareMessage}
      </p>

      <div className="border-border-subtle bg-surface/60 mt-6 border p-5">
        <p className="text-text-strong font-serif text-lg">
          Spedizione gratuita sopra{" "}
          {formatEuroMinor(businessInfo.freeShippingThresholdMinor)}
        </p>
        <p className="text-text-muted mt-2 text-sm">
          Imballaggio protettivo e consegna indicativa entro{" "}
          {shippingConfig.indicativeDeliveryHoursFromDispatch} ore dalla
          spedizione.
        </p>
      </div>
    </div>
  );
}
