import "server-only";

import { z } from "zod";

import type { DemoMediaAsset } from "@/content/demo-assets/media";
import { createEuro, formatEuroMinor } from "@/lib/money";
import { calculateGrossPrice } from "@/server/pricing";
import type {
  Brand,
  CatalogOfferView,
  Category,
  ProductBadge,
  ProductCardView,
  ProductDetailView,
} from "@/types/catalog";

const safeInteger = z.number().int().safe();
const nonNegativeInteger = safeInteger.nonnegative();

const catalogProductCardRowSchema = z.object({
  product_id: z.uuid(),
  code: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  producer: z.string().nullable(),
  country: z.string().nullable(),
  capacity_ml: z.number().int().positive().nullable(),
  capacity_label: z.string().min(1),
  pack_quantity: z.number().int().positive().nullable(),
  alcohol_percentage: z.number().min(0).max(100).nullable(),
  is_new: z.boolean(),
  is_limited: z.boolean(),
  brand_slug: z.string().nullable(),
  brand_name: z.string().nullable(),
  category_slug: z.string().min(1),
  category_name: z.string().min(1),
  subcategory_slug: z.string().nullable(),
  subcategory_name: z.string().nullable(),
  stock_quantity: nonNegativeInteger.nullable(),
  reserved_quantity: nonNegativeInteger.nullable(),
  available_quantity: nonNegativeInteger.nullable(),
  regular_net_amount_minor: nonNegativeInteger,
  promotional_net_amount_minor: nonNegativeInteger.nullable(),
  effective_net_amount_minor: nonNegativeInteger,
  gross_amount_minor: nonNegativeInteger,
  previous_gross_amount_minor: nonNegativeInteger.nullable(),
  vat_rate_basis_points: z.number().int().min(0).max(10_000),
  currency: z.literal("EUR"),
  offer_id: z.uuid().nullable(),
  image_path: z.string().min(1).nullable(),
  thumbnail_path: z.string().min(1).nullable(),
  image_alt_text: z.string().nullable(),
  image_width: z.number().int().positive().nullable(),
  image_height: z.number().int().positive().nullable(),
});

const catalogProductDetailRowSchema = catalogProductCardRowSchema.extend({
  description: z.string().nullable(),
  tasting_notes: z.string().nullable(),
  service_notes: z.string().nullable(),
  origin: z.string().nullable(),
});

const catalogBrandRowSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  country: z.string().nullable(),
  description: z.string().nullable(),
  product_count: nonNegativeInteger,
});

const catalogCategoryRowSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable(),
  subcategories: z.array(z.string()),
});

type CatalogProductDatabaseRow = z.infer<typeof catalogProductCardRowSchema>;

const placeholderMedia: DemoMediaAsset = {
  src: "/images/placeholder-bottle.svg",
  alt: "Bottiglia in attesa della fotografia definitiva",
  width: 800,
  height: 1000,
  position: "center",
};

function publicAssetPath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

function createProductMedia(row: CatalogProductDatabaseRow): DemoMediaAsset {
  if (!row.image_path || !row.image_width || !row.image_height) {
    return {
      ...placeholderMedia,
      alt: `Immagine di ${row.name} non disponibile`,
    };
  }

  return {
    src: publicAssetPath(row.image_path),
    thumbnailSrc: row.thumbnail_path
      ? publicAssetPath(row.thumbnail_path)
      : undefined,
    alt: row.image_alt_text?.trim() || row.name,
    width: row.image_width,
    height: row.image_height,
    position: "center",
  };
}

function toSafeMinorNumber(value: bigint, field: string) {
  const numberValue = Number(value);
  if (!Number.isSafeInteger(numberValue)) {
    throw new RangeError(`${field} supera l'intervallo monetario supportato.`);
  }
  return numberValue;
}

function normalizeTaxonomyLabel(value: string) {
  return value.replace(/ (?:&|e) /g, " | ");
}

function createOffer(
  row: CatalogProductDatabaseRow,
  grossAmountMinor: bigint,
): CatalogOfferView | null {
  if (!row.offer_id) return null;

  const previousGrossAmountMinor =
    row.promotional_net_amount_minor === null
      ? null
      : BigInt(row.previous_gross_amount_minor ?? 0);
  const discountPercentage =
    previousGrossAmountMinor && previousGrossAmountMinor > grossAmountMinor
      ? Number(
          ((previousGrossAmountMinor - grossAmountMinor) * 100n +
            previousGrossAmountMinor / 2n) /
            previousGrossAmountMinor,
        )
      : null;

  return {
    isActive: true,
    previousGrossPriceMinor:
      previousGrossAmountMinor === null
        ? null
        : toSafeMinorNumber(
            previousGrossAmountMinor,
            "Prezzo precedente lordo",
          ),
    previousGrossPrice:
      previousGrossAmountMinor === null
        ? null
        : formatEuroMinor(previousGrossAmountMinor),
    discountPercentage,
  };
}

function createBadges(row: CatalogProductDatabaseRow): ProductBadge[] {
  return [
    ...(row.offer_id ? (["In offerta"] as const) : []),
    ...(!row.offer_id && row.is_new ? (["Nuovo"] as const) : []),
    ...(row.is_limited ? (["Edizione limitata"] as const) : []),
  ];
}

function mapProductRow(rowValue: unknown) {
  const row = catalogProductCardRowSchema.parse(rowValue);
  const effectiveNetAmountMinor = BigInt(row.effective_net_amount_minor);
  const vatRateBasisPoints = BigInt(row.vat_rate_basis_points);
  const grossPrice = calculateGrossPrice(
    createEuro(effectiveNetAmountMinor),
    vatRateBasisPoints,
  );

  if (grossPrice.amountMinor !== BigInt(row.gross_amount_minor)) {
    throw new Error(`Prezzo lordo incoerente per ${row.code}.`);
  }

  return { row, grossPrice };
}

export function mapSupabaseProductCard(rowValue: unknown): ProductCardView {
  const { row, grossPrice } = mapProductRow(rowValue);

  return {
    code: row.code,
    slug: row.slug,
    name: row.name,
    brandSlug: row.brand_slug,
    brandName: row.brand_name,
    categorySlug: row.category_slug,
    categoryName: normalizeTaxonomyLabel(row.category_name),
    subcategory: normalizeTaxonomyLabel(
      row.subcategory_name ?? row.category_name,
    ),
    capacityMl: row.capacity_ml,
    capacityLabel: row.capacity_label,
    packQuantity: row.pack_quantity,
    alcoholPercentage:
      row.alcohol_percentage === null ? null : String(row.alcohol_percentage),
    country: row.country,
    producer: row.producer,
    stockQuantity: row.available_quantity,
    isNew: row.is_new && !row.offer_id,
    isLimited: row.is_limited,
    badges: createBadges(row),
    media: [createProductMedia(row)],
    grossPriceMinor: toSafeMinorNumber(grossPrice.amountMinor, "Prezzo lordo"),
    grossPrice: formatEuroMinor(grossPrice.amountMinor),
    offer: createOffer(row, grossPrice.amountMinor),
  };
}

export function mapSupabaseProductDetail(
  rowValue: unknown,
  media?: readonly DemoMediaAsset[],
): ProductDetailView {
  const detailRow = catalogProductDetailRowSchema.parse(rowValue);
  const { row } = mapProductRow(detailRow);
  const card = mapSupabaseProductCard(row);
  const characteristics = [
    { label: "Tipologia", value: card.subcategory },
    { label: "Formato", value: card.capacityLabel },
    ...(card.alcoholPercentage
      ? [{ label: "Gradazione", value: `${card.alcoholPercentage}% Vol.` }]
      : []),
    ...(card.country ? [{ label: "Paese", value: card.country }] : []),
    ...(card.producer ? [{ label: "Produttore", value: card.producer }] : []),
  ];

  return {
    ...card,
    media:
      media && media.length > 0
        ? ([...media] as [DemoMediaAsset, ...DemoMediaAsset[]])
        : card.media,
    overview:
      detailRow.description?.trim() ||
      `${row.name} è una referenza di ${card.subcategory.toLocaleLowerCase("it-IT")} nel formato ${card.capacityLabel}, selezionata per il catalogo La Botola e Mietto.`,
    tastingNotes: detailRow.tasting_notes,
    service: detailRow.service_notes,
    origin: detailRow.origin ?? row.country,
    pairings: [],
    characteristics,
  };
}

export function getSupabaseProductId(rowValue: unknown) {
  return z.object({ product_id: z.uuid() }).parse(rowValue).product_id;
}

export function mapSupabaseProductImage(rowValue: unknown): DemoMediaAsset {
  const row = z
    .object({
      storage_path: z.string().min(1),
      thumbnail_path: z.string().min(1).nullable(),
      alt_text: z.string(),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    })
    .parse(rowValue);

  return {
    src: publicAssetPath(row.storage_path),
    thumbnailSrc: row.thumbnail_path
      ? publicAssetPath(row.thumbnail_path)
      : undefined,
    alt: row.alt_text,
    width: row.width,
    height: row.height,
    position: "center",
  };
}

export function mapSupabaseBrand(rowValue: unknown): Brand {
  const row = catalogBrandRowSchema.parse(rowValue);
  const description =
    row.description?.trim() ||
    `Scopri le referenze ${row.name} presenti nella selezione.`;

  return {
    slug: row.slug,
    name: row.name,
    country: row.country,
    productCount: row.product_count,
    needsReview: false,
    description,
    story: description,
    media: { ...placeholderMedia, alt: `Selezione ${row.name}` },
  };
}

export function mapSupabaseCategory(rowValue: unknown): Category {
  const row = catalogCategoryRowSchema.parse(rowValue);
  const name = normalizeTaxonomyLabel(row.name);
  const description =
    row.description?.trim() || `Esplora la selezione ${name}.`;

  return {
    slug: row.slug,
    name,
    shortName: name,
    eyebrow: "Catalogo",
    description,
    introduction: description,
    subcategories: row.subcategories.map(normalizeTaxonomyLabel),
    media: { ...placeholderMedia, alt: `Selezione ${name}` },
  };
}
