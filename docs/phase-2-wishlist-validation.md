# Validazione wishlist Supabase locale

## Modalità supportate

### Demo

Con `AUTH_SERVICE=demo` la wishlist conserva il comportamento precedente e usa
soltanto lo stato browser. Non vengono effettuate richieste a Supabase.

### Supabase locale

Con `AUTH_SERVICE=supabase`:

- l'utente anonimo continua a usare `localStorage`;
- l'utente autenticato usa `wishlists` e `wishlist_items`;
- al login gli slug locali vengono uniti alla wishlist account;
- lo stato locale viene svuotato soltanto dopo un merge riuscito;
- refresh, logout e nuovo login conservano i preferiti persistiti;
- `/preferiti` e `/account/preferiti` consumano lo stesso stato.

## Confini server

Le route account espongono lettura, aggiunta, rimozione e merge. Il server
ricava sempre l'utente dai cookie di sessione: il browser non invia
`profile_id`, `wishlist_id` o altri identificativi proprietario.

Gli input sono validati con Zod e accettano al massimo 100 slug normalizzati e
univoci. Il database ignora prodotti inesistenti, inattivi o eliminati.

Le funzioni locali sono:

- `account_wishlist_slugs()`;
- `merge_account_wishlist(text[])`;
- `remove_account_wishlist_item(text)`.

Sono `security invoker`, hanno `search_path` vuoto e possono essere eseguite
solo dal ruolo `authenticated`.

## Idempotenza e concorrenza

Il vincolo primario `(wishlist_id, product_id)` impedisce duplicati. Il merge
usa `ON CONFLICT DO NOTHING`; doppio click, richieste simultanee e merge ripetuti
producono una sola riga per prodotto.

Nel client le mutazioni sono serializzate. L'interfaccia applica un aggiornamento
ottimistico, disabilita temporaneamente il controllo interessato e ripristina lo
stato precedente se il server rifiuta l'operazione. Errori e stato di attesa
sono annunciati tramite feedback accessibile.

## RLS verificata

I test locali confermano che:

- il ruolo anonimo non può leggere o modificare wishlist, carrelli o ordini;
- un utente non può creare una wishlist per un altro `profile_id`;
- un utente non vede gli elementi wishlist di un altro account;
- prodotti inattivi non sono esposti dalla vista catalogo e non entrano nel
  merge;
- la rimozione da una wishlist non modifica quella di un altro utente.

## Copertura

La validazione automatica copre:

- wishlist anonima locale;
- merge locale → Supabase e cancellazione locale solo dopo successo;
- merge idempotente;
- doppio click e rollback su errore;
- aggiunta, rimozione e persistenza;
- prodotto inesistente e prodotto inattivo;
- isolamento tra due utenti;
- badge header e coerenza tra pagina pubblica e account;
- logout/login e refresh;
- modalità demo invariata;
- viewport mobile nel flusso Playwright.

Gli utenti tecnici sono creati con email locali `example.test` e rimossi negli
hook finali dei test.

## Limiti intenzionali

- il carrello resta locale;
- gli ordini non sono coinvolti;
- non esiste sincronizzazione wishlist con un progetto remoto;
- il merge è limitato a 100 slug per richiesta;
- prodotti diventati inattivi vengono scartati senza ricrearli.
