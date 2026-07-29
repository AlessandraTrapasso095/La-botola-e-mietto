# Roadmap

## Milestone 0 — Fondazione tecnica

- stack Next.js, TypeScript, Tailwind e Supabase;
- design system Black e primitive UI;
- homepage tecnica e route informative;
- age gate e struttura preferenze cookie;
- schema prezzi netti e RLS iniziale;
- test, sicurezza e documentazione.

## Milestone 1A — Esperienza frontend

- homepage premium completa e responsive;
- header, mega menu, ricerca e menu mobile;
- catalogo, categorie, marchi e schede prodotto navigabili;
- filtri desktop e mobile, ordinamento, stati vuoti e skeleton;
- carrello, mini-carrello e wishlist con persistenza locale;
- prodotti e prezzi netti reali selezionati dal listino, senza import automatico;
- asset editoriali provvisori centralizzati e sostituibili;
- test unitari, componenti ed E2E dei flussi principali;
- nessun backend commerciale, account o ordine reale.

## Milestone 1B — Catalogo con dati reali

- normalizzazione delle 105 sottocategorie;
- pipeline di importazione verificabile;
- validazione e deduplicazione dei 2.124 prodotti;
- collegamento delle UI esistenti a Supabase;
- gestione immagini definitive, ricerca, filtri e paginazione server-side;
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
