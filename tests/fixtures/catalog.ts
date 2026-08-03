import type { CatalogProductView } from "@/content/catalog/types";

const media = [
  {
    src: "/images/demo/whisky-cellar.webp",
    alt: "Bottiglia illuminata in cantina",
    width: 1122,
    height: 1402,
    position: "center",
  },
] as const;

const baseProduct: CatalogProductView = {
  code: "AB0740",
  slug: "the-macallan-12-y-o-double-cask",
  name: "The Macallan 12 Y.O. Double Cask",
  brandSlug: "the-macallan",
  brandName: "The Macallan",
  categorySlug: "whisky-whiskey",
  categoryName: "Whisky e Whiskey",
  subcategory: "Single Malt Scotch",
  capacityMl: 700,
  capacityLabel: "70 cl",
  packQuantity: null,
  alcoholPercentage: "40",
  country: "Scozia",
  producer: "The Macallan Distillers",
  grossPriceMinor: 9_104,
  grossPrice: "91,04 €",
  offer: null,
  stockQuantity: 55,
  isNew: false,
  isLimited: false,
  badges: [],
  media,
  overview: "Single malt dello Speyside elegante e strutturato.",
  tastingNotes: "Miele, agrumi canditi e spezie dolci.",
  service: "Servire liscio.",
  origin: "Speyside, Scozia.",
  pairings: ["Cioccolato fondente"],
  characteristics: [
    { label: "Capacità", value: "700 ml" },
    { label: "Gradazione", value: "40% Vol." },
  ],
};

export function createCatalogProductFixture(
  overrides: Partial<CatalogProductView> = {},
): CatalogProductView {
  return {
    ...baseProduct,
    ...overrides,
  };
}

export const catalogProductFixtures = [
  createCatalogProductFixture(),
  createCatalogProductFixture({
    code: "AB6895",
    slug: "suntory-yamazaki-18-y-o",
    name: "Suntory Yamazaki 18 Y.O.",
    brandSlug: "suntory",
    brandName: "Suntory",
    subcategory: "Japanese Single Malt",
    country: "Giappone",
    grossPriceMinor: 73_986,
    grossPrice: "739,86 €",
    isNew: true,
    isLimited: true,
    badges: ["Nuovo", "Edizione limitata"],
  }),
  createCatalogProductFixture({
    code: "AB6737",
    slug: "caprisius",
    name: "Caprisius",
    brandSlug: "caprisius",
    brandName: "Caprisius",
    categorySlug: "gin",
    categoryName: "Gin",
    subcategory: "Distilled Gin",
    country: "Italia",
    alcoholPercentage: "43",
    grossPriceMinor: 3_892,
    grossPrice: "38,92 €",
    isNew: true,
    badges: ["Nuovo"],
  }),
] as const;
