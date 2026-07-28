# Motion system

## Linguaggio

Il movimento riprende il ritmo editoriale dei riferimenti Stitch senza
scroll hijacking o parallasse:

- fast: `180ms` per feedback funzionali;
- standard: `340ms` per bordi, overlay e controlli;
- editorial: `720ms` per reveal e immagini;
- zoom immagini: `1.04`;
- easing funzionale ed editoriale distinti;
- stagger: `70ms`.

## Implementazione

CSS gestisce hover, active, dialog, overlay e skeleton. `Reveal` usa
Intersection Observer e disconnette l’osservatore dopo la prima apparizione.
Le proprietà animate sono prevalentemente `transform` e `opacity`.

## Reduced motion

La media query `prefers-reduced-motion: reduce`:

- rimuove reveal e zoom;
- riduce animazioni e transizioni a feedback immediati;
- disattiva lo smooth scroll;
- mantiene focus e stati funzionali.
