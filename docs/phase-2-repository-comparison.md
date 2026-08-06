# Confronto repository catalogo — Fase 2 locale

## Ambito

Il confronto riguarda `DemoCatalogRepository` e
`SupabaseCatalogRepository` sullo stesso catalogo cliente. Il repository demo
resta predefinito; quello Supabase viene selezionato soltanto con
`CATALOG_REPOSITORY=supabase` e credenziali dello stack locale.

## Implementazione Supabase

- Query eseguite esclusivamente sul server con chiave anonima e RLS attiva.
- Vista `catalog_products_view` per card e dettaglio, con prezzo corrente,
  inventario, offerta e immagine primaria in una sola query.
- Viste aggregate `catalog_brands_view` e `catalog_categories_view` per la
  ricerca tassonomica senza caricare tutti i prodotti.
- Ricerca prodotto tramite l'indice full-text di `products.search_document`,
  completata da query tassonomiche limitate per marchi, categorie e
  sottocategorie.
- Funzione `catalog_filter_options` basata direttamente sulle tabelle catalogo
  per le opzioni distinte nello scope corrente, senza calcolare l'intera vista
  prodotto.
- Paginazione massima di 500 record per richieste editoriali; pagine catalogo
  da 12 record.
- Ricerca limitata a 100 prodotti e 50 risultati per gruppo tassonomico.
- Risoluzione carrello e wishlist in batch, fino a 100 slug.
- Prezzo lordo calcolato server-side da netto bigint e aliquota in basis point;
  il DTO browser contiene soltanto centesimi interi già calcolati.

## Prestazioni locali

Sul catalogo importato di 2.123 codici unici, i piani PostgreSQL locali hanno
registrato circa 0,6 ms per la selezione full-text indicizzata, 4 ms per le
opzioni filtro e meno di 1 ms per la prima pagina in evidenza. I tempi end-to-end
includono rendering Next.js, avvio browser e compilazione locale e non sono
confrontabili direttamente con i soli tempi SQL.

## Equivalenze verificate

| Scenario             |                 Demo |               Supabase locale | Esito                 |
| -------------------- | -------------------: | ----------------------------: | --------------------- |
| Prodotti commerciali |          2.124 righe |            2.123 codici unici | Differenza attesa     |
| Marchi attivi        |                  609 |                           609 | Equivalente           |
| Categorie principali |                   13 |                            13 | Equivalente           |
| Sottocategorie       |                   94 |                            94 | Equivalente           |
| Prodotti in offerta  |                   50 |                            50 | Equivalente           |
| Nuovi arrivi         |                   65 |                            65 | Equivalente           |
| Immagini principali  |   2.123 utilizzabili | 2.122 righe + fallback AB6837 | Equivalente in UI     |
| Inventari            | 2.124 righe sorgente |                  2.122 record | Differenze deliberate |

Sono inoltre verificati: prime pagine ordinate per prezzo, ricerca per nome,
codice e marchio, filtro categoria, scope sottocategoria, pagina marchio,
collezione per slug, dettaglio prodotto e risoluzione batch per carrello e
wishlist.

## Differenze attese

### AB1293

Il foglio contiene due righe con lo stesso codice e quantità 41 e 65. Il
repository demo conserva entrambe le righe; il database conserva un solo
prodotto e nessun inventario. `SupabaseCatalogRepository` espone disponibilità
`null`, visualizzata come “Disponibilità da verificare”, senza scegliere o
sommare quantità.

### AB6837

L’immagine cliente corretta non è disponibile. Il database non contiene una
riga `product_images` per il codice e il repository usa esclusivamente
`/images/placeholder-bottle.svg`. L’immagine errata del fucile non viene
reintrodotta.

### Contenuti editoriali

Descrizioni, storie marchio e media editoriali non sono stati importati perché
non ancora approvati come dati autorevoli. In modalità Supabase il dettaglio
usa soltanto informazioni fattuali disponibili e un testo neutro; la modalità
demo mantiene i contenuti editoriali correnti. Questa differenza resta aperta
fino alla revisione contenuti.

### Ordinamento “In evidenza”

Il demo conserva l’ordine dello snapshot dopo priorità limitata/novità. Il
repository Supabase aggiunge nome e codice come criteri deterministici. Prezzo,
nome e paginazione sono equivalenti; l’ordine editoriale definitivo richiederà
un campo `sort_order` prodotto.

## Sicurezza e confini

- Nessun import di `src/content/catalog/products.ts` nel repository Supabase.
- Nessun service role nel percorso di lettura pubblico.
- Nessuna variabile `CATALOG_REPOSITORY` esposta nel bundle client.
- Nessun collegamento a Supabase remoto, push schema o deploy.
