# Roadmap

## Milestone 0 — Fondazione tecnica

- stack Next.js, TypeScript, Tailwind e Supabase;
- design system Black e primitive UI;
- homepage tecnica e route informative;
- age gate e struttura preferenze cookie;
- schema prezzi netti e RLS iniziale;
- test, sicurezza e documentazione.

## Milestone 1A — Esperienza frontend e catalogo statico

- homepage premium completa e responsive;
- header, mega menu, ricerca e menu mobile;
- catalogo, categorie, marchi e schede prodotto navigabili;
- filtri desktop e mobile, ordinamento, stati vuoti e skeleton;
- carrello, mini-carrello e wishlist con persistenza locale;
- 2.124 prodotti e prezzi netti reali importati dal listino cliente;
- 2.123 fotografie prodotto convertite in WebP full e thumbnail;
- associazione esatta di tutte le righe catalogo alle immagini disponibili;
- logo raster ufficiale e asset editoriali sostituibili;
- newsletter, age gate e preference center cookie;
- pagine Chi siamo, Contatti, Spedizioni e resi e bozze legali;
- asset editoriali provvisori centralizzati e sostituibili;
- nessun backend commerciale, account o ordine reale.

## Milestone 1B — Catalogo server-side

- revisione dei 247 marchi estratti con confidenza ridotta;
- validazione delle anomalie documentate nel report di importazione;
- pipeline di aggiornamento ripetibile e verificabile;
- collegamento delle UI esistenti a Supabase;
- ricerca, filtri e paginazione server-side;
- caricamento del catalogo per richiesta, senza indice globale nel client;
- strategia cache e revalidation.

## Milestone 2 — Account e stato cliente

- autenticazione Supabase;
- profilo cliente e indirizzi;
- sincronizzazione server di carrello e wishlist;
- migrazione controllata dello stato locale.

## Milestone 3 — Checkout

- prezzo B2C e regole IVA validate;
- spedizioni e soglia gratuita;
- Stripe, webhook e idempotenza;
- accettazione separata delle condizioni di vendita;
- ordini e comunicazioni transazionali.

## Milestone 4 — Operazioni

- back office con ruoli e audit;
- gestione catalogo, disponibilità e ordini;
- osservabilità, backup e procedure operative;
- audit legale, privacy, accessibilità e performance pre-lancio.
