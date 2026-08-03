import type { CatalogProductSummaryView } from "@/content/catalog/types";
import { cn } from "@/lib/cn";

export function ProductPrice({
  product,
  size = "md",
  showVat = true,
  suffix,
  className,
}: {
  product: Pick<CatalogProductSummaryView, "grossPrice" | "offer">;
  size?: "sm" | "md" | "lg";
  showVat?: boolean;
  suffix?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {product.offer?.previousGrossPrice ? (
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <del className="text-text-muted text-xs">
            {product.offer.previousGrossPrice}
          </del>
          {product.offer.discountPercentage !== null ? (
            <span className="text-accent text-xs font-semibold">
              −{product.offer.discountPercentage}%
            </span>
          ) : null}
        </div>
      ) : null}
      <p
        className={cn(
          "text-text-strong font-semibold",
          size === "sm" && "text-sm",
          size === "md" && "text-lg",
          size === "lg" && "text-3xl",
        )}
      >
        {product.grossPrice}
        {suffix ? ` ${suffix}` : ""}
      </p>
      {showVat ? (
        <p className="text-text-muted mt-0.5 text-[0.65rem] uppercase">
          IVA inclusa
        </p>
      ) : null}
    </div>
  );
}
