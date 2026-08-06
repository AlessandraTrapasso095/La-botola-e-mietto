export const catalogImportActions = [
  "created",
  "updated",
  "unchanged",
  "skipped",
  "invalid",
  "conflict",
] as const;

export type CatalogImportAction = (typeof catalogImportActions)[number];

export type EntityImportStats = {
  created: number;
  updated: number;
  unchanged: number;
  skipped: number;
};

export type CatalogImportImage = {
  sourceName: string;
  storagePath: string;
  thumbnailPath: string;
  altText: string;
  width: number;
  height: number;
};

export type CatalogImportRow = {
  rowNumber: number;
  code: string;
  sourceName: string;
  name: string;
  slug: string;
  quantity: number;
  netAmountMinor: bigint;
  capacityMl: number | null;
  capacityLabel: string;
  packQuantity: number | null;
  alcoholPercentage: string | null;
  categorySlug: string;
  categoryName: string;
  subcategory: string | null;
  brandSlug: string | null;
  brandName: string | null;
  country: string | null;
  producer: string | null;
  isNew: boolean;
  isOffer: boolean;
  isLimited: boolean;
  image: CatalogImportImage | null;
  imageIssue: string | null;
};

export type CatalogImportIssue = {
  rowNumber: number | null;
  code: string | null;
  kind: "invalid" | "conflict" | "missing_image" | "skipped";
  message: string;
};

export type CatalogImportResult = {
  code: string;
  productName: string;
  action: CatalogImportAction;
  inventoryAction: CatalogImportAction;
  priceAction: CatalogImportAction;
  imageAction: CatalogImportAction;
  offerAction: CatalogImportAction;
  details: string;
};

export type CatalogImportSource = {
  rowsRead: number;
  rows: CatalogImportRow[];
  issues: CatalogImportIssue[];
  duplicateCodes: string[];
};

export type CatalogImportSummary = {
  runId: string;
  startedAt: string;
  completedAt: string;
  rowsRead: number;
  validRows: number;
  uniqueProductCodes: number;
  products: EntityImportStats;
  brands: EntityImportStats;
  categories: EntityImportStats;
  subcategories: EntityImportStats;
  prices: EntityImportStats;
  inventories: EntityImportStats;
  images: EntityImportStats;
  offers: EntityImportStats;
  newArrivalsImported: number;
  offersImported: number;
  invalidRows: number;
  skippedRows: number;
  conflicts: number;
  duplicateCodes: string[];
  missingImages: number;
  databaseCounts: Record<string, number>;
  results: CatalogImportResult[];
  issues: CatalogImportIssue[];
};

export function createEmptyEntityStats(): EntityImportStats {
  return { created: 0, updated: 0, unchanged: 0, skipped: 0 };
}
