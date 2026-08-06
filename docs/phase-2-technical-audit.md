# Audit tecnico — Fase 2

## Perimetro

Audit eseguito sul branch locale `phase-2-local`. Non sono stati usati ambienti
remoti, credenziali di produzione o comandi di deploy. Il catalogo cliente resta
uno snapshot TypeScript versionato; i file sorgente privati non sono letti a
runtime.

## Stato iniziale rilevato

### Applicazione e routing

- Next.js 16 con App Router, React 19 e TypeScript strict.
- Le pagine informative e le pagine di dettaglio sono Server Components.
- Dialog, filtri, ricerca, account, carrello e wishlist sono Client Components.
- Non esistevano route applicative server per ottenere sottoinsiemi del catalogo.

### Catalogo statico

- `src/content/catalog/products.ts` contiene 2.124 prodotti, circa 3,4 MB e
  oltre 114.000 righe.
- Lo snapshot conserva codice, disponibilità, prezzo netto in `bigint`,
  tassonomia, descrizioni e riferimenti media.
- Marchi e collezioni sono derivati dallo snapshot in moduli eseguiti lato
  server.
- Il codice `AB1293` resta duplicato nella fonte commerciale e non viene risolto
  automaticamente.

### Payload client critico

Prima di questa fase `src/app/layout.tsx` trasformava tutti i 2.124 prodotti e
li passava a `CommerceProvider`. Di conseguenza ogni route serializzava il
catalogo completo verso il browser. Lo stesso array alimentava:

- ricerca globale nel dialog;
- risoluzione di carrello e wishlist da `localStorage`;
- prodotti visti di recente;
- filtri, ordinamento e paginazione di `/catalogo`.

Questo era il principale rischio di bundle/payload, memoria client e tempi di
idratazione.

### Commerce e account

- Carrello e wishlist memorizzano slug e quantità in storage browser.
- L’autenticazione usava un adapter dimostrativo con sessione locale e
  credenziali pubbliche, adatte solo alla presentazione locale.
- Area account, ordini, indirizzi e profilo mostrano contenuti dimostrativi;
  nessuna route è protetta da una sessione server.
- Nessun ordine, pagamento o profilo reale viene creato.

### Supabase e ambiente

- Erano presenti client browser/server separati e una migrazione minima della
  sola tabella prodotti.
- La service role non è importata da moduli client.
- `.env.example` non contiene segreti reali.
- Supabase non è configurato come sorgente catalogo attiva.

### Dipendenze e cicli

- Le dipendenze installate hanno un uso concreto nello stack attuale.
- La scansione statica degli import TypeScript non ha rilevato dipendenze
  circolari.
- I moduli client più articolati restano `CatalogExplorer`, `SearchDialog`,
  `CommerceProvider` e i pannelli account; dopo questa fase non importano lo
  snapshot completo.

## Correzioni applicate

### Catalogo server-first

- `CatalogRepository` definisce query paginate, filtri, ricerca, dettaglio e
  caricamento per slug.
- `DemoCatalogRepository` mantiene la UI locale sullo snapshot corrente.
- `SupabaseCatalogRepository` interroga il database locale tramite viste
  RLS-invoker, DTO ridotti e limiti espliciti.
- `CATALOG_REPOSITORY` seleziona l’adapter solo sul server; il valore
  predefinito è `demo`.
- Catalogo, categorie, collezioni e offerte inviano al browser una pagina di 12
  `ProductCardView`, non 2.124 prodotti.
- Filtri, ordinamento e paginazione sono rappresentati nell’URL e risolti dal
  repository lato server.
- Ricerca live e risoluzione degli slug persistiti usano endpoint limitati e
  validati con Zod.
- “Visti di recente” recupera al massimo quattro DTO card.

### Commerce client

`CommerceProvider` non riceve più prodotti dal root layout. Conserva soltanto i
prodotti effettivamente aggiunti o richiesti da carrello/wishlist. Al refresh
risolve in batch al massimo 50 slug tramite endpoint locale.

### Modello di dominio

Sono distinti:

- `Product`, `ProductPrice`, `ProductInventory`;
- `ProductCardView`, `ProductDetailView`;
- `Brand`, `Category`;
- `UserProfile`, `Address`;
- `Cart`, `CartItem`, `WishlistItem`;
- `Order`, `OrderItem`.

Il mapper dello snapshot conserva il netto come `bigint`, l’aliquota in basis
point interi e calcola il lordo soltanto in codice server.

### Auth service

- `DemoAuthService` mantiene il comportamento locale.
- `SupabaseAuthService` implementa il confine browser per sessione, accesso,
  registrazione e reset.
- `NEXT_PUBLIC_AUTH_PROVIDER` seleziona l’adapter; il predefinito è `demo`.
- Le route account non sono ancora protette server-side.

## Logica riutilizzabile

- design system, layout, card e viste prodotto;
- calcolo monetario intero e formattazione italiana;
- configurazione aziendale e commerciale;
- storage centralizzato per stato locale;
- componenti accessibili di dialog, drawer e form;
- tassonomia e mapping media già validati per la presentazione.

## Logica da sostituire

- attivazione remota delle query Supabase tipizzate, oggi validate solo in
  locale;
- credenziali e sessione account locale con Supabase Auth;
- carrello e wishlist browser con servizi persistenti;
- dati account e ordini dimostrativi con dati autorizzati da RLS;
- disponibilità statica con inventario transazionale;
- invio newsletter e contatti con un provider email server-side.

## Rischi residui

- Il repository Supabase resta opt-in e dipende dallo stack locale attivo;
  nessun fallback silenzioso mescola dati statici e database.
- Gli endpoint catalogo locali non hanno ancora rate limiting: va introdotto
  prima dell’esposizione di ricerca e mutazioni reali.
- `localStorage` è modificabile dall’utente e non può essere fonte autorevole
  per prezzi, stock o ordini.
- Le route account non sono protette da middleware/sessione server.
- CSP consente ancora script e stili inline per compatibilità con Next.js.
- Il catalogo statico resta caricato nel processo server; non viene più
  serializzato globalmente al browser, ma sarà sostituito dal database.

## Funzioni che richiedono database

- profili, indirizzi e consensi verificabili;
- inventario e prezzi correnti;
- offerte temporali;
- carrelli e wishlist cross-device;
- ordini, righe ordine, stati e audit;
- ruoli amministrativi;
- idempotenza pagamenti e webhook;
- ricerca indicizzata e paginazione su catalogo reale.
