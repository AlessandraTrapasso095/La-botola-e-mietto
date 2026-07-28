# Design system

## Direzione

Obsidian & Gilt traduce i riferimenti Stitch Black in un sistema React
mobile-first: carbone opaco, superfici grafite, testo avorio e accenti
champagne moderati.

## Token

`src/styles/tokens.css` centralizza:

- palette e colori semantici;
- scala tipografica e line-height;
- spaziatura e container;
- raggi, bordi, ombre e focus ring;
- z-index, breakpoint e opacità;
- durate, easing, reveal e zoom.

Tailwind 4 espone i token con `@theme` in `src/styles/globals.css`.

## Primitive

Sono disponibili `Container`, `Section`, `Button`, `IconButton`, `Heading`,
`Text`, `Input`, `Select`, `Badge`, `Divider`, `Dialog`, `VisuallyHidden`,
`Logo` e `SiteNotice`.

La pagina `/design-system` dimostra palette, tipografia, controlli, dialog,
age gate, overlay, card, motion e reduced motion. È esclusa
dall’indicizzazione.

## Brand

Il PNG originale in `reference-private/client-data` ha una grande area
trasparente e non include varianti orizzontale, compatta o monocromatica
ottimizzate. Non è stato copiato in Git.

Le icone in `public/brand` sono una proposta provvisoria chiaramente isolata,
non un ridisegno definitivo del logo. Per finalizzare servono file vettoriali
originali e l’approvazione di un marchio compatto.
