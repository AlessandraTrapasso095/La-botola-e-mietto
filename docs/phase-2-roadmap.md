# Roadmap tecnica — Fase 2

## Principi

- Migrare un confine alla volta, mantenendo l’adapter demo come fallback.
- Nessuna fonte client è autorevole per prezzi, inventario o ordini.
- Ogni tabella privata deve avere RLS e test delle policy prima dell’uso.
- Stripe, checkout e pannello amministrativo restano fuori da questa
  fondazione.

## Sequenza proposta

### 1. Ambiente Supabase locale

1. Avviare Supabase esclusivamente in locale.
2. Applicare `supabase/migrations/0001_foundation.sql` al database locale.
3. Generare i tipi TypeScript dal database locale.
4. Verificare indici, constraint e policy RLS con test dedicati.

### 2. Importazione catalogo

1. Definire una pipeline idempotente per marchi, categorie e prodotti.
2. Validare codice, prezzi in centesimi, immagini e disponibilità con Zod.
3. Importare in transazione su database locale.
4. Confrontare conteggi e anomalie con i report privati esistenti.
5. Implementare `SupabaseCatalogRepository` sui tipi generati. Completato in
   locale.

### 3. Catalogo reale

1. Attivare `CATALOG_REPOSITORY=supabase` soltanto in locale. Completato per la
   validazione, non come default.
2. Verificare query paginate, filtri e ricerca indicizzata. Completato in
   locale.
3. Definire caching e revalidation senza rendere statico l’inventario.
4. Eseguire test di regressione sulle route pubbliche.

### 4. Autenticazione e profili

1. Configurare Supabase Auth locale. Completato.
2. Creare il profilo e i consensi separati alla registrazione tramite trigger.
   Completato.
3. Proteggere le route account lato server e aggiornare la sessione SSR.
   Completato.
4. Collegare il profilo reale con policy per proprietario. Completato.
5. Collegare conferma email e recupero password a Mailpit locale. Completato.
6. Mantenere `DemoAuthService` come fallback predefinito fino alla futura
   configurazione autorizzata di un ambiente remoto.
7. Collegare gli indirizzi reali con CRUD server-side, default indipendenti e
   RLS per proprietario. Completato esclusivamente in locale.

### 5. Carrello e wishlist

1. Implementare `WishlistService` con RLS. Completato esclusivamente in locale.
2. Migrare la wishlist locale dopo l’accesso con strategia idempotente.
   Completato.
3. Implementare `CartService` con RLS. Non iniziato.
4. Ricalcolare sempre prezzi e disponibilità sul server prima del futuro
   carrello persistente.
5. Gestire i conflitti del futuro carrello tra sessione anonima e account.

### 6. Ordini e pagamenti

Da iniziare soltanto dopo validazione commerciale e autorizzazione esplicita:

- creazione ordine transazionale;
- snapshot di prezzo e indirizzi;
- integrazione Stripe server-side;
- webhook verificati e idempotenti;
- email transazionali;
- amministrazione e audit.

## Dipendenze tra attività

- Il catalogo Supabase richiede migrazione, import e tipi generati.
- Carrello e wishlist persistenti richiedono Auth e profili.
- Gli ordini richiedono prezzi, inventario e indirizzi autorevoli.
- Stripe richiede ordini transazionali e gestione webhook già testata.
- Il back office richiede ruoli, policy e audit prima delle UI.

## Stato degli adapter

- `DemoCatalogRepository`: attivo e testato localmente.
- `SupabaseCatalogRepository`: implementato e validato sul database locale;
  resta opt-in.
- `DemoAuthService`: predefinito e invariato per la modalità dimostrativa.
- `SupabaseAuthService`: implementato e validato sullo stack locale; resta
  opt-in tramite `AUTH_SERVICE=supabase`.

## Limiti correnti intenzionali

- Nessun progetto Supabase remoto è collegato.
- La wishlist è persistita per account esclusivamente in modalità Supabase
  locale; il carrello resta locale.
- Ordini e offerte personali mostrano stati vuoti in modalità Supabase.
- Gli indirizzi sono persistiti in Supabase locale; eliminando un indirizzo
  predefinito non ne viene scelto automaticamente un altro.
- La modifica email e l’eliminazione definitiva dell’account non sono attive.
- Il rate limiting applicativo è locale e in memoria; un servizio distribuito
  verrà scelto prima di una futura pubblicazione.
