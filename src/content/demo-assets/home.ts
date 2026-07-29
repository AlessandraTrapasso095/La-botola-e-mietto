import { demoMedia } from "@/content/demo-assets/media";

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
