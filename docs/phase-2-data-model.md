# Modello dati — Fase 2

## Obiettivi

Lo schema locale separa catalogo, prezzi, inventario e dati cliente. Gli importi
sono sempre memorizzati in unità minori intere; l’aliquota IVA usa basis point.
La migrazione non contiene dati del cliente né credenziali.

## Catalogo

- `brands`: denominazione canonica, slug, paese e stato.
- `categories`: tassonomia gerarchica tramite `parent_id`.
- `products`: codice commerciale univoco, contenuti e caratteristiche.
- `product_images`: immagini ordinate con una sola primaria per prodotto.
- `inventory`: stock, riservato e disponibilità calcolata.
- `prices`: storico dei prezzi netti e aliquota; un solo prezzo corrente.
- `offers`: promozione opzionale e periodo di validità.

`products.search_document` predispone la ricerca PostgreSQL. Il catalogo pubblico
può leggere solo record attivi e non eliminati.

## Cliente

- `profiles`: estensione uno-a-uno di `auth.users`.
- `addresses`: indirizzi di spedizione e fatturazione, con default per tipo.
- `consent_records`: registrazione versionata e separata di età, privacy,
  marketing, cookie e condizioni di vendita.

La cancellazione logica è prevista per profili e indirizzi dove la conservazione
o l’audit possono impedire una cancellazione fisica immediata.

## Stato commerciale

- `wishlists` e `wishlist_items`: una wishlist per profilo.
- `carts` e `cart_items`: carrello per profilo o sessione anonima.
- `orders` e `order_items`: snapshot immutabile dei dati commerciali necessari
  a ricostruire l’acquisto.

Gli ordini conservano importi netti, IVA, spedizione e totale lordo. Le righe
ordine conservano codice e nome anche se il prodotto viene successivamente
archiviato.

## Integrità

- UUID generati con `pgcrypto`.
- Foreign key esplicite e cancellazioni conservative.
- Unique constraint su codici, slug, prezzi correnti e risorse attive.
- Check constraint su quantità, periodi, aliquote e importi.
- Indici per catalogo, ricerca, disponibilità, ordini e consensi.
- Trigger condiviso per `updated_at`.

## RLS

La migrazione abilita RLS su tutte le tabelle. Le policy iniziali consentono:

- lettura pubblica del catalogo attivo;
- gestione del proprio profilo, indirizzi, wishlist e carrello;
- sola lettura dei propri ordini;
- sola lettura dei propri consensi.

Creazione ordini, pagamenti, scritture catalogo e ruoli staff non sono concessi
al client e richiederanno funzioni server dedicate.

## Prezzi

Esempio concettuale:

- `net_amount_minor = 1000` equivale a 10,00 € netti;
- `vat_rate_basis_points = 2200` equivale al 22%;
- il lordo è calcolato sul server con aritmetica intera e arrotondamento
  esplicito.

Non vengono memorizzati o calcolati importi con float JavaScript.
