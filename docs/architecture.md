# Architettura

## Obiettivo

La Milestone 0 crea una base server-first per un catalogo superiore a 1.000
prodotti senza anticipare checkout, autenticazione completa o back office.

## Confini

- App Router e Server Components sono il default.
- Client Components sono limitati a dialog, consensi e reveal.
- Configurazione aziendale, commerciale, brand e consenso è centralizzata in
  `src/config`.
- Accesso Supabase browser e server è separato. La service role non è mai
  importabile dal client.
- Le route legali condividono un layout, ma non condividono testi dichiarati
  definitivi.

## Dati e prezzi

Il listino analizzato contiene 2.124 righe prodotto e 105 sottocategorie. Il
prezzo sorgente è netto IVA.

- Database: `net_price_cents bigint`.
- Applicazione: `bigint` in unità minori.
- IVA: basis points interi (`2200` equivale al 22% come valore iniziale
  configurabile, non validazione fiscale definitiva).
- Calcolo lordo: solo server, con arrotondamento intero.
- Formattazione: `Intl.NumberFormat` con locale `it-IT` e valuta `EUR`.

## Supabase

La migrazione iniziale crea `products`, abilita RLS e consente al pubblico solo
la lettura di prodotti `active`. Nessuna policy di scrittura è fornita ad
`anon` o `authenticated`. Lo storage pubblico è limitato al bucket
`product-images`; upload e gestione saranno definiti con il back office.

## Consensi

L’age gate usa un cookie first-party con scadenza configurabile. Preferenze
cookie, privacy e condizioni di vendita restano domini distinti. Le preferenze
cookie hanno un proprio modello e un proprio cookie.

## Deploy

Il target è Vercel. Nessun progetto o ambiente remoto è stato creato in questa
milestone.

## Demo Milestone 1A

La homepage editoriale resta server-first. Testi, prodotti dimostrativi e
riferimenti media sono centralizzati in `src/content/demo-assets`; i componenti
non dipendono dai nomi fisici delle immagini. I prezzi demo conservano il netto
in `bigint` e ricevono il prezzo B2C formattato dopo il calcolo lato server.

Header, mega menu, ricerca e menu mobile condividono configurazione e tassonomia.
Le sole parti client gestiscono focus, dialoghi, stato di apertura e feedback
dimostrativi. Nessuna interazione crea ordini, account o dati persistenti.
