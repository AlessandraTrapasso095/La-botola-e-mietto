# Audit collezioni

Data audit: 3 agosto 2026.

## Fonti analizzate

- catalogo cliente: `reference-private/catalog/listino_completo_la_botola.xlsx`;
- Prestashop storico: `https://labotolaemietto.com/index.php`;
- categoria Prestashop “Etichette di Pregio”: `https://labotolaemietto.com/index.php?id_category=64&controller=category`;
- tassonomia e dataset tipizzati già generati in `src/content/catalog`.

Il file Excel è stato letto senza modificarlo. Nessun file in `reference-private` è stato copiato o incluso nel mapping pubblico.

## Tassonomia Prestashop trovata

Il menu storico espone le seguenti categorie e sottocategorie:

- Whisky/Whiskey: Scotch (Speyside, Highland, Campbeltown, Lowlands, Islay, Islands, Blended), Irish (Blended, Single Malt, Single Grain, Single Pot), Americani (Tennessee, Bourbon, Canadian, Rye), Dal Mondo (Giapponesi, Canadian);
- Calvados;
- Tequila/Mezcal;
- Cognac;
- Armagnac;
- Gin;
- Rum | Rhum: Tradizionali, Agricole;
- Grappa;
- Cachaça;
- Liquori: Limoncello, Miscelazione, Sake, Liquirizia, Liquori internazionali, Liquori italiani, Liquori alle Erbe, Sambuche, Pastis;
- Amari;
- Vodka: classica, aromatizzata, Premium, tradizione est-Europa, stile occidentale/nordico, italiana, internazionale;
- Brandy/Acquavite;
- Birra;
- Assenzio;
- Aperitivi;
- Bitter;
- Vermouth;
- Analcolici: Sciroppi;
- Etichette di Pregio: Liquori, Whisky, Rum.

Tra le sei voci oggetto dell’audit, soltanto **Etichette di Pregio** è una categoria Prestashop verificata. La pagina storica dichiara 33 prodotti.

## Tassonomia Excel trovata

Il listino contiene 2.124 righe, 10 colonne e 85 sottocategorie valorizzate. Sono inoltre presenti 16 righe senza sottocategoria.

| Sottocategoria                 | Prodotti | Sottocategoria                       | Prodotti |
| ------------------------------ | -------: | ------------------------------------ | -------: |
| Aguardiente di Canna           |        2 | Aguardiente di Frutta                |        1 |
| Amaretto                       |        4 | Amari Regionali Classici             |       13 |
| American Whiskey - Altri       |        4 | Aperitivi Amari                      |        2 |
| Aperitivi Amari / Red Bitter   |        6 | Aquavit / Akvavit                    |        2 |
| Armagnac                       |        4 | Bagaceira                            |        1 |
| Bitter da Cocktail             |       11 | Blended Scotch                       |       75 |
| Bourbon Whiskey                |       77 | Brandy Europeo                       |       32 |
| Brandy Italiano                |        8 | Brandy de Jerez                      |        3 |
| Cachaça                        |        6 | Canadian Whisky                      |       14 |
| Cask-Aged / Barrel Gin         |        8 | Cognac                               |       10 |
| Contemporary / New Western Gin |       26 | Corn Whiskey                         |        2 |
| Creme di Liquore               |        4 | Distillati Tradizionali - Altri      |       24 |
| Distillato di Agave            |        1 | Distillato di Agave Aromatizzato     |        2 |
| Distillato di Vinaccia - Altri |        1 | Distillato non classificato          |        3 |
| Distilled Gin                  |       75 | European Whisky                      |        5 |
| Fernet & Amarissimi            |        1 | Grappa Affinata                      |        1 |
| Grappa Invecchiata / Riserva   |        1 | Irish Blended Whiskey                |       60 |
| Irish Cream                    |        3 | Irish Grain Whiskey                  |        1 |
| Irish Single Malt              |       34 | Irish Single Pot Still               |        6 |
| Japanese Blended Whisky        |       56 | Japanese Grain Whisky                |        2 |
| Japanese Single Malt           |       16 | Liquori Anisati                      |       14 |
| Liquori agli Agrumi            |       12 | Liquori al Caffè, Cacao e Cioccolato |        8 |
| Liquori alla Frutta            |       81 | Liquori alla Frutta Secca            |        5 |
| Liquori alle Erbe e Spezie     |       36 | London Dry Gin                       |      269 |
| Mezcal Artesanal               |        7 | Navy Strength Gin                    |       10 |
| Old Tom Gin                    |       10 | Ouzo                                 |        3 |
| Pastis                         |        3 | Pink & Flavored Gin                  |      140 |
| Pisco                          |        3 | Rakı                                 |        1 |
| Rhum Agricole                  |        1 | Rum Aromatizzato                     |       12 |
| Rum Bianco                     |        7 | Rum Invecchiato                      |      189 |
| Rum Overproof                  |       15 | Rum Speziato / Spiced Rum            |       19 |
| Rum Tradizionale da Melassa    |       92 | Rum di Stile Spagnolo / Ron          |        7 |
| Rye Whiskey                    |       30 | Sambuca                              |        1 |
| Single Malt Scotch             |      190 | Sotol                                |        1 |
| Taiwanese Whisky               |        3 | Tennessee Whiskey                    |       41 |
| Tequila Añejo                  |       22 | Tequila Blanco / Plata               |       28 |
| Tequila Cristalino             |        2 | Tequila Joven / Oro                  |        4 |
| Tequila Reposado               |       25 | Vermouth Bianco                      |       10 |
| Vermouth Dry                   |        3 | Vermouth Rosso                       |       13 |
| Vermouth Rosé                  |        3 | Vodka Aromatizzata / Flavored        |       27 |
| Vodka Premium & Craft          |       39 | Vodka da Altre Materie Prime         |        3 |
| Vodka di Grano / Cereali       |      108 | Vodka di Patata                      |        3 |
| World Whisky - Altri           |        1 |                                      |          |

Nessuna sottocategoria Excel usa i nomi Bottiglie Rare, Distillati Rari, Etichette di Pregio, Edizioni da Collezione, Confezioni Regalo o Nuovi Arrivi.

## Corrispondenze certe pubblicate

| Voce                | Sorgente esatta                       | Regola                                                                                          | Prodotti | Route                             |
| ------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------- | -------: | --------------------------------- |
| Etichette di Pregio | Categoria Prestashop `id_category=64` | sola corrispondenza nominale certa ancora presente nel listino: codice `AB1319`, Don Julio 1942 |        1 | `/collezione/etichette-di-pregio` |
| Confezioni Regalo   | Campo Excel `PRODOTTO`                | valore che inizia con `GIFT` oppure contiene la parola intera `COFANETTO`                       |       98 | `/collezione/confezioni-regalo`   |
| Nuovi Arrivi        | Campo Excel `NUOVI PRODOTTI`          | valore esattamente uguale a `NUOVI PRODOTTI`                                                    |       65 | `/collezione/nuovi-arrivi`        |

Il mapping è centralizzato in `src/content/catalog/collections.ts`. Le collezioni referenziano i prodotti tramite codice sorgente e derivano gli slug dal dataset: non duplicano oggetti prodotto.

## Corrispondenze dubbie e voci escluse

| Voce                   | Esito                        | Motivo                                                                                                                                                            |
| ---------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bottiglie Rare         | Da confermare con la cliente | non è una categoria Prestashop né una sottocategoria/campo Excel; la presenza di “rare” nel nome di alcune referenze non dimostra l’appartenenza a una collezione |
| Distillati Rari        | Da confermare con la cliente | è un titolo editoriale del progetto corrente, non una tassonomia verificata nelle fonti                                                                           |
| Edizioni da Collezione | Da confermare con la cliente | non esiste come categoria o campo; “collection” o “limited” in singoli nomi prodotto non costituisce una regola affidabile                                        |

`The Macallan Rare Cask Release 2023` (`AB2322`) potrebbe essere il successore di release storiche presenti in Etichette di Pregio, ma non è una corrispondenza esatta e resta escluso fino a conferma.

Il dataset generato usa `isNew` anche per 50 righe marcate `PRODOTTI IN OFFERTA`. La collezione Nuovi Arrivi non usa tale flag: usa i 65 codici derivati dal valore Excel esatto, evitando di pubblicare le offerte come novità.

## Route finali

- `/collezione/etichette-di-pregio`;
- `/collezione/confezioni-regalo`;
- `/collezione/nuovi-arrivi`.

Le tre route hanno almeno un prodotto reale associato. Le voci dubbie non sono mostrate nei menu desktop o mobile.
