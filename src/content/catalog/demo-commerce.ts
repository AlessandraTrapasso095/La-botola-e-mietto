export const demoCartLines = [
  {
    productSlug: "the-macallan-12-double-cask",
    quantity: 1,
  },
] as const;

export const demoWishlistSlugs = ["yamazaki-18-years-old"] as const;

export const catalogBanners = {
  catalog: {
    eyebrow: "La selezione",
    title: "Bottiglie scelte per essere ricordate.",
    description:
      "Una collezione costruita tra grandi classici, nuove release e distillati dalla disponibilità limitata.",
  },
  shipping: {
    title: "La cura continua durante il viaggio.",
    description:
      "Imballaggio protettivo e spedizione gratuita in Italia per ordini superiori a 60 €.",
  },
} as const;

export const newsletterContent = {
  eyebrow: "Lettere dalla cantina",
  title: "Nuove release, storie e bottiglie da seguire.",
  description:
    "Una selezione editoriale, inviata con misura. Nessuna comunicazione superflua.",
} as const;

export const instagramContent = {
  handle: "@labotolaemietto",
  title: "Dietro ogni bottiglia, una storia.",
} as const;
