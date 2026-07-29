export const primaryCatalogCategories = [
  "Whisky e Whiskey",
  "Rum e Rhum",
  "Gin",
  "Vodka",
  "Cognac",
  "Armagnac",
  "Tequila e Mezcal",
  "Grappe",
  "Vini",
  "Champagne e Spumanti",
  "Liquori",
  "Amari",
  "Vermouth",
  "Aperitivi",
  "Birre",
  "Bottiglie rare",
  "Etichette di pregio",
  "Prodotti da collezione",
] as const;

export const primaryNavigation = [
  { label: "Catalogo", href: "/catalogo", menu: true },
  { label: "Nuovi arrivi", href: "/#nuovi-arrivi" },
  { label: "Distillati rari", href: "/categoria/bottiglie-rare" },
  { label: "Marchi", href: "/marchi" },
  { label: "La nostra selezione", href: "/#la-nostra-selezione" },
] as const;

const menuCategoryRoutes: Record<string, string> = {
  "Single Malt Scotch": "/categoria/whisky-whiskey",
  "Blended Scotch": "/categoria/whisky-whiskey",
  "Irish Whiskey": "/categoria/whisky-whiskey",
  "Bourbon & Rye": "/categoria/whisky-whiskey",
  "Whisky Giapponesi": "/categoria/whisky-whiskey",
  "Rum Invecchiati": "/categoria/rum-rhum",
  "Rum Tradizionali": "/categoria/rum-rhum",
  "Rhum Agricole": "/categoria/rum-rhum",
  Cachaça: "/categoria/rum-rhum",
  "Edizioni da Collezione": "/categoria/bottiglie-rare",
  Gin: "/categoria/gin",
  Vodka: "/categoria/vodka",
  Tequila: "/categoria/tequila-mezcal",
  Mezcal: "/categoria/tequila-mezcal",
  Calvados: "/catalogo",
  Cognac: "/categoria/cognac",
  Armagnac: "/categoria/armagnac",
  Grappe: "/categoria/grappe",
  Amari: "/categoria/amari",
  Vermouth: "/categoria/vermouth",
  Vini: "/categoria/vini",
  Champagne: "/categoria/champagne-spumanti",
  Spumanti: "/categoria/champagne-spumanti",
  Aperitivi: "/categoria/aperitivi",
  Birre: "/categoria/birre",
  "Bottiglie Rare": "/categoria/bottiglie-rare",
  "Etichette di Pregio": "/categoria/bottiglie-rare",
  "Nuovi Arrivi": "/#nuovi-arrivi",
  "Confezioni Regalo": "/catalogo",
};

export function getCatalogMenuHref(label: string) {
  return menuCategoryRoutes[label] ?? "/catalogo";
}

export const catalogMenuGroups = [
  {
    title: "Whisky & Whiskey",
    description: "Dalle isole scozzesi alle distillerie del Giappone.",
    links: [
      "Single Malt Scotch",
      "Blended Scotch",
      "Irish Whiskey",
      "Bourbon & Rye",
      "Whisky Giapponesi",
    ],
  },
  {
    title: "Rum & Rhum",
    description: "Melassa, puro succo di canna e lunghe maturazioni.",
    links: [
      "Rum Invecchiati",
      "Rum Tradizionali",
      "Rhum Agricole",
      "Cachaça",
      "Edizioni da Collezione",
    ],
  },
  {
    title: "Distillati",
    description: "Classici internazionali e produzioni di ricerca.",
    links: ["Gin", "Vodka", "Tequila", "Mezcal", "Calvados"],
  },
  {
    title: "Fine degustazione",
    description: "Selezioni italiane e grandi tradizioni europee.",
    links: ["Cognac", "Armagnac", "Grappe", "Amari", "Vermouth"],
  },
  {
    title: "Cantina",
    description: "Vini, bollicine e proposte per l’aperitivo.",
    links: ["Vini", "Champagne", "Spumanti", "Aperitivi", "Birre"],
  },
  {
    title: "Collezioni",
    description: "Bottiglie ricercate per intenditori e collezionisti.",
    links: [
      "Bottiglie Rare",
      "Etichette di Pregio",
      "Nuovi Arrivi",
      "Confezioni Regalo",
    ],
  },
] as const;
