import type { CatalogProduct } from "@/content/catalog/types";

export const approvedCatalogBrands = [
  { name: "818 Tequila", slug: "818" },
  { name: "Ballantine’s", slug: "ballantines" },
  { name: "Crafter’s", slug: "crafters" },
  { name: "Flor de Caña", slug: "flor-de-cana" },
  { name: "Gosling’s", slug: "goslings" },
  { name: "J&B", slug: "j-b" },
  { name: "Jack Daniel's", slug: "jack-daniel-s" },
  { name: "No.3 London Dry Gin", slug: "n-3" },
  { name: "Ouzo 12", slug: "ouzo-12" },
  { name: "Planteray", slug: "planteray" },
  { name: "Ron Abuelo", slug: "abuelo" },
  { name: "The Glen Grant", slug: "the-glen-grant" },
  { name: "The Glenlivet", slug: "the-glenlivet" },
  { name: "The Macallan", slug: "the-macallan" },
] as const;

export type ApprovedCatalogBrandName =
  (typeof approvedCatalogBrands)[number]["name"];

export const productBrandByCode = {
  AB0072: "Flor de Caña",
  AB0130: "Jack Daniel's",
  AB0131: "Jack Daniel's",
  AB0132: "Jack Daniel's",
  AB0136: "Planteray",
  AB0137: "Planteray",
  AB0143: "The Glenlivet",
  AB0166: "Flor de Caña",
  AB0200: "Jack Daniel's",
  AB0249: "No.3 London Dry Gin",
  AB0254: "Jack Daniel's",
  AB0505: "Jack Daniel's",
  AB0632: "The Glenlivet",
  AB0653: "J&B",
  AB0660: "Ballantine’s",
  AB0662: "Ballantine’s",
  AB0664: "Ballantine’s",
  AB0679: "The Macallan",
  AB0680: "The Macallan",
  AB0682: "The Macallan",
  AB0691: "The Glenlivet",
  AB0727: "Planteray",
  AB0740: "The Macallan",
  AB0741: "The Macallan",
  AB0815: "The Glen Grant",
  AB0862: "Jack Daniel's",
  AB0864: "Jack Daniel's",
  AB0876: "Ouzo 12",
  AB1041: "J&B",
  AB1170: "The Glen Grant",
  AB1231: "Gosling’s",
  AB1237: "Flor de Caña",
  AB1912: "Flor de Caña",
  AB1974: "Crafter’s",
  AB2102: "Flor de Caña",
  AB2123: "Crafter’s",
  AB2189: "Gosling’s",
  AB2190: "Gosling’s",
  AB2321: "The Glen Grant",
  AB2322: "The Macallan",
  AB2350: "Jack Daniel's",
  AB2362: "Jack Daniel's",
  AB2383: "The Macallan",
  AB2611: "J&B",
  AB2904: "Crafter’s",
  AB3098: "Jack Daniel's",
  AB3115: "Jack Daniel's",
  AB3170: "Jack Daniel's",
  AB3262: "Gosling’s",
  AB3560: "Jack Daniel's",
  AB4000: "Jack Daniel's",
  AB4139: "Planteray",
  AB4140: "Planteray",
  AB4141: "Planteray",
  AB4185: "The Glenlivet",
  AB4197: "Jack Daniel's",
  AB4257: "Jack Daniel's",
  AB4278: "Jack Daniel's",
  AB4315: "Flor de Caña",
  AB4357: "Jack Daniel's",
  AB4421: "Jack Daniel's",
  AB4669: "Jack Daniel's",
  AB4705: "Gosling’s",
  AB4752: "Jack Daniel's",
  AB4798: "Jack Daniel's",
  AB4799: "Jack Daniel's",
  AB4874: "Jack Daniel's",
  AB5011: "Jack Daniel's",
  AB5131: "Flor de Caña",
  AB5354: "Jack Daniel's",
  AB5373: "Jack Daniel's",
  AB5389: "Jack Daniel's",
  AB5390: "Jack Daniel's",
  AB5392: "Jack Daniel's",
  AB5408: "Jack Daniel's",
  AB5445: "Crafter’s",
  AB5446: "Crafter’s",
  AB5459: "Planteray",
  AB5644: "Flor de Caña",
  AB5646: "Jack Daniel's",
  AB5742: "The Glenlivet",
  AB5754: "The Glenlivet",
  AB5764: "Crafter’s",
  AB5842: "Jack Daniel's",
  AB5943: "Jack Daniel's",
  AB6080: "Jack Daniel's",
  AB6127: "Crafter’s",
  AB6128: "Crafter’s",
  AB6205: "The Glenlivet",
  AB6206: "Ballantine’s",
  AB6213: "Jack Daniel's",
  AB6242: "Jack Daniel's",
  AB6243: "Jack Daniel's",
  AB6244: "Jack Daniel's",
  AB6285: "The Glen Grant",
  AB6288: "Jack Daniel's",
  AB6290: "Jack Daniel's",
  AB6381: "818 Tequila",
  AB6382: "818 Tequila",
  AB6383: "818 Tequila",
  AB6384: "818 Tequila",
  AB6415: "Jack Daniel's",
  AB6530: "Jack Daniel's",
  AB6640: "Flor de Caña",
  AB6647: "Crafter’s",
  AB6660: "Ballantine’s",
  AB6715: "Ron Abuelo",
  AB6721: "Jack Daniel's",
  AB6781: "Planteray",
} as const satisfies Readonly<Record<string, ApprovedCatalogBrandName>>;

export const genericBrandManualReviewCodes = [
  "AB0720",
  "AB0873",
  "AB1150",
  "AB1318",
  "AB1320",
  "AB1434",
  "AB2125",
  "AB2142",
  "AB2164",
  "AB2602",
  "AB2875",
  "AB3014",
  "AB3264",
  "AB3655",
  "AB3656",
  "AB4855",
  "AB5566",
  "AB5834",
  "AB5852",
  "AB5854",
  "AB5938",
  "AB5962",
  "AB6047",
  "AB6138",
  "AB6139",
  "AB6172",
  "AB6229",
  "AB6267",
  "AB6284",
  "AB6302",
  "AB6361",
  "AB6394",
  "AB6398",
  "AB6428",
  "AB6434",
  "AB6531",
  "AB6550",
  "AB6562",
  "AB6579",
  "AB6655",
  "AB6845",
] as const;

const genericBrandManualReviewCodeSet = new Set<string>(
  genericBrandManualReviewCodes,
);

const approvedBrandByName = new Map(
  approvedCatalogBrands.map((brand) => [brand.name, brand]),
);

export function resolveCatalogProductBrand(
  product: CatalogProduct,
): CatalogProduct {
  const approvedName =
    productBrandByCode[product.code as keyof typeof productBrandByCode];

  if (approvedName) {
    const approvedBrand = approvedBrandByName.get(approvedName);

    if (!approvedBrand) {
      throw new Error(
        `Configurazione marchio approvato mancante per ${product.code}.`,
      );
    }

    return { ...product, brandSlug: approvedBrand.slug };
  }

  if (genericBrandManualReviewCodeSet.has(product.code)) {
    return { ...product, brandSlug: null };
  }

  return product;
}
