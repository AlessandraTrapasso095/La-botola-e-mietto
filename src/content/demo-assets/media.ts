export type DemoMediaAsset = {
  src: string;
  thumbnailSrc?: string;
  alt: string;
  width: number;
  height: number;
  position?: string;
};

export const demoMedia = {
  hero: {
    src: "/images/demo/hero.webp",
    alt: "Bottiglia di distillato ambrato e bicchiere in una cantina scura",
    width: 1672,
    height: 941,
    position: "68% center",
  },
  whiskyCellar: {
    src: "/images/demo/whisky-cellar.webp",
    alt: "Decanter di whisky illuminato accanto a una botte in rovere",
    width: 1122,
    height: 1402,
    position: "center",
  },
  rumCellar: {
    src: "/images/demo/rum-cellar.webp",
    alt: "Bottiglia di rum ambrato e bicchiere nella penombra della cantina",
    width: 1122,
    height: 1402,
    position: "center",
  },
  ginBotanicals: {
    src: "/images/demo/gin-botanicals.webp",
    alt: "Bottiglia di gin con ginepro, rosmarino e scorza di limone",
    width: 1122,
    height: 1402,
    position: "center",
  },
  ginMediterranean: {
    src: "/images/demo/gin-mediterranean.webp",
    alt: "Bottiglia di gin con foglie mediterranee e scorza di agrumi",
    width: 1000,
    height: 1333,
    position: "center",
  },
  ginTea: {
    src: "/images/demo/gin-tea.webp",
    alt: "Bottiglia di gin con botaniche orientali e tazza da tè",
    width: 1000,
    height: 1333,
    position: "center",
  },
  rareCollection: {
    src: "/images/demo/rare-collection.webp",
    alt: "Bottiglia da collezione custodita in un elegante cofanetto scuro",
    width: 1122,
    height: 1402,
    position: "center",
  },
  curation: {
    src: "/images/demo/curation.webp",
    alt: "Mani esperte esaminano una bottiglia nella penombra della cantina",
    width: 1536,
    height: 1024,
    position: "center",
  },
} as const satisfies Record<string, DemoMediaAsset>;
