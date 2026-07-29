import { demoMedia } from "@/content/demo-assets/media";
import type { CatalogBrand } from "@/content/catalog/types";

export const catalogBrands = [
  {
    slug: "the-macallan",
    name: "The Macallan",
    country: "Scozia",
    description:
      "Single malt dello Speyside riconosciuti per maturazioni attente e profili profondi.",
    story:
      "La selezione The Macallan riunisce espressioni Double Cask, Sherry Oak e release da collezione, con un filo conduttore fatto di struttura, frutta matura e spezie.",
    media: demoMedia.whiskyCellar,
  },
  {
    slug: "yamazaki",
    name: "Yamazaki",
    country: "Giappone",
    description:
      "La distilleria pioniera del single malt giapponese, elegante e stratificato.",
    story:
      "Le maturazioni in botti differenti e la sensibilità nipponica per l’equilibrio rendono Yamazaki una presenza centrale nelle collezioni contemporanee.",
    media: demoMedia.rareCollection,
  },
  {
    slug: "lagavulin",
    name: "Lagavulin",
    country: "Scozia",
    description:
      "Il carattere torbato di Islay in whisky intensi, marini e persistenti.",
    story:
      "Fumo, note iodate e una ricca componente maltata definiscono una gamma capace di attraversare età e affinamenti mantenendo una firma inconfondibile.",
    media: demoMedia.whiskyCellar,
  },
  {
    slug: "glenfiddich",
    name: "Glenfiddich",
    country: "Scozia",
    description:
      "Single malt dello Speyside tra tradizione familiare e ricerca sulle maturazioni.",
    story:
      "Una distilleria storica con una gamma ampia, dalle espressioni classiche alle cuvée di prestigio dedicate alle grandi occasioni.",
    media: demoMedia.whiskyCellar,
  },
  {
    slug: "diplomatico",
    name: "Diplomatico",
    country: "Venezuela",
    description:
      "Rum venezuelani morbidi e complessi, apprezzati nella degustazione lenta.",
    story:
      "Stili di distillazione differenti e lunghi affinamenti costruiscono rum generosi, con note di frutta scura, cacao e spezie.",
    media: demoMedia.rumCellar,
  },
  {
    slug: "zacapa",
    name: "Zacapa",
    country: "Guatemala",
    description: "Rum d’altura affinati con un sistema ispirato alla solera.",
    story:
      "La maturazione in quota e l’uso di botti con storie diverse danno vita a profili avvolgenti, equilibrati e immediatamente riconoscibili.",
    media: demoMedia.rumCellar,
  },
  {
    slug: "hendricks",
    name: "Hendrick’s",
    country: "Scozia",
    description:
      "Gin contemporanei dal carattere floreale e da release stagionali ricercate.",
    story:
      "Accanto alla firma di rosa e cetriolo, le edizioni speciali esplorano botaniche e atmosfere differenti senza perdere eleganza.",
    media: demoMedia.ginBotanicals,
  },
  {
    slug: "caprisius",
    name: "Caprisius",
    country: "Italia",
    description:
      "Gin mediterranei costruiti intorno a botaniche, agrumi e identità territoriale.",
    story:
      "Una lettura italiana del gin, nitida e profumata, pensata per esprimersi sia liscia sia in un servizio essenziale.",
    media: demoMedia.ginMediterranean,
  },
  {
    slug: "roku",
    name: "Roku",
    country: "Giappone",
    description:
      "Gin giapponese preciso e armonico, con botaniche legate alle stagioni.",
    story:
      "La composizione mette in dialogo botaniche tradizionali e sensibilità contemporanea, con un profilo pulito e molto versatile.",
    media: demoMedia.ginTea,
  },
  {
    slug: "don-julio",
    name: "Don Julio",
    country: "Messico",
    description:
      "Tequila di riferimento, dall’espressione blanco alle lunghe maturazioni.",
    story:
      "Agave blu, selezione della materia prima e affinamenti misurati definiscono tequila luminose, morbide e coerenti.",
    media: demoMedia.curation,
  },
  {
    slug: "clase-azul",
    name: "Clase Azul",
    country: "Messico",
    description:
      "Tequila da collezione in decanter iconici realizzati con cura artigianale.",
    story:
      "Una proposta che unisce distillato e oggetto, con espressioni rare pensate per la degustazione importante e il collezionismo.",
    media: demoMedia.rareCollection,
  },
  {
    slug: "ilegal",
    name: "Ilegal",
    country: "Messico",
    description:
      "Mezcal artigianali dal tratto affumicato, minerale e diretto.",
    story:
      "Le espressioni joven e añejo raccontano due letture della stessa materia: una immediata, l’altra resa più profonda dal tempo in legno.",
    media: demoMedia.curation,
  },
  {
    slug: "camus",
    name: "Camus",
    country: "Francia",
    description:
      "Maison di Cognac familiare, nota per cuvée aromatiche e di grande finezza.",
    story:
      "La gamma attraversa diverse maturazioni mantenendo una particolare attenzione alla ricchezza aromatica e alla precisione dell’assemblaggio.",
    media: demoMedia.rareCollection,
  },
  {
    slug: "janneau",
    name: "Janneau",
    country: "Francia",
    description:
      "Armagnac della Guascogna, dalle riserve classiche alle lunghe maturazioni.",
    story:
      "Espressioni generose e complesse, segnate dal tempo in botte e da una tradizione produttiva profondamente legata al territorio.",
    media: demoMedia.whiskyCellar,
  },
  {
    slug: "montenegro",
    name: "Montenegro",
    country: "Italia",
    description:
      "Un amaro italiano storico, equilibrato tra dolcezza, agrumi ed erbe.",
    story:
      "Il suo profilo aromatico e accessibile lo rende adatto al fine pasto, al servizio con ghiaccio e alla miscelazione contemporanea.",
    media: demoMedia.ginBotanicals,
  },
  {
    slug: "cocchi",
    name: "Cocchi",
    country: "Italia",
    description:
      "Vermouth e aperitivi piemontesi dalla forte identità enologica.",
    story:
      "Vino, botaniche e ricette storiche compongono etichette precise, versatili e profondamente legate alla cultura dell’aperitivo.",
    media: demoMedia.rumCellar,
  },
  {
    slug: "carlo-alberto",
    name: "Carlo Alberto",
    country: "Italia",
    description:
      "Vermouth di pregio costruiti su vini, botaniche e ricette complesse.",
    story:
      "La linea Riserva interpreta il vermouth con profondità e nitidezza, adatta sia alla degustazione sia ai grandi classici miscelati.",
    media: demoMedia.rumCellar,
  },
  {
    slug: "select",
    name: "Select",
    country: "Italia",
    description:
      "Aperitivo veneziano dal profilo agrumato, speziato e piacevolmente amaro.",
    story:
      "Una presenza storica nel rito dell’aperitivo, pensata per il servizio con soda e per i cocktail della tradizione veneziana.",
    media: demoMedia.ginMediterranean,
  },
  {
    slug: "au-vodka",
    name: "Au Vodka",
    country: "Regno Unito",
    description:
      "Vodka premium contemporanee riconoscibili per una presenza visiva decisa.",
    story:
      "La proposta Au Vodka unisce una base pulita e morbida a una collezione pensata per il servizio freddo e la miscelazione.",
    media: demoMedia.curation,
  },
  {
    slug: "24kt",
    name: "24KT",
    country: "Italia",
    description:
      "Liquori cremosi italiani dedicati al fine pasto e al dessert.",
    story:
      "Ricette morbide e immediate, costruite intorno a cacao, grappa e aromi da servizio freddo.",
    media: demoMedia.rumCellar,
  },
  {
    slug: "ciemme",
    name: "Ciemme",
    country: "Italia",
    description:
      "Distillati e specialità italiane legate alla tradizione della grappa.",
    story:
      "Una proposta che valorizza la cultura del distillato italiano anche attraverso formati da degustazione e regalo.",
    media: demoMedia.curation,
  },
] as const satisfies readonly CatalogBrand[];
