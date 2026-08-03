export const primaryCatalogCategories = [
  "Whisky | Whiskey",
  "Rum | Rhum",
  "Gin",
  "Vodka",
  "Cognac",
  "Armagnac",
  "Brandy | altri distillati",
  "Tequila | Mezcal",
  "Grappe",
  "Vini",
  "Champagne | Spumanti",
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
  { label: "In offerta", href: "/in-offerta" },
  { label: "Distillati rari", href: "/#distillati-rari" },
  { label: "Marchi", href: "/marchi" },
  { label: "La nostra selezione", href: "/#la-nostra-selezione" },
] as const;

const menuCategoryRoutes: Record<string, string> = {
  "Single Malt Scotch": "/categoria/whisky-whiskey",
  "Blended Scotch": "/categoria/whisky-whiskey",
  "Irish Whiskey": "/categoria/whisky-whiskey",
  "Bourbon | Rye": "/categoria/whisky-whiskey",
  "Whisky Giapponesi": "/categoria/whisky-whiskey",
  "Rum Invecchiati": "/categoria/rum-rhum",
  "Rum Tradizionali": "/categoria/rum-rhum",
  "Rhum Agricole": "/categoria/rum-rhum",
  Cachaça: "/categoria/rum-rhum",
  Gin: "/categoria/gin",
  Vodka: "/categoria/vodka",
  Tequila: "/categoria/tequila-mezcal",
  Mezcal: "/categoria/tequila-mezcal",
  Calvados: "/categoria/brandy-distillati",
  Brandy: "/categoria/brandy-distillati",
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
};

export function getCatalogMenuHref(label: string) {
  return menuCategoryRoutes[label] ?? "/catalogo";
}

export type CatalogMenuLink = {
  label: string;
  href: string;
};

export type CatalogMenuGroup = {
  title: string;
  description: string;
  links: readonly CatalogMenuLink[];
};

function createCategoryLinks(labels: readonly string[]): CatalogMenuLink[] {
  return labels.map((label) => ({ label, href: getCatalogMenuHref(label) }));
}

const catalogMenuGroups = [
  {
    title: "Whisky | Whiskey",
    description: "Dalle isole scozzesi alle distillerie del Giappone.",
    links: createCategoryLinks([
      "Single Malt Scotch",
      "Blended Scotch",
      "Irish Whiskey",
      "Bourbon | Rye",
      "Whisky Giapponesi",
    ]),
  },
  {
    title: "Rum | Rhum",
    description: "Melassa, puro succo di canna e lunghe maturazioni.",
    links: createCategoryLinks([
      "Rum Invecchiati",
      "Rum Tradizionali",
      "Rhum Agricole",
      "Cachaça",
    ]),
  },
  {
    title: "Distillati",
    description: "Classici internazionali e produzioni di ricerca.",
    links: createCategoryLinks([
      "Gin",
      "Vodka",
      "Tequila",
      "Mezcal",
      "Brandy",
      "Calvados",
    ]),
  },
  {
    title: "Fine degustazione",
    description: "Selezioni italiane e grandi tradizioni europee.",
    links: createCategoryLinks([
      "Cognac",
      "Armagnac",
      "Grappe",
      "Amari",
      "Vermouth",
    ]),
  },
  {
    title: "Cantina",
    description: "Vini, bollicine e proposte per l’aperitivo.",
    links: createCategoryLinks([
      "Vini",
      "Champagne",
      "Spumanti",
      "Aperitivi",
      "Birre",
    ]),
  },
] as const satisfies readonly CatalogMenuGroup[];

export function createCatalogMenuGroups(
  collectionLinks: readonly CatalogMenuLink[],
): readonly CatalogMenuGroup[] {
  if (collectionLinks.length === 0) return catalogMenuGroups;

  return [
    ...catalogMenuGroups,
    {
      title: "Collezioni",
      description: "Bottiglie ricercate per intenditori e collezionisti.",
      links: collectionLinks,
    },
  ];
}
