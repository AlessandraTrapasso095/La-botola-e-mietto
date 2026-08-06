# Validazione indirizzi account — Fase 2

## Ambito

La sezione `/account/indirizzi` usa Supabase esclusivamente quando
`AUTH_SERVICE=supabase`. La modalità demo conserva il dataset e il comportamento
browser esistenti, senza query al database.

## Flussi implementati

- elenco server-side degli indirizzi della sessione corrente;
- stato vuoto e gestione degli errori di caricamento;
- creazione, modifica ed eliminazione logica;
- conferma accessibile prima dell’eliminazione;
- default indipendenti per spedizione e fatturazione;
- sostituzione atomica del relativo default tramite funzione PostgreSQL;
- validazione Zod lato browser e lato server;
- CAP italiano di cinque cifre e sigla provincia italiana normalizzata;
- supporto strutturale a paesi diversi da `IT`.

## Confine di sicurezza

Le API non accettano `profile_id`. L’identità viene ricavata con
`auth.getUser()` dalla sessione SSR. Le funzioni `upsert_account_address` e
`delete_account_address` usano esclusivamente `auth.uid()` e sono eseguibili
dal ruolo `authenticated`, non da `anon` o `public`.

La policy RLS limita lettura, inserimento, modifica ed eliminazione al
proprietario. I test verificano inoltre che un utente non possa forzare il
profilo di un altro o modificarne gli indirizzi.

## Regola dei predefiniti

Gli indici univoci parziali garantiscono al massimo un indirizzo di spedizione
predefinito e uno di fatturazione predefinito per utente. Un singolo indirizzo
può essere predefinito per entrambi gli usi.

Quando un predefinito viene eliminato, non viene selezionato automaticamente un
sostituto. La scelta resta esplicita e questa regola dovrà essere riesaminata
prima del checkout.

## Verifiche locali

- test unitari su CAP, provincia, stato vuoto e UI demo;
- test database su CRUD, default atomici, anonimato e isolamento tra utenti;
- test E2E Supabase su creazione, persistenza, modifica ed eliminazione mobile;
- regressione completa in modalità demo e Supabase locale;
- cancellazione degli utenti tecnici al termine delle suite.

## Limiti intenzionali

- nessun utilizzo degli indirizzi nel checkout;
- nessuna validazione tramite servizi postali esterni;
- nessun geocoding o autocompletamento;
- nessun progetto Supabase remoto collegato.
