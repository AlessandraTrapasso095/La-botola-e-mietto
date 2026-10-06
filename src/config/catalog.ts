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
  "Single Malt Scotch": "/categoria/whisky-whiskey/whisky-whiskey--single-malt-scotch",
  "Blended Scotch": "/categoria/whisky-whiskey/whisky-whiskey--blended-scotch",
  "Irish Whiskey": "/categoria/whisky-whiskey/irish-whiskey",
  "Bourbon | Rye": "/categoria/whisky-whiskey/bourbon-rye",
  "Whisky Giapponesi": "/categoria/whisky-whiskey/whisky-giapponesi",
  "Rum Invecchiati": "/categoria/rum-rhum/rum-invecchiati",
  "Rum Tradizionali": "/categoria/rum-rhum/rum-tradizionali",
  "Rhum Agricole": "/categoria/rum-rhum/rhum-agricole",
  Cachaça: "/categoria/rum-rhum/cachaca",
  Gin: "/categoria/gin",
  Vodka: "/categoria/vodka",
  Tequila: "/categoria/tequila-mezcal/tequila",
  Mezcal: "/categoria/tequila-mezcal/mezcal",
  Brandy: "/categoria/brandy",
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
  "Altre Birre / Specialità":
    "/categoria/birre/altre-birre-specialita",
  "Barley Wine & Strong Ale":
    "/categoria/birre/barley-wine-e-strong-ale",
  "Belgian Ale":
    "/categoria/birre/belgian-ale",
  "Birre Analcoliche":
    "/categoria/birre/birre-analcoliche",
  "Birre Senza Glutine":
    "/categoria/birre/birre-senza-glutine",
  "Blanche & Witbier":
    "/categoria/birre/blanche-e-witbier",
  "Dubbel, Tripel & Quadrupel":
    "/categoria/birre/dubbel-tripel-e-quadrupel",
  "IPA & Pale Ale":
    "/categoria/birre/ipa-e-pale-ale",
  "Lager & Pils":
    "/categoria/birre/lager-e-pils",
  "Lambic, Gueuze & Kriek":
    "/categoria/birre/lambic-gueuze-e-kriek",
  Saison:
    "/categoria/birre/saison",
  "Sour & Fruit Beer":
    "/categoria/birre/sour-e-fruit-beer",
  "Stout & Porter":
    "/categoria/birre/stout-e-porter",
  "Trappiste & Abbazia":
    "/categoria/birre/trappiste-e-abbazia",
  "Weiss & Weizen":
    "/categoria/birre/weiss-e-weizen",
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
      "Aperitivi",
      "Birre",
      "Lager & Pils",
      "IPA & Pale Ale",
      "Belgian Ale",
      "Blanche & Witbier",
      "Weiss & Weizen",
      "Dubbel, Tripel & Quadrupel",
      "Trappiste & Abbazia",
      "Lambic, Gueuze & Kriek",
      "Stout & Porter",
      "Saison",
      "Sour & Fruit Beer",
      "Barley Wine & Strong Ale",
      "Birre Analcoliche",
      "Birre Senza Glutine",
      "Altre Birre / Specialità",
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
