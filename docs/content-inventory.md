# Inventario contenuti

## Funzionante

- homepage editoriale Black;
- header sticky, mega menu e navigazione mobile;
- ricerca globale con prodotti, marchi e categorie;
- catalogo con filtri, ordinamento e paginazione client-side;
- pagine categoria, marchio e prodotto;
- carrello, mini-carrello e wishlist;
- age gate e preferenze cookie;
- newsletter e form contatti con stati completi;
- route Chi siamo, Contatti, Privacy, Cookie, Termini, Spedizioni e resi;
- metadata, manifest, robots e sitemap.

## Dataset centralizzati

- prodotti: `src/content/catalog/products.ts`;
- categorie: `src/content/catalog/categories.ts`;
- marchi: `src/content/catalog/brands.ts`;
- collezioni: `src/content/catalog/collections.ts`;
- stato iniziale e banner: `src/content/catalog/demo-commerce.ts`;
- homepage e riferimenti social: `src/content/demo-assets/home.ts`;
- asset editoriali: `src/content/demo-assets/media.ts`.

## Asset reali integrati

- logo raster fornito dal cliente in `public/brand/mietto-logo.png`;
- 2.123 fotografie prodotto in formato WebP full;
- 2.123 thumbnail prodotto dedicate;
- associazioni immagine-prodotto registrate nel dataset.

## Asset provvisori

- fotografie hero, categorie, Instagram e racconto editoriale;
- favicon e icone compatte del brand;
- Open Graph image generata dall’applicazione;
- loghi ufficiali dei singoli marchi.

La sostituzione delle fotografie deve avvenire aggiornando il layer media, senza
modificare componenti, layout o responsive.

## Contenuti da validare

- descrizioni sorgente, note degustative, abbinamenti e consigli di servizio;
- paese, produttore e nomenclatura commerciale;
- 247 marchi estratti con confidenza ridotta;
- 16 sottocategorie mancanti e 16 capacità da verificare;
- disponibilità e quantità;
- testi legali e cookie policy;
- spedizioni, resi, assicurazione e procedura difetto da tappo;
- tono e testo newsletter;
- link social ulteriori oltre Instagram.

## Materiali necessari

- logo originale vettoriale e relative varianti approvate;
- simbolo compatto approvato per favicon;
- fotografie hero e immagini editoriali definitive;
- loghi marchio con licenze e formati web;
- revisione delle descrizioni prodotto importate;
- contenuti legali validati;
- regole fiscali e commerciali definitive;
- conferma di disponibilità, paesi serviti e costi di spedizione.

## Fuori scope Milestone 1A

- aggiornamento automatico del listino;
- database e storage reali;
- autenticazione e account;
- checkout, Stripe, ordini e fatturazione;
- pannello amministrativo;
- ricerca e filtri server-side;
- sincronizzazione server di carrello e wishlist;
- analytics, marketing e newsletter reali.

Il dettaglio quantitativo e le anomalie non corrette automaticamente sono in
`docs/catalog-import-report.md` e `docs/catalog-import-report.json`.
