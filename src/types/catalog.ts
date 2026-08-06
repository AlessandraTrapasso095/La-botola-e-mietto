import type { DemoMediaAsset } from "@/content/demo-assets/media";

export type ProductBadge =
  | "Nuovo"
  | "In offerta"
  | "Edizione limitata"
  | "Selezione";

export type ProductPrice = {
  netAmountMinor: bigint;
  vatRateBasisPoints: bigint;
  currency: "EUR";
};

export type ProductInventory = {
  stockQuantity: number | null;
  reservedQuantity: number | null;
  availableQuantity: number | null;
};

export type Brand = {
  slug: string;
  name: string;
  country: string | null;
  productCount: number;
  needsReview: boolean;
  description: string;
  story: string;
  media: DemoMediaAsset;
};

export type Category = {
  slug: string;
  name: string;
  shortName: string;
  eyebrow: string;
  description: string;
  introduction: string;
  subcategories: readonly string[];
  media: DemoMediaAsset;
};

export type CatalogProduct = {
  code: string;
  slug: string;
  name: string;
  brandSlug: string | null;
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
  characteristics: readonly { label: string; value: string }[];
};

export type Product = Omit<
  CatalogProduct,
  "netPriceMinor" | "stockQuantity"
> & {
  price: ProductPrice;
  inventory: ProductInventory;
};

export type CatalogOfferView = {
  isActive: true;
  previousGrossPriceMinor: number | null;
  previousGrossPrice: string | null;
  discountPercentage: number | null;
};

export type ProductCardView = Omit<
  CatalogProduct,
  | "netPriceMinor"
  | "stockQuantity"
  | "overview"
  | "tastingNotes"
  | "service"
  | "origin"
  | "pairings"
  | "characteristics"
> & {
  brandName: string | null;
  categoryName: string;
  grossPriceMinor: number;
  grossPrice: string;
  stockQuantity: number | null;
  offer: CatalogOfferView | null;
};

export type ProductDetailView = ProductCardView &
  Pick<
    CatalogProduct,
    | "overview"
    | "tastingNotes"
    | "service"
    | "origin"
    | "pairings"
    | "characteristics"
  >;

export type CatalogProductSummaryView = ProductCardView;
export type CatalogProductView = ProductDetailView;
export type CatalogBrand = Brand;
export type CatalogCategory = Category;

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

export type CatalogFilters = {
  brands: string[];
  categories: string[];
  priceRanges: string[];
  capacities: string[];
  alcoholRanges: string[];
  countries: string[];
  onlyOnOffer: boolean;
  onlyNew: boolean;
  onlyLimited: boolean;
  onlyAvailable: boolean;
};

export type CatalogSort =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name"
  | "newest";

export type CatalogQueryScope = {
  categorySlug?: string;
  subcategorySlug?: string;
  brandSlug?: string;
  productSlugs?: readonly string[];
  onlyOffers?: boolean;
};

export type CatalogQuery = {
  page: number;
  pageSize: number;
  filters: CatalogFilters;
  sort: CatalogSort;
  scope?: CatalogQueryScope;
};

export type PaginatedProducts = {
  items: ProductCardView[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type CatalogFilterOption = { value: string; label: string };

export type CatalogFilterOptions = {
  brands: CatalogFilterOption[];
  categories: CatalogFilterOption[];
  countries: CatalogFilterOption[];
};

export type CatalogSearchResults = {
  query: string;
  normalizedQuery: string;
  isSearchable: boolean;
  products: readonly ProductCardView[];
  brands: readonly Brand[];
  categories: readonly Category[];
  totalCount: number;
};
