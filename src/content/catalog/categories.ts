import { demoMedia } from "@/content/demo-assets/media";
import type { CatalogCategory } from "@/content/catalog/types";

export const catalogCategories = [
  {
    slug: "whisky-whiskey",
    name: "Whisky e Whiskey",
    shortName: "Whisky",
    eyebrow: "Scozia, Irlanda, Americhe e Giappone",
    description:
      "Single malt, blended, bourbon e rye selezionati per origine, maturazione e carattere.",
    introduction:
      "Dalle torbe profonde di Islay alla precisione delle distillerie giapponesi, una selezione pensata per accompagnare sia la scoperta sia il collezionismo.",
    subcategories: [
      "Single Malt Scotch",
      "Blended Scotch",
      "Irish Whiskey",
      "Bourbon e Rye",
      "Whisky Giapponese",
    ],
    media: demoMedia.whiskyCellar,
  },
  {
    slug: "rum-rhum",
    name: "Rum e Rhum",
    shortName: "Rum",
    eyebrow: "Caraibi e America Latina",
    description:
      "Rum tradizionali, agricole e riserve da meditazione, scelti tra stili e territori differenti.",
    introduction:
      "Melassa, puro succo di canna e lunghi affinamenti raccontano un mondo ricco di sfumature, dalle espressioni più morbide alle release più complesse.",
    subcategories: [
      "Rum Invecchiato",
      "Rum Tradizionale",
      "Rhum Agricole",
      "Cachaça",
    ],
    media: demoMedia.rumCellar,
  },
  {
    slug: "gin",
    name: "Gin",
    shortName: "Gin",
    eyebrow: "Botaniche, tecnica e territorio",
    description:
      "London Dry, distilled gin e interpretazioni contemporanee da produzioni italiane e internazionali.",
    introduction:
      "Ginepro, agrumi, erbe e spezie definiscono una selezione trasversale: dai grandi classici alle botaniche mediterranee e orientali.",
    subcategories: [
      "London Dry Gin",
      "Distilled Gin",
      "Contemporary Gin",
      "Pink e Flavored Gin",
    ],
    media: demoMedia.ginBotanicals,
  },
  {
    slug: "vodka",
    name: "Vodka",
    shortName: "Vodka",
    eyebrow: "Purezza e struttura",
    description:
      "Vodka classiche, premium e aromatizzate provenienti dall’Europa e dalle principali scuole internazionali.",
    introduction:
      "La materia prima e il metodo di distillazione danno forma a profili nitidi, setosi o intensamente aromatici, adatti al servizio liscio e alla miscelazione.",
    subcategories: ["Vodka di Grano", "Vodka Premium", "Vodka Aromatizzata"],
    media: demoMedia.curation,
  },
  {
    slug: "cognac",
    name: "Cognac",
    shortName: "Cognac",
    eyebrow: "Grande tradizione francese",
    description:
      "Assemblaggi e lunghe maturazioni dalle maison storiche della Charente.",
    introduction:
      "Dalle espressioni VS alle cuvée XO, il Cognac riunisce profondità aromatica, precisione e una naturale vocazione alla degustazione lenta.",
    subcategories: ["VS", "VSOP", "XO", "Fine Champagne"],
    media: demoMedia.rareCollection,
  },
  {
    slug: "armagnac",
    name: "Armagnac",
    shortName: "Armagnac",
    eyebrow: "Guascogna autentica",
    description:
      "Acquaviti francesi dal profilo generoso, con millesimi e riserve di grande personalità.",
    introduction:
      "Una distillazione tradizionale e il tempo in legno danno vita a espressioni calde, profonde e complesse, ideali per chi cerca carattere.",
    subcategories: ["VSOP", "Napoléon", "XO", "Millesimati"],
    media: demoMedia.whiskyCellar,
  },
  {
    slug: "tequila-mezcal",
    name: "Tequila e Mezcal",
    shortName: "Agave",
    eyebrow: "Messico, agave e maestria",
    description:
      "Tequila blanco, reposado e añejo accanto a mezcal artigianali dal profilo affumicato.",
    introduction:
      "Agave, territorio e lavorazioni lente definiscono bottiglie dalla forte identità, pensate per la degustazione e per una miscelazione consapevole.",
    subcategories: [
      "Tequila Blanco",
      "Tequila Reposado",
      "Tequila Añejo",
      "Mezcal Artesanal",
    ],
    media: demoMedia.curation,
  },
  {
    slug: "grappe",
    name: "Grappe",
    shortName: "Grappe",
    eyebrow: "L’arte italiana della vinaccia",
    description:
      "Grappe giovani, affinate e riserve nate da vitigni e territori italiani.",
    introduction:
      "Una selezione che valorizza materia prima, distillazione e affinamento, dalle espressioni più cristalline alle riserve complesse.",
    subcategories: ["Grappa Giovane", "Grappa Affinata", "Grappa Riserva"],
    media: demoMedia.curation,
  },
  {
    slug: "vini",
    name: "Vini",
    shortName: "Vini",
    eyebrow: "Etichette italiane e internazionali",
    description:
      "Una cantina essenziale, costruita su denominazioni, produttori e annate di interesse.",
    introduction:
      "La selezione vini completerà la proposta della boutique con bottiglie scelte per tavola, ricorrenze e cantina personale.",
    subcategories: ["Rossi", "Bianchi", "Rosati", "Vini da dessert"],
    media: demoMedia.rumCellar,
  },
  {
    slug: "champagne-spumanti",
    name: "Champagne e Spumanti",
    shortName: "Bollicine",
    eyebrow: "Metodo classico e grandi maison",
    description:
      "Champagne, Franciacorta e spumanti per brindisi, tavola e occasioni importanti.",
    introduction:
      "Freschezza, finezza del perlage e profondità definiscono una selezione pensata per celebrare con eleganza.",
    subcategories: ["Champagne", "Franciacorta", "Metodo Classico", "Prosecco"],
    media: demoMedia.rareCollection,
  },
  {
    slug: "liquori",
    name: "Liquori",
    shortName: "Liquori",
    eyebrow: "Ricette, erbe e aromi",
    description:
      "Liquori italiani e internazionali per il fine pasto, il servizio liscio e la miscelazione.",
    introduction:
      "Dalle ricette alle erbe alle specialità agrumate, una raccolta ampia e ordinata per stile e occasione di consumo.",
    subcategories: [
      "Liquori alle Erbe",
      "Liquori agli Agrumi",
      "Liquori da Miscelazione",
      "Sake",
    ],
    media: demoMedia.ginBotanicals,
  },
  {
    slug: "amari",
    name: "Amari",
    shortName: "Amari",
    eyebrow: "L’Italia nel bicchiere",
    description:
      "Amari regionali e ricette alle erbe, dalle espressioni classiche alle interpretazioni contemporanee.",
    introduction:
      "Radici, spezie e infusioni raccontano territori e tradizioni differenti, con profili che spaziano dal balsamico al profondamente amaricante.",
    subcategories: ["Amari Regionali", "Amari alle Erbe", "Amari da Aperitivo"],
    media: demoMedia.ginBotanicals,
  },
  {
    slug: "vermouth",
    name: "Vermouth",
    shortName: "Vermouth",
    eyebrow: "Vino, botaniche e stile italiano",
    description:
      "Bianco, rosso, rosé ed extra dry per aperitivo, degustazione e cocktail classici.",
    introduction:
      "Una tradizione italiana riletta attraverso grandi ricette, vini di base accurati e composizioni botaniche equilibrate.",
    subcategories: [
      "Vermouth Bianco",
      "Vermouth Rosso",
      "Vermouth Rosé",
      "Vermouth Dry",
    ],
    media: demoMedia.rumCellar,
  },
  {
    slug: "aperitivi",
    name: "Aperitivi",
    shortName: "Aperitivi",
    eyebrow: "Il rito prima della tavola",
    description:
      "Bitter, aperitivi amari e specialità italiane per servizio semplice e miscelazione.",
    introduction:
      "Colore, freschezza e note amaricanti definiscono una selezione costruita intorno al rito italiano dell’aperitivo.",
    subcategories: ["Aperitivi Amari", "Red Bitter", "Bitter", "Analcolici"],
    media: demoMedia.ginMediterranean,
  },
  {
    slug: "birre",
    name: "Birre",
    shortName: "Birre",
    eyebrow: "Fermentazioni e stili",
    description:
      "Birre selezionate per stile, territorio e qualità produttiva.",
    introduction:
      "Una proposta complementare dedicata a fermentazioni, interpretazioni artigianali e stili di riferimento.",
    subcategories: ["Lager", "Ale", "Abbazia", "Specialità"],
    media: demoMedia.ginTea,
  },
  {
    slug: "bottiglie-rare",
    name: "Bottiglie Rare",
    shortName: "Rare",
    eyebrow: "Ricerca e collezionismo",
    description:
      "Release limitate, vecchie annate e confezioni di pregio selezionate per intenditori.",
    introduction:
      "Bottiglie dalla reperibilità ridotta, scelte per storia, unicità e valore collezionistico. La disponibilità è naturalmente limitata.",
    subcategories: ["Rare Cask", "Edizioni Limitate", "Vecchie Annate"],
    media: demoMedia.rareCollection,
  },
] as const satisfies readonly CatalogCategory[];
