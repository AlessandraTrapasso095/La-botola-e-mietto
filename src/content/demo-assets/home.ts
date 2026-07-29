import { demoMedia, type DemoMediaAsset } from "@/content/demo-assets/media";

export type DemoProduct = {
  code: string;
  name: string;
  brand: string;
  category: string;
  volume: string;
  netPriceMinor: bigint;
  media: DemoMediaAsset;
  badge?: string;
};

export const homeCategories = [
  {
    title: "Whisky & Whiskey",
    eyebrow: "Scozia, Irlanda, Americhe, Giappone",
    description:
      "Single malt, blended, bourbon e rye selezionati per origine e carattere.",
    href: "/categoria/whisky-whiskey",
    media: demoMedia.whiskyCellar,
    featured: true,
  },
  {
    title: "Rum & Rhum",
    eyebrow: "Caraibi e America Latina",
    description: "Tradizioni di melassa, agricole e riserve da meditazione.",
    href: "/categoria/rum-rhum",
    media: demoMedia.rumCellar,
  },
  {
    title: "Gin",
    eyebrow: "Botaniche e territorio",
    description: "London Dry, distilled e interpretazioni contemporanee.",
    href: "/categoria/gin",
    media: demoMedia.ginBotanicals,
  },
  {
    title: "Tequila & Mezcal",
    eyebrow: "Agave e maestria",
    description: "Blanco, reposado, añejo e mezcal dalla forte identità.",
    href: "/categoria/tequila-mezcal",
    media: demoMedia.curation,
  },
  {
    title: "Amari & Vermouth",
    eyebrow: "L’arte italiana del fine pasto",
    description:
      "Erbe, spezie e ricette storiche per degustazione e miscelazione.",
    href: "/categoria/amari",
    media: demoMedia.ginBotanicals,
  },
  {
    title: "Bottiglie Rare",
    eyebrow: "Edizioni limitate e da collezione",
    description:
      "Etichette ricercate, confezioni speciali e release fuori catalogo.",
    href: "/categoria/bottiglie-rare",
    media: demoMedia.rareCollection,
  },
] as const;

export const newArrivalProducts = [
  {
    code: "GIN-CAP-43",
    name: "Caprisius 43 Gin",
    brand: "Caprisius",
    category: "Distilled Gin",
    volume: "70 cl",
    netPriceMinor: 3_190n,
    media: demoMedia.ginMediterranean,
    badge: "Nuovo",
  },
  {
    code: "GIN-HEN-ANOTHER",
    name: "Hendrick’s Another Gin",
    brand: "Hendrick’s",
    category: "London Dry Gin",
    volume: "70 cl",
    netPriceMinor: 3_062n,
    media: demoMedia.ginBotanicals,
    badge: "Nuovo",
  },
  {
    code: "GIN-ROKU-NORYO",
    name: "Roku Noryo Tea Edition",
    brand: "Roku",
    category: "Japanese Gin",
    volume: "70 cl",
    netPriceMinor: 3_138n,
    media: demoMedia.ginTea,
    badge: "Edizione speciale",
  },
  {
    code: "WHI-YAM-18",
    name: "Yamazaki 18 Years Old",
    brand: "Yamazaki",
    category: "Single Malt Giapponese",
    volume: "70 cl",
    netPriceMinor: 60_644n,
    media: demoMedia.whiskyCellar,
    badge: "Nuovo",
  },
] as const satisfies readonly DemoProduct[];

export const rareProducts = [
  {
    code: "TEQ-CLA-GOLD",
    name: "Clase Azul Gold",
    brand: "Clase Azul",
    category: "Tequila Joven",
    volume: "70 cl",
    netPriceMinor: 55_488n,
    media: demoMedia.rareCollection,
    badge: "Collezione",
  },
  {
    code: "WHI-MAC-RARE-23",
    name: "Macallan Rare Cask 2023",
    brand: "The Macallan",
    category: "Single Malt Scotch",
    volume: "70 cl",
    netPriceMinor: 34_952n,
    media: demoMedia.rareCollection,
    badge: "Rare Cask",
  },
  {
    code: "WHI-GLEN-23-GC",
    name: "Glenfiddich 23 Grand Cru",
    brand: "Glenfiddich",
    category: "Single Malt Scotch",
    volume: "70 cl",
    netPriceMinor: 30_452n,
    media: demoMedia.whiskyCellar,
    badge: "Prestige",
  },
  {
    code: "RUM-DIP-AMB",
    name: "Diplomatico Ambassador",
    brand: "Diplomatico",
    category: "Rum Invecchiato",
    volume: "70 cl",
    netPriceMinor: 18_532n,
    media: demoMedia.rumCellar,
    badge: "Selezione",
  },
] as const satisfies readonly DemoProduct[];

export const featuredBrands = [
  "The Macallan",
  "Yamazaki",
  "Zacapa",
  "Hendrick’s",
  "Lagavulin",
  "Don Julio",
  "Glenfiddich",
  "Diplomatico",
] as const;

export const serviceHighlights = [
  {
    number: "01",
    title: "Selezione competente",
    description:
      "Una ricerca costruita su esperienza diretta, provenienze e qualità reale nel bicchiere.",
  },
  {
    number: "02",
    title: "Imballaggio protettivo",
    description:
      "Ogni bottiglia viene preparata con cura per affrontare il viaggio in sicurezza.",
  },
  {
    number: "03",
    title: "Assistenza personale",
    description:
      "Consigli dedicati per un regalo, una degustazione o una bottiglia da collezione.",
  },
] as const;

export const instagramStories = [
  {
    title: "Dettagli di cantina",
    media: demoMedia.whiskyCellar,
    position: "center 38%",
  },
  {
    title: "Nuove botaniche",
    media: demoMedia.ginBotanicals,
    position: "center 44%",
  },
  {
    title: "La selezione del giorno",
    media: demoMedia.curation,
    position: "30% center",
  },
  {
    title: "Etichette da collezione",
    media: demoMedia.rareCollection,
    position: "center 48%",
  },
] as const;

export const demoSearchTerms = [
  "Whisky giapponese",
  "Rum da meditazione",
  "Gin italiani",
] as const;
