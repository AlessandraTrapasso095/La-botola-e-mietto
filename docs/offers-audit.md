# Audit prodotti in offerta

Data audit: 3 agosto 2026.

## Fonte

File letto senza modifiche: `reference-private/catalog/listino_completo_la_botola.xlsx`.

Il workbook contiene un foglio (`Sheet1`), 2.124 prodotti e le colonne:

1. `CODICE PRODOTTO`;
2. `PRODOTTO`;
3. `QUANTITA`;
4. `PREZZO SENZA IVA`;
5. `NUOVI PRODOTTI`;
6. `CAPACITA'`;
7. `GRADO ALCOLICO`;
8. `SOTTOCATEGORIA`;
9. `DESCRIZIONE`;
10. `IMMAGINE`.

## Regola promozionale

La colonna usata per identificare le offerte è `NUOVI PRODOTTI`. I valori effettivamente presenti sono:

| Valore                | Righe |
| --------------------- | ----: |
| vuoto                 | 2.009 |
| `NUOVI PRODOTTI`      |    65 |
| `PRODOTTI IN OFFERTA` |    50 |

Un prodotto è pubblicato come offerta esclusivamente quando il valore della colonna è esattamente `PRODOTTI IN OFFERTA`.

## Prezzi e durata

- prezzo disponibile: `PREZZO SENZA IVA`;
- prezzo precedente: colonna non presente;
- prezzo promozionale distinto: colonna non presente;
- percentuale di sconto: colonna non presente;
- data di inizio, scadenza o durata: colonne non presenti.

Il prezzo disponibile viene mantenuto in centesimi come `bigint`; il prezzo comprensivo di IVA continua a essere calcolato lato server. Non vengono generati prezzo barrato, percentuale o scadenza.

## Controlli di integrità

- prodotti in offerta: **50**;
- codici duplicati tra le offerte: **0**;
- righe offerta prive di codice, nome o prezzo netto: **0**;
- righe ambigue o incomplete: **0**.

## Codici sorgente

`AB3197`, `AB4556`, `AB5889`, `AB1406`, `AB4700`, `AB1746`, `AB6026`, `AB3352`, `AB2726`, `AB5230`, `AB4123`, `AB5091`, `AB5092`, `AB5636`, `AB4573`, `AB5579`, `AB4293`, `AB3116`, `AB6825`, `AB5296`, `AB3508`, `AB0100`, `AB1270`, `AB3479`, `AB6900`, `AB6679`, `AB2972`, `AB3573`, `AB6040`, `AB2362`, `AB4799`, `AB4798`, `AB5295`, `AB0708`, `AB4398`, `AB0198`, `AB4682`, `AB0598`, `AB0571`, `AB0570`, `AB0576`, `AB1820`, `AB0609`, `AB0279`, `AB0393`, `AB4204`, `AB1238`, `AB5575`, `AB2957`, `AB3966`.

Il registry applicativo conserva soltanto questi codici e deriva i prodotti dal dataset centrale, senza duplicare gli oggetti catalogo.
