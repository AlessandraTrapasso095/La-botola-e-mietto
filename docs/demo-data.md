# Dati della Milestone 1A

## Origine

Il dataset in `src/content/catalog` è statico, tipizzato e centralizzato. I
prodotti selezionati usano codici, nomi, capacità, gradazioni, quantità e prezzi
netti presenti nel listino Excel del cliente.

Il file Excel resta in `reference-private/catalog`, è escluso da Git e non viene
letto dall’applicazione. Non è stata implementata una pipeline automatica di
importazione.

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
- contenuti editoriali prodotto;
- aggiunta al carrello e preferiti;
- avanzamento della soglia di spedizione gratuita.

## Sostituzione futura

I componenti ricevono viste prodotto serializzabili. La connessione futura a
Supabase deve sostituire selettori e sorgenti dati, senza modificare le API
visuali di card, griglie, ricerca e pagine prodotto.

## Vincoli

- nessun dato privato o file Excel può essere copiato in `public`;
- i prezzi non devono essere convertiti in float;
- le descrizioni devono essere revisionate dal cliente;
- la disponibilità deve provenire dalla futura sorgente autorevole.
