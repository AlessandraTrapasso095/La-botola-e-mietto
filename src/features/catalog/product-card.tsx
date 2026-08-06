"use client";

import Image from "next/image";
import Link from "next/link";

import { BagIcon, HeartIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import type { CatalogProductSummaryView } from "@/content/catalog/types";
import { ProductPrice } from "@/features/catalog/product-price";
import { useCommerce } from "@/features/commerce/commerce-provider";
import { cn } from "@/lib/cn";

export function ProductCard({
  product,
  featured = false,
}: {
  product: CatalogProductSummaryView;
  featured?: boolean;
}) {
  const { addToCart, isWishlisted, isWishlistPending, toggleWishlist } =
    useCommerce();
  const media = product.media[0];
  const wished = isWishlisted(product.slug);
  const wishlistPending = isWishlistPending(product.slug);
  const isAvailable = (product.stockQuantity ?? 0) > 0;

  return (
    <article className="product-card group flex h-full flex-col">
      <div
        className={cn(
          "image-hover product-packshot-frame border-border-subtle relative overflow-hidden border",
          featured ? "aspect-[4/5]" : "aspect-[3/4]",
        )}
      >
        <Link
          href={`/prodotto/${product.slug}`}
          aria-label={`Scopri ${product.name}`}
          className="absolute inset-0 z-10"
        />
        {media ? (
          <Image
            src={media.thumbnailSrc ?? media.src}
            alt={media.alt}
            fill
            sizes={
              featured
                ? "(min-width: 1024px) 42vw, 90vw"
                : "(min-width: 1280px) 20vw, (min-width: 768px) 42vw, 78vw"
            }
            className="product-packshot"
            style={{ objectPosition: media.position }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_35%,rgb(230_196_91_/_14%),transparent_35%),linear-gradient(145deg,var(--color-surface),var(--color-background))]">
            <span className="text-accent/70 font-serif text-5xl">L·M</span>
          </div>
        )}
        <div className="absolute top-3 left-3 z-20 flex max-w-[70%] flex-wrap gap-2 sm:top-4 sm:left-4">
          {product.badges.slice(0, 2).map((badge) => (
            <Badge key={badge} className="bg-background/85 backdrop-blur-md">
              {badge}
            </Badge>
          ))}
        </div>
        <IconButton
          aria-label={
            wished
              ? `Rimuovi ${product.name} dai preferiti`
              : `Aggiungi ${product.name} ai preferiti`
          }
          aria-pressed={wished}
          aria-busy={wishlistPending}
          disabled={wishlistPending}
          className={cn(
            "bg-background/80 absolute top-3 right-3 z-20 backdrop-blur-md sm:top-4 sm:right-4",
            wished && "border-accent text-accent",
          )}
          onClick={() => toggleWishlist(product)}
        >
          <HeartIcon className={cn("size-5", wished && "fill-current")} />
        </IconButton>
      </div>

      <div className="flex flex-1 flex-col pt-5">
        {product.brandName ? (
          <p className="text-accent text-[0.65rem] font-semibold tracking-[var(--letter-spacing-label)] uppercase">
            {product.brandName}
          </p>
        ) : null}
        <h3 className="text-text-strong mt-2 font-serif text-xl leading-tight sm:text-2xl">
          <Link
            href={`/prodotto/${product.slug}`}
            className="hover:text-accent-soft transition-colors"
          >
            {product.name}
          </Link>
        </h3>
        <p className="text-text-muted mt-2 text-xs">
          {product.subcategory} · {product.capacityLabel}
          {product.alcoholPercentage
            ? ` · ${product.alcoholPercentage}% Vol.`
            : ""}
        </p>
        <div className="border-border-subtle mt-auto flex items-end justify-between gap-4 border-t pt-4">
          <div>
            <ProductPrice product={product} />
          </div>
          <IconButton
            aria-label={`Aggiungi ${product.name} al carrello`}
            disabled={!isAvailable}
            className="hover:bg-accent hover:text-black"
            onClick={() => addToCart(product)}
          >
            <BagIcon className="size-5" />
          </IconButton>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="skeleton aspect-[3/4]" />
      <div className="skeleton mt-5 h-3 w-24" />
      <div className="skeleton mt-3 h-7 w-4/5" />
      <div className="skeleton mt-3 h-3 w-3/5" />
      <div className="border-border-subtle mt-5 border-t pt-4">
        <div className="skeleton h-6 w-24" />
      </div>
    </div>
  );
}
