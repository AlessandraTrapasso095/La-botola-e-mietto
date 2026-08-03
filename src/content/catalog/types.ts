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
  country: string | null;
  productCount: number;
  needsReview: boolean;
  description: string;
  story: string;
  media: DemoMediaAsset;
};

export type ProductBadge =
  | "Nuovo"
  | "In offerta"
  | "Edizione limitata"
  | "Selezione";

export type CatalogOfferView = {
  isActive: true;
  previousGrossPriceMinor: number | null;
  previousGrossPrice: string | null;
  discountPercentage: number | null;
};

export type CatalogProduct = {
  code: string;
  slug: string;
  name: string;
  brandSlug: string;
  categorySlug: string;
  subcategory: string;
  capacityMl: number | null;
  capacityLabel: string;
  packQuantity: number | null;
  alcoholPercentage: string | null;
  country: string | null;
  producer: string | null;
  netPriceMinor: bigint;
  stockQuantity: number;
  isNew: boolean;
  isLimited: boolean;
  badges: readonly ProductBadge[];
  media: readonly [DemoMediaAsset, ...DemoMediaAsset[]];
  overview: string;
  tastingNotes: string | null;
  service: string | null;
  origin: string | null;
  pairings: readonly string[];
  characteristics: readonly {
    label: string;
    value: string;
  }[];
};

export type CatalogProductSummaryView = Omit<
  CatalogProduct,
  | "netPriceMinor"
  | "overview"
  | "tastingNotes"
  | "service"
  | "origin"
  | "pairings"
  | "characteristics"
> & {
  brandName: string;
  categoryName: string;
  grossPriceMinor: number;
  grossPrice: string;
  offer: CatalogOfferView | null;
};

export type CatalogProductView = CatalogProductSummaryView &
  Pick<
    CatalogProduct,
    | "overview"
    | "tastingNotes"
    | "service"
    | "origin"
    | "pairings"
    | "characteristics"
  >;

export type CatalogCollection = {
  id: string;
  slug: string;
  label: string;
  sourceType:
    | "prestashop-category"
    | "excel-product-field"
    | "excel-status-field";
  sourceValue: string;
  productCount: number;
  href: string;
  eyebrow: string;
  description: string;
  introduction: string;
  productSlugs: readonly string[];
  media: DemoMediaAsset;
};
