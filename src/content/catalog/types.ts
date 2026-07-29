import type { DemoMediaAsset } from "@/content/demo-assets/media";

export type CatalogCategory = {
  slug: string;
  name: string;
  shortName: string;
  eyebrow: string;
  description: string;
  introduction: string;
  subcategories: readonly string[];
  media: DemoMediaAsset;
};

export type CatalogBrand = {
  slug: string;
  name: string;
  country: string;
  description: string;
  story: string;
  media: DemoMediaAsset;
};

export type ProductBadge = "Nuovo" | "Edizione limitata" | "Selezione";

export type CatalogProduct = {
  code: string;
  slug: string;
  name: string;
  brandSlug: string;
  categorySlug: string;
  subcategory: string;
  capacityMl: number;
  alcoholPercentage: string | null;
  country: string;
  producer: string;
  netPriceMinor: bigint;
  stockQuantity: number;
  isNew: boolean;
  isLimited: boolean;
  badges: readonly ProductBadge[];
  media: readonly [DemoMediaAsset, ...DemoMediaAsset[]];
  overview: string;
  tastingNotes: string;
  service: string;
  origin: string;
  pairings: readonly string[];
  characteristics: readonly {
    label: string;
    value: string;
  }[];
};

export type CatalogProductView = Omit<
  CatalogProduct,
  "netPriceMinor" | "media"
> & {
  brandName: string;
  categoryName: string;
  capacityLabel: string;
  grossPriceMinor: number;
  grossPrice: string;
  media: readonly [DemoMediaAsset, ...DemoMediaAsset[]];
};

export type CatalogCollection = {
  slug: string;
  title: string;
  description: string;
  productSlugs: readonly string[];
  media: DemoMediaAsset;
};
