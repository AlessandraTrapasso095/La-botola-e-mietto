# Sviluppo locale — Fase 2

## Vincolo del branch

Prima di ogni attività:

```bash
git branch --show-current
```

Il risultato deve essere `phase-2-local`. Non proseguire da altri branch.

## Configurazione predefinita

Senza variabili Supabase il progetto usa:

- `CATALOG_REPOSITORY=demo`;
- `AUTH_SERVICE=demo`.

Lo snapshot statico e la sessione browser mantengono operative le pagine
esistenti. Le chiavi in `.env.example` sono vuote e non devono essere sostituite
con credenziali di produzione.

## Comandi locali

```bash
npm install
npm run dev
npm run format
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
git diff --check
```

## Supabase locale

Lo stack usa Supabase CLI e un runtime Docker locale. Non richiede né ammette un
collegamento a un progetto remoto.

```bash
npm run supabase:start
npm run supabase:status
npm run supabase:reset
npm run supabase:types
```

`supabase:reset` ricrea il database locale e applica tutte le migrazioni da
zero. `supabase:types` genera `src/types/database.generated.ts`; il file non va
modificato manualmente.

## Selezione del repository catalogo

Il repository è selezionato esclusivamente nel codice server. I valori ammessi
sono `demo` e `supabase`; una variabile assente o vuota seleziona sempre
`DemoCatalogRepository`.

Modalità demo:

```bash
CATALOG_REPOSITORY=demo npm run dev
```

Modalità Supabase locale, senza salvare chiavi in file tracciati:

```bash
eval "$(npx supabase status -o env | sed -n \
  -e 's/^API_URL=/export NEXT_PUBLIC_SUPABASE_URL=/p' \
  -e 's/^ANON_KEY=/export NEXT_PUBLIC_SUPABASE_ANON_KEY=/p')"
CATALOG_REPOSITORY=supabase npm run dev
```

I valori devono puntare a `127.0.0.1` o `localhost`. Non usare service role per
le query pubbliche: `SupabaseCatalogRepository` usa la chiave anonima e le
policy RLS del database locale.

## Selezione del servizio di autenticazione

`AUTH_SERVICE` è una configurazione esclusivamente server-side. I valori
ammessi sono `demo` e `supabase`; un valore assente, vuoto o non valido usa
sempre `DemoAuthService`.

Modalità demo:

```bash
AUTH_SERVICE=demo CATALOG_REPOSITORY=demo npm run dev
```

Modalità Supabase locale:

```bash
eval "$(npx supabase status -o env | sed -n \
  -e 's/^API_URL=/export NEXT_PUBLIC_SUPABASE_URL=/p' \
  -e 's/^ANON_KEY=/export NEXT_PUBLIC_SUPABASE_ANON_KEY=/p')"
AUTH_SERVICE=supabase CATALOG_REPOSITORY=supabase npm run dev
```

La `service_role` non è necessaria per il sito e non deve essere esportata nel
browser. Viene letta soltanto dagli strumenti locali di importazione e dai test
tecnici che creano e cancellano utenti isolati.

## Email locali e recupero password

Con Supabase avviato, Mailpit è disponibile all’indirizzo mostrato da
`npm run supabase:status`, normalmente `http://127.0.0.1:54324`.

1. Registrare un account da `/registrati`.
2. Aprire Mailpit e selezionare l’email di conferma.
3. Seguire il link locale verso `/auth/confirm`.
4. Per il recupero usare `/password-dimenticata` e la seconda email ricevuta.
5. Impostare la nuova password in `/nuova-password`.

I template locali sono in `supabase/templates/`. Nessun provider email esterno
è collegato.

## Route account protette

In modalità Supabase, `src/proxy.ts` aggiorna la sessione SSR e protegge
`/account` e tutte le route discendenti. Un utente anonimo viene inviato a
`/accedi` con un percorso di ritorno interno validato. Il layout account esegue
anche un controllo server-side di difesa in profondità.

## Indirizzi account locali

Con `AUTH_SERVICE=supabase`, `/account/indirizzi` legge e modifica soltanto le
righe appartenenti alla sessione corrente. Le operazioni passano dalle route
server in `src/app/api/account/addresses/`; il browser non invia e non decide
mai `profile_id`.

La migrazione `0005_account_addresses.sql` aggiunge campi separati per nome,
cognome, via e numero civico, oltre ai default indipendenti di spedizione e
fatturazione. Le funzioni SQL atomiche rimuovono il relativo flag dagli altri
indirizzi dello stesso utente prima di assegnare un nuovo default. Se il
predefinito viene eliminato, nessun altro indirizzo viene promosso
automaticamente.

Con `AUTH_SERVICE=demo`, il pannello continua a usare esclusivamente lo stato
dimostrativo nel browser e non interroga il database.

## Wishlist locale e account

Con `AUTH_SERVICE=supabase`, la wishlist anonima resta nel browser. Al login gli
slug locali vengono uniti in modo idempotente alle tabelle `wishlists` e
`wishlist_items`; lo stato browser viene svuotato soltanto dopo una risposta
positiva. Prodotti inesistenti o inattivi vengono scartati dal database.

Le pagine `/preferiti` e `/account/preferiti`, il badge header, le card e la
scheda prodotto condividono lo stesso stato. Le route in
`src/app/api/account/wishlist/` ricavano l'identità esclusivamente dalla
sessione server e non accettano identificativi proprietario dal browser.

Con `AUTH_SERVICE=demo`, la wishlist resta integralmente locale e non interroga
Supabase.

## Importazione catalogo locale

Il catalogo commerciale viene letto da
`reference-private/catalog/listino_completo_la_botola.xlsx` e importato con:

```bash
npm run catalog:import -- --run=nome-esecuzione
```

La pipeline rifiuta URL database non locali, valida ogni riga con Zod e usa una
transazione PostgreSQL. I report sono scritti in
`reference-private/import-reports/`, esclusa da Git. Una seconda esecuzione a
dati invariati deve riportare tutti gli elementi come `unchanged`.

I test database e RLS richiedono lo stack locale attivo e il catalogo privato:

```bash
npm run test:db
```

## Comandi vietati senza autorizzazione

```text
git add
git commit
git push
vercel
npx vercel
supabase db push
supabase link
```

Non collegare dominio, DNS, progetto Vercel o Supabase remoto durante lo
sviluppo locale della fase.

## Stato degli adapter

- `DemoCatalogRepository` resta il comportamento predefinito.
- `SupabaseCatalogRepository` è operativo e validato sul database locale.
- `DemoAuthService` resta il comportamento predefinito.
- `SupabaseAuthService` è operativo e validato esclusivamente in locale.
- Gli indirizzi account sono operativi esclusivamente con
  `AUTH_SERVICE=supabase`; la modalità demo resta isolata dal database.
- Il repository Supabase non importa lo snapshot TypeScript e interroga viste
  paginate con un confine pubblico esplicito sui prodotti attivi.
- La wishlist account è operativa in Supabase locale; la wishlist anonima e il
  carrello restano locali. Gli ordini reali non sono ancora implementati.
- Nessun repository Supabase remoto è configurato o collegato.

Il passaggio a un progetto remoto richiede un’autorizzazione separata e non è
parte di questa fase locale.

## Verifiche anti-deploy

- controllare il branch prima e dopo il lavoro;
- verificare che lo staging sia vuoto con `git status --short`;
- non eseguire CLI Vercel;
- non modificare `.vercel`;
- non usare service role o segreti in variabili `NEXT_PUBLIC_*`;
- verificare che `reference-private/` resti esclusa da Git.
