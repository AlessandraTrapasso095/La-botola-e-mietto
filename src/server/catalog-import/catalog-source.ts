import { existsSync } from "node:fs";
import path from "node:path";

import { readSheet, type CellValue } from "read-excel-file/node";
import { z } from "zod";

import { catalogBrands } from "@/content/catalog/brands";
import { catalogCategories } from "@/content/catalog/categories";
import { productBrandByCode } from "@/content/catalog/product-brands";
import { catalogProducts } from "@/content/catalog/products";
import type { CatalogProduct } from "@/content/catalog/types";
import type {
  CatalogImportIssue,
  CatalogImportRow,
  CatalogImportSource,
} from "@/server/catalog-import/types";

const expectedHeaders = [
  "CODICE PRODOTTO",
  "PRODOTTO",
  "QUANTITA",
  "PREZZO SENZA IVA",
  "NUOVI PRODOTTI",
  "CAPACITA'",
  "GRADO ALCOLICO",
  "SOTTOCATEGORIA",
  "DESCRIZIONE",
  "IMMAGINE",
] as const;

const sourceRowSchema = z.object({
  code: z.string().trim().min(1),
  productName: z.string().trim().min(1),
  quantity: z.string().trim().regex(/^\d+$/),
  netPrice: z
    .string()
    .trim()
    .regex(/^\d+(?:[.,]\d+)?$/),
  commercialStatus: z.string().trim().nullable(),
  capacity: z.string().trim().min(1),
  alcoholPercentage: z.string().trim().nullable(),
  subcategory: z.string().trim().nullable(),
  description: z.string().trim().nullable(),
  imageName: z.string().trim().min(1),
});

type SourceRow = z.infer<typeof sourceRowSchema>;

type CatalogSourceOptions = {
  workbookPath: string;
  sourceImageDirectory: string;
  publicDirectory: string;
};

const catalogProductGroups = new Map<string, CatalogProduct[]>();
for (const product of catalogProducts) {
  const products = catalogProductGroups.get(product.code) ?? [];
  products.push(product);
  catalogProductGroups.set(product.code, products);
}

const categoryBySlug = new Map<string, (typeof catalogCategories)[number]>(
  catalogCategories.map((category) => [category.slug, category]),
);
const brandBySlug = new Map<string, (typeof catalogBrands)[number]>(
  catalogBrands.map((brand) => [brand.slug, brand]),
);

export function validateCatalogSourceRecord(value: unknown): SourceRow {
  return sourceRowSchema.parse(value);
}

function cellToString(
  value: CellValue<string> | null | undefined,
): string | null {
  if (value === null || value === undefined || value instanceof Date)
    return null;
  return String(value).trim() || null;
}

function createRawSourceRow(row: (CellValue<string> | null)[]): SourceRow {
  return validateCatalogSourceRecord({
    code: cellToString(row[0]),
    productName: cellToString(row[1]),
    quantity: cellToString(row[2]),
    netPrice: cellToString(row[3]),
    commercialStatus: cellToString(row[4]),
    capacity: cellToString(row[5]),
    alcoholPercentage: cellToString(row[6]),
    subcategory: cellToString(row[7]),
    description: cellToString(row[8]),
    imageName: cellToString(row[9]),
  });
}

export function normalizeProductCode(value: string): string {
  const normalized = value.trim().toUpperCase();
  return /^\d+\.0+$/.test(normalized)
    ? normalized.slice(0, normalized.indexOf("."))
    : normalized;
}

export function parseNetAmountMinor(value: string): bigint {
  const normalized = value.trim().replace(",", ".");
  if (!/^\d+(?:\.\d+)?$/.test(normalized)) {
    throw new Error(`Prezzo netto non valido: ${value}`);
  }

  const [whole, fraction = ""] = normalized.split(".");
  const paddedFraction = fraction.padEnd(3, "0");
  const cents = BigInt(paddedFraction.slice(0, 2));
  const roundingDigit = paddedFraction[2] ?? "0";
  return BigInt(whole ?? "0") * 100n + cents + (roundingDigit >= "5" ? 1n : 0n);
}

function parseQuantity(value: string): number {
  const quantity = BigInt(value);
  if (quantity > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error(`Quantità fuori intervallo: ${value}`);
  }
  return Number(quantity);
}

function parseAlcoholPercentage(value: string | null): string | null {
  if (!value) return null;
  const match = value.replace(",", ".").match(/\d+(?:\.\d+)?/);
  if (!match) return null;
  const [whole, fraction = ""] = match[0].split(".");
  return `${whole}.${fraction.padEnd(2, "0").slice(0, 2)}`;
}

function chooseCatalogProduct(code: string): CatalogProduct | null {
  const products = catalogProductGroups.get(code);
  if (!products?.length) return null;
  if (products.length === 1) return products[0] ?? null;

  const [first] = products;
  if (!first) return null;

  return {
    ...first,
    slug: `${first.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}-${code.toLowerCase()}`,
  };
}

function getImage(
  source: SourceRow,
  product: CatalogProduct,
  options: CatalogSourceOptions,
) {
  if (product.code === "AB6837") {
    return {
      image: null,
      imageIssue:
        "Immagine cliente da richiedere: AB6837_AK47_Absolute_Standard.jpg",
    };
  }

  const media = product.media[0];
  const thumbnailSrc = media.thumbnailSrc ?? media.src;
  const sourceImageExists = existsSync(
    path.join(options.sourceImageDirectory, source.imageName),
  );
  const fullImageExists = existsSync(
    path.join(options.publicDirectory, media.src.replace(/^\//, "")),
  );
  const thumbnailImageExists = existsSync(
    path.join(options.publicDirectory, thumbnailSrc.replace(/^\//, "")),
  );

  if (!sourceImageExists || !fullImageExists || !thumbnailImageExists) {
    return {
      image: null,
      imageIssue: [
        !sourceImageExists ? `sorgente ${source.imageName}` : null,
        !fullImageExists ? `full ${media.src}` : null,
        !thumbnailImageExists ? `thumbnail ${thumbnailSrc}` : null,
      ]
        .filter(Boolean)
        .join(", ")
        .replace(/^/, "File immagine mancante: "),
    };
  }

  return {
    image: {
      sourceName: source.imageName,
      storagePath: media.src.replace(/^\//, ""),
      thumbnailPath: thumbnailSrc.replace(/^\//, ""),
      altText: media.alt,
      width: media.width,
      height: media.height,
    },
    imageIssue: null,
  };
}

function normalizeSourceRow(
  source: SourceRow,
  rowNumber: number,
  options: CatalogSourceOptions,
): CatalogImportRow {
  const code = normalizeProductCode(source.code);
  const product = chooseCatalogProduct(code);
  if (!product) {
    throw new Error(`Nessuna mappatura catalogo verificata per ${code}.`);
  }

  const category = categoryBySlug.get(product.categorySlug);
  if (!category) {
    throw new Error(`Categoria non mappata per ${code}.`);
  }

  const brand = product.brandSlug ? brandBySlug.get(product.brandSlug) : null;
  const approvedBrand =
    productBrandByCode[code as keyof typeof productBrandByCode];
  if (approvedBrand && brand?.name !== approvedBrand) {
    throw new Error(`Marchio approvato non applicato per ${code}.`);
  }

  const { image, imageIssue } = getImage(source, product, options);
  const commercialStatus = source.commercialStatus?.toUpperCase() ?? "";

  return {
    rowNumber,
    code,
    sourceName: source.productName,
    name: product.name,
    slug: product.slug,
    quantity: parseQuantity(source.quantity),
    netAmountMinor: parseNetAmountMinor(source.netPrice),
    capacityMl: product.capacityMl,
    capacityLabel: product.capacityLabel,
    packQuantity: product.packQuantity,
    alcoholPercentage: parseAlcoholPercentage(source.alcoholPercentage),
    categorySlug: category.slug,
    categoryName: category.name,
    subcategory: source.subcategory,
    brandSlug: brand?.slug ?? null,
    brandName: brand?.name ?? null,
    country: product.country,
    producer: product.producer,
    isNew: commercialStatus === "NUOVI PRODOTTI",
    isOffer: commercialStatus === "PRODOTTI IN OFFERTA",
    isLimited: product.isLimited,
    image,
    imageIssue,
  };
}

function validateHeaders(row: (CellValue<string> | null)[]) {
  const headers = row.map(cellToString);
  for (const [index, expectedHeader] of expectedHeaders.entries()) {
    if (headers[index] !== expectedHeader) {
      throw new Error(
        `Colonna Excel ${index + 1}: attesa “${expectedHeader}”, ricevuta “${headers[index] ?? "vuota"}”.`,
      );
    }
  }
}

export async function readCatalogSource(
  options: CatalogSourceOptions,
): Promise<CatalogImportSource> {
  const sheet = await readSheet<string>(options.workbookPath, {
    parseNumber: (value) => value,
  });
  const [headerRow, ...dataRows] = sheet;
  if (!headerRow) throw new Error("Il file Excel non contiene intestazioni.");
  validateHeaders(headerRow);

  const issues: CatalogImportIssue[] = [];
  const normalizedRows: CatalogImportRow[] = [];

  dataRows.forEach((row, index) => {
    const rowNumber = index + 2;
    try {
      const source = createRawSourceRow(row);
      const normalized = normalizeSourceRow(source, rowNumber, options);
      normalizedRows.push(normalized);
      if (normalized.imageIssue) {
        issues.push({
          rowNumber,
          code: normalized.code,
          kind: "missing_image",
          message: normalized.imageIssue,
        });
      }
    } catch (error) {
      issues.push({
        rowNumber,
        code: cellToString(row[0]),
        kind: "invalid",
        message: error instanceof Error ? error.message : "Riga non valida.",
      });
    }
  });

  const rowsByCode = new Map<string, CatalogImportRow[]>();
  for (const row of normalizedRows) {
    const rows = rowsByCode.get(row.code) ?? [];
    rows.push(row);
    rowsByCode.set(row.code, rows);
  }

  const duplicateCodes = [...rowsByCode.entries()]
    .filter(([, rows]) => rows.length > 1)
    .map(([code]) => code)
    .sort();

  for (const code of duplicateCodes) {
    const rows = rowsByCode.get(code) ?? [];
    issues.push({
      rowNumber: rows[0]?.rowNumber ?? null,
      code,
      kind: "conflict",
      message:
        code === "AB1293"
          ? `Inventario non importato: quantità in conflitto (${rows.map((row) => row.quantity).join(", ")}).`
          : `Codice duplicato in ${rows.length} righe; inventario escluso.`,
    });
  }

  return {
    rowsRead: dataRows.length,
    rows: [...rowsByCode.values()].flatMap((rows) => rows[0] ?? []),
    issues,
    duplicateCodes,
  };
}
