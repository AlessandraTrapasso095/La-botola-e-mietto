# Dati della Milestone 1A

## Origine

Il dataset in `src/content/catalog` è statico, tipizzato e centralizzato. I
2.124 prodotti usano codici, nomi, capacità, gradazioni, quantità, descrizioni e
prezzi netti presenti nel listino Excel del cliente.

Il file Excel resta in `reference-private/catalog`, è escluso da Git e non viene
letto a runtime dall’applicazione. L’importazione eseguita per questa milestone
ha prodotto uno snapshot versionato e il report
`docs/catalog-import-report.md`.

## Immagini

- 2.123 fotografie sorgente sono state convertite in WebP;
- ogni fotografia dispone di variante full e thumbnail;
- 2.124 righe prodotto hanno un’associazione esatta;
- un’immagine è condivisa da due righe del listino;
- non risultano immagini mancanti o associazioni dubbie;
- gli originali in `reference-private` non sono stati modificati.

## Prezzi

- il prezzo sorgente è conservato in centesimi netti tramite `bigint`;
- il prezzo mostrato viene calcolato lato server;
- l’aliquota attuale è configurata a 22% in basis point;
- la formattazione usa locale `it-IT` e valuta `EUR`;
- aliquota, arrotondamenti e casi fiscali devono essere validati prima della
  pubblicazione.

## Stato simulato

Carrello, wishlist e prodotti visti di recente usano storage browser
centralizzato. Questo permette di verificare interazioni e persistenza senza
account, database o ordini reali.

Sono simulati:

- disponibilità commerciale;
- ricerca sul dataset statico;
- filtri e ordinamento client-side;
- aggiunta al carrello e preferiti;
- avanzamento della soglia di spedizione gratuita.
- invio di newsletter e modulo contatti.

Le descrizioni provengono dal listino. Tre prodotti senza descrizione sorgente
usano un testo sostitutivo isolato e richiedono revisione.

## Sostituzione futura

I componenti ricevono viste prodotto serializzabili. La futura sorgente dati
server-side dovrà sostituire selettori e snapshot senza modificare le API
visuali di card, griglie, ricerca e pagine prodotto.

## Vincoli

- nessun dato privato o file Excel può essere copiato in `public`;
- i prezzi non devono essere convertiti in float;
- le descrizioni devono essere revisionate dal cliente;
- la disponibilità deve provenire dalla futura sorgente autorevole.
- 247 associazioni di marchio richiedono verifica umana;
- il codice `AB1293` è duplicato nel listino.
