import { approvedCatalogBrands } from "@/content/catalog/product-brands";
import { catalogProducts } from "@/content/catalog/products";
import type { CatalogBrand } from "@/content/catalog/types";

const rawCatalogBrands = [
  {
    slug: "z",
    name: '"z"',
    country: null,
    productCount: 1,
    needsReview: true,
    description: '1 etichetta "z" presenti nella selezione.',
    story:
      'La raccolta "z" comprende liquori disponibili nel catalogo La Botola e Mietto.',
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-z-pistacchio-20-ct-6-new-7cedcf0fce.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-z-pistacchio-20-ct-6-new-7cedcf0fce.webp",
      width: 700,
      height: 700,
      alt: 'Confezione di "z" Pistacchio',
      position: "center",
    },
  },
  {
    slug: "135",
    name: "135°",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta 135° presenti nella selezione.",
    story:
      "La raccolta 135° comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-135-east-hyogo-dry-42-ct-6-c9431b0f0e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-135-east-hyogo-dry-42-ct-6-c9431b0f0e.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di 135° East Hyogo Dry",
      position: "center",
    },
  },
  {
    slug: "1800",
    name: "1800",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette 1800 presenti nella selezione.",
    story:
      "La raccolta 1800 comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-tequila-1800-anejo-38-ct-6-23ad7ead3a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-tequila-1800-anejo-38-ct-6-23ad7ead3a.webp",
      width: 550,
      height: 733,
      alt: "Confezione di 1800 Anejo",
      position: "center",
    },
  },
  {
    slug: "1866-gran-reserva",
    name: "1866 Gran Reserva",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette 1866 Gran Reserva presenti nella selezione.",
    story:
      "La raccolta 1866 Gran Reserva comprende brandy e altri distillati disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-brandy-1866-gran-reserva-40-gb-ct-6-4223948b04.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-brandy-1866-gran-reserva-40-gb-ct-6-4223948b04.webp",
      width: 1067,
      height: 1600,
      alt: "Confezione di 1866 Gran Reserva",
      position: "center",
    },
  },
  {
    slug: "24kt",
    name: "24KT",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta 24KT presenti nella selezione.",
    story:
      "La raccolta 24KT comprende grappe disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-24kt-crema-al-cioccolato-e-grappa-17-ct-6-d73f75c28c.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-24kt-crema-al-cioccolato-e-grappa-17-ct-6-d73f75c28c.webp",
      width: 1000,
      height: 1500,
      alt: "Confezione di 24KT Crema Al Cioccolato E Grappa",
      position: "center",
    },
  },
  {
    slug: "42",
    name: "42",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta 42 presenti nella selezione.",
    story:
      "La raccolta 42 comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-42-below-40-0cdab8f15f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-42-below-40-0cdab8f15f.webp",
      width: 964,
      height: 1000,
      alt: "Confezione di 42 Below",
      position: "center",
    },
  },
  {
    slug: "4me",
    name: "4ME",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta 4ME presenti nella selezione.",
    story:
      "La raccolta 4ME comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-gin-4me-45-gbox-ct-6-82c1826f4c.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-gin-4me-45-gbox-ct-6-82c1826f4c.webp",
      width: 1200,
      height: 1527,
      alt: "Confezione di 4ME",
      position: "center",
    },
  },
  {
    slug: "818",
    name: "818",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette 818 presenti nella selezione.",
    story:
      "La raccolta 818 comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-tequila-818-anejo-40-ct-6-new-2ebb8d9f40.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-tequila-818-anejo-40-ct-6-new-2ebb8d9f40.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di 818 Anejo",
      position: "center",
    },
  },
  {
    slug: "9",
    name: "9",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta 9 presenti nella selezione.",
    story:
      "La raccolta 9 comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-9-mascaro-40-ct-6-d3b0b1952f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-9-mascaro-40-ct-6-d3b0b1952f.webp",
      width: 800,
      height: 960,
      alt: "Confezione di 9 Mascaro'",
      position: "center",
    },
  },
  {
    slug: "a-nadal",
    name: "A. Nadal",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette A. Nadal presenti nella selezione.",
    story:
      "La raccolta A. Nadal comprende rum e rhum, liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-rum-a-nadal-capitan-huk-honey-22-litro-ct-6-new-23553cc2f6.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-rum-a-nadal-capitan-huk-honey-22-litro-ct-6-new-23553cc2f6.webp",
      width: 404,
      height: 581,
      alt: "Confezione di A. Nadal Capitan Huk Honey",
      position: "center",
    },
  },
  {
    slug: "a-h",
    name: "A.h.",
    country: null,
    productCount: 3,
    needsReview: true,
    description: "3 etichette A.h. presenti nella selezione.",
    story:
      "La raccolta A.h. comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-a-h-riise-non-plus-ultra-black-edition-42-gbo-63ba60cc93.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-a-h-riise-non-plus-ultra-black-edition-42-gbo-63ba60cc93.webp",
      width: 800,
      height: 800,
      alt: "Confezione di A.h. Riise Non Plus Ultra Black Edition",
      position: "center",
    },
  },
  {
    slug: "aalborg",
    name: "Aalborg",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Aalborg presenti nella selezione.",
    story:
      "La raccolta Aalborg comprende brandy e altri distillati disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-distillato-aalborg-jubilaemus-acquavite-40-ct-6-9684e0bee9.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-distillato-aalborg-jubilaemus-acquavite-40-ct-6-9684e0bee9.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Aalborg Jubilaemus Acquavite",
      position: "center",
    },
  },
  {
    slug: "aberfeldy",
    name: "Aberfeldy",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Aberfeldy presenti nella selezione.",
    story:
      "La raccolta Aberfeldy comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-aberfeldy-12-y-o-40-gb-ct-6-0ef479142a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-aberfeldy-12-y-o-40-gb-ct-6-0ef479142a.webp",
      width: 800,
      height: 1001,
      alt: "Confezione di Aberfeldy 12 Y.O.",
      position: "center",
    },
  },
  {
    slug: "aberlour",
    name: "Aberlour",
    country: null,
    productCount: 8,
    needsReview: false,
    description: "8 etichette Aberlour presenti nella selezione.",
    story:
      "La raccolta Aberlour comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-aberlour-10-y-o-forest-reserve-40-c-a7b0198585.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-aberlour-10-y-o-forest-reserve-40-c-a7b0198585.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Aberlour 10 Y.O. Forest Reserve",
      position: "center",
    },
  },
  {
    slug: "abnormal",
    name: "Abnormal",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Abnormal presenti nella selezione.",
    story:
      "La raccolta Abnormal comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-abnormal-40-132e36030d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-abnormal-40-132e36030d.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Abnormal",
      position: "center",
    },
  },
  {
    slug: "absente",
    name: "Absente",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Absente presenti nella selezione.",
    story:
      "La raccolta Absente comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-assenzio-absente-55-ct-6-f41cf8d5f8.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-assenzio-absente-55-ct-6-f41cf8d5f8.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Absente",
      position: "center",
    },
  },
  {
    slug: "absolut",
    name: "Absolut",
    country: null,
    productCount: 18,
    needsReview: false,
    description: "18 etichette Absolut presenti nella selezione.",
    story:
      "La raccolta Absolut comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-vodka-absolut-100-proof-50-litro-ct-12-e9666dcb01.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-vodka-absolut-100-proof-50-litro-ct-12-e9666dcb01.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Absolut 100 Proof",
      position: "center",
    },
  },
  {
    slug: "abuelo",
    name: "Abuelo",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Abuelo presenti nella selezione.",
    story:
      "La raccolta Abuelo comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/12-0050-rum-abuelo-anejo-miniatures-pet-40-ct-12-571e76ad79.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/12-0050-rum-abuelo-anejo-miniatures-pet-40-ct-12-571e76ad79.webp",
      width: 540,
      height: 900,
      alt: "Confezione di Abuelo Anejo Miniatures",
      position: "center",
    },
  },
  {
    slug: "achouffe",
    name: "Achouffe",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Achouffe presenti nella selezione.",
    story:
      "La raccolta Achouffe comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-achouffe-coffee-20-ct-6-7b055d34c2.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-achouffe-coffee-20-ct-6-7b055d34c2.webp",
      width: 1024,
      height: 1024,
      alt: "Confezione di Achouffe Coffee",
      position: "center",
    },
  },
  {
    slug: "adamus",
    name: "Adamus",
    country: null,
    productCount: 5,
    needsReview: false,
    description: "5 etichette Adamus presenti nella selezione.",
    story:
      "La raccolta Adamus comprende brandy e altri distillati, gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-distillato-adamus-aguardente-bagaceira-52-ct-6-0909edc695.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-distillato-adamus-aguardente-bagaceira-52-ct-6-0909edc695.webp",
      width: 595,
      height: 595,
      alt: "Confezione di Adamus Aguardente Bagaceira",
      position: "center",
    },
  },
  {
    slug: "admiral-rodney-hms",
    name: "Admiral Rodney Hms",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Admiral Rodney Hms presenti nella selezione.",
    story:
      "La raccolta Admiral Rodney Hms comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-admiral-rodney-hms-formidable-40-ct-6-30c201627e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-admiral-rodney-hms-formidable-40-ct-6-30c201627e.webp",
      width: 820,
      height: 1500,
      alt: "Confezione di Admiral Rodney Hms Formidable",
      position: "center",
    },
  },
  {
    slug: "agavesanta",
    name: "Agavesanta",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Agavesanta presenti nella selezione.",
    story:
      "La raccolta Agavesanta comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-distillato-agavesanta-40-ct-6-new-9889f56781.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-distillato-agavesanta-40-ct-6-new-9889f56781.webp",
      width: 1200,
      height: 1600,
      alt: "Confezione di Agavesanta",
      position: "center",
    },
  },
  {
    slug: "aguardiente",
    name: "Aguardiente",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Aguardiente presenti nella selezione.",
    story:
      "La raccolta Aguardiente comprende brandy e altri distillati disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-distillato-aguardiente-amarillo-de-manzanares-24--42e447426d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-distillato-aguardiente-amarillo-de-manzanares-24--42e447426d.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Aguardiente Amarillo De Manzanares",
      position: "center",
    },
  },
  {
    slug: "agwa-de-bolivia",
    name: "Agwa De Bolivia",
    country: null,
    productCount: 2,
    needsReview: true,
    description: "2 etichette Agwa De Bolivia presenti nella selezione.",
    story:
      "La raccolta Agwa De Bolivia comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-agwa-de-bolivia-coca-leaf-30-61e2a14e20.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-agwa-de-bolivia-coca-leaf-30-61e2a14e20.webp",
      width: 1067,
      height: 1600,
      alt: "Confezione di Agwa De Bolivia Coca Leaf",
      position: "center",
    },
  },
  {
    slug: "aha-toro",
    name: "Aha Toro",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Aha Toro presenti nella selezione.",
    story:
      "La raccolta Aha Toro comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-tequila-aha-toro-anejo-40-ct-6-7a4eb14f3d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-tequila-aha-toro-anejo-40-ct-6-7a4eb14f3d.webp",
      width: 1078,
      height: 1500,
      alt: "Confezione di Aha Toro Anejo",
      position: "center",
    },
  },
  {
    slug: "ak47",
    name: "Ak47",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Ak47 presenti nella selezione.",
    story:
      "La raccolta Ak47 comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-ak47-absolute-standard-38-gb-ct-6-new-48f1a9080e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-ak47-absolute-standard-38-gb-ct-6-new-48f1a9080e.webp",
      width: 744,
      height: 1500,
      alt: "Confezione di Ak47 Absolute Standard",
      position: "center",
    },
  },
  {
    slug: "akashi",
    name: "Akashi",
    country: null,
    productCount: 10,
    needsReview: false,
    description: "10 etichette Akashi presenti nella selezione.",
    story:
      "La raccolta Akashi comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-japanese-whisky-akashi-blue-blended-40-ct-6-a9036b0521.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-japanese-whisky-akashi-blue-blended-40-ct-6-a9036b0521.webp",
      width: 1067,
      height: 1600,
      alt: "Confezione di Akashi Blue Blended",
      position: "center",
    },
  },
  {
    slug: "akkeshi",
    name: "Akkeshi",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Akkeshi presenti nella selezione.",
    story:
      "La raccolta Akkeshi comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-japanese-whisky-akkeshi-2022-taisho-blended-48-gb-0535ad28bc.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-japanese-whisky-akkeshi-2022-taisho-blended-48-gb-0535ad28bc.webp",
      width: 893,
      height: 1500,
      alt: "Confezione di Akkeshi 2022 Taisho Blended",
      position: "center",
    },
  },
  {
    slug: "akori",
    name: "Akori",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Akori presenti nella selezione.",
    story:
      "La raccolta Akori comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-akori-42-ct-6-ed1ec752a0.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-akori-42-ct-6-ed1ec752a0.webp",
      width: 800,
      height: 960,
      alt: "Confezione di Akori",
      position: "center",
    },
  },
  {
    slug: "alkkemist",
    name: "Alkkemist",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Alkkemist presenti nella selezione.",
    story:
      "La raccolta Alkkemist comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-alkkemist-40-ct-6-d1b0f6fd9a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-alkkemist-40-ct-6-d1b0f6fd9a.webp",
      width: 1067,
      height: 1600,
      alt: "Confezione di Alkkemist",
      position: "center",
    },
  },
  {
    slug: "alma-de-magno",
    name: "Alma De Magno",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Alma De Magno presenti nella selezione.",
    story:
      "La raccolta Alma De Magno comprende brandy e altri distillati disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-brandy-alma-de-magno-solera-reserva-36-ct-6-c335871712.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-brandy-alma-de-magno-solera-reserva-36-ct-6-c335871712.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Alma De Magno Solera Reserva",
      position: "center",
    },
  },
  {
    slug: "amaethon-single",
    name: "Amaethon Single",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Amaethon Single presenti nella selezione.",
    story:
      "La raccolta Amaethon Single comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-whisky-amaethon-single-cask-46-5-ct-6-new-8745d1a859.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-whisky-amaethon-single-cask-46-5-ct-6-new-8745d1a859.webp",
      width: 100,
      height: 250,
      alt: "Confezione di Amaethon Single Cask",
      position: "center",
    },
  },
  {
    slug: "amargo",
    name: "Amargo",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Amargo presenti nella selezione.",
    story:
      "La raccolta Amargo comprende aperitivi disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0075-liquore-amargo-chuncho-cocktail-bitter-40-ct-24-e89a36b952.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0075-liquore-amargo-chuncho-cocktail-bitter-40-ct-24-e89a36b952.webp",
      width: 523,
      height: 930,
      alt: "Confezione di Amargo Chuncho Cocktail Bitter",
      position: "center",
    },
  },
  {
    slug: "amaro",
    name: "Amaro",
    country: null,
    productCount: 21,
    needsReview: false,
    description: "21 etichette Amaro presenti nella selezione.",
    story:
      "La raccolta Amaro comprende amari disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-amaro-amarognolo-21-ct-6-new-6b194bfd58.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-amaro-amarognolo-21-ct-6-new-6b194bfd58.webp",
      width: 500,
      height: 800,
      alt: "Confezione di Amaro Amarognolo",
      position: "center",
    },
  },
  {
    slug: "amarula",
    name: "Amarula",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Amarula presenti nella selezione.",
    story:
      "La raccolta Amarula comprende gin, liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-amarula-43-ct-6-db310a1482.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-amarula-43-ct-6-db310a1482.webp",
      width: 1079,
      height: 1079,
      alt: "Confezione di Amarula",
      position: "center",
    },
  },
  {
    slug: "amazonian",
    name: "Amazonian",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Amazonian presenti nella selezione.",
    story:
      "La raccolta Amazonian comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-amazonian-gin-company-41-ct-6-05e0c85d3a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-amazonian-gin-company-41-ct-6-05e0c85d3a.webp",
      width: 1080,
      height: 1080,
      alt: "Confezione di Amazonian Gin Company",
      position: "center",
    },
  },
  {
    slug: "amazzoni",
    name: "Amazzoni",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Amazzoni presenti nella selezione.",
    story:
      "La raccolta Amazzoni comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-amazzoni-42-ct-6-81e1138c69.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-amazzoni-42-ct-6-81e1138c69.webp",
      width: 1024,
      height: 1024,
      alt: "Confezione di Amazzoni",
      position: "center",
    },
  },
  {
    slug: "american",
    name: "American",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette American presenti nella selezione.",
    story:
      "La raccolta American comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-american-whisky-abasolo-43-from-mexico-ct-6-3baf560f0a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-american-whisky-abasolo-43-from-mexico-ct-6-3baf560f0a.webp",
      width: 635,
      height: 1600,
      alt: "Confezione di American Whisky Abasolo",
      position: "center",
    },
  },
  {
    slug: "amuerte",
    name: "Amuerte",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Amuerte presenti nella selezione.",
    story:
      "La raccolta Amuerte comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-amuerte-black-43-ct-6-a4f1546d7d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-amuerte-black-43-ct-6-a4f1546d7d.webp",
      width: 800,
      height: 1401,
      alt: "Confezione di Amuerte Black",
      position: "center",
    },
  },
  {
    slug: "an-cnoc",
    name: "An Cnoc",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette An Cnoc presenti nella selezione.",
    story:
      "La raccolta An Cnoc comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-an-cnoc-12-y-o-40-ast-ct-6-c03a2a7141.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-an-cnoc-12-y-o-40-ast-ct-6-c03a2a7141.webp",
      width: 1067,
      height: 1600,
      alt: "Confezione di An Cnoc 12 Y.O.",
      position: "center",
    },
  },
  {
    slug: "angels",
    name: "Angels",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Angels presenti nella selezione.",
    story:
      "La raccolta Angels comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-bourbon-whiskey-angels-envy-43-3-ct-6-d4766851f4.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-bourbon-whiskey-angels-envy-43-3-ct-6-d4766851f4.webp",
      width: 576,
      height: 1600,
      alt: "Confezione di Angels Envy",
      position: "center",
    },
  },
  {
    slug: "angostura",
    name: "Angostura",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Angostura presenti nella selezione.",
    story:
      "La raccolta Angostura comprende rum e rhum, aperitivi disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-angostura-1824-12yo-40-ct-6-af6e17627d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-angostura-1824-12yo-40-ct-6-af6e17627d.webp",
      width: 800,
      height: 1233,
      alt: "Confezione di Angostura 1824 12YO",
      position: "center",
    },
  },
  {
    slug: "appleton-estate",
    name: "Appleton Estate",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Appleton Estate presenti nella selezione.",
    story:
      "La raccolta Appleton Estate comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-appleton-estate-8-y-o-43-ct-6-e5ccc2650e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-appleton-estate-8-y-o-43-ct-6-e5ccc2650e.webp",
      width: 900,
      height: 1600,
      alt: "Confezione di Appleton Estate 8 Y.o",
      position: "center",
    },
  },
  {
    slug: "aqualuce",
    name: "Aqualuce",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Aqualuce presenti nella selezione.",
    story:
      "La raccolta Aqualuce comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-aqualuce-47-ct-4-63a58a0684.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-aqualuce-47-ct-4-63a58a0684.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Aqualuce",
      position: "center",
    },
  },
  {
    slug: "ararat",
    name: "Ararat",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Ararat presenti nella selezione.",
    story:
      "La raccolta Ararat comprende brandy e altri distillati disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-brandy-ararat-7y-o-ani-art-40-gbox-ct-6-5865a34e42.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-brandy-ararat-7y-o-ani-art-40-gbox-ct-6-5865a34e42.webp",
      width: 702,
      height: 1200,
      alt: "Confezione di Ararat 7Y.O. Ani-art",
      position: "center",
    },
  },
  {
    slug: "ardbeg",
    name: "Ardbeg",
    country: null,
    productCount: 12,
    needsReview: false,
    description: "12 etichette Ardbeg presenti nella selezione.",
    story:
      "La raccolta Ardbeg comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-ardbeg-5-y-o-wee-beastie-47-4-ct-6-325cbcc681.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-ardbeg-5-y-o-wee-beastie-47-4-ct-6-325cbcc681.webp",
      width: 720,
      height: 720,
      alt: "Confezione di Ardbeg 5 Y.O. Wee Beastie",
      position: "center",
    },
  },
  {
    slug: "arehucas",
    name: "Arehucas",
    country: null,
    productCount: 10,
    needsReview: false,
    description: "10 etichette Arehucas presenti nella selezione.",
    story:
      "La raccolta Arehucas comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-arehucas-7-y-o-40-ct-6-417562ad49.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-arehucas-7-y-o-40-ct-6-417562ad49.webp",
      width: 292,
      height: 1022,
      alt: "Confezione di Arehucas 7 Y.O.",
      position: "center",
    },
  },
  {
    slug: "au",
    name: "Au",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Au presenti nella selezione.",
    story:
      "La raccolta Au comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-au-black-grape-35-2-ct-6-new-064366d14a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-au-black-grape-35-2-ct-6-new-064366d14a.webp",
      width: 459,
      height: 1600,
      alt: "Confezione di Au Black Grape",
      position: "center",
    },
  },
  {
    slug: "auchentoshan",
    name: "Auchentoshan",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Auchentoshan presenti nella selezione.",
    story:
      "La raccolta Auchentoshan comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-scotch-whisky-auchentoshan-american-oak-40-gbox-c-b55766feba.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-scotch-whisky-auchentoshan-american-oak-40-gbox-c-b55766feba.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Auchentoshan American Oak",
      position: "center",
    },
  },
  {
    slug: "averna",
    name: "Averna",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Averna presenti nella selezione.",
    story:
      "La raccolta Averna comprende amari disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-averna-amaro-siciliano-29-litro-6-bt-8a366e3ab1.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-averna-amaro-siciliano-29-litro-6-bt-8a366e3ab1.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Averna Amaro Siciliano",
      position: "center",
    },
  },
  {
    slug: "aviation",
    name: "Aviation",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Aviation presenti nella selezione.",
    story:
      "La raccolta Aviation comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-aviation-42-ct-6-23e8aebd0a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-aviation-42-ct-6-23e8aebd0a.webp",
      width: 621,
      height: 1600,
      alt: "Confezione di Aviation",
      position: "center",
    },
  },
  {
    slug: "bacardi",
    name: "Bacardi",
    country: null,
    productCount: 5,
    needsReview: false,
    description: "5 etichette Bacardi presenti nella selezione.",
    story:
      "La raccolta Bacardi comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-bacardi-8yo-rye-cask-finish-45-ct-6-new-2812eb3ca5.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-bacardi-8yo-rye-cask-finish-45-ct-6-new-2812eb3ca5.webp",
      width: 1067,
      height: 1600,
      alt: "Confezione di Bacardi 8YO Rye Cask Finish",
      position: "center",
    },
  },
  {
    slug: "bacoo",
    name: "Bacoo",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Bacoo presenti nella selezione.",
    story:
      "La raccolta Bacoo comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-bacoo-4-y-o-40-ct-6-e3fc090e0b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-bacoo-4-y-o-40-ct-6-e3fc090e0b.webp",
      width: 814,
      height: 1000,
      alt: "Confezione di Bacoo 4 Y.O.",
      position: "center",
    },
  },
  {
    slug: "bacur",
    name: "Bacur",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Bacur presenti nella selezione.",
    story:
      "La raccolta Bacur comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-bacur-bottega-40-ct-6-af1991b937.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-bacur-bottega-40-ct-6-af1991b937.webp",
      width: 1067,
      height: 1600,
      alt: "Confezione di Bacur Bottega",
      position: "center",
    },
  },
  {
    slug: "baileys",
    name: "Baileys",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Baileys presenti nella selezione.",
    story:
      "La raccolta Baileys comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-baileys-17-litro-ct-6-new-1ece649c9e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-baileys-17-litro-ct-6-new-1ece649c9e.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Baileys",
      position: "center",
    },
  },
  {
    slug: "baker-s",
    name: "Baker's",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Baker's presenti nella selezione.",
    story:
      "La raccolta Baker's comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-bourbon-whiskey-baker-s-7-yo-53-5-ct-6-87e235306b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-bourbon-whiskey-baker-s-7-yo-53-5-ct-6-87e235306b.webp",
      width: 1067,
      height: 1600,
      alt: "Confezione di Baker's 7 Y.O.",
      position: "center",
    },
  },
  {
    slug: "ballantine-s",
    name: "Ballantine's",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Ballantine's presenti nella selezione.",
    story:
      "La raccolta Ballantine's comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0200-scotch-whisky-ballantine-s-finest-40-vetro-ct-24-ae978ae080.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0200-scotch-whisky-ballantine-s-finest-40-vetro-ct-24-ae978ae080.webp",
      width: 741,
      height: 804,
      alt: "Confezione di Ballantine's Finest",
      position: "center",
    },
  },
  {
    slug: "ballantines",
    name: "Ballantines",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Ballantines presenti nella selezione.",
    story:
      "La raccolta Ballantines comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/12-0050-scotch-whisky-ballantines-finest-38-8-miniatur-4e189a85e1.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/12-0050-scotch-whisky-ballantines-finest-38-8-miniatur-4e189a85e1.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Ballantines Finest",
      position: "center",
    },
  },
  {
    slug: "bally",
    name: "Bally",
    country: null,
    productCount: 10,
    needsReview: false,
    description: "10 etichette Bally presenti nella selezione.",
    story:
      "La raccolta Bally comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-bally-7-y-o-piramide-45-gbox-ct-6-b51d9f6648.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-bally-7-y-o-piramide-45-gbox-ct-6-b51d9f6648.webp",
      width: 880,
      height: 1600,
      alt: "Confezione di Bally 7 Y.o.piramide",
      position: "center",
    },
  },
  {
    slug: "barcelo",
    name: "Barcelo'",
    country: null,
    productCount: 11,
    needsReview: true,
    description: "11 etichette Barcelo' presenti nella selezione.",
    story:
      "La raccolta Barcelo' comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-rum-barcelo-anejo-37-5-1-liter-ct-6-747b375f3f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-rum-barcelo-anejo-37-5-1-liter-ct-6-747b375f3f.webp",
      width: 1000,
      height: 1600,
      alt: "Confezione di Barcelo' Anejo",
      position: "center",
    },
  },
  {
    slug: "bareksten",
    name: "Bareksten",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Bareksten presenti nella selezione.",
    story:
      "La raccolta Bareksten comprende gin, liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-bareksten-botanical-46-ct-6-d8824cd5b6.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-bareksten-botanical-46-ct-6-d8824cd5b6.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Bareksten Botanical",
      position: "center",
    },
  },
  {
    slug: "basil",
    name: "Basil",
    country: null,
    productCount: 2,
    needsReview: true,
    description: "2 etichette Basil presenti nella selezione.",
    story:
      "La raccolta Basil comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-bourbon-whiskey-basil-hayden-s-40-1-liter-ct-12-n-1d94bfc7e7.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-bourbon-whiskey-basil-hayden-s-40-1-liter-ct-12-n-1d94bfc7e7.webp",
      width: 940,
      height: 1600,
      alt: "Confezione di Basil Hayden's",
      position: "center",
    },
  },
  {
    slug: "bathtub",
    name: "Bathtub",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Bathtub presenti nella selezione.",
    story:
      "La raccolta Bathtub comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-bathtub-gin-40-3-ct-6-435966c99e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-bathtub-gin-40-3-ct-6-435966c99e.webp",
      width: 754,
      height: 1600,
      alt: "Confezione di Bathtub Gin",
      position: "center",
    },
  },
  {
    slug: "becherovka-38",
    name: "Becherovka 38%",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Becherovka 38% presenti nella selezione.",
    story:
      "La raccolta Becherovka 38% comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-liquore-becherovka-38-ct-12-mezzo-litro-c10a40531a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-liquore-becherovka-38-ct-12-mezzo-litro-c10a40531a.webp",
      width: 767,
      height: 1024,
      alt: "Confezione di Becherovka",
      position: "center",
    },
  },
  {
    slug: "beefeater",
    name: "Beefeater",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Beefeater presenti nella selezione.",
    story:
      "La raccolta Beefeater comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-beefeater-24-45-ct-6-9e02673b45.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-beefeater-24-45-ct-6-9e02673b45.webp",
      width: 461,
      height: 1600,
      alt: "Confezione di Beefeater 24",
      position: "center",
    },
  },
  {
    slug: "belizean",
    name: "Belizean",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Belizean presenti nella selezione.",
    story:
      "La raccolta Belizean comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-belizean-blue-rare-blend-48-gb-ct-6-new-454d24db06.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-belizean-blue-rare-blend-48-gb-ct-6-new-454d24db06.webp",
      width: 1176,
      height: 1600,
      alt: "Confezione di Belizean Blue Rare Blend",
      position: "center",
    },
  },
  {
    slug: "bells",
    name: "Bells",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Bells presenti nella selezione.",
    story:
      "La raccolta Bells comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/12-0050-scotch-whisky-bells-40-miniatures-pet-ct-16-d6a8446391.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/12-0050-scotch-whisky-bells-40-miniatures-pet-ct-16-d6a8446391.webp",
      width: 500,
      height: 500,
      alt: "Confezione di Bells",
      position: "center",
    },
  },
  {
    slug: "beluga",
    name: "Beluga",
    country: null,
    productCount: 13,
    needsReview: false,
    description: "13 etichette Beluga presenti nella selezione.",
    story:
      "La raccolta Beluga comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-beluga-allure-40-e93965ed3a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-beluga-allure-40-e93965ed3a.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Beluga Allure",
      position: "center",
    },
  },
  {
    slug: "belvedere",
    name: "Belvedere",
    country: null,
    productCount: 9,
    needsReview: false,
    description: "9 etichette Belvedere presenti nella selezione.",
    story:
      "La raccolta Belvedere comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-belvedere-10-40-ct-6-new-35b27cc1e0.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-belvedere-10-40-ct-6-new-35b27cc1e0.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Belvedere 10",
      position: "center",
    },
  },
  {
    slug: "benedictine-40",
    name: "Benedictine 40%",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Benedictine 40% presenti nella selezione.",
    story:
      "La raccolta Benedictine 40% comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-benedictine-40-1-liter-ct-12-355c20dc19.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-benedictine-40-1-liter-ct-12-355c20dc19.webp",
      width: 810,
      height: 1080,
      alt: "Confezione di Benedictine",
      position: "center",
    },
  },
  {
    slug: "benriach",
    name: "Benriach",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Benriach presenti nella selezione.",
    story:
      "La raccolta Benriach comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-benriach-10-y-o-43-gbox-ct-6-new-85a7d69cf6.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-benriach-10-y-o-43-gbox-ct-6-new-85a7d69cf6.webp",
      width: 1200,
      height: 1600,
      alt: "Confezione di Benriach 10 Y.O.",
      position: "center",
    },
  },
  {
    slug: "benromach",
    name: "Benromach",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Benromach presenti nella selezione.",
    story:
      "La raccolta Benromach comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-benromach-10-y-o-43-gbox-ct-6-e7917bb258.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-benromach-10-y-o-43-gbox-ct-6-e7917bb258.webp",
      width: 800,
      height: 1292,
      alt: "Confezione di Benromach 10 Y.o",
      position: "center",
    },
  },
  {
    slug: "big",
    name: "Big",
    country: null,
    productCount: 10,
    needsReview: false,
    description: "10 etichette Big presenti nella selezione.",
    story:
      "La raccolta Big comprende gin, whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-gin-big-gino-40-1-litro-gin-italiano-ct-6-69b076b4c2.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-gin-big-gino-40-1-litro-gin-italiano-ct-6-69b076b4c2.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Big Gino",
      position: "center",
    },
  },
  {
    slug: "bistro",
    name: "Bistro",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Bistro presenti nella selezione.",
    story:
      "La raccolta Bistro comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-bistro-40-ct-6-new-6fb1ccb2f2.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-bistro-40-ct-6-new-6fb1ccb2f2.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Bistro",
      position: "center",
    },
  },
  {
    slug: "bitter-campari",
    name: "Bitter Campari",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Bitter Campari presenti nella selezione.",
    story:
      "La raccolta Bitter Campari comprende aperitivi disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-bitter-campari-cask-tales-25-ct-6-e509393b07.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-bitter-campari-cask-tales-25-ct-6-e509393b07.webp",
      width: 416,
      height: 1500,
      alt: "Confezione di Bitter Campari Cask Tales",
      position: "center",
    },
  },
  {
    slug: "black",
    name: "Black",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Black presenti nella selezione.",
    story:
      "La raccolta Black comprende gin, rum e rhum, liquori, whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-gin-black-tomato-42-3-ct-6-24cbd3aed6.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-gin-black-tomato-42-3-ct-6-24cbd3aed6.webp",
      width: 818,
      height: 1600,
      alt: "Confezione di Black Tomato",
      position: "center",
    },
  },
  {
    slug: "blackwell-jamaican",
    name: "Blackwell Jamaican",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Blackwell Jamaican presenti nella selezione.",
    story:
      "La raccolta Blackwell Jamaican comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-blackwell-jamaican-40-ct-6-e77779d852.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-blackwell-jamaican-40-ct-6-e77779d852.webp",
      width: 1200,
      height: 1166,
      alt: "Confezione di Blackwell Jamaican",
      position: "center",
    },
  },
  {
    slug: "blackwoods",
    name: "Blackwoods",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Blackwoods presenti nella selezione.",
    story:
      "La raccolta Blackwoods comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-blackwoods-navy-strength-60-ct-6-070728c480.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-blackwoods-navy-strength-60-ct-6-070728c480.webp",
      width: 300,
      height: 300,
      alt: "Confezione di Blackwoods Navy Strength",
      position: "center",
    },
  },
  {
    slug: "bladnoch",
    name: "Bladnoch",
    country: null,
    productCount: 5,
    needsReview: false,
    description: "5 etichette Bladnoch presenti nella selezione.",
    story:
      "La raccolta Bladnoch comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-bladnoch-11-y-o-46-7-gbox-ct-6-new-281d70f8a3.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-bladnoch-11-y-o-46-7-gbox-ct-6-new-281d70f8a3.webp",
      width: 512,
      height: 512,
      alt: "Confezione di Bladnoch 11 Y.O.",
      position: "center",
    },
  },
  {
    slug: "blanton-s",
    name: "Blanton's",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Blanton's presenti nella selezione.",
    story:
      "La raccolta Blanton's comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-bourbon-whiskey-blanton-s-gold-edition-51-5-ce4b63b87b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-bourbon-whiskey-blanton-s-gold-edition-51-5-ce4b63b87b.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Blanton's Gold Edition",
      position: "center",
    },
  },
  {
    slug: "blavod",
    name: "Blavod",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Blavod presenti nella selezione.",
    story:
      "La raccolta Blavod comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-vodka-blavod-pure-black-40-1-liter-177518b594.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-vodka-blavod-pure-black-40-1-liter-177518b594.webp",
      width: 800,
      height: 1600,
      alt: "Confezione di Blavod Pure Black",
      position: "center",
    },
  },
  {
    slug: "bloom-40",
    name: "Bloom 40%",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Bloom 40% presenti nella selezione.",
    story:
      "La raccolta Bloom 40% comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-gin-bloom-40-liter-ct-6-90ad6ea855.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-gin-bloom-40-liter-ct-6-90ad6ea855.webp",
      width: 756,
      height: 930,
      alt: "Confezione di Bloom",
      position: "center",
    },
  },
  {
    slug: "blue",
    name: "Blue",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Blue presenti nella selezione.",
    story:
      "La raccolta Blue comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-blue-42-luxury-smooth-42-813a0fdcb8.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-blue-42-luxury-smooth-42-813a0fdcb8.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Blue 42 Luxury Smooth",
      position: "center",
    },
  },
  {
    slug: "bluecoat",
    name: "Bluecoat",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Bluecoat presenti nella selezione.",
    story:
      "La raccolta Bluecoat comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-bluecoat-american-dry-barrel-reserve-47-ct-6-ff8b3ab16b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-bluecoat-american-dry-barrel-reserve-47-ct-6-ff8b3ab16b.webp",
      width: 390,
      height: 1024,
      alt: "Confezione di Bluecoat American Dry Barrel Reserve",
      position: "center",
    },
  },
  {
    slug: "bobby-s",
    name: "Bobby's",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Bobby's presenti nella selezione.",
    story:
      "La raccolta Bobby's comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-bobby-s-dry-42-ct-6-fbc1461a33.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-bobby-s-dry-42-ct-6-fbc1461a33.webp",
      width: 800,
      height: 960,
      alt: "Confezione di Bobby's Dry",
      position: "center",
    },
  },
  {
    slug: "boe",
    name: "Boe",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Boe presenti nella selezione.",
    story:
      "La raccolta Boe comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-boe-41-5-ct-6-937846104b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-boe-41-5-ct-6-937846104b.webp",
      width: 552,
      height: 1200,
      alt: "Confezione di Boe",
      position: "center",
    },
  },
  {
    slug: "bols",
    name: "Bols",
    country: null,
    productCount: 17,
    needsReview: false,
    description: "17 etichette Bols presenti nella selezione.",
    story:
      "La raccolta Bols comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-bols-apricot-brandy-24-53868cbf44.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-bols-apricot-brandy-24-53868cbf44.webp",
      width: 479,
      height: 1600,
      alt: "Confezione di Bols Apricot Brandy",
      position: "center",
    },
  },
  {
    slug: "bombay",
    name: "Bombay",
    country: null,
    productCount: 5,
    needsReview: false,
    description: "5 etichette Bombay presenti nella selezione.",
    story:
      "La raccolta Bombay comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-gin-bombay-bramble-blackberry-43-ct-6-33a5dc91a3.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-gin-bombay-bramble-blackberry-43-ct-6-33a5dc91a3.webp",
      width: 1080,
      height: 1350,
      alt: "Confezione di Bombay Bramble Blackberry",
      position: "center",
    },
  },
  {
    slug: "boodles",
    name: "Boodles",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Boodles presenti nella selezione.",
    story:
      "La raccolta Boodles comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-boodles-40-ct-6-fe3ea42e9d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-boodles-40-ct-6-fe3ea42e9d.webp",
      width: 502,
      height: 961,
      alt: "Confezione di Boodles",
      position: "center",
    },
  },
  {
    slug: "borsci",
    name: "Borsci",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Borsci presenti nella selezione.",
    story:
      "La raccolta Borsci comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-borsci-elisir-san-marzano-38-ct-6-bb8eb865bf.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-borsci-elisir-san-marzano-38-ct-6-bb8eb865bf.webp",
      width: 880,
      height: 1120,
      alt: "Confezione di Borsci Elisir San Marzano",
      position: "center",
    },
  },
  {
    slug: "botran",
    name: "Botran",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Botran presenti nella selezione.",
    story:
      "La raccolta Botran comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-rum-botran-15-reserva-sistema-solera-1-liter-40-c324dfeb7b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-rum-botran-15-reserva-sistema-solera-1-liter-40-c324dfeb7b.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Botran 15 Reserva Sistema Solera 1 Liter",
      position: "center",
    },
  },
  {
    slug: "boukman",
    name: "Boukman",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Boukman presenti nella selezione.",
    story:
      "La raccolta Boukman comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-boukman-45-ct-6-0c2694658a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-boukman-45-ct-6-0c2694658a.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Boukman",
      position: "center",
    },
  },
  {
    slug: "bowmore",
    name: "Bowmore",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Bowmore presenti nella selezione.",
    story:
      "La raccolta Bowmore comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-bowmore-9-y-o-40-ct-6-new-9621226c2c.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-bowmore-9-y-o-40-ct-6-new-9621226c2c.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Bowmore 9 Y.O.",
      position: "center",
    },
  },
  {
    slug: "bowsaw",
    name: "Bowsaw",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Bowsaw presenti nella selezione.",
    story:
      "La raccolta Bowsaw comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-bourbon-whiskey-bowsaw-100-straight-american-40-c-1fa0716e32.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-bourbon-whiskey-bowsaw-100-straight-american-40-c-1fa0716e32.webp",
      width: 1080,
      height: 1080,
      alt: "Confezione di Bowsaw",
      position: "center",
    },
  },
  {
    slug: "brecon",
    name: "Brecon",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Brecon presenti nella selezione.",
    story:
      "La raccolta Brecon comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-brecon-botanicals-43-ct-6-e9d3c3f605.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-brecon-botanicals-43-ct-6-e9d3c3f605.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Brecon Botanicals",
      position: "center",
    },
  },
  {
    slug: "brewdog-lonewolf",
    name: "Brewdog Lonewolf",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Brewdog Lonewolf presenti nella selezione.",
    story:
      "La raccolta Brewdog Lonewolf comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-brewdog-lonewolf-bramble-e-raspberry-38-ct-6-a6803bd545.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-brewdog-lonewolf-bramble-e-raspberry-38-ct-6-a6803bd545.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Brewdog Lonewolf Bramble & Raspberry",
      position: "center",
    },
  },
  {
    slug: "brockmans",
    name: "Brockmans",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Brockmans presenti nella selezione.",
    story:
      "La raccolta Brockmans comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-brockmans-40-ct-6-795648ff7a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-brockmans-40-ct-6-795648ff7a.webp",
      width: 573,
      height: 1600,
      alt: "Confezione di Brockmans",
      position: "center",
    },
  },
  {
    slug: "broker-s",
    name: "Broker's",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Broker's presenti nella selezione.",
    story:
      "La raccolta Broker's comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-broker-s-london-dry-40-ct-6-3f6d6f6f84.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-broker-s-london-dry-40-ct-6-3f6d6f6f84.webp",
      width: 600,
      height: 849,
      alt: "Confezione di Broker's London Dry",
      position: "center",
    },
  },
  {
    slug: "brooklyn",
    name: "Brooklyn",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Brooklyn presenti nella selezione.",
    story:
      "La raccolta Brooklyn comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-brooklyn-40-ct-6-92dcf5ee0c.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-brooklyn-40-ct-6-92dcf5ee0c.webp",
      width: 800,
      height: 1476,
      alt: "Confezione di Brooklyn",
      position: "center",
    },
  },
  {
    slug: "brugal",
    name: "Brugal",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Brugal presenti nella selezione.",
    story:
      "La raccolta Brugal comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-brugal-1888-gran-reserva-40-ct-6-cafd2dba66.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-brugal-1888-gran-reserva-40-ct-6-cafd2dba66.webp",
      width: 608,
      height: 1600,
      alt: "Confezione di Brugal 1888 Gran Reserva",
      position: "center",
    },
  },
  {
    slug: "bruichladdich",
    name: "Bruichladdich",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Bruichladdich presenti nella selezione.",
    story:
      "La raccolta Bruichladdich comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-bruichladdich-islay-barley-2013-50--df8c31f4c6.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-bruichladdich-islay-barley-2013-50--df8c31f4c6.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Bruichladdich Islay Barley 2013",
      position: "center",
    },
  },
  {
    slug: "buchanan-s",
    name: "Buchanan's",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Buchanan's presenti nella selezione.",
    story:
      "La raccolta Buchanan's comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-scotch-whisky-buchanan-s-12-y-o-de-luxe-40-ct-12-e63e4e33bf.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-scotch-whisky-buchanan-s-12-y-o-de-luxe-40-ct-12-e63e4e33bf.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Buchanan's 12 Y.O. De Luxe",
      position: "center",
    },
  },
  {
    slug: "buen",
    name: "Buen",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Buen presenti nella selezione.",
    story:
      "La raccolta Buen comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-tequila-buen-vato-blanco-38-new-d7ca0fcef0.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-tequila-buen-vato-blanco-38-new-d7ca0fcef0.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Buen Vato Blanco",
      position: "center",
    },
  },
  {
    slug: "buffalo-trace",
    name: "Buffalo Trace",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Buffalo Trace presenti nella selezione.",
    story:
      "La raccolta Buffalo Trace comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-bourbon-whiskey-buffalo-trace-40-ct-6-06ffe32050.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-bourbon-whiskey-buffalo-trace-40-ct-6-06ffe32050.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Buffalo Trace",
      position: "center",
    },
  },
  {
    slug: "bulldog",
    name: "Bulldog",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Bulldog presenti nella selezione.",
    story:
      "La raccolta Bulldog comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-gin-bulldog-40-1-liter-ct-6-85d565cf2e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-gin-bulldog-40-1-liter-ct-6-85d565cf2e.webp",
      width: 381,
      height: 492,
      alt: "Confezione di Bulldog",
      position: "center",
    },
  },
  {
    slug: "bulleit",
    name: "Bulleit",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Bulleit presenti nella selezione.",
    story:
      "La raccolta Bulleit comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-bourbon-whiskey-bulleit-10-y-o-45-6-2939059e56.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-bourbon-whiskey-bulleit-10-y-o-45-6-2939059e56.webp",
      width: 669,
      height: 1600,
      alt: "Confezione di Bulleit 10 Y.O.",
      position: "center",
    },
  },
  {
    slug: "bumbu",
    name: "Bumbu",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Bumbu presenti nella selezione.",
    story:
      "La raccolta Bumbu comprende rum e rhum, liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-bumbu-the-original-40-ct-6-ab5d5c09d1.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-bumbu-the-original-40-ct-6-ab5d5c09d1.webp",
      width: 553,
      height: 1224,
      alt: "Confezione di Bumbu The Original",
      position: "center",
    },
  },
  {
    slug: "bunnahabhain",
    name: "Bunnahabhain",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Bunnahabhain presenti nella selezione.",
    story:
      "La raccolta Bunnahabhain comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-bunnahabhain-stiuireadair-46-3-gb-c-58fa2c4383.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-bunnahabhain-stiuireadair-46-3-gb-c-58fa2c4383.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Bunnahabhain Stiuireadair",
      position: "center",
    },
  },
  {
    slug: "bushmill",
    name: "Bushmill",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Bushmill presenti nella selezione.",
    story:
      "La raccolta Bushmill comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/12-0050-irish-whiskey-bushmill-40-miniatures-vetro-06298a07bf.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/12-0050-irish-whiskey-bushmill-40-miniatures-vetro-06298a07bf.webp",
      width: 1200,
      height: 1007,
      alt: "Confezione di Bushmill",
      position: "center",
    },
  },
  {
    slug: "bushmills",
    name: "Bushmills",
    country: null,
    productCount: 11,
    needsReview: false,
    description: "11 etichette Bushmills presenti nella selezione.",
    story:
      "La raccolta Bushmills comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-irish-whiskey-bushmills-10-y-o-irish-40-ct-6-03d15c81e3.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-irish-whiskey-bushmills-10-y-o-irish-40-ct-6-03d15c81e3.webp",
      width: 499,
      height: 800,
      alt: "Confezione di Bushmills 10 Y.O. Irish",
      position: "center",
    },
  },
  {
    slug: "buss-n-509",
    name: "Buss N.509",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Buss N.509 presenti nella selezione.",
    story:
      "La raccolta Buss N.509 comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-buss-n-509-ederflower-40-ct-6-63133a2c03.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-buss-n-509-ederflower-40-ct-6-63133a2c03.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Buss N.509 Ederflower",
      position: "center",
    },
  },
  {
    slug: "cab",
    name: "Cab",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Cab presenti nella selezione.",
    story:
      "La raccolta Cab comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-cab-ron-triple-oak-sherry-cask-finished-40-ct-81d50c7d93.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-cab-ron-triple-oak-sherry-cask-finished-40-ct-81d50c7d93.webp",
      width: 462,
      height: 726,
      alt: "Confezione di Cab Ron Triple Oak Sherry Cask Finished",
      position: "center",
    },
  },
  {
    slug: "cachaca",
    name: "Cachaca",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Cachaca presenti nella selezione.",
    story:
      "La raccolta Cachaca comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-cachaca-germana-40-ct-6-a62a22d115.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-cachaca-germana-40-ct-6-a62a22d115.webp",
      width: 515,
      height: 1600,
      alt: "Confezione di Cachaca Germana",
      position: "center",
    },
  },
  {
    slug: "calm",
    name: "Calm",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Calm presenti nella selezione.",
    story:
      "La raccolta Calm comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/gift-vodka-calm-head-black-40-2-bicc-dc367cb40d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/gift-vodka-calm-head-black-40-2-bicc-dc367cb40d.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Calm Head Black",
      position: "center",
    },
  },
  {
    slug: "campari",
    name: "Campari",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Campari presenti nella selezione.",
    story:
      "La raccolta Campari comprende aperitivi disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-campari-bitter-25-ct-12-05750f3a4d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-campari-bitter-25-ct-12-05750f3a4d.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Campari Bitter",
      position: "center",
    },
  },
  {
    slug: "camus",
    name: "Camus",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Camus presenti nella selezione.",
    story:
      "La raccolta Camus comprende cognac disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-cognac-camus-ile-de-re-40-fine-island-gbox-ct-6-054a86564e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-cognac-camus-ile-de-re-40-fine-island-gbox-ct-6-054a86564e.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Camus Ile De Re'",
      position: "center",
    },
  },
  {
    slug: "canadian-club",
    name: "Canadian Club",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Canadian Club presenti nella selezione.",
    story:
      "La raccolta Canadian Club comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/10-0050-canadian-whisky-canadian-club-40-miniatures-pe-564a986d28.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/10-0050-canadian-whisky-canadian-club-40-miniatures-pe-564a986d28.webp",
      width: 1082,
      height: 1600,
      alt: "Confezione di Canadian Club",
      position: "center",
    },
  },
  {
    slug: "cannabis",
    name: "Cannabis",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Cannabis presenti nella selezione.",
    story:
      "La raccolta Cannabis comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-cannabis-sativa-40-ct-6-303aa3e41f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-cannabis-sativa-40-ct-6-303aa3e41f.webp",
      width: 960,
      height: 676,
      alt: "Confezione di Cannabis Sativa",
      position: "center",
    },
  },
  {
    slug: "caol-ila",
    name: "Caol Ila",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Caol Ila presenti nella selezione.",
    story:
      "La raccolta Caol Ila comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-caol-ila-12-y-o-43-ct-6-535b4b289c.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-caol-ila-12-y-o-43-ct-6-535b4b289c.webp",
      width: 800,
      height: 1518,
      alt: "Confezione di Caol Ila 12 Y.O.",
      position: "center",
    },
  },
  {
    slug: "caorunn",
    name: "Caorunn",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Caorunn presenti nella selezione.",
    story:
      "La raccolta Caorunn comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-caorunn-41-8-ct-6-95439953d6.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-caorunn-41-8-ct-6-95439953d6.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Caorunn",
      position: "center",
    },
  },
  {
    slug: "caprisius",
    name: "Caprisius",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Caprisius presenti nella selezione.",
    story:
      "La raccolta Caprisius comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-caprisius-43-ct-6-new-4545013021.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-caprisius-43-ct-6-new-4545013021.webp",
      width: 600,
      height: 800,
      alt: "Confezione di Caprisius",
      position: "center",
    },
  },
  {
    slug: "captain-morgan",
    name: "Captain Morgan",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Captain Morgan presenti nella selezione.",
    story:
      "La raccolta Captain Morgan comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-rum-captain-morgan-black-spiced-40-ct-12-aa000b2d2d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-rum-captain-morgan-black-spiced-40-ct-12-aa000b2d2d.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Captain Morgan Black Spiced",
      position: "center",
    },
  },
  {
    slug: "cardenal-mendoza",
    name: "Cardenal Mendoza",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Cardenal Mendoza presenti nella selezione.",
    story:
      "La raccolta Cardenal Mendoza comprende liquori, brandy e altri distillati disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-cardenal-mendoza-angelus-40-gbox-ct-6-3874bebb2e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-cardenal-mendoza-angelus-40-gbox-ct-6-3874bebb2e.webp",
      width: 1200,
      height: 1457,
      alt: "Confezione di Cardenal Mendoza Angelus",
      position: "center",
    },
  },
  {
    slug: "cardhu",
    name: "Cardhu",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Cardhu presenti nella selezione.",
    story:
      "La raccolta Cardhu comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-cardhu-12-y-o-40-gbox-ct-6-a7a936ed1f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-cardhu-12-y-o-40-gbox-ct-6-a7a936ed1f.webp",
      width: 800,
      height: 927,
      alt: "Confezione di Cardhu 12 Y.O.",
      position: "center",
    },
  },
  {
    slug: "carlo-alberto",
    name: "Carlo Alberto",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Carlo Alberto presenti nella selezione.",
    story:
      "La raccolta Carlo Alberto comprende vermouth disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0750-vermouth-carlo-alberto-riserva-bianco-18-ct-6-9f9c3c3269.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0750-vermouth-carlo-alberto-riserva-bianco-18-ct-6-9f9c3c3269.webp",
      width: 512,
      height: 1600,
      alt: "Confezione di Carlo Alberto Riserva Bianco",
      position: "center",
    },
  },
  {
    slug: "carlos",
    name: "Carlos",
    country: null,
    productCount: 8,
    needsReview: false,
    description: "8 etichette Carlos presenti nella selezione.",
    story:
      "La raccolta Carlos comprende brandy e altri distillati disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/09-0050-brandy-carlos-i-primero-38-ct-10-miniature-vet-38056830b3.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/09-0050-brandy-carlos-i-primero-38-ct-10-miniature-vet-38056830b3.webp",
      width: 504,
      height: 800,
      alt: "Confezione di Carlos I Primero",
      position: "center",
    },
  },
  {
    slug: "carpano",
    name: "Carpano",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Carpano presenti nella selezione.",
    story:
      "La raccolta Carpano comprende brandy e altri distillati disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-carpano-formula-antica-16-5-ct-6-53a841607a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-carpano-formula-antica-16-5-ct-6-53a841607a.webp",
      width: 800,
      height: 960,
      alt: "Confezione di Carpano Formula Antica",
      position: "center",
    },
  },
  {
    slug: "cartavio",
    name: "Cartavio",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Cartavio presenti nella selezione.",
    story:
      "La raccolta Cartavio comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-cartavio-selecto-5-anos-40-ct-6-b92e6571d1.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-cartavio-selecto-5-anos-40-ct-6-b92e6571d1.webp",
      width: 397,
      height: 1000,
      alt: "Confezione di Cartavio Selecto 5 Anos",
      position: "center",
    },
  },
  {
    slug: "casa",
    name: "Casa",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Casa presenti nella selezione.",
    story:
      "La raccolta Casa comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-tequila-casa-dragones-joven-40-ct-3-e584e716c2.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-tequila-casa-dragones-joven-40-ct-3-e584e716c2.webp",
      width: 970,
      height: 600,
      alt: "Confezione di Casa Dragones Joven",
      position: "center",
    },
  },
  {
    slug: "casamigos",
    name: "Casamigos",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Casamigos presenti nella selezione.",
    story:
      "La raccolta Casamigos comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-tequila-casamigos-anejo-40-ct-6-fe4f516634.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-tequila-casamigos-anejo-40-ct-6-fe4f516634.webp",
      width: 600,
      height: 600,
      alt: "Confezione di Casamigos Anejo",
      position: "center",
    },
  },
  {
    slug: "casco",
    name: "Casco",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Casco presenti nella selezione.",
    story:
      "La raccolta Casco comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-tequila-casco-viejo-gold-38-ct-6-35241033b5.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-tequila-casco-viejo-gold-38-ct-6-35241033b5.webp",
      width: 426,
      height: 768,
      alt: "Confezione di Casco Viejo Gold",
      position: "center",
    },
  },
  {
    slug: "cenote",
    name: "Cenote",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Cenote presenti nella selezione.",
    story:
      "La raccolta Cenote comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-tequila-cenote-anejo-40-ct-6-new-b95ed4538b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-tequila-cenote-anejo-40-ct-6-new-b95ed4538b.webp",
      width: 900,
      height: 1191,
      alt: "Confezione di Cenote Anejo",
      position: "center",
    },
  },
  {
    slug: "centenario",
    name: "Centenario",
    country: null,
    productCount: 8,
    needsReview: false,
    description: "8 etichette Centenario presenti nella selezione.",
    story:
      "La raccolta Centenario comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-centenario-5-y-anejo-selecto-40-ct-6-6cc0877777.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-centenario-5-y-anejo-selecto-40-ct-6-6cc0877777.webp",
      width: 449,
      height: 1427,
      alt: "Confezione di Centenario 5 Y. Anejo Selecto",
      position: "center",
    },
  },
  {
    slug: "chairman-s-reserve",
    name: "Chairman's Reserve",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Chairman's Reserve presenti nella selezione.",
    story:
      "La raccolta Chairman's Reserve comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-chairman-s-reserve-original-finest-select-40--3a2980575b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-chairman-s-reserve-original-finest-select-40--3a2980575b.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Chairman's Reserve Original Finest Select",
      position: "center",
    },
  },
  {
    slug: "chambord",
    name: "Chambord",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Chambord presenti nella selezione.",
    story:
      "La raccolta Chambord comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-liquore-chambord-16-5-gb-ct-6-9396aed38b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-liquore-chambord-16-5-gb-ct-6-9396aed38b.webp",
      width: 1157,
      height: 1500,
      alt: "Confezione di Chambord",
      position: "center",
    },
  },
  {
    slug: "cherry",
    name: "Cherry",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Cherry presenti nella selezione.",
    story:
      "La raccolta Cherry comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-cherry-heering-24-ct-6-55525098ac.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-cherry-heering-24-ct-6-55525098ac.webp",
      width: 500,
      height: 500,
      alt: "Confezione di Cherry Heering",
      position: "center",
    },
  },
  {
    slug: "chivas",
    name: "Chivas",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Chivas presenti nella selezione.",
    story:
      "La raccolta Chivas comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/12-0050-scotch-whisky-chivas-regal-12y-40-miniatures-v-958f599491.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/12-0050-scotch-whisky-chivas-regal-12y-40-miniatures-v-958f599491.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Chivas Regal 12Y",
      position: "center",
    },
  },
  {
    slug: "chopin",
    name: "Chopin",
    country: null,
    productCount: 10,
    needsReview: false,
    description: "10 etichette Chopin presenti nella selezione.",
    story:
      "La raccolta Chopin comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-chopin-potato-40-8785d029f4.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-chopin-potato-40-8785d029f4.webp",
      width: 711,
      height: 1600,
      alt: "Confezione di Chopin Potato",
      position: "center",
    },
  },
  {
    slug: "christiania",
    name: "Christiania",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Christiania presenti nella selezione.",
    story:
      "La raccolta Christiania comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/06-0100-vodka-christiania-40-miniatures-vetro-ct-4-e245a2e610.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/06-0100-vodka-christiania-40-miniatures-vetro-ct-4-e245a2e610.webp",
      width: 800,
      height: 960,
      alt: "Confezione di Christiania",
      position: "center",
    },
  },
  {
    slug: "christmas",
    name: "Christmas",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Christmas presenti nella selezione.",
    story:
      "La raccolta Christmas comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-christmas-globe-spiced-orange-e-cranberry-20--9ded97b450.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-christmas-globe-spiced-orange-e-cranberry-20--9ded97b450.webp",
      width: 900,
      height: 1200,
      alt: "Confezione di Christmas Globe Spiced Orange & Cranberry",
      position: "center",
    },
  },
  {
    slug: "ciemme",
    name: "Ciemme",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Ciemme presenti nella selezione.",
    story:
      "La raccolta Ciemme comprende brandy e altri distillati, grappe disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/30-0030-ciemme-brandy-miniature-38-vetro-ct-8-156e03c753.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/30-0030-ciemme-brandy-miniature-38-vetro-ct-8-156e03c753.webp",
      width: 463,
      height: 830,
      alt: "Confezione di Ciemme Brandy Miniature",
      position: "center",
    },
  },
  {
    slug: "cihuatan",
    name: "Cihuatan",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Cihuatan presenti nella selezione.",
    story:
      "La raccolta Cihuatan comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-cihuatan-jade-40-ct-6-b173297203.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-cihuatan-jade-40-ct-6-b173297203.webp",
      width: 452,
      height: 452,
      alt: "Confezione di Cihuatan Jade",
      position: "center",
    },
  },
  {
    slug: "ciroc",
    name: "Ciroc",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Ciroc presenti nella selezione.",
    story:
      "La raccolta Ciroc comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-ciroc-40-26e2364f20.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-ciroc-40-26e2364f20.webp",
      width: 452,
      height: 452,
      alt: "Confezione di Ciroc",
      position: "center",
    },
  },
  {
    slug: "ciroc-40",
    name: "Ciroc 40%",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Ciroc 40% presenti nella selezione.",
    story:
      "La raccolta Ciroc 40% comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/6000-vodka-ciroc-40-6-litri-edc099b56a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/6000-vodka-ciroc-40-6-litri-edc099b56a.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Ciroc",
      position: "center",
    },
  },
  {
    slug: "citadelle",
    name: "Citadelle",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Citadelle presenti nella selezione.",
    story:
      "La raccolta Citadelle comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-citadelle-44-ct-6-ee20db0ef0.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-citadelle-44-ct-6-ee20db0ef0.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Citadelle",
      position: "center",
    },
  },
  {
    slug: "clase-azul",
    name: "Clase Azul",
    country: null,
    productCount: 5,
    needsReview: false,
    description: "5 etichette Clase Azul presenti nella selezione.",
    story:
      "La raccolta Clase Azul comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-tequila-clase-azul-anejo-40-ct-3-5b82d71877.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-tequila-clase-azul-anejo-40-ct-3-5b82d71877.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Clase Azul Anejo",
      position: "center",
    },
  },
  {
    slug: "clement",
    name: "Clement",
    country: null,
    productCount: 15,
    needsReview: false,
    description: "15 etichette Clement presenti nella selezione.",
    story:
      "La raccolta Clement comprende rum e rhum, liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-clement-10-y-o-42-gbox-ct-6-c34280353e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-clement-10-y-o-42-gbox-ct-6-c34280353e.webp",
      width: 1000,
      height: 1170,
      alt: "Confezione di Clement 10 Y.O.",
      position: "center",
    },
  },
  {
    slug: "clontarf",
    name: "Clontarf",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Clontarf presenti nella selezione.",
    story:
      "La raccolta Clontarf comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/gift-irish-whiskey-clontarf-40-3-200-3bicchieri-1079e8a394.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/gift-irish-whiskey-clontarf-40-3-200-3bicchieri-1079e8a394.webp",
      width: 1200,
      height: 887,
      alt: "Confezione di Clontarf",
      position: "center",
    },
  },
  {
    slug: "cocchi",
    name: "Cocchi",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Cocchi presenti nella selezione.",
    story:
      "La raccolta Cocchi comprende vermouth disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0750-vermouth-cocchi-americano-bianco-16-5-aperitivo-ea7b4f530c.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0750-vermouth-cocchi-americano-bianco-16-5-aperitivo-ea7b4f530c.webp",
      width: 600,
      height: 1600,
      alt: "Confezione di Cocchi Americano Bianco",
      position: "center",
    },
  },
  {
    slug: "cointreau",
    name: "Cointreau",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Cointreau presenti nella selezione.",
    story:
      "La raccolta Cointreau comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-cointreau-litro-40-ct-6-0b82c020b7.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-cointreau-litro-40-ct-6-0b82c020b7.webp",
      width: 300,
      height: 400,
      alt: "Confezione di Cointreau Litro",
      position: "center",
    },
  },
  {
    slug: "connemara",
    name: "Connemara",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Connemara presenti nella selezione.",
    story:
      "La raccolta Connemara comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-irish-whiskey-connemara-12-y-o-40-d136ac69bb.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-irish-whiskey-connemara-12-y-o-40-d136ac69bb.webp",
      width: 800,
      height: 1026,
      alt: "Confezione di Connemara 12 Y.O.",
      position: "center",
    },
  },
  {
    slug: "copperhead",
    name: "Copperhead",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Copperhead presenti nella selezione.",
    story:
      "La raccolta Copperhead comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-gin-copperhead-40-ct-6-86dcefbca8.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-gin-copperhead-40-ct-6-86dcefbca8.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Copperhead",
      position: "center",
    },
  },
  {
    slug: "cordiale",
    name: "Cordiale",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Cordiale presenti nella selezione.",
    story:
      "La raccolta Cordiale comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-cordiale-40-ct-6-40e24ea5e2.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-cordiale-40-ct-6-40e24ea5e2.webp",
      width: 698,
      height: 1227,
      alt: "Confezione di Cordiale",
      position: "center",
    },
  },
  {
    slug: "corn-whiskey",
    name: "Corn Whiskey",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Corn Whiskey presenti nella selezione.",
    story:
      "La raccolta Corn Whiskey comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-corn-whiskey-mccormick-platte-valley-40-ct-6-6e7d1e6d70.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-corn-whiskey-mccormick-platte-valley-40-ct-6-6e7d1e6d70.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Corn Whiskey Mccormick Platte Valley",
      position: "center",
    },
  },
  {
    slug: "corralejo",
    name: "Corralejo",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Corralejo presenti nella selezione.",
    story:
      "La raccolta Corralejo comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-tequila-corralejo-anejo-1-liter-38-ct-12-3d9fc01700.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-tequila-corralejo-anejo-1-liter-38-ct-12-3d9fc01700.webp",
      width: 650,
      height: 650,
      alt: "Confezione di Corralejo Anejo 1 Liter",
      position: "center",
    },
  },
  {
    slug: "cosa",
    name: "Cosa",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Cosa presenti nella selezione.",
    story:
      "La raccolta Cosa comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-cosa-nostra-mitra-con-scotch-whisky-40-5b4bd6c5eb.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-cosa-nostra-mitra-con-scotch-whisky-40-5b4bd6c5eb.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Cosa Nostra Mitra Con Scotch Whisky",
      position: "center",
    },
  },
  {
    slug: "cotswolds",
    name: "Cotswolds",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Cotswolds presenti nella selezione.",
    story:
      "La raccolta Cotswolds comprende gin, whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-cotswolds-dry-46-ct-6-b0077b2a3d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-cotswolds-dry-46-ct-6-b0077b2a3d.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Cotswolds Dry",
      position: "center",
    },
  },
  {
    slug: "courvoisier",
    name: "Courvoisier",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Courvoisier presenti nella selezione.",
    story:
      "La raccolta Courvoisier comprende cognac disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-cognac-courvoisier-v-s-40-ct-6-b36ea3cc48.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-cognac-courvoisier-v-s-40-ct-6-b36ea3cc48.webp",
      width: 605,
      height: 1600,
      alt: "Confezione di Courvoisier V.s.",
      position: "center",
    },
  },
  {
    slug: "crafter-s",
    name: "Crafter's",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Crafter's presenti nella selezione.",
    story:
      "La raccolta Crafter's comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-crafter-s-aromatic-flower-44-3-ct-6-8fd461630a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-crafter-s-aromatic-flower-44-3-ct-6-8fd461630a.webp",
      width: 1024,
      height: 1024,
      alt: "Confezione di Crafter's Aromatic Flower",
      position: "center",
    },
  },
  {
    slug: "crafters",
    name: "Crafters",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Crafters presenti nella selezione.",
    story:
      "La raccolta Crafters comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-gin-crafters-aromatic-flower-44-3-ct-6-f75474cf12.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-gin-crafters-aromatic-flower-44-3-ct-6-f75474cf12.webp",
      width: 1024,
      height: 1024,
      alt: "Confezione di Crafters Aromatic Flower",
      position: "center",
    },
  },
  {
    slug: "cragganmore",
    name: "Cragganmore",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Cragganmore presenti nella selezione.",
    story:
      "La raccolta Cragganmore comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-cragganmore-12-y-o-40-ast-ct-6-cf2fcbb80c.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-cragganmore-12-y-o-40-ast-ct-6-cf2fcbb80c.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Cragganmore 12 Y.o",
      position: "center",
    },
  },
  {
    slug: "crespo",
    name: "Crespo",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Crespo presenti nella selezione.",
    story:
      "La raccolta Crespo comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-crespo-legacy-barreled-45-9-ct-6-3076b930bc.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-crespo-legacy-barreled-45-9-ct-6-3076b930bc.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Crespo Legacy Barreled",
      position: "center",
    },
  },
  {
    slug: "cross",
    name: "Cross",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Cross presenti nella selezione.",
    story:
      "La raccolta Cross comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-cross-keys-41-ct-6-0f6f4857e7.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-cross-keys-41-ct-6-0f6f4857e7.webp",
      width: 1080,
      height: 1440,
      alt: "Confezione di Cross Keys",
      position: "center",
    },
  },
  {
    slug: "crown-royal",
    name: "Crown Royal",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Crown Royal presenti nella selezione.",
    story:
      "La raccolta Crown Royal comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/06-0050-canadian-whisky-crown-royal-40-miniatures-vetr-4ea962d1da.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/06-0050-canadian-whisky-crown-royal-40-miniatures-vetr-4ea962d1da.webp",
      width: 1024,
      height: 1024,
      alt: "Confezione di Crown Royal",
      position: "center",
    },
  },
  {
    slug: "crystal-head",
    name: "Crystal Head",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Crystal Head presenti nella selezione.",
    story:
      "La raccolta Crystal Head comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-vodka-crystal-head-40-1-liter-ct-6-137797f025.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-vodka-crystal-head-40-1-liter-ct-6-137797f025.webp",
      width: 1000,
      height: 1243,
      alt: "Confezione di Crystal Head",
      position: "center",
    },
  },
  {
    slug: "cubaney",
    name: "Cubaney",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Cubaney presenti nella selezione.",
    story:
      "La raccolta Cubaney comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-cubaney-15-y-o-estupendo-38-gb-ct-6-3abe107737.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-cubaney-15-y-o-estupendo-38-gb-ct-6-3abe107737.webp",
      width: 500,
      height: 1600,
      alt: "Confezione di Cubaney 15 Y.O. Estupendo",
      position: "center",
    },
  },
  {
    slug: "cubical",
    name: "Cubical",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Cubical presenti nella selezione.",
    story:
      "La raccolta Cubical comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-cubical-kiss-37-5-ct-6-95f648f451.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-cubical-kiss-37-5-ct-6-95f648f451.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Cubical Kiss",
      position: "center",
    },
  },
  {
    slug: "cuervo",
    name: "Cuervo",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Cuervo presenti nella selezione.",
    story:
      "La raccolta Cuervo comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/10-0050-tequila-cuervo-blanco-silver-40-miniatures-pet-6cb9311866.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/10-0050-tequila-cuervo-blanco-silver-40-miniatures-pet-6cb9311866.webp",
      width: 482,
      height: 369,
      alt: "Confezione di Cuervo Blanco/silver",
      position: "center",
    },
  },
  {
    slug: "dalwhinnie",
    name: "Dalwhinnie",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Dalwhinnie presenti nella selezione.",
    story:
      "La raccolta Dalwhinnie comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-dalwhinnie-15-y-o-43-gbox-ct-6-6b6f98ebf3.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-dalwhinnie-15-y-o-43-gbox-ct-6-6b6f98ebf3.webp",
      width: 900,
      height: 1200,
      alt: "Confezione di Dalwhinnie 15 Y.O.",
      position: "center",
    },
  },
  {
    slug: "danzka",
    name: "Danzka",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Danzka presenti nella selezione.",
    story:
      "La raccolta Danzka comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/04-0050-vodka-danzka-forty-apple-citrus-cranraz-40-min-2dfeb0c0d1.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/04-0050-vodka-danzka-forty-apple-citrus-cranraz-40-min-2dfeb0c0d1.webp",
      width: 600,
      height: 800,
      alt: "Confezione di Danzka (forty/apple/citrus/cranraz)",
      position: "center",
    },
  },
  {
    slug: "david-nicholson",
    name: "David Nicholson",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette David Nicholson presenti nella selezione.",
    story:
      "La raccolta David Nicholson comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-bourbon-whiskey-david-nicholson-1843-50-82ae740720.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-bourbon-whiskey-david-nicholson-1843-50-82ae740720.webp",
      width: 664,
      height: 1600,
      alt: "Confezione di David Nicholson 1843",
      position: "center",
    },
  },
  {
    slug: "de-medici",
    name: "De Medici",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette De Medici presenti nella selezione.",
    story:
      "La raccolta De Medici comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-de-medici-exotic-22-40-ct-6-6c7499c8c7.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-de-medici-exotic-22-40-ct-6-6c7499c8c7.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di De Medici Exotic 22",
      position: "center",
    },
  },
  {
    slug: "deadhead",
    name: "Deadhead",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Deadhead presenti nella selezione.",
    story:
      "La raccolta Deadhead comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-deadhead-40-ct-6-f347b91d16.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-deadhead-40-ct-6-f347b91d16.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Deadhead",
      position: "center",
    },
  },
  {
    slug: "debowa",
    name: "Debowa",
    country: null,
    productCount: 22,
    needsReview: false,
    description: "22 etichette Debowa presenti nella selezione.",
    story:
      "La raccolta Debowa comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-debowa-40-ct-6-68844253f9.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-debowa-40-ct-6-68844253f9.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Debowa",
      position: "center",
    },
  },
  {
    slug: "dei",
    name: "Dei",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Dei presenti nella selezione.",
    story:
      "La raccolta Dei comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-dei-sospiri-40-ct-6-c5c7a9cbd1.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-dei-sospiri-40-ct-6-c5c7a9cbd1.webp",
      width: 800,
      height: 960,
      alt: "Confezione di Dei Sospiri",
      position: "center",
    },
  },
  {
    slug: "del-professore",
    name: "Del Professore",
    country: null,
    productCount: 5,
    needsReview: false,
    description: "5 etichette Del Professore presenti nella selezione.",
    story:
      "La raccolta Del Professore comprende gin, vermouth disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-del-professore-crocodile-45-old-tom-ct-6-741e2fb2fd.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-del-professore-crocodile-45-old-tom-ct-6-741e2fb2fd.webp",
      width: 700,
      height: 700,
      alt: "Confezione di Del Professore Crocodile",
      position: "center",
    },
  },
  {
    slug: "depaz",
    name: "Depaz",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Depaz presenti nella selezione.",
    story:
      "La raccolta Depaz comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-depaz-cuvee-de-la-montagne-45-ct-6-662dcbdf1a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-depaz-cuvee-de-la-montagne-45-ct-6-662dcbdf1a.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Depaz Cuvee De La Montagne",
      position: "center",
    },
  },
  {
    slug: "devoille",
    name: "Devoille",
    country: null,
    productCount: 10,
    needsReview: false,
    description: "10 etichette Devoille presenti nella selezione.",
    story:
      "La raccolta Devoille comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-assenzio-devoille-abel-bresson-72-cacabaaf59.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-assenzio-devoille-abel-bresson-72-cacabaaf59.webp",
      width: 458,
      height: 458,
      alt: "Confezione di Devoille Abel Bresson",
      position: "center",
    },
  },
  {
    slug: "dewar-s",
    name: "Dewar's",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Dewar's presenti nella selezione.",
    story:
      "La raccolta Dewar's comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/10-0050-scotch-whisky-dewar-s-white-label-40-miniature-6366e68593.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/10-0050-scotch-whisky-dewar-s-white-label-40-miniature-6366e68593.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Dewar's White Label",
      position: "center",
    },
  },
  {
    slug: "diamond",
    name: "Diamond",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Diamond presenti nella selezione.",
    story:
      "La raccolta Diamond comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-diamond-standard-40-new-7aeedd43ac.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-diamond-standard-40-new-7aeedd43ac.webp",
      width: 230,
      height: 1200,
      alt: "Confezione di Diamond Standard",
      position: "center",
    },
  },
  {
    slug: "dictador",
    name: "Dictador",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Dictador presenti nella selezione.",
    story:
      "La raccolta Dictador comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-dictador-12-y-o-40-senza-astuccio-ct-6-6e684d21c5.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-dictador-12-y-o-40-senza-astuccio-ct-6-6e684d21c5.webp",
      width: 800,
      height: 960,
      alt: "Confezione di Dictador 12 Y.O.",
      position: "center",
    },
  },
  {
    slug: "dimple",
    name: "Dimple",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Dimple presenti nella selezione.",
    story:
      "La raccolta Dimple comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-scotch-whisky-dimple-15yo-43-ct-12-d5c8e11086.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-scotch-whisky-dimple-15yo-43-ct-12-d5c8e11086.webp",
      width: 1140,
      height: 1200,
      alt: "Confezione di Dimple 15YO",
      position: "center",
    },
  },
  {
    slug: "dingle",
    name: "Dingle",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Dingle presenti nella selezione.",
    story:
      "La raccolta Dingle comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-irish-whiskey-dingle-single-malt-46-3-gb-ct-6-new-4e6d7db2db.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-irish-whiskey-dingle-single-malt-46-3-gb-ct-6-new-4e6d7db2db.webp",
      width: 1013,
      height: 1500,
      alt: "Confezione di Dingle Single Malt",
      position: "center",
    },
  },
  {
    slug: "diplomatico",
    name: "Diplomatico",
    country: null,
    productCount: 13,
    needsReview: false,
    description: "13 etichette Diplomatico presenti nella selezione.",
    story:
      "La raccolta Diplomatico comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-diplomatico-ambassador-47-ct-4-7c98f09e87.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-diplomatico-ambassador-47-ct-4-7c98f09e87.webp",
      width: 800,
      height: 1033,
      alt: "Confezione di Diplomatico Ambassador",
      position: "center",
    },
  },
  {
    slug: "disaronno-amaretto",
    name: "Disaronno Amaretto",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Disaronno Amaretto presenti nella selezione.",
    story:
      "La raccolta Disaronno Amaretto comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-disaronno-amaretto-28-1-liter-ct-12-314a66ae71.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-disaronno-amaretto-28-1-liter-ct-12-314a66ae71.webp",
      width: 1067,
      height: 1600,
      alt: "Confezione di Disaronno Amaretto",
      position: "center",
    },
  },
  {
    slug: "dolin",
    name: "Dolin",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Dolin presenti nella selezione.",
    story:
      "La raccolta Dolin comprende vermouth disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0750-vermouth-dolin-blanc-16-ct-12-501f91cbc0.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0750-vermouth-dolin-blanc-16-ct-12-501f91cbc0.webp",
      width: 1067,
      height: 1600,
      alt: "Confezione di Dolin Blanc",
      position: "center",
    },
  },
  {
    slug: "don",
    name: "Don",
    country: null,
    productCount: 21,
    needsReview: false,
    description: "21 etichette Don presenti nella selezione.",
    story:
      "La raccolta Don comprende rum e rhum, tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-don-diego-encantador-1997-40-ct-6-56252a0c9a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-don-diego-encantador-1997-40-ct-6-56252a0c9a.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Don Diego Encantador 1997",
      position: "center",
    },
  },
  {
    slug: "dona-celia",
    name: "Dona Celia",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Dona Celia presenti nella selezione.",
    story:
      "La raccolta Dona Celia comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-tequila-dona-celia-anejo-40-gb-ct-6-new-8c4075be8b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-tequila-dona-celia-anejo-40-gb-ct-6-new-8c4075be8b.webp",
      width: 800,
      height: 960,
      alt: "Confezione di Dona Celia Anejo",
      position: "center",
    },
  },
  {
    slug: "doorly-s",
    name: "Doorly's",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Doorly's presenti nella selezione.",
    story:
      "La raccolta Doorly's comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-doorly-s-3-y-o-40-barbados-ct-6-c36df94663.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-doorly-s-3-y-o-40-barbados-ct-6-c36df94663.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Doorly's 3 Y.O.",
      position: "center",
    },
  },
  {
    slug: "dos-maderas",
    name: "Dos Maderas",
    country: null,
    productCount: 5,
    needsReview: false,
    description: "5 etichette Dos Maderas presenti nella selezione.",
    story:
      "La raccolta Dos Maderas comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/3000-rum-dos-maderas-5-3-37-5-3litri-ct-6-new-2119bd9fdd.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/3000-rum-dos-maderas-5-3-37-5-3litri-ct-6-new-2119bd9fdd.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Dos Maderas 5+3",
      position: "center",
    },
  },
  {
    slug: "dr",
    name: "Dr.",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Dr. presenti nella selezione.",
    story:
      "La raccolta Dr. comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-dr-squid-40-ct-24-b21a2edbff.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-dr-squid-40-ct-24-b21a2edbff.webp",
      width: 460,
      height: 1600,
      alt: "Confezione di Dr. Squid",
      position: "center",
    },
  },
  {
    slug: "drambuie-40",
    name: "Drambuie 40%",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Drambuie 40% presenti nella selezione.",
    story:
      "La raccolta Drambuie 40% comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-drambuie-40-1-liter-ct-12-c02c5b011a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-drambuie-40-1-liter-ct-12-c02c5b011a.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Drambuie",
      position: "center",
    },
  },
  {
    slug: "drumshambo",
    name: "Drumshambo",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Drumshambo presenti nella selezione.",
    story:
      "La raccolta Drumshambo comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-drumshambo-sausage-tree-43-ct-6-new-c0b1f5c37a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-drumshambo-sausage-tree-43-ct-6-new-c0b1f5c37a.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Drumshambo Sausage Tree",
      position: "center",
    },
  },
  {
    slug: "drumshanbo-gunpowder",
    name: "Drumshanbo Gunpowder",
    country: null,
    productCount: 12,
    needsReview: false,
    description: "12 etichette Drumshanbo Gunpowder presenti nella selezione.",
    story:
      "La raccolta Drumshanbo Gunpowder comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-drumshanbo-gunpowder-californian-orange-43-ct-eaf450b88c.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-drumshanbo-gunpowder-californian-orange-43-ct-eaf450b88c.webp",
      width: 934,
      height: 934,
      alt: "Confezione di Drumshanbo Gunpowder Californian Orange",
      position: "center",
    },
  },
  {
    slug: "dubonnet",
    name: "Dubonnet",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Dubonnet presenti nella selezione.",
    story:
      "La raccolta Dubonnet comprende vermouth disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0750-vermouth-dubonnet-red-14-8-ct-6-46491ec716.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0750-vermouth-dubonnet-red-14-8-ct-6-46491ec716.webp",
      width: 577,
      height: 1024,
      alt: "Confezione di Dubonnet Red",
      position: "center",
    },
  },
  {
    slug: "dunville-s",
    name: "Dunville's",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Dunville's presenti nella selezione.",
    story:
      "La raccolta Dunville's comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-irish-whiskey-dunville-s-px-cask-46-12-y-o-new-259d72bda8.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-irish-whiskey-dunville-s-px-cask-46-12-y-o-new-259d72bda8.webp",
      width: 800,
      height: 1330,
      alt: "Confezione di Dunville's Px Cask",
      position: "center",
    },
  },
  {
    slug: "eagle",
    name: "Eagle",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Eagle presenti nella selezione.",
    story:
      "La raccolta Eagle comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-bourbon-whiskey-eagle-rare-10-y-o-45-704f32e6f4.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-bourbon-whiskey-eagle-rare-10-y-o-45-704f32e6f4.webp",
      width: 1200,
      height: 1600,
      alt: "Confezione di Eagle Rare 10 Y.O.",
      position: "center",
    },
  },
  {
    slug: "eden",
    name: "Eden",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Eden presenti nella selezione.",
    story:
      "La raccolta Eden comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-eden-mill-love-40-ct-6-c283a5eb42.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-eden-mill-love-40-ct-6-c283a5eb42.webp",
      width: 480,
      height: 638,
      alt: "Confezione di Eden MILL Love",
      position: "center",
    },
  },
  {
    slug: "edinburgh",
    name: "Edinburgh",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Edinburgh presenti nella selezione.",
    story:
      "La raccolta Edinburgh comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-edinburgh-43-ct-6-f7a4aa222c.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-edinburgh-43-ct-6-f7a4aa222c.webp",
      width: 1100,
      height: 1600,
      alt: "Confezione di Edinburgh",
      position: "center",
    },
  },
  {
    slug: "edradour",
    name: "Edradour",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Edradour presenti nella selezione.",
    story:
      "La raccolta Edradour comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-edradour-10-y-40-ct-6-gbox-efacdb1ca0.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-edradour-10-y-40-ct-6-gbox-efacdb1ca0.webp",
      width: 1024,
      height: 1024,
      alt: "Confezione di Edradour 10 Y.",
      position: "center",
    },
  },
  {
    slug: "egan-s",
    name: "Egan's",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Egan's presenti nella selezione.",
    story:
      "La raccolta Egan's comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-irish-whiskey-egan-s-10-y-o-47-328e200933.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-irish-whiskey-egan-s-10-y-o-47-328e200933.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Egan's 10 Y.O.",
      position: "center",
    },
  },
  {
    slug: "el",
    name: "El",
    country: null,
    productCount: 10,
    needsReview: false,
    description: "10 etichette El presenti nella selezione.",
    story:
      "La raccolta El comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-el-dorado-5-y-o-40-ct-6-ce7b69349a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-el-dorado-5-y-o-40-ct-6-ce7b69349a.webp",
      width: 360,
      height: 1000,
      alt: "Confezione di El Dorado 5 Y.O.",
      position: "center",
    },
  },
  {
    slug: "elephant",
    name: "Elephant",
    country: null,
    productCount: 5,
    needsReview: false,
    description: "5 etichette Elephant presenti nella selezione.",
    story:
      "La raccolta Elephant comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-gin-elephant-dry-45-ct-6-23df5a38fd.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-gin-elephant-dry-45-ct-6-23df5a38fd.webp",
      width: 450,
      height: 730,
      alt: "Confezione di Elephant Dry",
      position: "center",
    },
  },
  {
    slug: "elijah-craig",
    name: "Elijah Craig",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Elijah Craig presenti nella selezione.",
    story:
      "La raccolta Elijah Craig comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-bourbon-whiskey-elijah-craig-barrel-proof-12y-o-6-9055a66730.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-bourbon-whiskey-elijah-craig-barrel-proof-12y-o-6-9055a66730.webp",
      width: 1002,
      height: 1284,
      alt: "Confezione di Elijah Craig Barrel Proof 12Y.O.",
      position: "center",
    },
  },
  {
    slug: "elit-40",
    name: "Elit 40%",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Elit 40% presenti nella selezione.",
    story:
      "La raccolta Elit 40% comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1750-vodka-elit-40-ct-4-9bed6adf13.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1750-vodka-elit-40-ct-4-9bed6adf13.webp",
      width: 450,
      height: 600,
      alt: "Confezione di Elit",
      position: "center",
    },
  },
  {
    slug: "ellenor",
    name: "Ellenor",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Ellenor presenti nella selezione.",
    story:
      "La raccolta Ellenor comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-ellenor-elderflower-sambuco-18-ct-6-new-0b3ee44156.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-ellenor-elderflower-sambuco-18-ct-6-new-0b3ee44156.webp",
      width: 222,
      height: 1023,
      alt: "Confezione di Ellenor Elderflower Sambuco",
      position: "center",
    },
  },
  {
    slug: "emile-pernot",
    name: "Emile Pernot",
    country: null,
    productCount: 9,
    needsReview: false,
    description: "9 etichette Emile Pernot presenti nella selezione.",
    story:
      "La raccolta Emile Pernot comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-assenzio-emile-pernot-1804-pontarlier-68-ct-12-c5d16e0828.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-assenzio-emile-pernot-1804-pontarlier-68-ct-12-c5d16e0828.webp",
      width: 771,
      height: 1000,
      alt: "Confezione di Emile Pernot 1804 Pontarlier",
      position: "center",
    },
  },
  {
    slug: "eminente",
    name: "Eminente",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Eminente presenti nella selezione.",
    story:
      "La raccolta Eminente comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-eminente-10y-o-43-5-ct-6-new-a7c2c57a6f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-eminente-10y-o-43-5-ct-6-new-a7c2c57a6f.webp",
      width: 800,
      height: 1600,
      alt: "Confezione di Eminente 10Y.O.",
      position: "center",
    },
  },
  {
    slug: "engine-bio-42",
    name: "Engine BIO 42%",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Engine BIO 42% presenti nella selezione.",
    story:
      "La raccolta Engine BIO 42% comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-gin-engine-bio-42-1-liter-ct-6-9fef4bb289.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-gin-engine-bio-42-1-liter-ct-6-9fef4bb289.webp",
      width: 1024,
      height: 1024,
      alt: "Confezione di Engine BIO",
      position: "center",
    },
  },
  {
    slug: "enso",
    name: "Enso",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Enso presenti nella selezione.",
    story:
      "La raccolta Enso comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-japanese-whisky-enso-40-ct-6-c1e3ff605f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-japanese-whisky-enso-40-ct-6-c1e3ff605f.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Enso",
      position: "center",
    },
  },
  {
    slug: "equiano",
    name: "Equiano",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Equiano presenti nella selezione.",
    story:
      "La raccolta Equiano comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-equiano-light-43-ct-6-new-5abb56d58a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-equiano-light-43-ct-6-new-5abb56d58a.webp",
      width: 600,
      height: 900,
      alt: "Confezione di Equiano Light",
      position: "center",
    },
  },
  {
    slug: "eristoff",
    name: "Eristoff",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Eristoff presenti nella selezione.",
    story:
      "La raccolta Eristoff comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0200-vodka-eristoff-37-5-ct-24-vetro-01c923aa6f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0200-vodka-eristoff-37-5-ct-24-vetro-01c923aa6f.webp",
      width: 384,
      height: 1500,
      alt: "Confezione di Eristoff",
      position: "center",
    },
  },
  {
    slug: "etsu",
    name: "Etsu",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Etsu presenti nella selezione.",
    story:
      "La raccolta Etsu comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-etsu-japanese-43-ct-6-8ca414dda7.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-etsu-japanese-43-ct-6-8ca414dda7.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Etsu Japanese",
      position: "center",
    },
  },
  {
    slug: "evan-williams",
    name: "Evan Williams",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Evan Williams presenti nella selezione.",
    story:
      "La raccolta Evan Williams comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-bourbon-whiskey-evan-williams-black-43-ct-12-6c57cfca57.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-bourbon-whiskey-evan-williams-black-43-ct-12-6c57cfca57.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Evan Williams Black",
      position: "center",
    },
  },
  {
    slug: "ezra",
    name: "Ezra",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Ezra presenti nella selezione.",
    story:
      "La raccolta Ezra comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-bourbon-whiskey-ezra-brooks-black-label-40-5f929a61f2.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-bourbon-whiskey-ezra-brooks-black-label-40-5f929a61f2.webp",
      width: 900,
      height: 1200,
      alt: "Confezione di Ezra Brooks Black Label",
      position: "center",
    },
  },
  {
    slug: "fallen-angel",
    name: "Fallen Angel",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Fallen Angel presenti nella selezione.",
    story:
      "La raccolta Fallen Angel comprende gin, rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1500-gin-fallen-angel-blood-orange-40-6-magnum-811155949b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1500-gin-fallen-angel-blood-orange-40-6-magnum-811155949b.webp",
      width: 600,
      height: 600,
      alt: "Confezione di Fallen Angel Blood Orange",
      position: "center",
    },
  },
  {
    slug: "fifty-pounds",
    name: "Fifty Pounds",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Fifty Pounds presenti nella selezione.",
    story:
      "La raccolta Fifty Pounds comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-fifty-pounds-43-5-ct-6-e81ddc178b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-fifty-pounds-43-5-ct-6-e81ddc178b.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Fifty Pounds",
      position: "center",
    },
  },
  {
    slug: "filliers",
    name: "Filliers",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Filliers presenti nella selezione.",
    story:
      "La raccolta Filliers comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-gin-filliers-28-barrel-aged-43-7-ct-6-8fa65dd538.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-gin-filliers-28-barrel-aged-43-7-ct-6-8fa65dd538.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Filliers 28 Barrel Aged",
      position: "center",
    },
  },
  {
    slug: "finlaggan",
    name: "Finlaggan",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Finlaggan presenti nella selezione.",
    story:
      "La raccolta Finlaggan comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-finlaggan-cask-strength-58-gbox-ct--4625043634.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-finlaggan-cask-strength-58-gbox-ct--4625043634.webp",
      width: 609,
      height: 1138,
      alt: "Confezione di Finlaggan Cask Strength",
      position: "center",
    },
  },
  {
    slug: "finlandia",
    name: "Finlandia",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Finlandia presenti nella selezione.",
    story:
      "La raccolta Finlandia comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/12-0050-vodka-finlandia-40-miniatures-pet-ct-10-1196a2cc1d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/12-0050-vodka-finlandia-40-miniatures-pet-ct-10-1196a2cc1d.webp",
      width: 600,
      height: 600,
      alt: "Confezione di Finlandia",
      position: "center",
    },
  },
  {
    slug: "fireball-33",
    name: "Fireball 33%",
    country: null,
    productCount: 5,
    needsReview: false,
    description: "5 etichette Fireball 33% presenti nella selezione.",
    story:
      "La raccolta Fireball 33% comprende whisky e whiskey, liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-fireball-33-1-liter-whisky-cannella-ct-12-ba92067c09.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-fireball-33-1-liter-whisky-cannella-ct-12-ba92067c09.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Fireball",
      position: "center",
    },
  },
  {
    slug: "fireside",
    name: "Fireside",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Fireside presenti nella selezione.",
    story:
      "La raccolta Fireside comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-fireside-12-y-o-40-gbox-ct-6-new-00839b90c3.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-fireside-12-y-o-40-gbox-ct-6-new-00839b90c3.webp",
      width: 800,
      height: 960,
      alt: "Confezione di Fireside 12 Y.O.",
      position: "center",
    },
  },
  {
    slug: "five",
    name: "Five",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Five presenti nella selezione.",
    story:
      "La raccolta Five comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-five-farms-irish-cream-17-ct-9-new-cd148e3bc8.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-five-farms-irish-cream-17-ct-9-new-cd148e3bc8.webp",
      width: 502,
      height: 1500,
      alt: "Confezione di Five Farms Irish Cream",
      position: "center",
    },
  },
  {
    slug: "flor-de-cana",
    name: "Flor De Cana",
    country: null,
    productCount: 9,
    needsReview: false,
    description: "9 etichette Flor De Cana presenti nella selezione.",
    story:
      "La raccolta Flor De Cana comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-rum-flor-de-cana-4-y-o-40-ct-6-ae3db0e0e0.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-rum-flor-de-cana-4-y-o-40-ct-6-ae3db0e0e0.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Flor De Cana 4 Y.O.",
      position: "center",
    },
  },
  {
    slug: "four",
    name: "Four",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Four presenti nella selezione.",
    story:
      "La raccolta Four comprende gin, whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-four-pillars-bloody-shiraz-37-8-ct-6-5a93767359.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-four-pillars-bloody-shiraz-37-8-ct-6-5a93767359.webp",
      width: 1002,
      height: 1600,
      alt: "Confezione di Four Pillars Bloody Shiraz",
      position: "center",
    },
  },
  {
    slug: "foursquare",
    name: "Foursquare",
    country: null,
    productCount: 5,
    needsReview: false,
    description: "5 etichette Foursquare presenti nella selezione.",
    story:
      "La raccolta Foursquare comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-foursquare-barbados-spiced-37-5-ct-6-new-510285e46c.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-foursquare-barbados-spiced-37-5-ct-6-new-510285e46c.webp",
      width: 600,
      height: 849,
      alt: "Confezione di Foursquare Barbados Spiced",
      position: "center",
    },
  },
  {
    slug: "frangelico",
    name: "Frangelico",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Frangelico presenti nella selezione.",
    story:
      "La raccolta Frangelico comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-frangelico-20-litro-ct-12-new-df97cde67b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-frangelico-20-litro-ct-12-new-df97cde67b.webp",
      width: 960,
      height: 1280,
      alt: "Confezione di Frangelico",
      position: "center",
    },
  },
  {
    slug: "fred-jerbis",
    name: "Fred Jerbis",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Fred Jerbis presenti nella selezione.",
    story:
      "La raccolta Fred Jerbis comprende gin, amari, aperitivi disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-fred-jerbis-43-ct-6-24d52e7b57.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-fred-jerbis-43-ct-6-24d52e7b57.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Fred Jerbis",
      position: "center",
    },
  },
  {
    slug: "g-vine",
    name: "G'vine",
    country: null,
    productCount: 8,
    needsReview: false,
    description: "8 etichette G'vine presenti nella selezione.",
    story:
      "La raccolta G'vine comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-gin-g-vine-floraison-40-1-liter-ct-6-6c5f1ecc76.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-gin-g-vine-floraison-40-1-liter-ct-6-6c5f1ecc76.webp",
      width: 1000,
      height: 1500,
      alt: "Confezione di G'vine Floraison",
      position: "center",
    },
  },
  {
    slug: "galliano",
    name: "Galliano",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Galliano presenti nella selezione.",
    story:
      "La raccolta Galliano comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-galliano-42-3-ct-6-82988a68be.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-galliano-42-3-ct-6-82988a68be.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Galliano",
      position: "center",
    },
  },
  {
    slug: "gastro",
    name: "Gastro",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Gastro presenti nella selezione.",
    story:
      "La raccolta Gastro comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-gastro-gin-e-jonnie-45-ct-6-56a15c2aa0.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-gastro-gin-e-jonnie-45-ct-6-56a15c2aa0.webp",
      width: 800,
      height: 960,
      alt: "Confezione di Gastro Gin&jonnie",
      position: "center",
    },
  },
  {
    slug: "gecko",
    name: "Gecko",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Gecko presenti nella selezione.",
    story:
      "La raccolta Gecko comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-gecko-caramel-liqueur-27-ct-6-new-136c03d109.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-gecko-caramel-liqueur-27-ct-6-new-136c03d109.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Gecko Caramel Liqueur",
      position: "center",
    },
  },
  {
    slug: "generous",
    name: "Generous",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Generous presenti nella selezione.",
    story:
      "La raccolta Generous comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-generous-44-ct-6-31ea33e95b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-generous-44-ct-6-31ea33e95b.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Generous",
      position: "center",
    },
  },
  {
    slug: "george",
    name: "George",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta George presenti nella selezione.",
    story:
      "La raccolta George comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-whiskey-george-dickel-tabasco-40-1-liter-ct-12-d0227d48eb.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-whiskey-george-dickel-tabasco-40-1-liter-ct-12-d0227d48eb.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di George Dickel Tabasco",
      position: "center",
    },
  },
  {
    slug: "geranium",
    name: "Geranium",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Geranium presenti nella selezione.",
    story:
      "La raccolta Geranium comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-geranium-44-ct-6-85006e55d1.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-geranium-44-ct-6-85006e55d1.webp",
      width: 900,
      height: 1200,
      alt: "Confezione di Geranium",
      position: "center",
    },
  },
  {
    slug: "ginarte",
    name: "Ginarte",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Ginarte presenti nella selezione.",
    story:
      "La raccolta Ginarte comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-ginarte-dry-43-5-ct-6-3473b366cd.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-ginarte-dry-43-5-ct-6-3473b366cd.webp",
      width: 800,
      height: 1401,
      alt: "Confezione di Ginarte Dry",
      position: "center",
    },
  },
  {
    slug: "ginepraio",
    name: "Ginepraio",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Ginepraio presenti nella selezione.",
    story:
      "La raccolta Ginepraio comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-ginepraio-organic-tuscan-dry-bio-45-73216fe5b2.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-ginepraio-organic-tuscan-dry-bio-45-73216fe5b2.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Ginepraio Organic Tuscan Dry BIO",
      position: "center",
    },
  },
  {
    slug: "giniu",
    name: "Giniu",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Giniu presenti nella selezione.",
    story:
      "La raccolta Giniu comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-giniu-40-ct-4-sardo-in-wooden-box-9221267885.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-giniu-40-ct-4-sardo-in-wooden-box-9221267885.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Giniu",
      position: "center",
    },
  },
  {
    slug: "ginraw",
    name: "Ginraw",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Ginraw presenti nella selezione.",
    story:
      "La raccolta Ginraw comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-ginraw-42-3-ct-6-3a0e292fc6.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-ginraw-42-3-ct-6-3a0e292fc6.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Ginraw",
      position: "center",
    },
  },
  {
    slug: "glen",
    name: "Glen",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Glen presenti nella selezione.",
    story:
      "La raccolta Glen comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/gift-scotch-whisky-glen-grant-12yo-0-70-2-bicchieri-ct-816c4ed28f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/gift-scotch-whisky-glen-grant-12yo-0-70-2-bicchieri-ct-816c4ed28f.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Glen Grant 12YO 0.70 +2 Bicchieri",
      position: "center",
    },
  },
  {
    slug: "glendalough",
    name: "Glendalough",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Glendalough presenti nella selezione.",
    story:
      "La raccolta Glendalough comprende gin, whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-glendalough-rose-37-5-ct-6-2a8ac5e9e6.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-glendalough-rose-37-5-ct-6-2a8ac5e9e6.webp",
      width: 700,
      height: 770,
      alt: "Confezione di Glendalough Rose",
      position: "center",
    },
  },
  {
    slug: "glenfarclas",
    name: "Glenfarclas",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Glenfarclas presenti nella selezione.",
    story:
      "La raccolta Glenfarclas comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-glenfarclas-15-y-o-46-gbox-ct-6-new-09160f4d81.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-glenfarclas-15-y-o-46-gbox-ct-6-new-09160f4d81.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Glenfarclas 15 Y.O.",
      position: "center",
    },
  },
  {
    slug: "glenfiddich",
    name: "Glenfiddich",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Glenfiddich presenti nella selezione.",
    story:
      "La raccolta Glenfiddich comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-scotch-whisky-glenfiddich-12-y-o-40-gb-ct-6-c1259cb85b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-scotch-whisky-glenfiddich-12-y-o-40-gb-ct-6-c1259cb85b.webp",
      width: 600,
      height: 600,
      alt: "Confezione di Glenfiddich 12 Y.O.",
      position: "center",
    },
  },
  {
    slug: "glengoyne",
    name: "Glengoyne",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Glengoyne presenti nella selezione.",
    story:
      "La raccolta Glengoyne comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-glengoyne-12-yo-43-gbox-ct-6-new-a9a9b0ac0b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-glengoyne-12-yo-43-gbox-ct-6-new-a9a9b0ac0b.webp",
      width: 800,
      height: 1553,
      alt: "Confezione di Glengoyne 12 Y.O.",
      position: "center",
    },
  },
  {
    slug: "glenkinchie",
    name: "Glenkinchie",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Glenkinchie presenti nella selezione.",
    story:
      "La raccolta Glenkinchie comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-glenkinchie-12-y-o-43-ct-6-14ab7e30d4.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-glenkinchie-12-y-o-43-ct-6-14ab7e30d4.webp",
      width: 880,
      height: 1600,
      alt: "Confezione di Glenkinchie 12 Y.O.",
      position: "center",
    },
  },
  {
    slug: "glenlivet",
    name: "Glenlivet",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Glenlivet presenti nella selezione.",
    story:
      "La raccolta Glenlivet comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/03-0200-scotch-whisky-glenlivet-tasting-experience-ct--74038561ae.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/03-0200-scotch-whisky-glenlivet-tasting-experience-ct--74038561ae.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Glenlivet Tasting Experience",
      position: "center",
    },
  },
  {
    slug: "glenmorangie",
    name: "Glenmorangie",
    country: null,
    productCount: 9,
    needsReview: false,
    description: "9 etichette Glenmorangie presenti nella selezione.",
    story:
      "La raccolta Glenmorangie comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-glenmorangie-12-y-o-palo-cortado-46-ec6ca6e95a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-glenmorangie-12-y-o-palo-cortado-46-ec6ca6e95a.webp",
      width: 600,
      height: 800,
      alt: "Confezione di Glenmorangie 12 Y.O. Palo Cortado",
      position: "center",
    },
  },
  {
    slug: "goa",
    name: "Goa",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Goa presenti nella selezione.",
    story:
      "La raccolta Goa comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-goa-43-ct-6-d8b595e87f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-goa-43-ct-6-d8b595e87f.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Goa",
      position: "center",
    },
  },
  {
    slug: "gold",
    name: "Gold",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Gold presenti nella selezione.",
    story:
      "La raccolta Gold comprende gin, whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-gin-gold-999-9-40-ct-6-989d337509.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-gin-gold-999-9-40-ct-6-989d337509.webp",
      width: 800,
      height: 1600,
      alt: "Confezione di Gold 999,9",
      position: "center",
    },
  },
  {
    slug: "goldwasser",
    name: "Goldwasser",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Goldwasser presenti nella selezione.",
    story:
      "La raccolta Goldwasser comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-liquore-goldwasser-38-ct-6-0d2f94e7cb.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-liquore-goldwasser-38-ct-6-0d2f94e7cb.webp",
      width: 1080,
      height: 1080,
      alt: "Confezione di Goldwasser",
      position: "center",
    },
  },
  {
    slug: "gordon",
    name: "Gordon",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Gordon presenti nella selezione.",
    story:
      "La raccolta Gordon comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/12-0050-gin-gordon-37-5-miniatures-pet-ct-16-bb9b9d9335.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/12-0050-gin-gordon-37-5-miniatures-pet-ct-16-bb9b9d9335.webp",
      width: 1000,
      height: 1600,
      alt: "Confezione di Gordon",
      position: "center",
    },
  },
  {
    slug: "gordon-s",
    name: "Gordon's",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Gordon's presenti nella selezione.",
    story:
      "La raccolta Gordon's comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-gordon-s-pink-37-5-ct-6-338e1723d4.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-gordon-s-pink-37-5-ct-6-338e1723d4.webp",
      width: 1162,
      height: 1600,
      alt: "Confezione di Gordon's Pink",
      position: "center",
    },
  },
  {
    slug: "gosling",
    name: "Gosling",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Gosling presenti nella selezione.",
    story:
      "La raccolta Gosling comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/10-0050-rum-gosling-black-seal-40-miniatures-ct-12-new-df38a80e3f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/10-0050-rum-gosling-black-seal-40-miniatures-ct-12-new-df38a80e3f.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Gosling Black Seal",
      position: "center",
    },
  },
  {
    slug: "gosling-s",
    name: "Gosling's",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Gosling's presenti nella selezione.",
    story:
      "La raccolta Gosling's comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-gosling-s-black-seal-151-proof-75-5-ct-6-585f008ee5.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-gosling-s-black-seal-151-proof-75-5-ct-6-585f008ee5.webp",
      width: 493,
      height: 1600,
      alt: "Confezione di Gosling's Black Seal 151 Proof",
      position: "center",
    },
  },
  {
    slug: "goslings",
    name: "Goslings",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Goslings presenti nella selezione.",
    story:
      "La raccolta Goslings comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-rum-goslings-black-seal-40-1-liter-ct-6-8c8cd2c538.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-rum-goslings-black-seal-40-1-liter-ct-6-8c8cd2c538.webp",
      width: 440,
      height: 1600,
      alt: "Confezione di Goslings Black Seal",
      position: "center",
    },
  },
  {
    slug: "gouden",
    name: "Gouden",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Gouden presenti nella selezione.",
    story:
      "La raccolta Gouden comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-whiskey-gouden-carolus-single-malt-46-36385cf5a6.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-whiskey-gouden-carolus-single-malt-46-36385cf5a6.webp",
      width: 800,
      height: 798,
      alt: "Confezione di Gouden Carolus Single Malt",
      position: "center",
    },
  },
  {
    slug: "gran-duca-d-alba",
    name: "Gran Duca D'alba",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Gran Duca D'alba presenti nella selezione.",
    story:
      "La raccolta Gran Duca D'alba comprende brandy e altri distillati disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-brandy-gran-duca-d-alba-40-ct-6-75c2add9d7.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-brandy-gran-duca-d-alba-40-ct-6-75c2add9d7.webp",
      width: 800,
      height: 916,
      alt: "Confezione di Gran Duca D'alba",
      position: "center",
    },
  },
  {
    slug: "grand",
    name: "Grand",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Grand presenti nella selezione.",
    story:
      "La raccolta Grand comprende rum e rhum, whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-grand-kadoo-3-yo-40-ct-6-bbbd38173d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-grand-kadoo-3-yo-40-ct-6-bbbd38173d.webp",
      width: 516,
      height: 1600,
      alt: "Confezione di Grand Kadoo 3 Y.O.",
      position: "center",
    },
  },
  {
    slug: "granit",
    name: "Granit",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Granit presenti nella selezione.",
    story:
      "La raccolta Granit comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-granit-bavarian-bio-42-ct-6-ca7d5d243e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-granit-bavarian-bio-42-ct-6-ca7d5d243e.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Granit Bavarian BIO",
      position: "center",
    },
  },
  {
    slug: "green-spot",
    name: "Green Spot",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Green Spot presenti nella selezione.",
    story:
      "La raccolta Green Spot comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-irish-whiskey-green-spot-40-gb-ct-6-e82e14c90d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-irish-whiskey-green-spot-40-gb-ct-6-e82e14c90d.webp",
      width: 800,
      height: 1389,
      alt: "Confezione di Green Spot",
      position: "center",
    },
  },
  {
    slug: "greenals",
    name: "Greenals",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Greenals presenti nella selezione.",
    story:
      "La raccolta Greenals comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-greenals-37-5-ct-6-2b1730af4d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-greenals-37-5-ct-6-2b1730af4d.webp",
      width: 1144,
      height: 1600,
      alt: "Confezione di Greenals",
      position: "center",
    },
  },
  {
    slug: "grey-goose",
    name: "Grey Goose",
    country: null,
    productCount: 8,
    needsReview: false,
    description: "8 etichette Grey Goose presenti nella selezione.",
    story:
      "La raccolta Grey Goose comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/6000-vodka-grey-goose-40-a5ae939f39.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/6000-vodka-grey-goose-40-a5ae939f39.webp",
      width: 750,
      height: 750,
      alt: "Confezione di Grey Goose",
      position: "center",
    },
  },
  {
    slug: "gusano",
    name: "Gusano",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Gusano presenti nella selezione.",
    story:
      "La raccolta Gusano comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-mezcal-gusano-rojo-38-2f321f01da.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-mezcal-gusano-rojo-38-2f321f01da.webp",
      width: 434,
      height: 1600,
      alt: "Confezione di Gusano Rojo",
      position: "center",
    },
  },
  {
    slug: "haku",
    name: "Haku",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Haku presenti nella selezione.",
    story:
      "La raccolta Haku comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-haku-40-ct-6-fca3dcaf8d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-haku-40-ct-6-fca3dcaf8d.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Haku",
      position: "center",
    },
  },
  {
    slug: "hapusa",
    name: "Hapusa",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Hapusa presenti nella selezione.",
    story:
      "La raccolta Hapusa comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-hapusa-himalayan-dry-43-ct-6-85a3be7fcc.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-hapusa-himalayan-dry-43-ct-6-85a3be7fcc.webp",
      width: 1100,
      height: 1600,
      alt: "Confezione di Hapusa Himalayan Dry",
      position: "center",
    },
  },
  {
    slug: "harahorn",
    name: "Harahorn",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Harahorn presenti nella selezione.",
    story:
      "La raccolta Harahorn comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-gin-harahorn-pink-40-ct-6-c86035a26d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-gin-harahorn-pink-40-ct-6-c86035a26d.webp",
      width: 502,
      height: 1024,
      alt: "Confezione di Harahorn Pink",
      position: "center",
    },
  },
  {
    slug: "hastings",
    name: "Hastings",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Hastings presenti nella selezione.",
    story:
      "La raccolta Hastings comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-hastings-1066-london-40-ct-6-25d96c99b4.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-hastings-1066-london-40-ct-6-25d96c99b4.webp",
      width: 431,
      height: 1000,
      alt: "Confezione di Hastings 1066 London",
      position: "center",
    },
  },
  {
    slug: "haswell",
    name: "Haswell",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Haswell presenti nella selezione.",
    story:
      "La raccolta Haswell comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-haswell-47-ct-6-1487d11348.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-haswell-47-ct-6-1487d11348.webp",
      width: 700,
      height: 700,
      alt: "Confezione di Haswell",
      position: "center",
    },
  },
  {
    slug: "hatozaki",
    name: "Hatozaki",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Hatozaki presenti nella selezione.",
    story:
      "La raccolta Hatozaki comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-japanese-whisky-hatozaki-blended-40-ct-6-73989395de.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-japanese-whisky-hatozaki-blended-40-ct-6-73989395de.webp",
      width: 468,
      height: 1000,
      alt: "Confezione di Hatozaki Blended",
      position: "center",
    },
  },
  {
    slug: "havana-club",
    name: "Havana Club",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Havana Club presenti nella selezione.",
    story:
      "La raccolta Havana Club comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-havana-club-seleccion-de-maestros-45-ct-6-new-20240562dc.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-havana-club-seleccion-de-maestros-45-ct-6-new-20240562dc.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Havana Club Seleccion De Maestros",
      position: "center",
    },
  },
  {
    slug: "hayman-s",
    name: "Hayman's",
    country: null,
    productCount: 10,
    needsReview: false,
    description: "10 etichette Hayman's presenti nella selezione.",
    story:
      "La raccolta Hayman's comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-hayman-s-exotic-citrus-41-1-ct-6-b604b0e9e9.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-hayman-s-exotic-citrus-41-1-ct-6-b604b0e9e9.webp",
      width: 905,
      height: 1600,
      alt: "Confezione di Hayman's Exotic Citrus",
      position: "center",
    },
  },
  {
    slug: "haymans",
    name: "Haymans",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Haymans presenti nella selezione.",
    story:
      "La raccolta Haymans comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-haymans-clementine-23kt-gold-20-ct-6-9af9edabed.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-haymans-clementine-23kt-gold-20-ct-6-9af9edabed.webp",
      width: 800,
      height: 1000,
      alt: "Confezione di Haymans Clementine 23KT Gold",
      position: "center",
    },
  },
  {
    slug: "heaven",
    name: "Heaven",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Heaven presenti nella selezione.",
    story:
      "La raccolta Heaven comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-bourbon-whiskey-heaven-hill-40-ct-12-24e425dc97.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-bourbon-whiskey-heaven-hill-40-ct-12-24e425dc97.webp",
      width: 1160,
      height: 1425,
      alt: "Confezione di Heaven Hill",
      position: "center",
    },
  },
  {
    slug: "hendrick-s",
    name: "Hendrick's",
    country: null,
    productCount: 15,
    needsReview: false,
    description: "15 etichette Hendrick's presenti nella selezione.",
    story:
      "La raccolta Hendrick's comprende gin, liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-hendrick-s-ct-6-e0926c3089.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-hendrick-s-ct-6-e0926c3089.webp",
      width: 1024,
      height: 1024,
      alt: "Confezione di Hendrick's",
      position: "center",
    },
  },
  {
    slug: "hendricks",
    name: "Hendricks",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Hendricks presenti nella selezione.",
    story:
      "La raccolta Hendricks comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-hendricks-flora-adora-43-4-ct-6-a677085440.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-hendricks-flora-adora-43-4-ct-6-a677085440.webp",
      width: 778,
      height: 1600,
      alt: "Confezione di Hendricks Flora Adora",
      position: "center",
    },
  },
  {
    slug: "hennessy-vs-40",
    name: "Hennessy VS 40%",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Hennessy VS 40% presenti nella selezione.",
    story:
      "La raccolta Hennessy VS 40% comprende cognac disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/12-0050-cognac-hennessy-vs-40-ct-10-new-a3f4f497f9.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/12-0050-cognac-hennessy-vs-40-ct-10-new-a3f4f497f9.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Hennessy VS",
      position: "center",
    },
  },
  {
    slug: "henri",
    name: "Henri",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Henri presenti nella selezione.",
    story:
      "La raccolta Henri comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-henri-bardouin-pastis-45-ct-6-6d9a27bbc3.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-henri-bardouin-pastis-45-ct-6-6d9a27bbc3.webp",
      width: 1068,
      height: 1580,
      alt: "Confezione di Henri Bardouin Pastis",
      position: "center",
    },
  },
  {
    slug: "heritage",
    name: "Heritage",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Heritage presenti nella selezione.",
    story:
      "La raccolta Heritage comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-american-whiskey-heritage-40-ct-6-73ade48e0e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-american-whiskey-heritage-40-ct-6-73ade48e0e.webp",
      width: 360,
      height: 514,
      alt: "Confezione di Heritage",
      position: "center",
    },
  },
  {
    slug: "herno",
    name: "Herno",
    country: null,
    productCount: 5,
    needsReview: false,
    description: "5 etichette Herno presenti nella selezione.",
    story:
      "La raccolta Herno comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-gin-herno-blackcurrant-bio-28-ct-6-276bc227bf.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-gin-herno-blackcurrant-bio-28-ct-6-276bc227bf.webp",
      width: 271,
      height: 520,
      alt: "Confezione di Herno Blackcurrant BIO",
      position: "center",
    },
  },
  {
    slug: "hierbas-mari-mayans",
    name: "Hierbas Mari Mayans",
    country: null,
    productCount: 9,
    needsReview: false,
    description: "9 etichette Hierbas Mari Mayans presenti nella selezione.",
    story:
      "La raccolta Hierbas Mari Mayans comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-hierbas-mari-mayans-black-edition-26-litr-96f4ae71aa.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-hierbas-mari-mayans-black-edition-26-litr-96f4ae71aa.webp",
      width: 600,
      height: 600,
      alt: "Confezione di Hierbas Mari Mayans Black Edition",
      position: "center",
    },
  },
  {
    slug: "high",
    name: "High",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta High presenti nella selezione.",
    story:
      "La raccolta High comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-bourbon-whiskey-high-west-american-prairie-reserv-641189b2eb.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-bourbon-whiskey-high-west-american-prairie-reserv-641189b2eb.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di High West American Prairie Reserve",
      position: "center",
    },
  },
  {
    slug: "highland-park",
    name: "Highland Park",
    country: null,
    productCount: 5,
    needsReview: false,
    description: "5 etichette Highland Park presenti nella selezione.",
    story:
      "La raccolta Highland Park comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-highland-park-10-y-o-40-gb-ct-6-831784cc55.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-highland-park-10-y-o-40-gb-ct-6-831784cc55.webp",
      width: 1067,
      height: 1600,
      alt: "Confezione di Highland Park 10 Y.O.",
      position: "center",
    },
  },
  {
    slug: "hills-e-harbour",
    name: "Hills & Harbour",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Hills & Harbour presenti nella selezione.",
    story:
      "La raccolta Hills & Harbour comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-hills-e-harbour-40-ct-6-fd9f65be66.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-hills-e-harbour-40-ct-6-fd9f65be66.webp",
      width: 360,
      height: 511,
      alt: "Confezione di Hills & Harbour",
      position: "center",
    },
  },
  {
    slug: "holywatergin",
    name: "Holywatergin",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Holywatergin presenti nella selezione.",
    story:
      "La raccolta Holywatergin comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-gin-holywatergin-42-5-ct-6-new-449f924329.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-gin-holywatergin-42-5-ct-6-new-449f924329.webp",
      width: 1080,
      height: 1080,
      alt: "Confezione di Holywatergin",
      position: "center",
    },
  },
  {
    slug: "hussong-s",
    name: "Hussong's",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Hussong's presenti nella selezione.",
    story:
      "La raccolta Hussong's comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-tequila-hussong-s-anejo-40-ct-6-new-d5c4f5da53.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-tequila-hussong-s-anejo-40-ct-6-new-d5c4f5da53.webp",
      width: 1080,
      height: 1080,
      alt: "Confezione di Hussong's Anejo",
      position: "center",
    },
  },
  {
    slug: "hyde",
    name: "Hyde",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Hyde presenti nella selezione.",
    story:
      "La raccolta Hyde comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-irish-whiskey-hyde-no-3-1916-bourbon-cask-46-new-ba56df296a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-irish-whiskey-hyde-no-3-1916-bourbon-cask-46-new-ba56df296a.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Hyde No.3 1916 Bourbon Cask",
      position: "center",
    },
  },
  {
    slug: "i",
    name: "I",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta I presenti nella selezione.",
    story:
      "La raccolta I comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-assenzio-i-fiori-del-mare-verde-65-ct-6-new-007d64b68a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-assenzio-i-fiori-del-mare-verde-65-ct-6-new-007d64b68a.webp",
      width: 892,
      height: 1482,
      alt: "Confezione di I Fiori Del Mare Verde",
      position: "center",
    },
  },
  {
    slug: "ilegal",
    name: "Ilegal",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Ilegal presenti nella selezione.",
    story:
      "La raccolta Ilegal comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-mezcal-ilegal-anejo-40-ct-6-50cf849700.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-mezcal-ilegal-anejo-40-ct-6-50cf849700.webp",
      width: 450,
      height: 675,
      alt: "Confezione di Ilegal Anejo",
      position: "center",
    },
  },
  {
    slug: "impavid",
    name: "Impavid",
    country: null,
    productCount: 2,
    needsReview: true,
    description: "2 etichette Impavid presenti nella selezione.",
    story:
      "La raccolta Impavid comprende vodka, gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-impavid-luxury-40-gbox-ct-6-440ad6e9fc.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-impavid-luxury-40-gbox-ct-6-440ad6e9fc.webp",
      width: 504,
      height: 800,
      alt: "Confezione di Impavid Luxury",
      position: "center",
    },
  },
  {
    slug: "inchmurrin",
    name: "Inchmurrin",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Inchmurrin presenti nella selezione.",
    story:
      "La raccolta Inchmurrin comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-inchmurrin-12-y-o-loch-lomond-46-gb-659a46e445.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-inchmurrin-12-y-o-loch-lomond-46-gb-659a46e445.webp",
      width: 769,
      height: 1600,
      alt: "Confezione di Inchmurrin 12 Y.O. Loch Lomond",
      position: "center",
    },
  },
  {
    slug: "irish-mist-honey-35",
    name: "Irish Mist Honey 35%",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Irish Mist Honey 35% presenti nella selezione.",
    story:
      "La raccolta Irish Mist Honey 35% comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-irish-mist-honey-35-litro-2a856dce8b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-irish-mist-honey-35-litro-2a856dce8b.webp",
      width: 1080,
      height: 1080,
      alt: "Confezione di Irish Mist Honey",
      position: "center",
    },
  },
  {
    slug: "isle",
    name: "Isle",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Isle presenti nella selezione.",
    story:
      "La raccolta Isle comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-isle-of-harris-45-ct-6-c0d703ca63.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-isle-of-harris-45-ct-6-c0d703ca63.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Isle Of Harris",
      position: "center",
    },
  },
  {
    slug: "istriana",
    name: "Istriana",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Istriana presenti nella selezione.",
    story:
      "La raccolta Istriana comprende brandy e altri distillati disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0200-brandy-istriana-36-vetro-ct-24-f05e76241d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0200-brandy-istriana-36-vetro-ct-24-f05e76241d.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Istriana",
      position: "center",
    },
  },
  {
    slug: "italian-malt-whisky-puni",
    name: "Italian Malt Whisky Puni",
    country: null,
    productCount: 4,
    needsReview: false,
    description:
      "4 etichette Italian Malt Whisky Puni presenti nella selezione.",
    story:
      "La raccolta Italian Malt Whisky Puni comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-italian-malt-whisky-puni-4-y-o-batch-1-47-3-gb-ct-8ea5b5e115.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-italian-malt-whisky-puni-4-y-o-batch-1-47-3-gb-ct-8ea5b5e115.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Italian Malt Whisky Puni 4 Y.O. Batch 1",
      position: "center",
    },
  },
  {
    slug: "italicus",
    name: "Italicus",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Italicus presenti nella selezione.",
    story:
      "La raccolta Italicus comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-italicus-20-ct-6-new-a5ae7daddb.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-italicus-20-ct-6-new-a5ae7daddb.webp",
      width: 452,
      height: 584,
      alt: "Confezione di Italicus",
      position: "center",
    },
  },
  {
    slug: "j-e-b-40",
    name: "J & B 40%",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette J & B 40% presenti nella selezione.",
    story:
      "La raccolta J & B 40% comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/12-0050-scotch-whisky-j-e-b-40-miniatures-pet-ct-10-b6d5a644cc.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/12-0050-scotch-whisky-j-e-b-40-miniatures-pet-ct-10-b6d5a644cc.webp",
      width: 1010,
      height: 1600,
      alt: "Confezione di J & B",
      position: "center",
    },
  },
  {
    slug: "j-m",
    name: "J.m",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette J.m presenti nella selezione.",
    story:
      "La raccolta J.m comprende rum e rhum, liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-j-m-2008-15y-o-42-4-gb-ct-6-new-67e90634ab.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-j-m-2008-15y-o-42-4-gb-ct-6-new-67e90634ab.webp",
      width: 841,
      height: 1200,
      alt: "Confezione di J.m 2008 15Y.O.",
      position: "center",
    },
  },
  {
    slug: "jack-daniel-s",
    name: "Jack Daniel's",
    country: null,
    productCount: 45,
    needsReview: false,
    description: "45 etichette Jack Daniel's presenti nella selezione.",
    story:
      "La raccolta Jack Daniel's comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/10-0050-whiskey-jack-daniel-s-40-miniatures-pet-ct-12-e4e7609411.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/10-0050-whiskey-jack-daniel-s-40-miniatures-pet-ct-12-e4e7609411.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Jack Daniel's",
      position: "center",
    },
  },
  {
    slug: "jagermeister",
    name: "Jagermeister",
    country: null,
    productCount: 14,
    needsReview: false,
    description: "14 etichette Jagermeister presenti nella selezione.",
    story:
      "La raccolta Jagermeister comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/3000-liquore-jagermeister-35-3-liters-604f25aca5.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/3000-liquore-jagermeister-35-3-liters-604f25aca5.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Jagermeister",
      position: "center",
    },
  },
  {
    slug: "jameson",
    name: "Jameson",
    country: null,
    productCount: 11,
    needsReview: false,
    description: "11 etichette Jameson presenti nella selezione.",
    story:
      "La raccolta Jameson comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/12-0050-irish-whiskey-jameson-40-miniatures-vetro-ct-1-f0ec2ce5cb.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/12-0050-irish-whiskey-jameson-40-miniatures-vetro-ct-1-f0ec2ce5cb.webp",
      width: 300,
      height: 540,
      alt: "Confezione di Jameson",
      position: "center",
    },
  },
  {
    slug: "janneau-grand-armagnac",
    name: "Janneau Grand Armagnac",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Janneau Grand Armagnac presenti nella selezione.",
    story:
      "La raccolta Janneau Grand Armagnac comprende armagnac disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-janneau-grand-armagnac-25yo-43-ct-6-7f8587586e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-janneau-grand-armagnac-25yo-43-ct-6-7f8587586e.webp",
      width: 1200,
      height: 1500,
      alt: "Confezione di Janneau Grand Armagnac 25YO",
      position: "center",
    },
  },
  {
    slug: "japanese-whiskey",
    name: "Japanese Whiskey",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Japanese Whiskey presenti nella selezione.",
    story:
      "La raccolta Japanese Whiskey comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/gift-japanese-whiskey-akashi-meisei-0-50-40-2-bicchier-f0bce8f6a1.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/gift-japanese-whiskey-akashi-meisei-0-50-40-2-bicchier-f0bce8f6a1.webp",
      width: 900,
      height: 800,
      alt: "Confezione di Japanese Whiskey Akashi Meisei 0.50",
      position: "center",
    },
  },
  {
    slug: "jawbox",
    name: "Jawbox",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Jawbox presenti nella selezione.",
    story:
      "La raccolta Jawbox comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-jawbox-dry-of-belfast-43-ct-6-04eb666972.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-jawbox-dry-of-belfast-43-ct-6-04eb666972.webp",
      width: 800,
      height: 960,
      alt: "Confezione di Jawbox Dry Of Belfast",
      position: "center",
    },
  },
  {
    slug: "jefferson-amaro-importante-30",
    name: "Jefferson Amaro Importante 30%",
    country: null,
    productCount: 2,
    needsReview: false,
    description:
      "2 etichette Jefferson Amaro Importante 30% presenti nella selezione.",
    story:
      "La raccolta Jefferson Amaro Importante 30% comprende amari disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-jefferson-amaro-importante-30-ct-6-bb95e3020b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-jefferson-amaro-importante-30-ct-6-bb95e3020b.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Jefferson Amaro Importante",
      position: "center",
    },
  },
  {
    slug: "jefferson-s",
    name: "Jefferson's",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Jefferson's presenti nella selezione.",
    story:
      "La raccolta Jefferson's comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-bourbon-whiskey-jefferson-s-reserve-45-1-ct-6-9d82e1da41.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-bourbon-whiskey-jefferson-s-reserve-45-1-ct-6-9d82e1da41.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Jefferson's Reserve",
      position: "center",
    },
  },
  {
    slug: "jim-beam",
    name: "Jim Beam",
    country: null,
    productCount: 13,
    needsReview: false,
    description: "13 etichette Jim Beam presenti nella selezione.",
    story:
      "La raccolta Jim Beam comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/10-0050-bourbon-whiskey-jim-beam-40-miniatures-pet-ct--22b7c07c29.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/10-0050-bourbon-whiskey-jim-beam-40-miniatures-pet-ct--22b7c07c29.webp",
      width: 1000,
      height: 1500,
      alt: "Confezione di Jim Beam",
      position: "center",
    },
  },
  {
    slug: "jodhpur",
    name: "Jodhpur",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Jodhpur presenti nella selezione.",
    story:
      "La raccolta Jodhpur comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-jodhpur-43-ct-4bt-9e5de42824.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-jodhpur-43-ct-4bt-9e5de42824.webp",
      width: 642,
      height: 1600,
      alt: "Confezione di Jodhpur",
      position: "center",
    },
  },
  {
    slug: "john",
    name: "John",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta John presenti nella selezione.",
    story:
      "La raccolta John comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-bourbon-whiskey-john-medley-s-rich-e-mild-40-1-li-6fcd6b4028.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-bourbon-whiskey-john-medley-s-rich-e-mild-40-1-li-6fcd6b4028.webp",
      width: 907,
      height: 1210,
      alt: "Confezione di John Medley's Rich & MILD",
      position: "center",
    },
  },
  {
    slug: "johnnie-walker",
    name: "Johnnie Walker",
    country: null,
    productCount: 19,
    needsReview: false,
    description: "19 etichette Johnnie Walker presenti nella selezione.",
    story:
      "La raccolta Johnnie Walker comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/12-0050-scotch-whisky-johnnie-walker-black-12-y-o-40-m-6297bf7c99.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/12-0050-scotch-whisky-johnnie-walker-black-12-y-o-40-m-6297bf7c99.webp",
      width: 373,
      height: 1500,
      alt: "Confezione di Johnnie Walker Black 12 Y.O.",
      position: "center",
    },
  },
  {
    slug: "johnny",
    name: "Johnny",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Johnny presenti nella selezione.",
    story:
      "La raccolta Johnny comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-bourbon-whiskey-johnny-drum-private-stock-50-5-ct-b3baa230ec.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-bourbon-whiskey-johnny-drum-private-stock-50-5-ct-b3baa230ec.webp",
      width: 800,
      height: 1193,
      alt: "Confezione di Johnny Drum Private Stock",
      position: "center",
    },
  },
  {
    slug: "jrose",
    name: "Jrose",
    country: null,
    productCount: 11,
    needsReview: false,
    description: "11 etichette Jrose presenti nella selezione.",
    story:
      "La raccolta Jrose comprende gin, tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-jrose-flamenco-43-ct-6-e10005d831.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-jrose-flamenco-43-ct-6-e10005d831.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Jrose Flamenco",
      position: "center",
    },
  },
  {
    slug: "jura",
    name: "Jura",
    country: null,
    productCount: 5,
    needsReview: false,
    description: "5 etichette Jura presenti nella selezione.",
    story:
      "La raccolta Jura comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-jura-10-y-o-40-ct-6-925814ec05.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-jura-10-y-o-40-ct-6-925814ec05.webp",
      width: 1013,
      height: 1350,
      alt: "Confezione di Jura 10 Y.O.",
      position: "center",
    },
  },
  {
    slug: "kah",
    name: "Kah",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Kah presenti nella selezione.",
    story:
      "La raccolta Kah comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-tequila-kah-anejo-100-agave-40-ct-6-ee380d3e84.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-tequila-kah-anejo-100-agave-40-ct-6-ee380d3e84.webp",
      width: 900,
      height: 1200,
      alt: "Confezione di Kah Anejo",
      position: "center",
    },
  },
  {
    slug: "kahlua",
    name: "Kahlua",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Kahlua presenti nella selezione.",
    story:
      "La raccolta Kahlua comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-kahlua-16-litro-new-ct-6-caba9a5981.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-kahlua-16-litro-new-ct-6-caba9a5981.webp",
      width: 1200,
      height: 1600,
      alt: "Confezione di Kahlua",
      position: "center",
    },
  },
  {
    slug: "kaiza",
    name: "Kaiza",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Kaiza presenti nella selezione.",
    story:
      "La raccolta Kaiza comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-gin-kaiza-5-43-ct-6-207d6dc3c6.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-gin-kaiza-5-43-ct-6-207d6dc3c6.webp",
      width: 500,
      height: 500,
      alt: "Confezione di Kaiza 5",
      position: "center",
    },
  },
  {
    slug: "kamiki",
    name: "Kamiki",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Kamiki presenti nella selezione.",
    story:
      "La raccolta Kamiki comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-japanese-whisky-kamiki-48-gbox-ct-6-bf6d101e18.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-japanese-whisky-kamiki-48-gbox-ct-6-bf6d101e18.webp",
      width: 1024,
      height: 1024,
      alt: "Confezione di Kamiki",
      position: "center",
    },
  },
  {
    slug: "kapriol",
    name: "Kapriol",
    country: null,
    productCount: 12,
    needsReview: false,
    description: "12 etichette Kapriol presenti nella selezione.",
    story:
      "La raccolta Kapriol comprende gin, liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-kapriol-arancia-e-pesca-40-7-02ad774ebb.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-kapriol-arancia-e-pesca-40-7-02ad774ebb.webp",
      width: 600,
      height: 730,
      alt: "Confezione di Kapriol Arancia & Pesca",
      position: "center",
    },
  },
  {
    slug: "karlsson-s",
    name: "Karlsson's",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Karlsson's presenti nella selezione.",
    story:
      "La raccolta Karlsson's comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-karlsson-s-gold-40-cb4686bc8b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-karlsson-s-gold-40-cb4686bc8b.webp",
      width: 260,
      height: 280,
      alt: "Confezione di Karlsson's Gold",
      position: "center",
    },
  },
  {
    slug: "ketel",
    name: "Ketel",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Ketel presenti nella selezione.",
    story:
      "La raccolta Ketel comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-ketel-one-40-d45bd3f62b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-ketel-one-40-d45bd3f62b.webp",
      width: 900,
      height: 900,
      alt: "Confezione di Ketel One",
      position: "center",
    },
  },
  {
    slug: "ketel-one-40",
    name: "Ketel One 40%",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Ketel One 40% presenti nella selezione.",
    story:
      "La raccolta Ketel One 40% comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/4500-vodka-ketel-one-40-ct-1-new-8583843bc7.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/4500-vodka-ketel-one-40-ct-1-new-8583843bc7.webp",
      width: 394,
      height: 1600,
      alt: "Confezione di Ketel One",
      position: "center",
    },
  },
  {
    slug: "ki-no",
    name: "Ki No",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Ki No presenti nella selezione.",
    story:
      "La raccolta Ki No comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-ki-no-bi-sei-kyoto-dry-54-5-gbox-ct-6-f07be11473.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-ki-no-bi-sei-kyoto-dry-54-5-gbox-ct-6-f07be11473.webp",
      width: 937,
      height: 1600,
      alt: "Confezione di Ki No Bi *sei* Kyoto Dry",
      position: "center",
    },
  },
  {
    slug: "kilchoman",
    name: "Kilchoman",
    country: null,
    productCount: 9,
    needsReview: false,
    description: "9 etichette Kilchoman presenti nella selezione.",
    story:
      "La raccolta Kilchoman comprende liquori, whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-liquore-kilchoman-bramble-liqueur-19-ct-12-5986bbbef5.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-liquore-kilchoman-bramble-liqueur-19-ct-12-5986bbbef5.webp",
      width: 600,
      height: 800,
      alt: "Confezione di Kilchoman Bramble Liqueur",
      position: "center",
    },
  },
  {
    slug: "kinahan-s",
    name: "Kinahan's",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Kinahan's presenti nella selezione.",
    story:
      "La raccolta Kinahan's comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-irish-whiskey-kinahan-s-10-y-o-single-malt-46-new-d997c7f0e6.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-irish-whiskey-kinahan-s-10-y-o-single-malt-46-new-d997c7f0e6.webp",
      width: 898,
      height: 1600,
      alt: "Confezione di Kinahan's 10 Y.O. Single Malt",
      position: "center",
    },
  },
  {
    slug: "kinobai",
    name: "Kinobai",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Kinobai presenti nella selezione.",
    story:
      "La raccolta Kinobai comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-kinobai-plum-and-berry-29-5-gbox-ct-6-c5d2a445df.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-kinobai-plum-and-berry-29-5-gbox-ct-6-c5d2a445df.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Kinobai Plum And Berry",
      position: "center",
    },
  },
  {
    slug: "knappogue-castle",
    name: "Knappogue Castle",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Knappogue Castle presenti nella selezione.",
    story:
      "La raccolta Knappogue Castle comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-irish-whiskey-knappogue-castle-12yo-40-gb-ct-6-dad741e10e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-irish-whiskey-knappogue-castle-12yo-40-gb-ct-6-dad741e10e.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Knappogue Castle 12YO",
      position: "center",
    },
  },
  {
    slug: "knob",
    name: "Knob",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Knob presenti nella selezione.",
    story:
      "La raccolta Knob comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-bourbon-whiskey-knob-creek-50-ct-6-865547c126.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-bourbon-whiskey-knob-creek-50-ct-6-865547c126.webp",
      width: 499,
      height: 666,
      alt: "Confezione di Knob Creek",
      position: "center",
    },
  },
  {
    slug: "knockando",
    name: "Knockando",
    country: null,
    productCount: 5,
    needsReview: false,
    description: "5 etichette Knockando presenti nella selezione.",
    story:
      "La raccolta Knockando comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-knockando-12-y-o-season-43-ct-6-da29812d2d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-knockando-12-y-o-season-43-ct-6-da29812d2d.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Knockando 12 Y.O. Season",
      position: "center",
    },
  },
  {
    slug: "knut-hansen",
    name: "Knut Hansen",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Knut Hansen presenti nella selezione.",
    story:
      "La raccolta Knut Hansen comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1500-gin-knut-hansen-42-ct-1-0cc0c03c0a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1500-gin-knut-hansen-42-ct-1-0cc0c03c0a.webp",
      width: 1080,
      height: 1080,
      alt: "Confezione di Knut Hansen",
      position: "center",
    },
  },
  {
    slug: "komos",
    name: "Komos",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Komos presenti nella selezione.",
    story:
      "La raccolta Komos comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-tequila-komos-anejo-cristalino-40-ct-6-new-db80ebd8d9.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-tequila-komos-anejo-cristalino-40-ct-6-new-db80ebd8d9.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Komos Anejo Cristalino",
      position: "center",
    },
  },
  {
    slug: "kong",
    name: "Kong",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Kong presenti nella selezione.",
    story:
      "La raccolta Kong comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-kong-40-ceramic-gb-ct-4-d3df1ab091.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-kong-40-ceramic-gb-ct-4-d3df1ab091.webp",
      width: 835,
      height: 777,
      alt: "Confezione di Kong",
      position: "center",
    },
  },
  {
    slug: "koskenkorva-40",
    name: "Koskenkorva 40%",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Koskenkorva 40% presenti nella selezione.",
    story:
      "La raccolta Koskenkorva 40% comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-vodka-koskenkorva-40-1-liter-ct-12-new-7253a8f750.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-vodka-koskenkorva-40-1-liter-ct-12-new-7253a8f750.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Koskenkorva",
      position: "center",
    },
  },
  {
    slug: "koval",
    name: "Koval",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Koval presenti nella selezione.",
    story:
      "La raccolta Koval comprende gin, whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-gin-koval-barreled-47-ct-6-1af4dbd09c.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-gin-koval-barreled-47-ct-6-1af4dbd09c.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Koval Barreled",
      position: "center",
    },
  },
  {
    slug: "kraken",
    name: "Kraken",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Kraken presenti nella selezione.",
    story:
      "La raccolta Kraken comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-kraken-black-spiced-40-ct-6-3fe0f08db2.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-kraken-black-spiced-40-ct-6-3fe0f08db2.webp",
      width: 536,
      height: 1500,
      alt: "Confezione di Kraken Black Spiced",
      position: "center",
    },
  },
  {
    slug: "kujira",
    name: "Kujira",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Kujira presenti nella selezione.",
    story:
      "La raccolta Kujira comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-japanese-whisky-kujira-10yo-ryukyu-43-ct-6-new-84cee3f888.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-japanese-whisky-kujira-10yo-ryukyu-43-ct-6-new-84cee3f888.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Kujira 10YO Ryukyu",
      position: "center",
    },
  },
  {
    slug: "kultu",
    name: "Kultu",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Kultu presenti nella selezione.",
    story:
      "La raccolta Kultu comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-kultu-ginja-18-ct-6-new-f865b5ce11.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-kultu-ginja-18-ct-6-new-f865b5ce11.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Kultu Ginja",
      position: "center",
    },
  },
  {
    slug: "la",
    name: "La",
    country: null,
    productCount: 15,
    needsReview: false,
    description: "15 etichette La presenti nella selezione.",
    story:
      "La raccolta La comprende vodka, rum e rhum, liquori, amari, tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-la-vodka-luxury-40-italiano-ct-6-new-7c0bf77366.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-la-vodka-luxury-40-italiano-ct-6-new-7c0bf77366.webp",
      width: 472,
      height: 472,
      alt: "Confezione di La Vodka Luxury",
      position: "center",
    },
  },
  {
    slug: "lagavulin",
    name: "Lagavulin",
    country: null,
    productCount: 5,
    needsReview: false,
    description: "5 etichette Lagavulin presenti nella selezione.",
    story:
      "La raccolta Lagavulin comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-lagavulin-8-y-o-48-gb-ct-6-7a69c42777.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-lagavulin-8-y-o-48-gb-ct-6-7a69c42777.webp",
      width: 800,
      height: 1429,
      alt: "Confezione di Lagavulin 8 Y.O.",
      position: "center",
    },
  },
  {
    slug: "lamaro",
    name: "Lamaro",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Lamaro presenti nella selezione.",
    story:
      "La raccolta Lamaro comprende amari disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-lamaro-caffe-e-menta-luxury-25-amaro-ital-0e38e38dff.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-lamaro-caffe-e-menta-luxury-25-amaro-ital-0e38e38dff.webp",
      width: 480,
      height: 480,
      alt: "Confezione di Lamaro Caffe' E Menta Luxury",
      position: "center",
    },
  },
  {
    slug: "laphroaig",
    name: "Laphroaig",
    country: null,
    productCount: 8,
    needsReview: false,
    description: "8 etichette Laphroaig presenti nella selezione.",
    story:
      "La raccolta Laphroaig comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-laphroaig-10-y-o-40-ct-6-83556d19f3.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-laphroaig-10-y-o-40-ct-6-83556d19f3.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Laphroaig 10 Y.O.",
      position: "center",
    },
  },
  {
    slug: "larceny",
    name: "Larceny",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Larceny presenti nella selezione.",
    story:
      "La raccolta Larceny comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-bourbon-whiskey-larceny-92-proof-46-05b2bf3a3f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-bourbon-whiskey-larceny-92-proof-46-05b2bf3a3f.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Larceny 92 Proof",
      position: "center",
    },
  },
  {
    slug: "larios",
    name: "Larios",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Larios presenti nella selezione.",
    story:
      "La raccolta Larios comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-gin-larios-dry-37-5-ct-6-new-f71298bd56.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-gin-larios-dry-37-5-ct-6-new-f71298bd56.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Larios Dry",
      position: "center",
    },
  },
  {
    slug: "latin",
    name: "Latin",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Latin presenti nella selezione.",
    story:
      "La raccolta Latin comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-latin-beach-41-ct-6-new-5ebe0d8203.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-latin-beach-41-ct-6-new-5ebe0d8203.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Latin Beach",
      position: "center",
    },
  },
  {
    slug: "latte-di-suocera",
    name: "Latte DI Suocera",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Latte DI Suocera presenti nella selezione.",
    story:
      "La raccolta Latte DI Suocera comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-latte-di-suocera-dannata-25-ct-6-new-160e495f19.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-latte-di-suocera-dannata-25-ct-6-new-160e495f19.webp",
      width: 1200,
      height: 1370,
      alt: "Confezione di Latte DI Suocera Dannata",
      position: "center",
    },
  },
  {
    slug: "le",
    name: "Le",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Le presenti nella selezione.",
    story:
      "La raccolta Le comprende gin, tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-le-gin-de-christian-drouin-42-ct-6-473a1820d7.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-le-gin-de-christian-drouin-42-ct-6-473a1820d7.webp",
      width: 480,
      height: 638,
      alt: "Confezione di Le Gin De Christian Drouin",
      position: "center",
    },
  },
  {
    slug: "legendario",
    name: "Legendario",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Legendario presenti nella selezione.",
    story:
      "La raccolta Legendario comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-legendario-anejo-9-y-o-40-ct-6-dc38d03f46.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-legendario-anejo-9-y-o-40-ct-6-dc38d03f46.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Legendario Anejo 9 Y.O.",
      position: "center",
    },
  },
  {
    slug: "lepanto",
    name: "Lepanto",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Lepanto presenti nella selezione.",
    story:
      "La raccolta Lepanto comprende brandy e altri distillati disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-brandy-lepanto-o-v-36-ct-3-eff339e4bf.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-brandy-lepanto-o-v-36-ct-3-eff339e4bf.webp",
      width: 800,
      height: 960,
      alt: "Confezione di Lepanto O.v.",
      position: "center",
    },
  },
  {
    slug: "licor-43-original-31",
    name: "Licor 43 Original 31%",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Licor 43 Original 31% presenti nella selezione.",
    story:
      "La raccolta Licor 43 Original 31% comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-licor-43-original-31-1-liter-ct-12-5635031aaf.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-licor-43-original-31-1-liter-ct-12-5635031aaf.webp",
      width: 486,
      height: 1500,
      alt: "Confezione di Licor 43 Original",
      position: "center",
    },
  },
  {
    slug: "lillet",
    name: "Lillet",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Lillet presenti nella selezione.",
    story:
      "La raccolta Lillet comprende vermouth disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0750-vermouth-lillet-bianco-17-ct-6-d41762a9b9.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0750-vermouth-lillet-bianco-17-ct-6-d41762a9b9.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Lillet Bianco",
      position: "center",
    },
  },
  {
    slug: "limoncello",
    name: "Limoncello",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Limoncello presenti nella selezione.",
    story:
      "La raccolta Limoncello comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-limoncello-di-capri-30-ct-6-new-adb49cafac.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-limoncello-di-capri-30-ct-6-new-adb49cafac.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Limoncello DI Capri",
      position: "center",
    },
  },
  {
    slug: "limoncino",
    name: "Limoncino",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Limoncino presenti nella selezione.",
    story:
      "La raccolta Limoncino comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-limoncino-portofino-30-ct-6-2d20038492.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-limoncino-portofino-30-ct-6-2d20038492.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Limoncino Portofino",
      position: "center",
    },
  },
  {
    slug: "lind-e-lime",
    name: "Lind & Lime",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Lind & Lime presenti nella selezione.",
    story:
      "La raccolta Lind & Lime comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-lind-e-lime-44-ct-6-b97dbfe3b4.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-lind-e-lime-44-ct-6-b97dbfe3b4.webp",
      width: 960,
      height: 1320,
      alt: "Confezione di Lind & Lime",
      position: "center",
    },
  },
  {
    slug: "liq",
    name: "Liq.",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Liq. presenti nella selezione.",
    story:
      "La raccolta Liq. comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/30-0030-liq-ciemme-limoncello-miniature-34-vetro-ct-8-afdfc7606e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/30-0030-liq-ciemme-limoncello-miniature-34-vetro-ct-8-afdfc7606e.webp",
      width: 1200,
      height: 1600,
      alt: "Confezione di Liq. Ciemme Limoncello Miniature",
      position: "center",
    },
  },
  {
    slug: "london",
    name: "London",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette London presenti nella selezione.",
    story:
      "La raccolta London comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-gin-london-hill-dry-43-liter-ct-12-7a1313bc2d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-gin-london-hill-dry-43-liter-ct-12-7a1313bc2d.webp",
      width: 960,
      height: 1280,
      alt: "Confezione di London Hill Dry",
      position: "center",
    },
  },
  {
    slug: "louers",
    name: "Louers",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Louers presenti nella selezione.",
    story:
      "La raccolta Louers comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-vodka-louers-40-with-light-ct-4-27f2e07013.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-vodka-louers-40-with-light-ct-4-27f2e07013.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Louers",
      position: "center",
    },
  },
  {
    slug: "lupulus",
    name: "Lupulus",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Lupulus presenti nella selezione.",
    story:
      "La raccolta Lupulus comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-gin-lupulus-40-ct-6-2a688291d8.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-gin-lupulus-40-ct-6-2a688291d8.webp",
      width: 1024,
      height: 706,
      alt: "Confezione di Lupulus",
      position: "center",
    },
  },
  {
    slug: "macaronesian",
    name: "Macaronesian",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Macaronesian presenti nella selezione.",
    story:
      "La raccolta Macaronesian comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-macaronesian-37-5-ct-6-e9c8ab4487.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-macaronesian-37-5-ct-6-e9c8ab4487.webp",
      width: 602,
      height: 1600,
      alt: "Confezione di Macaronesian",
      position: "center",
    },
  },
  {
    slug: "magellan",
    name: "Magellan",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Magellan presenti nella selezione.",
    story:
      "La raccolta Magellan comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-magellan-blue-44-ct-6-f7484beebd.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-magellan-blue-44-ct-6-f7484beebd.webp",
      width: 600,
      height: 900,
      alt: "Confezione di Magellan Blue",
      position: "center",
    },
  },
  {
    slug: "major",
    name: "Major",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Major presenti nella selezione.",
    story:
      "La raccolta Major comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-major-47-italiano-capsula-rossa-ct-6-4be653c2bd.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-major-47-italiano-capsula-rossa-ct-6-4be653c2bd.webp",
      width: 1200,
      height: 800,
      alt: "Confezione di Major",
      position: "center",
    },
  },
  {
    slug: "makarov",
    name: "Makarov",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Makarov presenti nella selezione.",
    story:
      "La raccolta Makarov comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0100-vodka-makarov-pistola-absolut-standard-38-gb-ct-6-48a8fd7265.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0100-vodka-makarov-pistola-absolut-standard-38-gb-ct-6-48a8fd7265.webp",
      width: 600,
      height: 900,
      alt: "Confezione di Makarov Pistola Absolut Standard",
      position: "center",
    },
  },
  {
    slug: "maker-s",
    name: "Maker's",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Maker's presenti nella selezione.",
    story:
      "La raccolta Maker's comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-bourbon-whiskey-maker-s-46-barrel-finished-47-a40aab7312.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-bourbon-whiskey-maker-s-46-barrel-finished-47-a40aab7312.webp",
      width: 900,
      height: 1200,
      alt: "Confezione di Maker's 46 Barrel Finished",
      position: "center",
    },
  },
  {
    slug: "malfy",
    name: "Malfy",
    country: null,
    productCount: 14,
    needsReview: false,
    description: "14 etichette Malfy presenti nella selezione.",
    story:
      "La raccolta Malfy comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-gin-malfy-arancia-41-ct-6-38101ac8fe.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-gin-malfy-arancia-41-ct-6-38101ac8fe.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Malfy Arancia",
      position: "center",
    },
  },
  {
    slug: "malibu",
    name: "Malibu",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Malibu presenti nella selezione.",
    story:
      "La raccolta Malibu comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-malibu-black-35-bfa3549c9e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-malibu-black-35-bfa3549c9e.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Malibu Black",
      position: "center",
    },
  },
  {
    slug: "mamont",
    name: "Mamont",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Mamont presenti nella selezione.",
    story:
      "La raccolta Mamont comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-mamont-40-ct-6-6565b4c69e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-mamont-40-ct-6-6565b4c69e.webp",
      width: 902,
      height: 1172,
      alt: "Confezione di Mamont",
      position: "center",
    },
  },
  {
    slug: "mandarine",
    name: "Mandarine",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Mandarine presenti nella selezione.",
    story:
      "La raccolta Mandarine comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-mandarine-napolen-38-ct-6-ab2339b1c2.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-mandarine-napolen-38-ct-6-ab2339b1c2.webp",
      width: 387,
      height: 1600,
      alt: "Confezione di Mandarine Napolen",
      position: "center",
    },
  },
  {
    slug: "mangaroca",
    name: "Mangaroca",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Mangaroca presenti nella selezione.",
    story:
      "La raccolta Mangaroca comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-mangaroca-batida-de-coco-16-liter-ct-6-ne-76ba94aab8.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-mangaroca-batida-de-coco-16-liter-ct-6-ne-76ba94aab8.webp",
      width: 620,
      height: 930,
      alt: "Confezione di Mangaroca Batida De Coco",
      position: "center",
    },
  },
  {
    slug: "mansinthe",
    name: "Mansinthe",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Mansinthe presenti nella selezione.",
    story:
      "La raccolta Mansinthe comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-assenzio-mansinthe-66-6-ct-6-c40e7669eb.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-assenzio-mansinthe-66-6-ct-6-c40e7669eb.webp",
      width: 180,
      height: 879,
      alt: "Confezione di Mansinthe",
      position: "center",
    },
  },
  {
    slug: "mare",
    name: "Mare",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Mare presenti nella selezione.",
    story:
      "La raccolta Mare comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-gin-mare-42-7-1-liter-ct-6-e1491fb001.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-gin-mare-42-7-1-liter-ct-6-e1491fb001.webp",
      width: 989,
      height: 1600,
      alt: "Confezione di Mare",
      position: "center",
    },
  },
  {
    slug: "mars",
    name: "Mars",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Mars presenti nella selezione.",
    story:
      "La raccolta Mars comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-japanese-whisky-mars-kasei-40-gbox-ct-6-76c8279612.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-japanese-whisky-mars-kasei-40-gbox-ct-6-76c8279612.webp",
      width: 1131,
      height: 1600,
      alt: "Confezione di Mars Kasei",
      position: "center",
    },
  },
  {
    slug: "martell",
    name: "Martell",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Martell presenti nella selezione.",
    story:
      "La raccolta Martell comprende cognac disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-cognac-martell-xo-40-gbox-ct-3-f092d85ea8.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-cognac-martell-xo-40-gbox-ct-3-f092d85ea8.webp",
      width: 565,
      height: 800,
      alt: "Confezione di Martell XO",
      position: "center",
    },
  },
  {
    slug: "martin",
    name: "Martin",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Martin presenti nella selezione.",
    story:
      "La raccolta Martin comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-gin-martin-miller-s-40-1-liter-ct-6-4bb512aa2b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-gin-martin-miller-s-40-1-liter-ct-6-4bb512aa2b.webp",
      width: 1080,
      height: 1080,
      alt: "Confezione di Martin Miller's",
      position: "center",
    },
  },
  {
    slug: "martini",
    name: "Martini",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Martini presenti nella selezione.",
    story:
      "La raccolta Martini comprende vermouth disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/12-0060-vermouth-martini-bianco-15-miniatures-vetro-ct-8ce11bad76.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/12-0060-vermouth-martini-bianco-15-miniatures-vetro-ct-8ce11bad76.webp",
      width: 900,
      height: 900,
      alt: "Confezione di Martini Bianco",
      position: "center",
    },
  },
  {
    slug: "matusalem",
    name: "Matusalem",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Matusalem presenti nella selezione.",
    story:
      "La raccolta Matusalem comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-matusalem-7-y-o-40-ct-6-24ac6b4cc5.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-matusalem-7-y-o-40-ct-6-24ac6b4cc5.webp",
      width: 450,
      height: 675,
      alt: "Confezione di Matusalem 7 Y.O.",
      position: "center",
    },
  },
  {
    slug: "mayfair",
    name: "Mayfair",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Mayfair presenti nella selezione.",
    story:
      "La raccolta Mayfair comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-mayfair-40-ct-6-9b59914163.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-mayfair-40-ct-6-9b59914163.webp",
      width: 669,
      height: 1600,
      alt: "Confezione di Mayfair",
      position: "center",
    },
  },
  {
    slug: "mcqueen",
    name: "Mcqueen",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Mcqueen presenti nella selezione.",
    story:
      "La raccolta Mcqueen comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-mcqueen-violet-fog-40-ct-6-036d4bc4cb.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-mcqueen-violet-fog-40-ct-6-036d4bc4cb.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Mcqueen Violet Fog",
      position: "center",
    },
  },
  {
    slug: "mermaid",
    name: "Mermaid",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Mermaid presenti nella selezione.",
    story:
      "La raccolta Mermaid comprende vodka, gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-mermaid-salt-vodka-40-ct-6-38b3610cdb.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-mermaid-salt-vodka-40-ct-6-38b3610cdb.webp",
      width: 333,
      height: 1024,
      alt: "Confezione di Mermaid Salt Vodka",
      position: "center",
    },
  },
  {
    slug: "metaxa",
    name: "Metaxa",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Metaxa presenti nella selezione.",
    story:
      "La raccolta Metaxa comprende brandy e altri distillati disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/12-0050-brandy-metaxa-5-stars-38-miniatures-vetro-ct-6-a3ea4a504e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/12-0050-brandy-metaxa-5-stars-38-miniatures-vetro-ct-6-a3ea4a504e.webp",
      width: 445,
      height: 1600,
      alt: "Confezione di Metaxa 5 Stars",
      position: "center",
    },
  },
  {
    slug: "meukow",
    name: "Meukow",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Meukow presenti nella selezione.",
    story:
      "La raccolta Meukow comprende cognac disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/12-0050-cognac-meukow-vs-40-pet-ct-14-910278bd0f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/12-0050-cognac-meukow-vs-40-pet-ct-14-910278bd0f.webp",
      width: 678,
      height: 800,
      alt: "Confezione di Meukow VS",
      position: "center",
    },
  },
  {
    slug: "mg",
    name: "Mg",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Mg presenti nella selezione.",
    story:
      "La raccolta Mg comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-mg-classico-40-ct-6-new-937d90c0e4.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-mg-classico-40-ct-6-new-937d90c0e4.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Mg Classico",
      position: "center",
    },
  },
  {
    slug: "michter-s",
    name: "Michter's",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Michter's presenti nella selezione.",
    story:
      "La raccolta Michter's comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-bourbon-whiskey-michter-s-small-batch-45-7-gbox-c-8a4f94c7a5.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-bourbon-whiskey-michter-s-small-batch-45-7-gbox-c-8a4f94c7a5.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Michter's Small Batch",
      position: "center",
    },
  },
  {
    slug: "midleton",
    name: "Midleton",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Midleton presenti nella selezione.",
    story:
      "La raccolta Midleton comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-irish-whiskey-midleton-barry-crocket-legacy-46-ct-580e8657e2.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-irish-whiskey-midleton-barry-crocket-legacy-46-ct-580e8657e2.webp",
      width: 607,
      height: 1600,
      alt: "Confezione di Midleton Barry Crocket Legacy",
      position: "center",
    },
  },
  {
    slug: "midori",
    name: "Midori",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Midori presenti nella selezione.",
    story:
      "La raccolta Midori comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-midori-20-liter-crt-12-509c033596.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-midori-20-liter-crt-12-509c033596.webp",
      width: 727,
      height: 800,
      alt: "Confezione di Midori",
      position: "center",
    },
  },
  {
    slug: "millonario",
    name: "Millonario",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Millonario presenti nella selezione.",
    story:
      "La raccolta Millonario comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-millonario-10-anniversario-reserva-40-ct-6-253afb5c52.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-millonario-10-anniversario-reserva-40-ct-6-253afb5c52.webp",
      width: 463,
      height: 703,
      alt: "Confezione di Millonario 10 Anniversario Reserva",
      position: "center",
    },
  },
  {
    slug: "mintis",
    name: "Mintis",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Mintis presenti nella selezione.",
    story:
      "La raccolta Mintis comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-mintis-originale-41-8-new-2aff2e20a9.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-mintis-originale-41-8-new-2aff2e20a9.webp",
      width: 1016,
      height: 1600,
      alt: "Confezione di Mintis Originale",
      position: "center",
    },
  },
  {
    slug: "miracielo",
    name: "Miracielo",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Miracielo presenti nella selezione.",
    story:
      "La raccolta Miracielo comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-miracielo-reserva-especial-38-ct-6-e2c7a38db8.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-miracielo-reserva-especial-38-ct-6-e2c7a38db8.webp",
      width: 603,
      height: 1600,
      alt: "Confezione di Miracielo Reserva Especial",
      position: "center",
    },
  },
  {
    slug: "mirto-di-sardegna",
    name: "Mirto DI Sardegna",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Mirto DI Sardegna presenti nella selezione.",
    story:
      "La raccolta Mirto DI Sardegna comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-mirto-di-sardegna-zedda-piras-32-ct-6-385a639bf7.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-mirto-di-sardegna-zedda-piras-32-ct-6-385a639bf7.webp",
      width: 400,
      height: 600,
      alt: "Confezione di Mirto DI Sardegna Zedda Piras",
      position: "center",
    },
  },
  {
    slug: "molinari",
    name: "Molinari",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Molinari presenti nella selezione.",
    story:
      "La raccolta Molinari comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/25-0030-liquore-molinari-42-miniatures-pet-76b49b9445.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/25-0030-liquore-molinari-42-miniatures-pet-76b49b9445.webp",
      width: 1029,
      height: 850,
      alt: "Confezione di Molinari",
      position: "center",
    },
  },
  {
    slug: "mom",
    name: "Mom",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Mom presenti nella selezione.",
    story:
      "La raccolta Mom comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-gin-mom-39-5-1-liter-crt-6-f7a3defa8f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-gin-mom-39-5-1-liter-crt-6-f7a3defa8f.webp",
      width: 620,
      height: 930,
      alt: "Confezione di Mom",
      position: "center",
    },
  },
  {
    slug: "mombasa",
    name: "Mombasa",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Mombasa presenti nella selezione.",
    story:
      "La raccolta Mombasa comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-mombasa-colonel-s-reserve-43-5-ct-6-27ed698f8e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-mombasa-colonel-s-reserve-43-5-ct-6-27ed698f8e.webp",
      width: 818,
      height: 1000,
      alt: "Confezione di Mombasa Colonel's Reserve",
      position: "center",
    },
  },
  {
    slug: "monkai",
    name: "Monkai",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Monkai presenti nella selezione.",
    story:
      "La raccolta Monkai comprende tequila e mezcal, rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-monkai-agave-33-ct-6-new-768f94fa3e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-monkai-agave-33-ct-6-new-768f94fa3e.webp",
      width: 1000,
      height: 1600,
      alt: "Confezione di Monkai Agave",
      position: "center",
    },
  },
  {
    slug: "monkey",
    name: "Monkey",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Monkey presenti nella selezione.",
    story:
      "La raccolta Monkey comprende gin, whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-gin-monkey-47-dry-47-ct-6-6d900136f5.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-gin-monkey-47-dry-47-ct-6-6d900136f5.webp",
      width: 736,
      height: 1600,
      alt: "Confezione di Monkey 47 Dry",
      position: "center",
    },
  },
  {
    slug: "monte",
    name: "Monte",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Monte presenti nella selezione.",
    story:
      "La raccolta Monte comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-mezcal-monte-alban-40-ct-6-new-39f379ea01.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-mezcal-monte-alban-40-ct-6-new-39f379ea01.webp",
      width: 1200,
      height: 1600,
      alt: "Confezione di Monte Alban",
      position: "center",
    },
  },
  {
    slug: "mortlach",
    name: "Mortlach",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Mortlach presenti nella selezione.",
    story:
      "La raccolta Mortlach comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-mortlach-12-y-o-43-4-gbox-ct-6-e0e1e5bef9.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-mortlach-12-y-o-43-4-gbox-ct-6-e0e1e5bef9.webp",
      width: 440,
      height: 672,
      alt: "Confezione di Mortlach 12 Y.O.",
      position: "center",
    },
  },
  {
    slug: "moskovskaya",
    name: "Moskovskaya",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Moskovskaya presenti nella selezione.",
    story:
      "La raccolta Moskovskaya comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-vodka-moskovskaya-38-1-liter-ct-12-2f183c0a88.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-vodka-moskovskaya-38-1-liter-ct-12-2f183c0a88.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Moskovskaya",
      position: "center",
    },
  },
  {
    slug: "mount-gay",
    name: "Mount Gay",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Mount Gay presenti nella selezione.",
    story:
      "La raccolta Mount Gay comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-rum-mount-gay-eclipse-gold-40-ct-12-f3ee407ae7.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-rum-mount-gay-eclipse-gold-40-ct-12-f3ee407ae7.webp",
      width: 998,
      height: 1000,
      alt: "Confezione di Mount Gay Eclipse Gold",
      position: "center",
    },
  },
  {
    slug: "myers-s",
    name: "Myers's",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Myers's presenti nella selezione.",
    story:
      "La raccolta Myers's comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-rum-myers-s-original-dark-40-ct-12-a0c6181482.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-rum-myers-s-original-dark-40-ct-12-a0c6181482.webp",
      width: 765,
      height: 1600,
      alt: "Confezione di Myers's Original Dark",
      position: "center",
    },
  },
  {
    slug: "n-3",
    name: "N.3",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta N.3 presenti nella selezione.",
    story:
      "La raccolta N.3 comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-n-3-london-dry-46-ct-6-66f7adf764.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-n-3-london-dry-46-ct-6-66f7adf764.webp",
      width: 1024,
      height: 1024,
      alt: "Confezione di N.3 London Dry",
      position: "center",
    },
  },
  {
    slug: "naga",
    name: "Naga",
    country: null,
    productCount: 5,
    needsReview: false,
    description: "5 etichette Naga presenti nella selezione.",
    story:
      "La raccolta Naga comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-naga-anggur-edition-red-wine-cask-gbox-40-crt-9098847958.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-naga-anggur-edition-red-wine-cask-gbox-40-crt-9098847958.webp",
      width: 1026,
      height: 1600,
      alt: "Confezione di Naga Anggur Edition Red Wine Cask",
      position: "center",
    },
  },
  {
    slug: "nardini",
    name: "Nardini",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Nardini presenti nella selezione.",
    story:
      "La raccolta Nardini comprende grappe, liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/01-0050-grappa-nardini-riserva-3cl-50-vetro-21c34dbc81.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/01-0050-grappa-nardini-riserva-3cl-50-vetro-21c34dbc81.webp",
      width: 405,
      height: 1600,
      alt: "Confezione di Nardini Riserva 3CL",
      position: "center",
    },
  },
  {
    slug: "navy-island-jamaica",
    name: "Navy Island Jamaica",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Navy Island Jamaica presenti nella selezione.",
    story:
      "La raccolta Navy Island Jamaica comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-navy-island-jamaica-10-y-o-51-2-gbox-ct-6-2c4ee76a75.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-navy-island-jamaica-10-y-o-51-2-gbox-ct-6-2c4ee76a75.webp",
      width: 880,
      height: 1120,
      alt: "Confezione di Navy Island Jamaica 10 Y.O.",
      position: "center",
    },
  },
  {
    slug: "nikka",
    name: "Nikka",
    country: null,
    productCount: 16,
    needsReview: false,
    description: "16 etichette Nikka presenti nella selezione.",
    story:
      "La raccolta Nikka comprende vodka, gin, whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-nikka-coffey-40-73d5c526fc.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-nikka-coffey-40-73d5c526fc.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Nikka Coffey",
      position: "center",
    },
  },
  {
    slug: "noah-s",
    name: "Noah's",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Noah's presenti nella selezione.",
    story:
      "La raccolta Noah's comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-bourbon-whiskey-noah-s-mill-57-15-b1008dd16b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-bourbon-whiskey-noah-s-mill-57-15-b1008dd16b.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Noah's MILL",
      position: "center",
    },
  },
  {
    slug: "noilly-prat",
    name: "Noilly Prat",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Noilly Prat presenti nella selezione.",
    story:
      "La raccolta Noilly Prat comprende vermouth disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0750-vermouth-noilly-prat-ambre-16-5dc8ed5736.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0750-vermouth-noilly-prat-ambre-16-5dc8ed5736.webp",
      width: 393,
      height: 1600,
      alt: "Confezione di Noilly Prat Ambre'",
      position: "center",
    },
  },
  {
    slug: "nolet-s",
    name: "Nolet's",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Nolet's presenti nella selezione.",
    story:
      "La raccolta Nolet's comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-nolet-s-silver-dry-47-6-ct-4-db75f05cac.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-nolet-s-silver-dry-47-6-ct-4-db75f05cac.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Nolet's Silver Dry",
      position: "center",
    },
  },
  {
    slug: "nordes",
    name: "Nordes",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Nordes presenti nella selezione.",
    story:
      "La raccolta Nordes comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-gin-nordes-40-1-liter-ct-6-01ae73c495.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-gin-nordes-40-1-liter-ct-6-01ae73c495.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Nordes",
      position: "center",
    },
  },
  {
    slug: "nordesia",
    name: "Nordesia",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Nordesia presenti nella selezione.",
    story:
      "La raccolta Nordesia comprende vermouth disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0750-vermouth-nordesia-bianco-16-a72c899411.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0750-vermouth-nordesia-bianco-16-a72c899411.webp",
      width: 600,
      height: 600,
      alt: "Confezione di Nordesia Bianco",
      position: "center",
    },
  },
  {
    slug: "oban",
    name: "Oban",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Oban presenti nella selezione.",
    story:
      "La raccolta Oban comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-oban-14-years-43-gbox-ct-6-cec38df62f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-oban-14-years-43-gbox-ct-6-cec38df62f.webp",
      width: 900,
      height: 900,
      alt: "Confezione di Oban 14 Years",
      position: "center",
    },
  },
  {
    slug: "ocho",
    name: "Ocho",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Ocho presenti nella selezione.",
    story:
      "La raccolta Ocho comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-tequila-ocho-anejo-widow-jane-48-ct-6-new-74a8eb92d6.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-tequila-ocho-anejo-widow-jane-48-ct-6-new-74a8eb92d6.webp",
      width: 452,
      height: 452,
      alt: "Confezione di Ocho Anejo Widow Jane",
      position: "center",
    },
  },
  {
    slug: "octomore",
    name: "Octomore",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Octomore presenti nella selezione.",
    story:
      "La raccolta Octomore comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-octomore-10-3-61-3-gb-ct-6-d956d7749b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-octomore-10-3-61-3-gb-ct-6-d956d7749b.webp",
      width: 470,
      height: 470,
      alt: "Confezione di Octomore 10.3",
      position: "center",
    },
  },
  {
    slug: "okinawa-recipe",
    name: "Okinawa Recipe",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Okinawa Recipe presenti nella selezione.",
    story:
      "La raccolta Okinawa Recipe comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-okinawa-recipe-01-47-blue-label-ct-6-japanese-f326a27ab1.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-okinawa-recipe-01-47-blue-label-ct-6-japanese-f326a27ab1.webp",
      width: 230,
      height: 600,
      alt: "Confezione di Okinawa Recipe 01",
      position: "center",
    },
  },
  {
    slug: "old",
    name: "Old",
    country: null,
    productCount: 8,
    needsReview: false,
    description: "8 etichette Old presenti nella selezione.",
    story:
      "La raccolta Old comprende gin, rum e rhum, whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-old-english-44-ct-6-cb986ca6d9.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-old-english-44-ct-6-cb986ca6d9.webp",
      width: 500,
      height: 500,
      alt: "Confezione di Old English",
      position: "center",
    },
  },
  {
    slug: "one",
    name: "One",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta One presenti nella selezione.",
    story:
      "La raccolta One comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-one-key-40-ct-6-14e2e9aff9.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-one-key-40-ct-6-14e2e9aff9.webp",
      width: 1067,
      height: 1600,
      alt: "Confezione di One Key",
      position: "center",
    },
  },
  {
    slug: "ophyum",
    name: "Ophyum",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Ophyum presenti nella selezione.",
    story:
      "La raccolta Ophyum comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-ophyum-12-y-o-40-gbox-ct-6-e217c58b4b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-ophyum-12-y-o-40-gbox-ct-6-e217c58b4b.webp",
      width: 1200,
      height: 1038,
      alt: "Confezione di Ophyum 12 Y.O.",
      position: "center",
    },
  },
  {
    slug: "opihr-oriental-spiced",
    name: "Opihr Oriental Spiced",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Opihr Oriental Spiced presenti nella selezione.",
    story:
      "La raccolta Opihr Oriental Spiced comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-opihr-oriental-spiced-40-ct-6-9a078acd1b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-opihr-oriental-spiced-40-ct-6-9a078acd1b.webp",
      width: 1024,
      height: 1024,
      alt: "Confezione di Opihr Oriental Spiced",
      position: "center",
    },
  },
  {
    slug: "opthimus",
    name: "Opthimus",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Opthimus presenti nella selezione.",
    story:
      "La raccolta Opthimus comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-opthimus-15-y-o-38-gbox-ct-6-566ee2675b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-opthimus-15-y-o-38-gbox-ct-6-566ee2675b.webp",
      width: 800,
      height: 1001,
      alt: "Confezione di Opthimus 15 Y.O.",
      position: "center",
    },
  },
  {
    slug: "outerspace",
    name: "Outerspace",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Outerspace presenti nella selezione.",
    story:
      "La raccolta Outerspace comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-outerspace-alien-40-ct-6-new-a871880092.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-outerspace-alien-40-ct-6-new-a871880092.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Outerspace Alien",
      position: "center",
    },
  },
  {
    slug: "ouzo",
    name: "Ouzo",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Ouzo presenti nella selezione.",
    story:
      "La raccolta Ouzo comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-distillato-ouzo-12-1-liter-40-ct-12-d2dbffc504.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-distillato-ouzo-12-1-liter-40-ct-12-d2dbffc504.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Ouzo 12 1 Liter",
      position: "center",
    },
  },
  {
    slug: "oxley-47",
    name: "Oxley 47%",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Oxley 47% presenti nella selezione.",
    story:
      "La raccolta Oxley 47% comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-oxley-47-ct-6-f483e90dea.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-oxley-47-ct-6-f483e90dea.webp",
      width: 749,
      height: 749,
      alt: "Confezione di Oxley",
      position: "center",
    },
  },
  {
    slug: "p-a-311",
    name: "P.a./311",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta P.a./311 presenti nella selezione.",
    story:
      "La raccolta P.a./311 comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-p-a-311-40-ct-6-new-25a1ddea3f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-p-a-311-40-ct-6-new-25a1ddea3f.webp",
      width: 800,
      height: 976,
      alt: "Confezione di P.a./311",
      position: "center",
    },
  },
  {
    slug: "p31",
    name: "P31",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta P31 presenti nella selezione.",
    story:
      "La raccolta P31 comprende aperitivi disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-p31-aperitivo-green-11-ct-6-new-a94b2878c8.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-p31-aperitivo-green-11-ct-6-new-a94b2878c8.webp",
      width: 379,
      height: 1417,
      alt: "Confezione di P31 Aperitivo Green",
      position: "center",
    },
  },
  {
    slug: "paddy-40",
    name: "Paddy 40%",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Paddy 40% presenti nella selezione.",
    story:
      "La raccolta Paddy 40% comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/12-0050-irish-whiskey-paddy-40-miniatures-pet-ct-16-635abe6489.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/12-0050-irish-whiskey-paddy-40-miniatures-pet-ct-16-635abe6489.webp",
      width: 294,
      height: 765,
      alt: "Confezione di Paddy",
      position: "center",
    },
  },
  {
    slug: "padre-azul",
    name: "Padre Azul",
    country: null,
    productCount: 8,
    needsReview: false,
    description: "8 etichette Padre Azul presenti nella selezione.",
    story:
      "La raccolta Padre Azul comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/3000-tequila-padre-azul-anejo-jeroboam-40-6b13ef22ca.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/3000-tequila-padre-azul-anejo-jeroboam-40-6b13ef22ca.webp",
      width: 608,
      height: 1600,
      alt: "Confezione di Padre Azul Anejo Jeroboam",
      position: "center",
    },
  },
  {
    slug: "panarea",
    name: "Panarea",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Panarea presenti nella selezione.",
    story:
      "La raccolta Panarea comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-panarea-island-44-ct-6-new-f63b115565.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-panarea-island-44-ct-6-new-f63b115565.webp",
      width: 404,
      height: 1200,
      alt: "Confezione di Panarea Island",
      position: "center",
    },
  },
  {
    slug: "passoa-17",
    name: "Passoa 17%",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Passoa 17% presenti nella selezione.",
    story:
      "La raccolta Passoa 17% comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-passoa-17-crt-6-1-liter-7970f1722d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-passoa-17-crt-6-1-liter-7970f1722d.webp",
      width: 485,
      height: 485,
      alt: "Confezione di Passoa",
      position: "center",
    },
  },
  {
    slug: "pastis",
    name: "Pastis",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Pastis presenti nella selezione.",
    story:
      "La raccolta Pastis comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-pastis-51-45-new-17507c3ee4.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-pastis-51-45-new-17507c3ee4.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Pastis 51",
      position: "center",
    },
  },
  {
    slug: "patron",
    name: "Patron",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Patron presenti nella selezione.",
    story:
      "La raccolta Patron comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-tequila-patron-anejo-40-897a185bf0.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-tequila-patron-anejo-40-897a185bf0.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Patron Anejo",
      position: "center",
    },
  },
  {
    slug: "pechery",
    name: "Pechery",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Pechery presenti nella selezione.",
    story:
      "La raccolta Pechery comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-pechery-dubai-chocolate-cream-17-ct-6-new-dfc37c78d9.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-pechery-dubai-chocolate-cream-17-ct-6-new-dfc37c78d9.webp",
      width: 556,
      height: 1600,
      alt: "Confezione di Pechery Dubai Chocolate Cream",
      position: "center",
    },
  },
  {
    slug: "penny",
    name: "Penny",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Penny presenti nella selezione.",
    story:
      "La raccolta Penny comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-bourbon-whiskey-penny-packer-40-ct-6-4728fd520d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-bourbon-whiskey-penny-packer-40-ct-6-4728fd520d.webp",
      width: 901,
      height: 1600,
      alt: "Confezione di Penny Packer",
      position: "center",
    },
  },
  {
    slug: "perfekta",
    name: "Perfekta",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Perfekta presenti nella selezione.",
    story:
      "La raccolta Perfekta comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-vodka-perfekta-40-ct-6-new-1adebd9779.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-vodka-perfekta-40-ct-6-new-1adebd9779.webp",
      width: 225,
      height: 225,
      alt: "Confezione di Perfekta",
      position: "center",
    },
  },
  {
    slug: "pernod",
    name: "Pernod",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Pernod presenti nella selezione.",
    story:
      "La raccolta Pernod comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-pernod-40-ct-6-new-3d3675ea12.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-pernod-40-ct-6-new-3d3675ea12.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Pernod",
      position: "center",
    },
  },
  {
    slug: "peter-in-florence",
    name: "Peter In Florence",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Peter In Florence presenti nella selezione.",
    story:
      "La raccolta Peter In Florence comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-gin-peter-in-florence-london-dry-43-ct-6-fb018375e3.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-gin-peter-in-florence-london-dry-43-ct-6-fb018375e3.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Peter In Florence London Dry",
      position: "center",
    },
  },
  {
    slug: "peychaud-s",
    name: "Peychaud's",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Peychaud's presenti nella selezione.",
    story:
      "La raccolta Peychaud's comprende aperitivi disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0148-liquore-peychaud-s-bitter-35-ct-12-eacd462928.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0148-liquore-peychaud-s-bitter-35-ct-12-eacd462928.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Peychaud's Bitter",
      position: "center",
    },
  },
  {
    slug: "picon",
    name: "Picon",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Picon presenti nella selezione.",
    story:
      "La raccolta Picon comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-picon-a-l-orange-18-1-liter-new-f2ace4e468.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-picon-a-l-orange-18-1-liter-new-f2ace4e468.webp",
      width: 431,
      height: 1500,
      alt: "Confezione di Picon A L'orange",
      position: "center",
    },
  },
  {
    slug: "pierre",
    name: "Pierre",
    country: null,
    productCount: 10,
    needsReview: false,
    description: "10 etichette Pierre presenti nella selezione.",
    story:
      "La raccolta Pierre comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-pierre-ferrand-dry-curacao-triple-sec-40-f352afceb4.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-pierre-ferrand-dry-curacao-triple-sec-40-f352afceb4.webp",
      width: 492,
      height: 1600,
      alt: "Confezione di Pierre Ferrand Dry Curacao Triple Sec",
      position: "center",
    },
  },
  {
    slug: "pig-s",
    name: "Pig's",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Pig's presenti nella selezione.",
    story:
      "La raccolta Pig's comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-pig-s-nose-43-new-ct-6-3c0720454a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-pig-s-nose-43-new-ct-6-3c0720454a.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Pig's Nose",
      position: "center",
    },
  },
  {
    slug: "pimm-s",
    name: "Pimm's",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Pimm's presenti nella selezione.",
    story:
      "La raccolta Pimm's comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-pimm-s-n-1-25-litro-ct-12-bt-81274d5cc8.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-pimm-s-n-1-25-litro-ct-12-bt-81274d5cc8.webp",
      width: 960,
      height: 1280,
      alt: "Confezione di Pimm's N. 1",
      position: "center",
    },
  },
  {
    slug: "pinaq",
    name: "Pinaq",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Pinaq presenti nella selezione.",
    story:
      "La raccolta Pinaq comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-pinaq-blue-17-ct-6-new-7e03244380.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-pinaq-blue-17-ct-6-new-7e03244380.webp",
      width: 736,
      height: 981,
      alt: "Confezione di Pinaq Blue",
      position: "center",
    },
  },
  {
    slug: "pink",
    name: "Pink",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Pink presenti nella selezione.",
    story:
      "La raccolta Pink comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-pink-47-47-ct-6-f6a747502a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-pink-47-47-ct-6-f6a747502a.webp",
      width: 800,
      height: 1370,
      alt: "Confezione di Pink 47",
      position: "center",
    },
  },
  {
    slug: "pisco-capel",
    name: "Pisco Capel",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Pisco Capel presenti nella selezione.",
    story:
      "La raccolta Pisco Capel comprende brandy e altri distillati disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-distillato-pisco-capel-35-especial-d57bae2fce.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-distillato-pisco-capel-35-especial-d57bae2fce.webp",
      width: 1000,
      height: 1600,
      alt: "Confezione di Pisco Capel",
      position: "center",
    },
  },
  {
    slug: "plantation",
    name: "Plantation",
    country: null,
    productCount: 13,
    needsReview: false,
    description: "13 etichette Plantation presenti nella selezione.",
    story:
      "La raccolta Plantation comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-rum-plantation-3-stars-41-2-1-liter-ct-6-040f13ac54.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-rum-plantation-3-stars-41-2-1-liter-ct-6-040f13ac54.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Plantation 3 Stars",
      position: "center",
    },
  },
  {
    slug: "planteray",
    name: "Planteray",
    country: null,
    productCount: 8,
    needsReview: false,
    description: "8 etichette Planteray presenti nella selezione.",
    story:
      "La raccolta Planteray comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-planteray-barbados-aged-5-y-o-40-ct-6-a4fd3fd693.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-planteray-barbados-aged-5-y-o-40-ct-6-a4fd3fd693.webp",
      width: 1200,
      height: 1600,
      alt: "Confezione di Planteray Barbados Aged 5 Y.O.",
      position: "center",
    },
  },
  {
    slug: "plymouth",
    name: "Plymouth",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Plymouth presenti nella selezione.",
    story:
      "La raccolta Plymouth comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-plymouth-41-2-ct-6-7f1688da60.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-plymouth-41-2-ct-6-7f1688da60.webp",
      width: 500,
      height: 500,
      alt: "Confezione di Plymouth",
      position: "center",
    },
  },
  {
    slug: "poli",
    name: "Poli",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Poli presenti nella selezione.",
    story:
      "La raccolta Poli comprende gin, vermouth disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-poli-marconi-42-42-ct-6-new-7815948b63.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-poli-marconi-42-42-ct-6-new-7815948b63.webp",
      width: 1200,
      height: 1500,
      alt: "Confezione di Poli Marconi 42",
      position: "center",
    },
  },
  {
    slug: "pontiane",
    name: "Pontiane",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Pontiane presenti nella selezione.",
    story:
      "La raccolta Pontiane comprende aperitivi disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-pontiane-aperitivo-16-ct-12-a7294a6e14.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-pontiane-aperitivo-16-ct-12-a7294a6e14.webp",
      width: 768,
      height: 768,
      alt: "Confezione di Pontiane Aperitivo",
      position: "center",
    },
  },
  {
    slug: "porcelain",
    name: "Porcelain",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Porcelain presenti nella selezione.",
    story:
      "La raccolta Porcelain comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-porcelain-mandarin-43-ct-6-new-18c0a90475.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-porcelain-mandarin-43-ct-6-new-18c0a90475.webp",
      width: 608,
      height: 800,
      alt: "Confezione di Porcelain Mandarin",
      position: "center",
    },
  },
  {
    slug: "port",
    name: "Port",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Port presenti nella selezione.",
    story:
      "La raccolta Port comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-port-askaig-islay-8-y-o-45-8-ct-6-94cff79de2.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-port-askaig-islay-8-y-o-45-8-ct-6-94cff79de2.webp",
      width: 900,
      height: 1200,
      alt: "Confezione di Port Askaig Islay 8 Y.O.",
      position: "center",
    },
  },
  {
    slug: "portobello-road",
    name: "Portobello Road",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Portobello Road presenti nella selezione.",
    story:
      "La raccolta Portobello Road comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-portobello-road-n-171-42-ct-6-854c6a56cd.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-portobello-road-n-171-42-ct-6-854c6a56cd.webp",
      width: 1125,
      height: 1500,
      alt: "Confezione di Portobello Road N.171",
      position: "center",
    },
  },
  {
    slug: "portofino",
    name: "Portofino",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Portofino presenti nella selezione.",
    story:
      "La raccolta Portofino comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/5000-gin-portofino-40-5-litri-0895f64a35.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/5000-gin-portofino-40-5-litri-0895f64a35.webp",
      width: 1024,
      height: 1024,
      alt: "Confezione di Portofino",
      position: "center",
    },
  },
  {
    slug: "pott",
    name: "Pott",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Pott presenti nella selezione.",
    story:
      "La raccolta Pott comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-rum-pott-54-1-liter-ct-6-a6cbd284e6.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-rum-pott-54-1-liter-ct-6-a6cbd284e6.webp",
      width: 1024,
      height: 1024,
      alt: "Confezione di Pott",
      position: "center",
    },
  },
  {
    slug: "powers",
    name: "Powers",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Powers presenti nella selezione.",
    story:
      "La raccolta Powers comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-irish-whiskey-powers-gold-label-43-2-ct-6-658a701a9d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-irish-whiskey-powers-gold-label-43-2-ct-6-658a701a9d.webp",
      width: 596,
      height: 1600,
      alt: "Confezione di Powers Gold Label",
      position: "center",
    },
  },
  {
    slug: "pravda",
    name: "Pravda",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Pravda presenti nella selezione.",
    story:
      "La raccolta Pravda comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-pravda-40-new-77bbbc619f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-pravda-40-new-77bbbc619f.webp",
      width: 1067,
      height: 1600,
      alt: "Confezione di Pravda",
      position: "center",
    },
  },
  {
    slug: "precious",
    name: "Precious",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Precious presenti nella selezione.",
    story:
      "La raccolta Precious comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-precious-jewel-lines-40-ct-6-c980cc48b3.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-precious-jewel-lines-40-ct-6-c980cc48b3.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Precious Jewel Lines",
      position: "center",
    },
  },
  {
    slug: "presidente-marti",
    name: "Presidente Marti",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Presidente Marti presenti nella selezione.",
    story:
      "La raccolta Presidente Marti comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-presidente-marti-15-y-o-40-gbox-ct-6-77efedc283.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-presidente-marti-15-y-o-40-gbox-ct-6-77efedc283.webp",
      width: 800,
      height: 1031,
      alt: "Confezione di Presidente Marti 15 Y.O.",
      position: "center",
    },
  },
  {
    slug: "primo",
    name: "Primo",
    country: null,
    productCount: 5,
    needsReview: false,
    description: "5 etichette Primo presenti nella selezione.",
    story:
      "La raccolta Primo comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-primo-43-ct-6-95ed4c9368.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-primo-43-ct-6-95ed4c9368.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Primo",
      position: "center",
    },
  },
  {
    slug: "proper-no-twelve",
    name: "Proper No. Twelve",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Proper No. Twelve presenti nella selezione.",
    story:
      "La raccolta Proper No. Twelve comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-irish-whiskey-proper-no-twelve-40-ct-6-32dac1822a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-irish-whiskey-proper-no-twelve-40-ct-6-32dac1822a.webp",
      width: 500,
      height: 500,
      alt: "Confezione di Proper No. Twelve",
      position: "center",
    },
  },
  {
    slug: "puerto-de-indias",
    name: "Puerto De Indias",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Puerto De Indias presenti nella selezione.",
    story:
      "La raccolta Puerto De Indias comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-gin-puerto-de-indias-blackberry-37-5-litro-ct-6-n-51bd51a13d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-gin-puerto-de-indias-blackberry-37-5-litro-ct-6-n-51bd51a13d.webp",
      width: 604,
      height: 1500,
      alt: "Confezione di Puerto De Indias Blackberry",
      position: "center",
    },
  },
  {
    slug: "pumpkin",
    name: "Pumpkin",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Pumpkin presenti nella selezione.",
    story:
      "La raccolta Pumpkin comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-pumpkin-potion-12-ct-6-new-35d994aeac.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-pumpkin-potion-12-ct-6-new-35d994aeac.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Pumpkin Potion",
      position: "center",
    },
  },
  {
    slug: "puntacana",
    name: "Puntacana",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Puntacana presenti nella selezione.",
    story:
      "La raccolta Puntacana comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-puntacana-black-38-gb-ct-6-new-2086d9ac55.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-puntacana-black-38-gb-ct-6-new-2086d9ac55.webp",
      width: 600,
      height: 800,
      alt: "Confezione di Puntacana Black",
      position: "center",
    },
  },
  {
    slug: "pure",
    name: "Pure",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Pure presenti nella selezione.",
    story:
      "La raccolta Pure comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-bourbon-whiskey-pure-kentucky-xo-53-5-df05959fa9.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-bourbon-whiskey-pure-kentucky-xo-53-5-df05959fa9.webp",
      width: 1024,
      height: 1024,
      alt: "Confezione di Pure Kentucky XO",
      position: "center",
    },
  },
  {
    slug: "purity",
    name: "Purity",
    country: null,
    productCount: 5,
    needsReview: false,
    description: "5 etichette Purity presenti nella selezione.",
    story:
      "La raccolta Purity comprende vodka, gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-purity-34-premium-bio-40-ct-6-054dc81cc2.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-purity-34-premium-bio-40-ct-6-054dc81cc2.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Purity 34 Premium BIO",
      position: "center",
    },
  },
  {
    slug: "pusser-s",
    name: "Pusser's",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Pusser's presenti nella selezione.",
    story:
      "La raccolta Pusser's comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-pusser-s-15-y-o-40-gbox-ct-6-7c940401a3.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-pusser-s-15-y-o-40-gbox-ct-6-7c940401a3.webp",
      width: 1163,
      height: 1600,
      alt: "Confezione di Pusser's 15 Y.O.",
      position: "center",
    },
  },
  {
    slug: "pyrat",
    name: "Pyrat",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Pyrat presenti nella selezione.",
    story:
      "La raccolta Pyrat comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-pyrat-x-o-reserve-40-senza-astuccio-9cb4e5abfc.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-pyrat-x-o-reserve-40-senza-astuccio-9cb4e5abfc.webp",
      width: 1013,
      height: 1350,
      alt: "Confezione di Pyrat X.o. Reserve",
      position: "center",
    },
  },
  {
    slug: "quorhum",
    name: "Quorhum",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Quorhum presenti nella selezione.",
    story:
      "La raccolta Quorhum comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-quorhum-12-anos-solera-40-ct-6-d0e78bb49e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-quorhum-12-anos-solera-40-ct-6-d0e78bb49e.webp",
      width: 739,
      height: 1600,
      alt: "Confezione di Quorhum 12 Anos Solera",
      position: "center",
    },
  },
  {
    slug: "r-l",
    name: "R.l.",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta R.l. presenti nella selezione.",
    story:
      "La raccolta R.l. comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-r-l-seale-s-barbados-10-y-o-46-ct-6-137ab8a682.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-r-l-seale-s-barbados-10-y-o-46-ct-6-137ab8a682.webp",
      width: 576,
      height: 1024,
      alt: "Confezione di R.l. Seale's Barbados 10 Y.O.",
      position: "center",
    },
  },
  {
    slug: "raasay",
    name: "Raasay",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Raasay presenti nella selezione.",
    story:
      "La raccolta Raasay comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-raasay-46-ct-6-722b3b0388.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-raasay-46-ct-6-722b3b0388.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Raasay",
      position: "center",
    },
  },
  {
    slug: "rabitt",
    name: "Rabitt",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Rabitt presenti nella selezione.",
    story:
      "La raccolta Rabitt comprende aperitivi, liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-rabitt-bitter-integrale-26-2-ct-6-new-ita-9759d95e28.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-rabitt-bitter-integrale-26-2-ct-6-new-ita-9759d95e28.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Rabitt Bitter Integrale",
      position: "center",
    },
  },
  {
    slug: "rebel-yell",
    name: "Rebel Yell",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Rebel Yell presenti nella selezione.",
    story:
      "La raccolta Rebel Yell comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-bourbon-whiskey-rebel-yell-40-db6cd44729.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-bourbon-whiskey-rebel-yell-40-db6cd44729.webp",
      width: 600,
      height: 800,
      alt: "Confezione di Rebel Yell",
      position: "center",
    },
  },
  {
    slug: "red",
    name: "Red",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Red presenti nella selezione.",
    story:
      "La raccolta Red comprende vodka, whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1200-vodka-red-army-kalashnikov-40-a1cededf8f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1200-vodka-red-army-kalashnikov-40-a1cededf8f.webp",
      width: 600,
      height: 600,
      alt: "Confezione di Red Army Kalashnikov",
      position: "center",
    },
  },
  {
    slug: "redbreast",
    name: "Redbreast",
    country: null,
    productCount: 5,
    needsReview: false,
    description: "5 etichette Redbreast presenti nella selezione.",
    story:
      "La raccolta Redbreast comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-irish-whiskey-redbreast-12-y-o-40-gb-ct-3-6a18ad2215.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-irish-whiskey-redbreast-12-y-o-40-gb-ct-3-6a18ad2215.webp",
      width: 800,
      height: 1117,
      alt: "Confezione di Redbreast 12 Y.O.",
      position: "center",
    },
  },
  {
    slug: "relicario",
    name: "Relicario",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Relicario presenti nella selezione.",
    story:
      "La raccolta Relicario comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-relicario-peated-finish-40-ct-da-4-bt-new-90869c1759.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-relicario-peated-finish-40-ct-da-4-bt-new-90869c1759.webp",
      width: 827,
      height: 1200,
      alt: "Confezione di Relicario Peated Finish",
      position: "center",
    },
  },
  {
    slug: "riga",
    name: "Riga",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Riga presenti nella selezione.",
    story:
      "La raccolta Riga comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-liquore-riga-black-original-45-ct-12-b15168a1e5.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-liquore-riga-black-original-45-ct-12-b15168a1e5.webp",
      width: 204,
      height: 800,
      alt: "Confezione di Riga Black Original",
      position: "center",
    },
  },
  {
    slug: "roberto-cavalli",
    name: "Roberto Cavalli",
    country: null,
    productCount: 12,
    needsReview: false,
    description: "12 etichette Roberto Cavalli presenti nella selezione.",
    story:
      "La raccolta Roberto Cavalli comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-roberto-cavalli-40-ct-6-new-a0ef641530.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-roberto-cavalli-40-ct-6-new-a0ef641530.webp",
      width: 384,
      height: 1600,
      alt: "Confezione di Roberto Cavalli",
      position: "center",
    },
  },
  {
    slug: "roby-marton",
    name: "Roby Marton",
    country: null,
    productCount: 5,
    needsReview: false,
    description: "5 etichette Roby Marton presenti nella selezione.",
    story:
      "La raccolta Roby Marton comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-roby-marton-47-ct-6-e824b88888.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-roby-marton-47-ct-6-e824b88888.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Roby Marton",
      position: "center",
    },
  },
  {
    slug: "roe-e-co",
    name: "Roe&co",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Roe&co presenti nella selezione.",
    story:
      "La raccolta Roe&co comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-irish-whiskey-roe-e-co-45-ct-6-9fd785d1fd.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-irish-whiskey-roe-e-co-45-ct-6-9fd785d1fd.webp",
      width: 594,
      height: 1600,
      alt: "Confezione di Roe&co",
      position: "center",
    },
  },
  {
    slug: "roku",
    name: "Roku",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Roku presenti nella selezione.",
    story:
      "La raccolta Roku comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-gin-roku-43-1-liter-ct-6-4e4fbfe31f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-gin-roku-43-1-liter-ct-6-4e4fbfe31f.webp",
      width: 395,
      height: 527,
      alt: "Confezione di Roku",
      position: "center",
    },
  },
  {
    slug: "ron",
    name: "Ron",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Ron presenti nella selezione.",
    story:
      "La raccolta Ron comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-ron-del-barrilito-3-stars-43-ct-12-new-e9fce4cefa.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-ron-del-barrilito-3-stars-43-ct-12-new-e9fce4cefa.webp",
      width: 800,
      height: 1375,
      alt: "Confezione di Ron Del Barrilito 3 Stars",
      position: "center",
    },
  },
  {
    slug: "rosso",
    name: "Rosso",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Rosso presenti nella selezione.",
    story:
      "La raccolta Rosso comprende vermouth disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0750-vermouth-rosso-fred-jerbis-18-ct-6-82e8d2ba6f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0750-vermouth-rosso-fred-jerbis-18-ct-6-82e8d2ba6f.webp",
      width: 328,
      height: 600,
      alt: "Confezione di Rosso Fred Jerbis",
      position: "center",
    },
  },
  {
    slug: "royal",
    name: "Royal",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Royal presenti nella selezione.",
    story:
      "La raccolta Royal comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-royal-dragon-imperial-40-gbox-a93418c82f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-royal-dragon-imperial-40-gbox-a93418c82f.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Royal Dragon Imperial",
      position: "center",
    },
  },
  {
    slug: "rumbullion",
    name: "Rumbullion",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Rumbullion presenti nella selezione.",
    story:
      "La raccolta Rumbullion comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-rumbullion-42-6-ct-6-73a0faebae.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-rumbullion-42-6-ct-6-73a0faebae.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Rumbullion",
      position: "center",
    },
  },
  {
    slug: "russian",
    name: "Russian",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Russian presenti nella selezione.",
    story:
      "La raccolta Russian comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/24-0050-vodka-russian-standard-original-40-miniatures--8d917be98d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/24-0050-vodka-russian-standard-original-40-miniatures--8d917be98d.webp",
      width: 530,
      height: 530,
      alt: "Confezione di Russian Standard Original",
      position: "center",
    },
  },
  {
    slug: "rutherford-s",
    name: "Rutherford's",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Rutherford's presenti nella selezione.",
    story:
      "La raccolta Rutherford's comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-rutherford-s-40-ct-6-new-b908c0796b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-rutherford-s-40-ct-6-new-b908c0796b.webp",
      width: 1200,
      height: 628,
      alt: "Confezione di Rutherford's",
      position: "center",
    },
  },
  {
    slug: "rye",
    name: "Rye",
    country: null,
    productCount: 26,
    needsReview: false,
    description: "26 etichette Rye presenti nella selezione.",
    story:
      "La raccolta Rye comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rye-whiskey-1776-46-ct-6-7c352b3dc7.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rye-whiskey-1776-46-ct-6-7c352b3dc7.webp",
      width: 554,
      height: 1600,
      alt: "Confezione di Rye Whiskey 1776",
      position: "center",
    },
  },
  {
    slug: "ryoma",
    name: "Ryoma",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Ryoma presenti nella selezione.",
    story:
      "La raccolta Ryoma comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-ryoma-7-y-o-40-japanese-ct-6-cd3d563258.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-ryoma-7-y-o-40-japanese-ct-6-cd3d563258.webp",
      width: 800,
      height: 853,
      alt: "Confezione di Ryoma 7 Y.O.",
      position: "center",
    },
  },
  {
    slug: "sabatini",
    name: "Sabatini",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Sabatini presenti nella selezione.",
    story:
      "La raccolta Sabatini comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-sabatini-41-3-ct-6-c78cfef1cd.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-sabatini-41-3-ct-6-c78cfef1cd.webp",
      width: 1082,
      height: 1443,
      alt: "Confezione di Sabatini",
      position: "center",
    },
  },
  {
    slug: "saffron",
    name: "Saffron",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Saffron presenti nella selezione.",
    story:
      "La raccolta Saffron comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-saffron-40-ct-6-fd86698820.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-saffron-40-ct-6-fd86698820.webp",
      width: 586,
      height: 1186,
      alt: "Confezione di Saffron",
      position: "center",
    },
  },
  {
    slug: "saigon",
    name: "Saigon",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Saigon presenti nella selezione.",
    story:
      "La raccolta Saigon comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-saigon-baigur-premium-dry-43-ct-6-new-a51598e6fe.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-saigon-baigur-premium-dry-43-ct-6-new-a51598e6fe.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Saigon Baigur Premium Dry",
      position: "center",
    },
  },
  {
    slug: "sailor-jerry-spiced-40",
    name: "Sailor Jerry Spiced 40%",
    country: null,
    productCount: 2,
    needsReview: false,
    description:
      "2 etichette Sailor Jerry Spiced 40% presenti nella selezione.",
    story:
      "La raccolta Sailor Jerry Spiced 40% comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-sailor-jerry-spiced-40-ct-6-484df457db.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-sailor-jerry-spiced-40-ct-6-484df457db.webp",
      width: 650,
      height: 750,
      alt: "Confezione di Sailor Jerry Spiced",
      position: "center",
    },
  },
  {
    slug: "saint-james",
    name: "Saint James",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Saint James presenti nella selezione.",
    story:
      "La raccolta Saint James comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-saint-james-7-y-o-43-gb-ct-6-ffad299c70.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-saint-james-7-y-o-43-gb-ct-6-ffad299c70.webp",
      width: 1080,
      height: 1080,
      alt: "Confezione di Saint James 7 Y.O.",
      position: "center",
    },
  },
  {
    slug: "sakurao",
    name: "Sakurao",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Sakurao presenti nella selezione.",
    story:
      "La raccolta Sakurao comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-sakurao-classic-40-gb-ct-6-9b474f6c1c.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-sakurao-classic-40-gb-ct-6-9b474f6c1c.webp",
      width: 424,
      height: 1424,
      alt: "Confezione di Sakurao Classic",
      position: "center",
    },
  },
  {
    slug: "sambuca",
    name: "Sambuca",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Sambuca presenti nella selezione.",
    story:
      "La raccolta Sambuca comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-sambuca-molinari-40-litro-ct-6-4a6a2dfbb2.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-sambuca-molinari-40-litro-ct-6-4a6a2dfbb2.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Sambuca Molinari",
      position: "center",
    },
  },
  {
    slug: "san",
    name: "San",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta San presenti nella selezione.",
    story:
      "La raccolta San comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-mezcal-san-cosme-joven-40-62f2829986.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-mezcal-san-cosme-joven-40-62f2829986.webp",
      width: 900,
      height: 1600,
      alt: "Confezione di San Cosme Joven",
      position: "center",
    },
  },
  {
    slug: "sangre-de-vida",
    name: "Sangre De Vida",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Sangre De Vida presenti nella selezione.",
    story:
      "La raccolta Sangre De Vida comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-tequila-sangre-de-vida-anejo-el-corazon-40-ct-6-n-b54c10dd66.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-tequila-sangre-de-vida-anejo-el-corazon-40-ct-6-n-b54c10dd66.webp",
      width: 462,
      height: 600,
      alt: "Confezione di Sangre De Vida Anejo El Corazon",
      position: "center",
    },
  },
  {
    slug: "santa",
    name: "Santa",
    country: null,
    productCount: 5,
    needsReview: false,
    description: "5 etichette Santa presenti nella selezione.",
    story:
      "La raccolta Santa comprende gin, rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-santa-ana-floreale-42-3-ct-6-new-10bb7e7674.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-santa-ana-floreale-42-3-ct-6-new-10bb7e7674.webp",
      width: 585,
      height: 1500,
      alt: "Confezione di Santa Ana Floreale",
      position: "center",
    },
  },
  {
    slug: "santiago-de-cuba",
    name: "Santiago De Cuba",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Santiago De Cuba presenti nella selezione.",
    story:
      "La raccolta Santiago De Cuba comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/gift-rum-santiago-de-cuba-11y-o-0-70-43-2bicchieri-ct--122c0c79be.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/gift-rum-santiago-de-cuba-11y-o-0-70-43-2bicchieri-ct--122c0c79be.webp",
      width: 1024,
      height: 1024,
      alt: "Confezione di Santiago De Cuba 11Y.O. 0.70",
      position: "center",
    },
  },
  {
    slug: "saper",
    name: "Saper",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Saper presenti nella selezione.",
    story:
      "La raccolta Saper comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/gift-vodka-saper-3-bott-0-20-legno-ct-3-forma-bomba-ma-4a52af385e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/gift-vodka-saper-3-bott-0-20-legno-ct-3-forma-bomba-ma-4a52af385e.webp",
      width: 492,
      height: 327,
      alt: "Confezione di Saper 3 Bott. 0.20 Legno",
      position: "center",
    },
  },
  {
    slug: "scapegrace",
    name: "Scapegrace",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Scapegrace presenti nella selezione.",
    story:
      "La raccolta Scapegrace comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-scapegrace-black-41-6-ct-6-46c3172d5d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-scapegrace-black-41-6-ct-6-46c3172d5d.webp",
      width: 593,
      height: 1185,
      alt: "Confezione di Scapegrace Black",
      position: "center",
    },
  },
  {
    slug: "schneider",
    name: "Schneider",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Schneider presenti nella selezione.",
    story:
      "La raccolta Schneider comprende grappe disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0200-distillato-di-birra-schneider-aventinus-40-vetro-436d00756b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0200-distillato-di-birra-schneider-aventinus-40-vetro-436d00756b.webp",
      width: 960,
      height: 960,
      alt: "Confezione di Schneider Aventinus",
      position: "center",
    },
  },
  {
    slug: "sea",
    name: "Sea",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Sea presenti nella selezione.",
    story:
      "La raccolta Sea comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-sea-40-ct-6-8150951b94.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-sea-40-ct-6-8150951b94.webp",
      width: 1200,
      height: 628,
      alt: "Confezione di Sea",
      position: "center",
    },
  },
  {
    slug: "seagram-s-vo-40",
    name: "Seagram's Vo 40%",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Seagram's Vo 40% presenti nella selezione.",
    story:
      "La raccolta Seagram's Vo 40% comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-canadian-whisky-seagram-s-vo-40-ct-6-04ae5abb70.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-canadian-whisky-seagram-s-vo-40-ct-6-04ae5abb70.webp",
      width: 471,
      height: 1600,
      alt: "Confezione di Seagram's Vo",
      position: "center",
    },
  },
  {
    slug: "select",
    name: "Select",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Select presenti nella selezione.",
    story:
      "La raccolta Select comprende aperitivi disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-select-aperitivo-1-liter-17-5-ct-6-59c5d33986.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-select-aperitivo-1-liter-17-5-ct-6-59c5d33986.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Select Aperitivo 1 Liter",
      position: "center",
    },
  },
  {
    slug: "sexton",
    name: "Sexton",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Sexton presenti nella selezione.",
    story:
      "La raccolta Sexton comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-irish-whiskey-sexton-single-malt-40-ct-6-9ff07557e2.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-irish-whiskey-sexton-single-malt-40-ct-6-9ff07557e2.webp",
      width: 570,
      height: 852,
      alt: "Confezione di Sexton Single Malt",
      position: "center",
    },
  },
  {
    slug: "shankys",
    name: "Shankys",
    country: null,
    productCount: 2,
    needsReview: true,
    description: "2 etichette Shankys presenti nella selezione.",
    story:
      "La raccolta Shankys comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-irish-whiskey-shankys-whip-black-liqueur-33-ct-6--0d4585fe3f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-irish-whiskey-shankys-whip-black-liqueur-33-ct-6--0d4585fe3f.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Shankys Whip Black Liqueur",
      position: "center",
    },
  },
  {
    slug: "sierra",
    name: "Sierra",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Sierra presenti nella selezione.",
    story:
      "La raccolta Sierra comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/12-0050-tequila-sierra-reposado-35-pet-ct-12-new-2f30bbe756.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/12-0050-tequila-sierra-reposado-35-pet-ct-12-new-2f30bbe756.webp",
      width: 556,
      height: 1600,
      alt: "Confezione di Sierra Reposado",
      position: "center",
    },
  },
  {
    slug: "sikkim",
    name: "Sikkim",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Sikkim presenti nella selezione.",
    story:
      "La raccolta Sikkim comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-sikkim-fraise-40-ct-6-new-7de5fb753f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-sikkim-fraise-40-ct-6-new-7de5fb753f.webp",
      width: 347,
      height: 555,
      alt: "Confezione di Sikkim Fraise",
      position: "center",
    },
  },
  {
    slug: "silent-pool",
    name: "Silent Pool",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Silent Pool presenti nella selezione.",
    story:
      "La raccolta Silent Pool comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-gin-silent-pool-1-liter-43-ct-6-fc8dddcdb3.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-gin-silent-pool-1-liter-43-ct-6-fc8dddcdb3.webp",
      width: 960,
      height: 1280,
      alt: "Confezione di Silent Pool 1 Liter",
      position: "center",
    },
  },
  {
    slug: "silla",
    name: "Silla",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Silla presenti nella selezione.",
    story:
      "La raccolta Silla comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-silla-bio-40-ct-6-new-e37003f928.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-silla-bio-40-ct-6-new-e37003f928.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Silla BIO",
      position: "center",
    },
  },
  {
    slug: "sipsmith",
    name: "Sipsmith",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Sipsmith presenti nella selezione.",
    story:
      "La raccolta Sipsmith comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-sipsmith-london-dry-41-6-ct-6-5c8dd31f49.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-sipsmith-london-dry-41-6-ct-6-5c8dd31f49.webp",
      width: 870,
      height: 1110,
      alt: "Confezione di Sipsmith London Dry",
      position: "center",
    },
  },
  {
    slug: "six",
    name: "Six",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Six presenti nella selezione.",
    story:
      "La raccolta Six comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-gin-six-ravens-london-dry-46-ct-6-f563d31f35.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-gin-six-ravens-london-dry-46-ct-6-f563d31f35.webp",
      width: 450,
      height: 600,
      alt: "Confezione di Six Ravens London Dry",
      position: "center",
    },
  },
  {
    slug: "smirnoff",
    name: "Smirnoff",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Smirnoff presenti nella selezione.",
    story:
      "La raccolta Smirnoff comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-vodka-smirnoff-lime-37-5-1-liter-ct-12-87feeec561.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-vodka-smirnoff-lime-37-5-1-liter-ct-12-87feeec561.webp",
      width: 1000,
      height: 1500,
      alt: "Confezione di Smirnoff Lime",
      position: "center",
    },
  },
  {
    slug: "smith",
    name: "Smith",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Smith presenti nella selezione.",
    story:
      "La raccolta Smith comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-smith-and-cross-57-ct-6-48e364de1a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-smith-and-cross-57-ct-6-48e364de1a.webp",
      width: 520,
      height: 1600,
      alt: "Confezione di Smith And Cross",
      position: "center",
    },
  },
  {
    slug: "smokehead",
    name: "Smokehead",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Smokehead presenti nella selezione.",
    story:
      "La raccolta Smokehead comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-smokehead-high-voltage-58-ct-6-c64939beb3.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-smokehead-high-voltage-58-ct-6-c64939beb3.webp",
      width: 768,
      height: 1024,
      alt: "Confezione di Smokehead High Voltage",
      position: "center",
    },
  },
  {
    slug: "smooth",
    name: "Smooth",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Smooth presenti nella selezione.",
    story:
      "La raccolta Smooth comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-bourbon-whiskey-smooth-ambler-old-scout-7-y-o-49--52a27e41ab.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-bourbon-whiskey-smooth-ambler-old-scout-7-y-o-49--52a27e41ab.webp",
      width: 671,
      height: 1000,
      alt: "Confezione di Smooth Ambler Old Scout 7 Y.O.",
      position: "center",
    },
  },
  {
    slug: "snowglobe",
    name: "Snowglobe",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Snowglobe presenti nella selezione.",
    story:
      "La raccolta Snowglobe comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-snowglobe-orange-e-gingerbread-20-gbox-ct-6-d91b152629.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-snowglobe-orange-e-gingerbread-20-gbox-ct-6-d91b152629.webp",
      width: 750,
      height: 750,
      alt: "Confezione di Snowglobe Orange & Gingerbread",
      position: "center",
    },
  },
  {
    slug: "sotol-la-escondida",
    name: "Sotol La Escondida",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Sotol La Escondida presenti nella selezione.",
    story:
      "La raccolta Sotol La Escondida comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-sotol-la-escondida-blanco-40-ct-6-new-f5e87cc3ea.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-sotol-la-escondida-blanco-40-ct-6-new-f5e87cc3ea.webp",
      width: 370,
      height: 370,
      alt: "Confezione di Sotol La Escondida Blanco",
      position: "center",
    },
  },
  {
    slug: "southern-comfort",
    name: "Southern Comfort",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Southern Comfort presenti nella selezione.",
    story:
      "La raccolta Southern Comfort comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-liquore-southern-comfort-black-litro-35-ct-12-bd7d89589a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-liquore-southern-comfort-black-litro-35-ct-12-bd7d89589a.webp",
      width: 1080,
      height: 1080,
      alt: "Confezione di Southern Comfort Black Litro",
      position: "center",
    },
  },
  {
    slug: "spinello",
    name: "Spinello",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Spinello presenti nella selezione.",
    story:
      "La raccolta Spinello comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-spinello-28-ct-6-95b9ebf120.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-spinello-28-ct-6-95b9ebf120.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Spinello",
      position: "center",
    },
  },
  {
    slug: "st-germain",
    name: "St.germain",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta St.germain presenti nella selezione.",
    story:
      "La raccolta St.germain comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-st-germain-20-ct-6-b172b9e098.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-st-germain-20-ct-6-b172b9e098.webp",
      width: 699,
      height: 1280,
      alt: "Confezione di St.germain",
      position: "center",
    },
  },
  {
    slug: "starlino-aperitivo",
    name: "Starlino Aperitivo",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Starlino Aperitivo presenti nella selezione.",
    story:
      "La raccolta Starlino Aperitivo comprende vermouth disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0750-vermouth-starlino-aperitivo-arancione-17-ct-6-e5e7433a5f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0750-vermouth-starlino-aperitivo-arancione-17-ct-6-e5e7433a5f.webp",
      width: 900,
      height: 1600,
      alt: "Confezione di Starlino Aperitivo Arancione",
      position: "center",
    },
  },
  {
    slug: "still",
    name: "Still",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Still presenti nella selezione.",
    story:
      "La raccolta Still comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-still-42-5-ct-6-new-59a4b6b635.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-still-42-5-ct-6-new-59a4b6b635.webp",
      width: 530,
      height: 530,
      alt: "Confezione di Still",
      position: "center",
    },
  },
  {
    slug: "stock",
    name: "Stock",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Stock presenti nella selezione.",
    story:
      "La raccolta Stock comprende brandy e altri distillati disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/20-0030-brandy-stock-84-36-miniatures-pet-ct-3-new-dce702761c.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/20-0030-brandy-stock-84-36-miniatures-pet-ct-3-new-dce702761c.webp",
      width: 1131,
      height: 1600,
      alt: "Confezione di Stock 84",
      position: "center",
    },
  },
  {
    slug: "stolichnaya",
    name: "Stolichnaya",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Stolichnaya presenti nella selezione.",
    story:
      "La raccolta Stolichnaya comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/12-0050-vodka-stolichnaya-40-miniatures-pet-ct-10-new-8f194b0721.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/12-0050-vodka-stolichnaya-40-miniatures-pet-ct-10-new-8f194b0721.webp",
      width: 900,
      height: 900,
      alt: "Confezione di Stolichnaya",
      position: "center",
    },
  },
  {
    slug: "stonegaze",
    name: "Stonegaze",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Stonegaze presenti nella selezione.",
    story:
      "La raccolta Stonegaze comprende gin, rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-stonegaze-rhubarb-e-raspberry-ceramic-btls-gb-bcb259b4b6.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-stonegaze-rhubarb-e-raspberry-ceramic-btls-gb-bcb259b4b6.webp",
      width: 1080,
      height: 1350,
      alt: "Confezione di Stonegaze Rhubarb & Raspberry Ceramic Btls",
      position: "center",
    },
  },
  {
    slug: "strega",
    name: "Strega",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Strega presenti nella selezione.",
    story:
      "La raccolta Strega comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-strega-alberti-40-ct-6-new-65008f5c4e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-strega-alberti-40-ct-6-new-65008f5c4e.webp",
      width: 942,
      height: 1132,
      alt: "Confezione di Strega Alberti",
      position: "center",
    },
  },
  {
    slug: "stroh",
    name: "Stroh",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Stroh presenti nella selezione.",
    story:
      "La raccolta Stroh comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-stroh-80-gradi-80-ct-6-737e8d57c6.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-stroh-80-gradi-80-ct-6-737e8d57c6.webp",
      width: 800,
      height: 960,
      alt: "Confezione di Stroh 80 Gradi",
      position: "center",
    },
  },
  {
    slug: "sul",
    name: "Sul",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Sul presenti nella selezione.",
    story:
      "La raccolta Sul comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-gin-sul-43-ad92300be0.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-gin-sul-43-ad92300be0.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Sul",
      position: "center",
    },
  },
  {
    slug: "suntory",
    name: "Suntory",
    country: null,
    productCount: 18,
    needsReview: false,
    description: "18 etichette Suntory presenti nella selezione.",
    story:
      "La raccolta Suntory comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-japanese-whisky-suntory-ao-43-gb-ct-6-853657f329.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-japanese-whisky-suntory-ao-43-gb-ct-6-853657f329.webp",
      width: 384,
      height: 512,
      alt: "Confezione di Suntory Ao",
      position: "center",
    },
  },
  {
    slug: "sylvius",
    name: "Sylvius",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Sylvius presenti nella selezione.",
    story:
      "La raccolta Sylvius comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-sylvius-45-ct-6-27e012de53.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-sylvius-45-ct-6-27e012de53.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Sylvius",
      position: "center",
    },
  },
  {
    slug: "szene",
    name: "Szene",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Szene presenti nella selezione.",
    story:
      "La raccolta Szene comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-bourbon-whiskey-szene-40-1-liter-3c0a2400ef.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-bourbon-whiskey-szene-40-1-liter-3c0a2400ef.webp",
      width: 722,
      height: 1600,
      alt: "Confezione di Szene",
      position: "center",
    },
  },
  {
    slug: "taiwan-whisky",
    name: "Taiwan Whisky",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Taiwan Whisky presenti nella selezione.",
    story:
      "La raccolta Taiwan Whisky comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-taiwan-whisky-kavalan-single-malt-40-gb-ct-6-b36302babc.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-taiwan-whisky-kavalan-single-malt-40-gb-ct-6-b36302babc.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Taiwan Whisky Kavalan Single Malt",
      position: "center",
    },
  },
  {
    slug: "talisker",
    name: "Talisker",
    country: null,
    productCount: 8,
    needsReview: false,
    description: "8 etichette Talisker presenti nella selezione.",
    story:
      "La raccolta Talisker comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-scotch-whisky-talisker-dark-storm-45-8-1-liter-gb-9d3bdae5af.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-scotch-whisky-talisker-dark-storm-45-8-1-liter-gb-9d3bdae5af.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Talisker Dark Storm",
      position: "center",
    },
  },
  {
    slug: "tann-s",
    name: "Tann's",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Tann's presenti nella selezione.",
    story:
      "La raccolta Tann's comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-tann-s-40-ct-6-45eec82edc.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-tann-s-40-ct-6-45eec82edc.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Tann's",
      position: "center",
    },
  },
  {
    slug: "tanqueray",
    name: "Tanqueray",
    country: null,
    productCount: 14,
    needsReview: false,
    description: "14 etichette Tanqueray presenti nella selezione.",
    story:
      "La raccolta Tanqueray comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-tanqueray-0-0-alcohol-free-ct-6-7b4bdb17ba.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-tanqueray-0-0-alcohol-free-ct-6-7b4bdb17ba.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Tanqueray",
      position: "center",
    },
  },
  {
    slug: "tarquin-s",
    name: "Tarquin's",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Tarquin's presenti nella selezione.",
    story:
      "La raccolta Tarquin's comprende gin, liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-tarquin-s-british-blackberry-38-ct-6-54ad2e681c.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-tarquin-s-british-blackberry-38-ct-6-54ad2e681c.webp",
      width: 900,
      height: 1200,
      alt: "Confezione di Tarquin's British Blackberry",
      position: "center",
    },
  },
  {
    slug: "teacher-s",
    name: "Teacher's",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Teacher's presenti nella selezione.",
    story:
      "La raccolta Teacher's comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-scotch-whisky-teacher-s-litro-40-ct-12-new-269f554e4f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-scotch-whisky-teacher-s-litro-40-ct-12-new-269f554e4f.webp",
      width: 800,
      height: 960,
      alt: "Confezione di Teacher's Litro",
      position: "center",
    },
  },
  {
    slug: "teeling",
    name: "Teeling",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Teeling presenti nella selezione.",
    story:
      "La raccolta Teeling comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-irish-whiskey-teeling-blackpitts-peated-46-gb-ct--a61956e1c8.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-irish-whiskey-teeling-blackpitts-peated-46-gb-ct--a61956e1c8.webp",
      width: 800,
      height: 1141,
      alt: "Confezione di Teeling Blackpitts Peated",
      position: "center",
    },
  },
  {
    slug: "tenjaku",
    name: "Tenjaku",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Tenjaku presenti nella selezione.",
    story:
      "La raccolta Tenjaku comprende gin, whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-tenjaku-japanese-craft-gin-40-ct-6-2d9746213e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-tenjaku-japanese-craft-gin-40-ct-6-2d9746213e.webp",
      width: 900,
      height: 1200,
      alt: "Confezione di Tenjaku Japanese Craft Gin",
      position: "center",
    },
  },
  {
    slug: "the",
    name: "The",
    country: null,
    productCount: 88,
    needsReview: false,
    description: "88 etichette The presenti nella selezione.",
    story:
      "La raccolta The comprende vodka, gin, rum e rhum, whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-vodka-the-standard-1894-40-litro-ct-6-e65c20d08d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-vodka-the-standard-1894-40-litro-ct-6-e65c20d08d.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di The Standard 1894",
      position: "center",
    },
  },
  {
    slug: "tia",
    name: "Tia",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Tia presenti nella selezione.",
    story:
      "La raccolta Tia comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/12-0050-liquore-tia-maria-20-pet-ct-5-new-138d5e53c4.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/12-0050-liquore-tia-maria-20-pet-ct-5-new-138d5e53c4.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Tia Maria",
      position: "center",
    },
  },
  {
    slug: "timberman",
    name: "Timberman",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Timberman presenti nella selezione.",
    story:
      "La raccolta Timberman comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/gift-whisky-timberman-3-y-o-0-50-40-borraccia-new-ecd2d0532e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/gift-whisky-timberman-3-y-o-0-50-40-borraccia-new-ecd2d0532e.webp",
      width: 1080,
      height: 1061,
      alt: "Confezione di Timberman 3 Y.O. 0.50",
      position: "center",
    },
  },
  {
    slug: "tio",
    name: "Tio",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Tio presenti nella selezione.",
    story:
      "La raccolta Tio comprende vermouth disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-vermouth-tio-pepe-sherry-15-ct-12-4e4fe258df.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-vermouth-tio-pepe-sherry-15-ct-12-4e4fe258df.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Tio Pepe Sherry",
      position: "center",
    },
  },
  {
    slug: "tito-s-40",
    name: "Tito's 40%",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Tito's 40% presenti nella selezione.",
    story:
      "La raccolta Tito's 40% comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-vodka-tito-s-40-1-liter-ct-12-cada2ac6b8.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-vodka-tito-s-40-1-liter-ct-12-cada2ac6b8.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Tito's",
      position: "center",
    },
  },
  {
    slug: "togouchi",
    name: "Togouchi",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Togouchi presenti nella selezione.",
    story:
      "La raccolta Togouchi comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-japanese-whisky-togouchi-9-yo-blended-40-gbox-ct--7749451bc8.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-japanese-whisky-togouchi-9-yo-blended-40-gbox-ct--7749451bc8.webp",
      width: 900,
      height: 900,
      alt: "Confezione di Togouchi 9 Y.O. Blended",
      position: "center",
    },
  },
  {
    slug: "tokinoka",
    name: "Tokinoka",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Tokinoka presenti nella selezione.",
    story:
      "La raccolta Tokinoka comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-japanese-whisky-tokinoka-black-50-ct-6-6ac2fb9a31.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-japanese-whisky-tokinoka-black-50-ct-6-6ac2fb9a31.webp",
      width: 1149,
      height: 1580,
      alt: "Confezione di Tokinoka Black",
      position: "center",
    },
  },
  {
    slug: "tomatin",
    name: "Tomatin",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Tomatin presenti nella selezione.",
    story:
      "La raccolta Tomatin comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-scotch-whisky-tomatin-12-y-o-bourbon-e-sherry-cas-9f3cf9deb0.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-scotch-whisky-tomatin-12-y-o-bourbon-e-sherry-cas-9f3cf9deb0.webp",
      width: 800,
      height: 1040,
      alt: "Confezione di Tomatin 12 Y.O. Bourbon&sherry Casks",
      position: "center",
    },
  },
  {
    slug: "tonka",
    name: "Tonka",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Tonka presenti nella selezione.",
    story:
      "La raccolta Tonka comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-gin-tonka-italia-2021-47-ct-6-7c00436e51.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-gin-tonka-italia-2021-47-ct-6-7c00436e51.webp",
      width: 311,
      height: 800,
      alt: "Confezione di Tonka Italia 2021",
      position: "center",
    },
  },
  {
    slug: "torres",
    name: "Torres",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Torres presenti nella selezione.",
    story:
      "La raccolta Torres comprende brandy e altri distillati disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-brandy-torres-5-y-o-38-ct-6-76fd040ff8.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-brandy-torres-5-y-o-38-ct-6-76fd040ff8.webp",
      width: 667,
      height: 1000,
      alt: "Confezione di Torres 5 Y.O.",
      position: "center",
    },
  },
  {
    slug: "tovel-s-45",
    name: "Tovel's 45%",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Tovel's 45% presenti nella selezione.",
    story:
      "La raccolta Tovel's 45% comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-tovel-s-45-ct-6-italiano-46973259de.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-tovel-s-45-ct-6-italiano-46973259de.webp",
      width: 533,
      height: 1390,
      alt: "Confezione di Tovel's",
      position: "center",
    },
  },
  {
    slug: "tranquebar",
    name: "Tranquebar",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Tranquebar presenti nella selezione.",
    story:
      "La raccolta Tranquebar comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-tranquebar-colonial-45-ct-6-f1d5779693.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-tranquebar-colonial-45-ct-6-f1d5779693.webp",
      width: 866,
      height: 1600,
      alt: "Confezione di Tranquebar Colonial",
      position: "center",
    },
  },
  {
    slug: "trois",
    name: "Trois",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Trois presenti nella selezione.",
    story:
      "La raccolta Trois comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-trois-rivieres-vsop-40-gb-ct-6-new-19a5d3ee49.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-trois-rivieres-vsop-40-gb-ct-6-new-19a5d3ee49.webp",
      width: 398,
      height: 1024,
      alt: "Confezione di Trois Rivieres VSOP",
      position: "center",
    },
  },
  {
    slug: "tropez",
    name: "Tropez",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Tropez presenti nella selezione.",
    story:
      "La raccolta Tropez comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-gin-tropez-40-ct-6-48cd9c1260.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-gin-tropez-40-ct-6-48cd9c1260.webp",
      width: 194,
      height: 259,
      alt: "Confezione di Tropez",
      position: "center",
    },
  },
  {
    slug: "tullamore-dew",
    name: "Tullamore Dew",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Tullamore Dew presenti nella selezione.",
    story:
      "La raccolta Tullamore Dew comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-irish-whiskey-tullamore-dew-12-y-o-40-gb-ct-6-7e6711ff36.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-irish-whiskey-tullamore-dew-12-y-o-40-gb-ct-6-7e6711ff36.webp",
      width: 800,
      height: 1195,
      alt: "Confezione di Tullamore Dew 12 Y.O.",
      position: "center",
    },
  },
  {
    slug: "twisted",
    name: "Twisted",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Twisted presenti nella selezione.",
    story:
      "La raccolta Twisted comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-twisted-nose-40-ct-6-new-198052e856.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-twisted-nose-40-ct-6-new-198052e856.webp",
      width: 1125,
      height: 1500,
      alt: "Confezione di Twisted Nose",
      position: "center",
    },
  },
  {
    slug: "tyrconnell",
    name: "Tyrconnell",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Tyrconnell presenti nella selezione.",
    story:
      "La raccolta Tyrconnell comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-irish-whiskey-tyrconnell-10-y-o-sherry-cask-46-15a5e470db.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-irish-whiskey-tyrconnell-10-y-o-sherry-cask-46-15a5e470db.webp",
      width: 992,
      height: 992,
      alt: "Confezione di Tyrconnell 10 Y.O. Sherry Cask",
      position: "center",
    },
  },
  {
    slug: "u-luvka",
    name: "U'luvka",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette U'luvka presenti nella selezione.",
    story:
      "La raccolta U'luvka comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/gift-vodka-u-luvka-0-10-40-2bicchierini-ct-6-new-9467c99a56.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/gift-vodka-u-luvka-0-10-40-2bicchierini-ct-6-new-9467c99a56.webp",
      width: 800,
      height: 800,
      alt: "Confezione di U'luvka 0.10",
      position: "center",
    },
  },
  {
    slug: "ukiyo-japanese",
    name: "Ukiyo Japanese",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Ukiyo Japanese presenti nella selezione.",
    story:
      "La raccolta Ukiyo Japanese comprende vodka, gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-ukiyo-japanese-rice-vodka-40-ct-6-new-d28856f66d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-ukiyo-japanese-rice-vodka-40-ct-6-new-d28856f66d.webp",
      width: 711,
      height: 1600,
      alt: "Confezione di Ukiyo Japanese Rice Vodka",
      position: "center",
    },
  },
  {
    slug: "uncle-val-s",
    name: "Uncle Val's",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Uncle Val's presenti nella selezione.",
    story:
      "La raccolta Uncle Val's comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-uncle-val-s-botanical-45-ct-6-53696c3302.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-uncle-val-s-botanical-45-ct-6-53696c3302.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Uncle Val's Botanical",
      position: "center",
    },
  },
  {
    slug: "ungava",
    name: "Ungava",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Ungava presenti nella selezione.",
    story:
      "La raccolta Ungava comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-ungava-43-1-ct-6-9aeefcca67.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-ungava-43-1-ct-6-9aeefcca67.webp",
      width: 620,
      height: 930,
      alt: "Confezione di Ungava",
      position: "center",
    },
  },
  {
    slug: "unhiq",
    name: "Unhiq",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Unhiq presenti nella selezione.",
    story:
      "La raccolta Unhiq comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-rum-unhiq-xo-42-ct-6-e9ad0b548e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-rum-unhiq-xo-42-ct-6-e9ad0b548e.webp",
      width: 872,
      height: 930,
      alt: "Confezione di Unhiq XO",
      position: "center",
    },
  },
  {
    slug: "uppercut",
    name: "Uppercut",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Uppercut presenti nella selezione.",
    story:
      "La raccolta Uppercut comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-uppercut-49-6-ct-6-fe3ab7cab2.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-uppercut-49-6-ct-6-fe3ab7cab2.webp",
      width: 502,
      height: 1600,
      alt: "Confezione di Uppercut",
      position: "center",
    },
  },
  {
    slug: "upperhand",
    name: "Upperhand",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Upperhand presenti nella selezione.",
    story:
      "La raccolta Upperhand comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-gin-upperhand-irish-gin-40-ct-6-eee8362120.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-gin-upperhand-irish-gin-40-ct-6-eee8362120.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Upperhand Irish Gin",
      position: "center",
    },
  },
  {
    slug: "vecchia-romagna-nera",
    name: "Vecchia Romagna Nera",
    country: null,
    productCount: 4,
    needsReview: false,
    description: "4 etichette Vecchia Romagna Nera presenti nella selezione.",
    story:
      "La raccolta Vecchia Romagna Nera comprende brandy e altri distillati disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/20-0030-brandy-vecchia-romagna-nera-miniatures-38-vetr-481080bc5f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/20-0030-brandy-vecchia-romagna-nera-miniatures-38-vetr-481080bc5f.webp",
      width: 482,
      height: 800,
      alt: "Confezione di Vecchia Romagna Nera Miniatures",
      position: "center",
    },
  },
  {
    slug: "vecchio",
    name: "Vecchio",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Vecchio presenti nella selezione.",
    story:
      "La raccolta Vecchio comprende amari disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-liquore-vecchio-amaro-del-capo-35-ct-6-6ac51c7783.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-liquore-vecchio-amaro-del-capo-35-ct-6-6ac51c7783.webp",
      width: 458,
      height: 458,
      alt: "Confezione di Vecchio Amaro Del Capo",
      position: "center",
    },
  },
  {
    slug: "villa",
    name: "Villa",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Villa presenti nella selezione.",
    story:
      "La raccolta Villa comprende gin, liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-villa-ascenti-41-ct-6-dcb7011011.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-villa-ascenti-41-ct-6-dcb7011011.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Villa Ascenti",
      position: "center",
    },
  },
  {
    slug: "vka",
    name: "Vka",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Vka presenti nella selezione.",
    story:
      "La raccolta Vka comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1500-vodka-vka-organic-bio-40-magnum-bc97e39704.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1500-vodka-vka-organic-bio-40-magnum-bc97e39704.webp",
      width: 334,
      height: 500,
      alt: "Confezione di Vka Organic BIO",
      position: "center",
    },
  },
  {
    slug: "von-hallers",
    name: "Von Hallers",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Von Hallers presenti nella selezione.",
    story:
      "La raccolta Von Hallers comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-gin-von-hallers-44-ct-6-ca30a284a5.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-gin-von-hallers-44-ct-6-ca30a284a5.webp",
      width: 667,
      height: 1000,
      alt: "Confezione di Von Hallers",
      position: "center",
    },
  },
  {
    slug: "vor",
    name: "Vor",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Vor presenti nella selezione.",
    story:
      "La raccolta Vor comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-vor-islanda-47-ct-6-cc91621a5d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-vor-islanda-47-ct-6-cc91621a5d.webp",
      width: 581,
      height: 1600,
      alt: "Confezione di Vor Islanda",
      position: "center",
    },
  },
  {
    slug: "warner-edwards",
    name: "Warner Edwards",
    country: null,
    productCount: 6,
    needsReview: false,
    description: "6 etichette Warner Edwards presenti nella selezione.",
    story:
      "La raccolta Warner Edwards comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-warner-edwards-harrington-dry-44-ct-6-new-aa84d08bdb.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-warner-edwards-harrington-dry-44-ct-6-new-aa84d08bdb.webp",
      width: 1002,
      height: 1600,
      alt: "Confezione di Warner Edwards Harrington Dry",
      position: "center",
    },
  },
  {
    slug: "west-cork",
    name: "West Cork",
    country: null,
    productCount: 9,
    needsReview: false,
    description: "9 etichette West Cork presenti nella selezione.",
    story:
      "La raccolta West Cork comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-irish-whiskey-west-cork-16-y-o-single-malt-bourbo-73b3420ec7.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-irish-whiskey-west-cork-16-y-o-single-malt-bourbo-73b3420ec7.webp",
      width: 979,
      height: 1079,
      alt: "Confezione di West Cork 16 Y.O. Single Malt Bourbon Cask",
      position: "center",
    },
  },
  {
    slug: "whitley-neill",
    name: "Whitley Neill",
    country: null,
    productCount: 33,
    needsReview: false,
    description: "33 etichette Whitley Neill presenti nella selezione.",
    story:
      "La raccolta Whitley Neill comprende vodka, gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-whitley-neill-rhubarb-43-e066076600.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-whitley-neill-rhubarb-43-e066076600.webp",
      width: 544,
      height: 1600,
      alt: "Confezione di Whitley Neill Rhubarb",
      position: "center",
    },
  },
  {
    slug: "wild",
    name: "Wild",
    country: null,
    productCount: 11,
    needsReview: false,
    description: "11 etichette Wild presenti nella selezione.",
    story:
      "La raccolta Wild comprende vodka, gin, liquori, whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-wild-wombat-australiana-40-ct-6-a215fdde18.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-wild-wombat-australiana-40-ct-6-a215fdde18.webp",
      width: 800,
      height: 1318,
      alt: "Confezione di Wild Wombat Australiana",
      position: "center",
    },
  },
  {
    slug: "willett",
    name: "Willett",
    country: null,
    productCount: 2,
    needsReview: true,
    description: "2 etichette Willett presenti nella selezione.",
    story:
      "La raccolta Willett comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1750-bourbon-whiskey-willett-pot-still-reserve-47-magn-4da7e066e9.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1750-bourbon-whiskey-willett-pot-still-reserve-47-magn-4da7e066e9.webp",
      width: 1068,
      height: 1580,
      alt: "Confezione di Willett Pot Still Reserve",
      position: "center",
    },
  },
  {
    slug: "windspiel",
    name: "Windspiel",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Windspiel presenti nella selezione.",
    story:
      "La raccolta Windspiel comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-gin-windspiel-premium-dry-47-ct-6-50628c9722.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-gin-windspiel-premium-dry-47-ct-6-50628c9722.webp",
      width: 1200,
      height: 1464,
      alt: "Confezione di Windspiel Premium Dry",
      position: "center",
    },
  },
  {
    slug: "wint-e-lila",
    name: "Wint & Lila",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Wint & Lila presenti nella selezione.",
    story:
      "La raccolta Wint & Lila comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-wint-e-lila-40-ct-6-8865f0de5a.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-wint-e-lila-40-ct-6-8865f0de5a.webp",
      width: 900,
      height: 900,
      alt: "Confezione di Wint & Lila",
      position: "center",
    },
  },
  {
    slug: "wood-s",
    name: "Wood's",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Wood's presenti nella selezione.",
    story:
      "La raccolta Wood's comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-american-whiskey-wood-s-tenderfoot-45-1b819015e4.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-american-whiskey-wood-s-tenderfoot-45-1b819015e4.webp",
      width: 750,
      height: 859,
      alt: "Confezione di Wood's Tenderfoot",
      position: "center",
    },
  },
  {
    slug: "woodford-reserve",
    name: "Woodford Reserve",
    country: null,
    productCount: 5,
    needsReview: false,
    description: "5 etichette Woodford Reserve presenti nella selezione.",
    story:
      "La raccolta Woodford Reserve comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/12-0050-bourbon-whiskey-woodford-reserve-43-2-pet-ct-1-589f157bcd.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/12-0050-bourbon-whiskey-woodford-reserve-43-2-pet-ct-1-589f157bcd.webp",
      width: 1200,
      height: 1496,
      alt: "Confezione di Woodford Reserve",
      position: "center",
    },
  },
  {
    slug: "wray-e-nephew",
    name: "Wray & Nephew",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Wray & Nephew presenti nella selezione.",
    story:
      "La raccolta Wray & Nephew comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-wray-e-nephew-overproof-63-ct-6-new-6a66276ce2.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-wray-e-nephew-overproof-63-ct-6-new-6a66276ce2.webp",
      width: 536,
      height: 1600,
      alt: "Confezione di Wray & Nephew Overproof",
      position: "center",
    },
  },
  {
    slug: "writers",
    name: "Writers",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Writers presenti nella selezione.",
    story:
      "La raccolta Writers comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-irish-whiskey-writers-tears-cask-strength-54-8-5be718c7d2.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-irish-whiskey-writers-tears-cask-strength-54-8-5be718c7d2.webp",
      width: 900,
      height: 1600,
      alt: "Confezione di Writers Tears Cask Strength",
      position: "center",
    },
  },
  {
    slug: "xellent",
    name: "Xellent",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Xellent presenti nella selezione.",
    story:
      "La raccolta Xellent comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-vodka-xellent-swiss-vodka-40-86e2a39a8e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-vodka-xellent-swiss-vodka-40-86e2a39a8e.webp",
      width: 1200,
      height: 1200,
      alt: "Confezione di Xellent Swiss Vodka",
      position: "center",
    },
  },
  {
    slug: "xenta",
    name: "Xenta",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Xenta presenti nella selezione.",
    story:
      "La raccolta Xenta comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-assenzio-xenta-70-ct-6-87f76185d1.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-assenzio-xenta-70-ct-6-87f76185d1.webp",
      width: 1000,
      height: 1000,
      alt: "Confezione di Xenta",
      position: "center",
    },
  },
  {
    slug: "xiaman",
    name: "Xiaman",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Xiaman presenti nella selezione.",
    story:
      "La raccolta Xiaman comprende tequila e mezcal disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-mezcal-xiaman-44-ct-6-1e46092172.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-mezcal-xiaman-44-ct-6-1e46092172.webp",
      width: 734,
      height: 1600,
      alt: "Confezione di Xiaman",
      position: "center",
    },
  },
  {
    slug: "xibal",
    name: "Xibal",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Xibal presenti nella selezione.",
    story:
      "La raccolta Xibal comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-xibal-45-ct-6-021e987a5f.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-xibal-45-ct-6-021e987a5f.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Xibal",
      position: "center",
    },
  },
  {
    slug: "xoriguer-mahon-38",
    name: "Xoriguer Mahon 38%",
    country: null,
    productCount: 3,
    needsReview: false,
    description: "3 etichette Xoriguer Mahon 38% presenti nella selezione.",
    story:
      "La raccolta Xoriguer Mahon 38% comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-xoriguer-mahon-38-ceramica-ct-6-61f32292d4.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-xoriguer-mahon-38-ceramica-ct-6-61f32292d4.webp",
      width: 1024,
      height: 1024,
      alt: "Confezione di Xoriguer Mahon",
      position: "center",
    },
  },
  {
    slug: "yamazakura-blended",
    name: "Yamazakura Blended",
    country: null,
    productCount: 2,
    needsReview: false,
    description: "2 etichette Yamazakura Blended presenti nella selezione.",
    story:
      "La raccolta Yamazakura Blended comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-japanese-whisky-yamazakura-blended-black-label-40-5d26cf0a8d.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-japanese-whisky-yamazakura-blended-black-label-40-5d26cf0a8d.webp",
      width: 1200,
      height: 1370,
      alt: "Confezione di Yamazakura Blended Black Label",
      position: "center",
    },
  },
  {
    slug: "yellow",
    name: "Yellow",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Yellow presenti nella selezione.",
    story:
      "La raccolta Yellow comprende whisky e whiskey disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-irish-whiskey-yellow-spot-12-y-o-46-ct-3-1c35b56234.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-irish-whiskey-yellow-spot-12-y-o-46-ct-3-1c35b56234.webp",
      width: 555,
      height: 555,
      alt: "Confezione di Yellow Spot 12 Y.O.",
      position: "center",
    },
  },
  {
    slug: "yeni",
    name: "Yeni",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Yeni presenti nella selezione.",
    story:
      "La raccolta Yeni comprende liquori disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-distillato-yeni-raky-45-ct-6-turchia-8601351919.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-distillato-yeni-raky-45-ct-6-turchia-8601351919.webp",
      width: 593,
      height: 1600,
      alt: "Confezione di Yeni Raky",
      position: "center",
    },
  },
  {
    slug: "yu",
    name: "Yu",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Yu presenti nella selezione.",
    story:
      "La raccolta Yu comprende gin disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-gin-yu-43-ct-6-b14ade666e.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-gin-yu-43-ct-6-b14ade666e.webp",
      width: 800,
      height: 800,
      alt: "Confezione di Yu",
      position: "center",
    },
  },
  {
    slug: "yzaguirre",
    name: "Yzaguirre",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Yzaguirre presenti nella selezione.",
    story:
      "La raccolta Yzaguirre comprende vermouth disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-vermouth-yzaguirre-blanco-reserva18-1-litro-f585e2697c.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-vermouth-yzaguirre-blanco-reserva18-1-litro-f585e2697c.webp",
      width: 300,
      height: 250,
      alt: "Confezione di Yzaguirre Blanco Reserva18% 1 Litro",
      position: "center",
    },
  },
  {
    slug: "zacapa",
    name: "Zacapa",
    country: null,
    productCount: 8,
    needsReview: false,
    description: "8 etichette Zacapa presenti nella selezione.",
    story:
      "La raccolta Zacapa comprende rum e rhum disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0700-rum-zacapa-el-alma-40-ct-6-257d2a1f4b.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0700-rum-zacapa-el-alma-40-ct-6-257d2a1f4b.webp",
      width: 933,
      height: 1400,
      alt: "Confezione di Zacapa *el Alma*",
      position: "center",
    },
  },
  {
    slug: "zlatogor",
    name: "Zlatogor",
    country: null,
    productCount: 1,
    needsReview: true,
    description: "1 etichetta Zlatogor presenti nella selezione.",
    story:
      "La raccolta Zlatogor comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/0500-vodka-zlatogor-m16-mitra-38-gbox-941c7b8f00.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/0500-vodka-zlatogor-m16-mitra-38-gbox-941c7b8f00.webp",
      width: 1000,
      height: 1000,
      alt: 'Confezione di Zlatogor M16 "mitra"',
      position: "center",
    },
  },
  {
    slug: "zubrowka",
    name: "Zubrowka",
    country: null,
    productCount: 7,
    needsReview: false,
    description: "7 etichette Zubrowka presenti nella selezione.",
    story:
      "La raccolta Zubrowka comprende vodka disponibili nel catalogo La Botola e Mietto.",
    media: {
      src: "/images/products/catalog-2026-07/full/1000-vodka-zubrowka-biala-37-5-1-litro-ct-12-41fa01a0df.webp",
      thumbnailSrc:
        "/images/products/catalog-2026-07/thumb/1000-vodka-zubrowka-biala-37-5-1-litro-ct-12-41fa01a0df.webp",
      width: 1200,
      height: 1600,
      alt: "Confezione di Zubrowka Biala",
      position: "center",
    },
  },
] as const satisfies readonly CatalogBrand[];

const rawBrandBySlug = new Map<string, CatalogBrand>(
  rawCatalogBrands.map((brand) => [brand.slug, brand]),
);
const approvedBrandBySlug = new Map<
  string,
  (typeof approvedCatalogBrands)[number]
>(approvedCatalogBrands.map((brand) => [brand.slug, brand]));
const productsByBrand = new Map<string, (typeof catalogProducts)[number][]>();

for (const product of catalogProducts) {
  if (!product.brandSlug) continue;

  const products = productsByBrand.get(product.brandSlug) ?? [];
  products.push(product);
  productsByBrand.set(product.brandSlug, products);
}

export const catalogBrands: readonly CatalogBrand[] = Array.from(
  productsByBrand,
  ([slug, products]) => {
    const firstProduct = products[0];
    const rawBrand = rawBrandBySlug.get(slug);
    const approvedBrand = approvedBrandBySlug.get(slug);
    const name = approvedBrand?.name ?? rawBrand?.name;

    if (!name || !firstProduct) {
      throw new Error(`Definizione marchio mancante per lo slug ${slug}.`);
    }

    const productCount = products.length;

    return {
      slug,
      name,
      country: rawBrand?.country ?? null,
      productCount,
      needsReview: approvedBrand ? false : (rawBrand?.needsReview ?? true),
      description:
        !approvedBrand && rawBrand
          ? rawBrand.description
          : `${productCount} ${productCount === 1 ? "etichetta" : "etichette"} ${name} ${productCount === 1 ? "presente" : "presenti"} nella selezione.`,
      story:
        !approvedBrand && rawBrand
          ? rawBrand.story
          : `La selezione ${name} riunisce le referenze disponibili nel catalogo La Botola e Mietto.`,
      media: rawBrand?.media ?? firstProduct.media[0],
    } satisfies CatalogBrand;
  },
).sort((left, right) => left.name.localeCompare(right.name, "it"));
