import type { CatalogProductView } from "@/content/catalog/types";

export type CommerceState = {
  cart: Record<string, number>;
  wishlist: string[];
};

export type CartLineView = {
  product: CatalogProductView;
  quantity: number;
  lineTotalMinor: number;
};

export type CartSummary = {
  lines: CartLineView[];
  itemCount: number;
  subtotalMinor: number;
};

export function createCartSummary(
  state: CommerceState,
  products: readonly CatalogProductView[],
): CartSummary {
  const productsBySlug = new Map(
    products.map((product) => [product.slug, product]),
  );
  const lines = Object.entries(state.cart).flatMap(([slug, quantity]) => {
    const product = productsBySlug.get(slug);
    if (!product || quantity < 1) return [];

    return [
      {
        product,
        quantity,
        lineTotalMinor: product.grossPriceMinor * quantity,
      },
    ];
  });

  return {
    lines,
    itemCount: lines.reduce((total, line) => total + line.quantity, 0),
    subtotalMinor: lines.reduce(
      (total, line) => total + line.lineTotalMinor,
      0,
    ),
  };
}

export function calculateShippingProgress(
  subtotalMinor: number,
  thresholdMinor: number,
) {
  const remainingMinor = Math.max(0, thresholdMinor - subtotalMinor);
  const percentage =
    thresholdMinor === 0
      ? 100
      : Math.min(100, Math.round((subtotalMinor * 100) / thresholdMinor));

  return {
    remainingMinor,
    percentage,
    qualified: remainingMinor === 0,
  };
}
