import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  normalizeProductCode,
  parseNetAmountMinor,
  readCatalogSource,
  validateCatalogSourceRecord,
} from "@/server/catalog-import/catalog-source";

const rootDirectory = process.cwd();
const workbookPath = path.join(
  rootDirectory,
  "reference-private/catalog/listino_completo_la_botola.xlsx",
);
const hasPrivateCatalog = existsSync(workbookPath);

describe("normalizzazione import catalogo", () => {
  it("normalizza codici senza alterare i codici alfanumerici", () => {
    expect(normalizeProductCode(" ab1170 ")).toBe("AB1170");
    expect(normalizeProductCode("00123.0")).toBe("00123");
  });

  it("converte i prezzi in centesimi senza aritmetica floating point", () => {
    expect(parseNetAmountMinor("16.44")).toBe(1644n);
    expect(parseNetAmountMinor("16.440000000000001")).toBe(1644n);
    expect(parseNetAmountMinor("14,075")).toBe(1408n);
  });

  it("valida con Zod la struttura di una riga esterna", () => {
    expect(
      validateCatalogSourceRecord({
        code: "AB1170",
        productName: "Glen Grant 12YO",
        quantity: "10",
        netPrice: "31.52",
        commercialStatus: null,
        capacity: "700cl",
        alcoholPercentage: null,
        subcategory: "Blended Scotch",
        description: null,
        imageName: "AB1170.jpg",
      }).code,
    ).toBe("AB1170");

    expect(() =>
      validateCatalogSourceRecord({ code: "", quantity: "non numerica" }),
    ).toThrow();
  });
});

describe.skipIf(!hasPrivateCatalog)("catalogo cliente locale", () => {
  it("legge tutte le righe e rileva il conflitto AB1293", async () => {
    const source = await readCatalogSource({
      workbookPath,
      sourceImageDirectory: path.join(
        rootDirectory,
        "reference-private/product-images/immagini_prodotti",
      ),
      publicDirectory: path.join(rootDirectory, "public"),
    });

    expect(source.rowsRead).toBe(2124);
    expect(source.rows).toHaveLength(2123);
    expect(source.duplicateCodes).toEqual(["AB1293"]);
    expect(
      source.issues.some(
        (issue) => issue.code === "AB1293" && issue.kind === "conflict",
      ),
    ).toBe(true);
  });

  it("usa il marchio approvato per codice e mantiene AB6837 senza immagine", async () => {
    const source = await readCatalogSource({
      workbookPath,
      sourceImageDirectory: path.join(
        rootDirectory,
        "reference-private/product-images/immagini_prodotti",
      ),
      publicDirectory: path.join(rootDirectory, "public"),
    });
    const glenGrant = source.rows.find((row) => row.code === "AB1170");
    const ak47 = source.rows.find((row) => row.code === "AB6837");

    expect(glenGrant?.brandName).toBe("The Glen Grant");
    expect(ak47?.image).toBeNull();
    expect(ak47?.imageIssue).toContain("AB6837_AK47_Absolute_Standard.jpg");
  });

  it("riconosce offerte senza inventare un prezzo promozionale", async () => {
    const source = await readCatalogSource({
      workbookPath,
      sourceImageDirectory: path.join(
        rootDirectory,
        "reference-private/product-images/immagini_prodotti",
      ),
      publicDirectory: path.join(rootDirectory, "public"),
    });

    expect(source.rows.filter((row) => row.isOffer)).toHaveLength(50);
    expect(source.rows.filter((row) => row.isNew)).toHaveLength(65);
  });
});
