# Validazione autenticazione locale — Fase 2

## Ambito

La validazione riguarda esclusivamente Supabase CLI locale. Non sono stati
collegati progetti remoti, provider email esterni, Vercel, Stripe o credenziali
di produzione.

## Modalità disponibili

- `AUTH_SERVICE=demo`: comportamento predefinito, sessione dimostrativa nel
  browser e contenuti account già esistenti.
- `AUTH_SERVICE=supabase`: autenticazione locale reale con cookie SSR, profilo
  PostgreSQL e consensi persistiti.

La scelta avviene lato server. Variabili mancanti o non valide ricadono sulla
modalità demo.

## Flussi implementati

- registrazione con validazione Zod e consensi privacy, maggiore età e
  marketing distinti;
- conferma email tramite template locale e Mailpit;
- login e logout;
- persistenza e aggiornamento sessione SSR;
- recupero e nuova password;
- profilo reale con email Auth in sola lettura;
- preferenze comunicazioni e cronologia consenso marketing;
- redirect interno sicuro verso la pagina richiesta;
- stati account vuoti in assenza di ordini, indirizzi e offerte personali
  reali.

## Confini tecnici

- Il browser usa soltanto URL e chiave anonima Supabase.
- Le route applicative validano input, origine e frequenza delle richieste.
- `src/proxy.ts` aggiorna i cookie e protegge l’intero prefisso `/account`.
- Il layout account ripete la verifica utente lato server.
- Il client amministrativo è isolato in un modulo `server-only` e non viene
  usato dai flussi pubblici.
- Password, token, cookie e chiavi non vengono registrati nei log applicativi.

## RLS verificata

I test locali confermano che:

- il catalogo attivo resta leggibile anonimamente;
- profili, indirizzi, consensi, carrelli, wishlist e ordini non sono leggibili
  da utenti anonimi;
- un utente autenticato vede e modifica soltanto il proprio profilo;
- consensi e preferenze vengono registrati per il solo proprietario;
- utenti differenti non leggono carrelli, wishlist o ordini altrui;
- gli utenti normali non ricevono privilegi amministrativi.

La FK dei consensi usa cancellazione in cascata sul profilo: questo evita
record privi di soggetto e consente ai test tecnici di eliminare completamente
gli utenti locali.

## Flussi testati

- registrazione valida e conferma email richiesta;
- email già registrata senza duplicazione;
- rifiuto password debole;
- login valido e credenziali errate con messaggio generico;
- sessione persistente dopo refresh;
- accesso anonimo e autenticato alle route protette;
- lettura e modifica del profilo proprio;
- isolamento da profili altrui;
- aggiornamento consenso marketing;
- logout;
- recupero e cambio password tramite Mailpit;
- navigazione account mobile;
- pulizia completa degli utenti tecnici.

## Limitazioni residue

- Il rate limiting applicativo usa memoria di processo ed è adeguato soltanto
  allo sviluppo locale.
- Modifica email ed eliminazione definitiva dell’account non sono attive.
- Wishlist e carrello restano nel browser.
- Ordini, indirizzi e offerte personali reali richiedono i rispettivi servizi
  database delle fasi successive.
