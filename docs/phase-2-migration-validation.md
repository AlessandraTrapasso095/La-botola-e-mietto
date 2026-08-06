# Validazione migrazione Supabase locale

## Ambito

Le migrazioni `0001_foundation.sql`, `0002_catalog_repository.sql` e
`0003_catalog_repository_performance.sql` sono state applicate esclusivamente
allo stack Supabase locale. Non è stato collegato alcun progetto remoto e non è
stato eseguito `supabase db push`.

## Ambiente validato

- Supabase CLI: 2.111.0, installata come dipendenza di sviluppo;
- runtime container: Colima con Docker locale;
- PostgreSQL locale: major 17;
- reset riproducibile tramite `npm run supabase:reset`.

## Risultato strutturale

- 16 tabelle applicative;
- 6 enum;
- 20 foreign key;
- 48 indici dopo l'indice univoco delle offerte attive;
- trigger `updated_at` sulle entità mutabili;
- RLS attiva su tutte le tabelle applicative;
- policy pubbliche limitate a catalogo attivo, immagini, disponibilità, prezzi e
  offerte correnti;
- policy utente limitate a profilo, indirizzi, carrello, wishlist, ordini e
  consensi propri;
- ruolo `service_role` predisposto per attività server e amministrative, mai
  esposto al browser.
- tre viste catalogo con `security_invoker`, una funzione aggregata per le
  opzioni filtro e normalizzazione di ricerca condivisa;
- grant di sola lettura alle viste e di sola esecuzione alle funzioni per i
  ruoli `anon` e `authenticated`.

## Correzioni conservative effettuate

1. Aggiunto un vincolo univoco parziale per impedire due offerte attive sullo
   stesso prodotto.
2. Limitata la lettura pubblica di inventario, prezzi e offerte ai prodotti
   attivi e non eliminati.
3. Aggiunti grant espliciti e minimi per `anon` e `authenticated`; il solo
   `service_role` mantiene privilegi completi server-side.
4. Spostata la ricerca prodotto sul documento full-text indicizzato e resa la
   funzione delle opzioni filtro indipendente dalla vista prodotto completa.

## Riproducibilità

Il comando seguente ricrea il database da zero, applica tutte le migrazioni e il
seed locale vuoto:

```bash
npm run supabase:reset
```

La generazione tipi va eseguita dopo ogni modifica allo schema:

```bash
npm run supabase:types
```

Il file `src/types/database.generated.ts` è generato dalla CLI e non deve essere
modificato manualmente.
