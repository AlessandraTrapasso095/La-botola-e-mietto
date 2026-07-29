# Inventario contenuti

## Funzionante

- homepage editoriale Black;
- header sticky, mega menu e navigazione mobile;
- ricerca globale con prodotti, marchi e categorie;
- catalogo con filtri, ordinamento e paginazione client-side;
- pagine categoria, marchio e prodotto;
- carrello, mini-carrello e wishlist;
- age gate e preferenze cookie;
- route contatti, privacy, cookie, termini, spedizioni e resi;
- metadata, manifest, robots e sitemap.

## Dataset centralizzati

- prodotti: `src/content/catalog/products.ts`;
- categorie: `src/content/catalog/categories.ts`;
- marchi: `src/content/catalog/brands.ts`;
- collezioni: `src/content/catalog/collections.ts`;
- stato iniziale e banner: `src/content/catalog/demo-commerce.ts`;
- homepage e riferimenti social: `src/content/demo-assets/home.ts`;
- asset editoriali: `src/content/demo-assets/media.ts`.

## Asset provvisori

- fotografie hero e sezioni editoriali in `public/images/demo`;
- immagini prodotto riutilizzate per categoria;
- favicon e icone brand della fondazione tecnica;
- Open Graph image generata dall’applicazione;
- assenza di fotografie prodotto definitive e loghi marchio ufficiali.

La sostituzione delle fotografie deve avvenire aggiornando il layer media, senza
modificare componenti, layout o responsive.

## Contenuti da validare

- descrizioni, note degustative, abbinamenti e consigli di servizio;
- paese, produttore e nomenclatura commerciale;
- categorie e mappatura completa delle 105 sottocategorie;
- disponibilità e quantità;
- testi legali e cookie policy;
- spedizioni, resi, assicurazione e procedura difetto da tappo;
- tono e testo newsletter;
- link social ulteriori oltre Instagram.

## Materiali necessari

- logo originale vettoriale e relative varianti approvate;
- simbolo compatto approvato per favicon;
- fotografie hero e immagini editoriali definitive;
- fotografie prodotto scontornate o con direzione fotografica coerente;
- loghi marchio con licenze e formati web;
- descrizioni prodotto approvate;
- contenuti legali validati;
- regole fiscali e commerciali definitive;
- conferma di disponibilità, paesi serviti e costi di spedizione.

## Fuori scope Milestone 1A

- importazione automatica Excel;
- database e storage reali;
- autenticazione e account;
- checkout, Stripe, ordini e fatturazione;
- pannello amministrativo;
- ricerca e filtri server-side;
- sincronizzazione server di carrello e wishlist;
- analytics, marketing e newsletter reali.
