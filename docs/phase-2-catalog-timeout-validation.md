# Validazione timeout catalogo Supabase locale

## Ambito

La verifica riguarda esclusivamente `SupabaseCatalogRepository` sullo stack
Supabase locale. Il timeout non è stato disabilitato.

## Errore osservato

I log PostgreSQL hanno registrato `57014` sulle query PostgREST usate da:

- dettaglio prodotto per `slug`;
- risoluzione della categoria del prodotto correlato;
- elenco dei correlati ordinato per rarità, nome e codice;
- pagina catalogo con conteggio totale.

Le query normalmente terminavano in pochi millisecondi. Il superamento dei 3
secondi coincideva con blocchi I/O dell'ambiente Docker/Colima: nel caso più
evidente il checkpoint ha richiesto 47,856 secondi, di cui 7,424 secondi di
`sync`, con un singolo file fermo per 3,677 secondi. Nello stesso intervallo sono
state interrotte anche operazioni Auth, confermando che il rallentamento non
proveniva dalle funzioni wishlist o indirizzi.

La configurazione precedente amplificava però il problema: le policy RLS delle
tabelle sottostanti venivano espanse dentro ogni interrogazione della vista e
la vista categorie produceva un insieme intermedio ottenuto dal prodotto
cartesiano tra sottocategorie e prodotti.

## Correzioni applicate

La migrazione `0006_catalog_wishlist.sql`:

- mantiene nella vista prodotti un confine pubblico esplicito sui soli prodotti
  attivi e non eliminati;
- imposta la vista con `security_barrier=true`, evitando che i predicati del
  chiamante vengano valutati prima del confine pubblico;
- evita la ripetizione delle policy RLS interne per la proiezione pubblica;
- riscrive la vista categorie con due aggregazioni laterali indipendenti,
  eliminando il prodotto cartesiano.

Il repository inoltre:

- legge `category_id` dalla tabella `products` tramite lo slug indicizzato,
  invece di interrogare due volte la vista completa per i correlati;
- limita e pagina ogni query;
- seleziona DTO ridotti per le card e il DTO completo solo nel dettaglio;
- risolve carrello e wishlist in batch da massimo 50 slug lato browser e 100
  lato repository;
- riusa il dettaglio prodotto tra metadata e pagina tramite cache React della
  singola richiesta.

Le tabelle base conservano RLS. Un test dedicato conferma che un prodotto
`draft` non compare nella vista pubblica.

## Piani di esecuzione

Misure raccolte con `EXPLAIN (ANALYZE, BUFFERS)` sul database locale popolato.
I tempi sono campioni diagnostici, non benchmark di capacità.

| Operazione            | Prima: esecuzione | Dopo: esecuzione | Buffer/righe rilevanti                    |
| --------------------- | ----------------: | ---------------: | ----------------------------------------- |
| Dettaglio per slug    |          0,457 ms |         0,365 ms | 29 → 20 hit                               |
| Correlati             |          8,768 ms |         5,904 ms | 14.993 → 9.341 hit                        |
| Prima pagina catalogo |         25,255 ms |        10,111 ms | 31.791 → 225 hit                          |
| Ricerca `Absolut`     |         20,493 ms |         6,674 ms | 28.030 → 294 hit                          |
| Offerte               |          1,983 ms |         1,336 ms | 639 hit finali                            |
| Nuovi arrivi          |          1,727 ms |         2,098 ms | 199 hit finali                            |
| Batch prodotti        |          0,533 ms |         0,551 ms | 54 hit finali                             |
| Categorie             |         17,980 ms |         0,372 ms | 25.669 righe intermedie → 13 righe radice |

Le prove successive sotto carico includono 32 operazioni repository in quattro
batch paralleli: catalogo, ricerca, filtri, offerte, nuovi arrivi, dettaglio,
correlati e risoluzione batch. Tutte terminano entro il limite del ruolo senza
`57014`.

## Adeguamento del limite locale

Dopo le ottimizzazioni, la suite Playwright completa ha riprodotto un singolo
`57014` mentre Colima era sotto carico con compilazione Next, test Auth e
checkpoint PostgreSQL concorrenti. I piani restavano nell'ordine dei
millisecondi: il tempo era trascorso in attesa dell'I/O del runtime locale.

La migrazione `0007_local_catalog_timeout.sql` porta quindi il ruolo `anon` da
3 a 8 secondi, lo stesso limite già usato dal ruolo `authenticated`. Il valore:

- non disabilita il timeout;
- non maschera scansioni lente, perché i piani vengono testati separatamente;
- copre il massimo `sync` locale osservato di 7,424 secondi;
- deve essere rivalutato con metriche dell'ambiente prima di qualunque futura
  applicazione a un progetto remoto.

## Indici e ordinamento

I piani usano gli indici già predisposti per slug, codice, categoria, marchio,
stato promozionale e ricerca normalizzata. Gli ordinamenti terminano sempre con
il codice prodotto, così la paginazione resta deterministica.

## Esito

- timeout anonimo locale limitato a 8 secondi dopo l'ottimizzazione;
- nessun caricamento globale dei 2.123 prodotti nel client;
- test repository concorrente verde;
- flusso Playwright catalogo/commercio Supabase verde;
- nessun nuovo `57014` nei flussi mirati successivi alla correzione.
