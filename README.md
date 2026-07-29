# La Botola e Mietto

E-commerce premium italiano **La Botola e Mietto**. Il repository comprende la
fondazione tecnica e l’esperienza frontend della Milestone 1A: homepage
editoriale, catalogo reale navigabile, categorie, marchi, schede prodotto,
ricerca, carrello e preferiti.

Il catalogo statico e tipizzato è stato generato dal listino cliente: 2.124
prodotti e 2.123 fotografie sorgente convertite in varianti WebP full e
thumbnail. Database, autenticazione, checkout, pagamenti e ordini reali restano
intenzionalmente fuori dallo scope.

## Stack

- Next.js 16 con App Router, React 19 e TypeScript strict
- Tailwind CSS 4 con token CSS centralizzati
- Supabase predisposto per PostgreSQL, Auth, Storage e RLS
- Zod e React Hook Form
- Vitest, Testing Library e Playwright
- ESLint e Prettier

## Avvio locale

Requisiti: Node.js 20.9 o successivo.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Aprire `http://localhost:3000`. Le variabili Supabase possono restare vuote
finché non vengono usate le relative integrazioni.

## Verifiche

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
git diff --check
```

Per la prima esecuzione E2E:

```bash
npx playwright install chromium
```

## Struttura

- `src/app`: route, metadata e layout App Router
- `src/components`: primitive UI, layout e motion
- `src/features`: catalogo, ricerca, carrello, preferiti, age gate e consensi
- `src/content/catalog`: dataset tipizzati di prodotti, categorie, marchi e collezioni
- `src/content/demo-assets`: riferimenti centralizzati agli asset editoriali sostituibili
- `src/config`: business, commercio, brand, consensi e metadata
- `src/lib`: utility condivise e client browser
- `src/server`: logica e segreti esclusivamente server
- `supabase`: migrazioni RLS e seed intenzionalmente vuoto
- `tests`: test unitari e end-to-end
- `docs`: decisioni tecniche e stato della milestone

## Dati privati

`reference-private/`, listini, archivi e documenti del cliente sono esclusi da
Git e non devono essere modificati. In `public/` sono presenti soltanto copie
elaborate per il sito: logo raster ottimizzato, 2.123 immagini prodotto WebP e
gli asset editoriali sostituibili.

## Stato funzionale

Funzionano realmente nel browser:

- age gate persistente, gestione focus e blocco del contenuto;
- navigazione tra 2.124 prodotti, categorie, marchi e schede prodotto;
- filtri, ordinamento, ricerca e drawer mobile;
- carrello, quantità, soglia di spedizione gratuita e preferiti;
- persistenza locale di carrello, wishlist e prodotti visti di recente;
- preference center cookie e newsletter con stati accessibili;
- metadata, sitemap e route informative.

Sono simulati o statici:

- disponibilità commerciale;
- catalogo generato dal listino e non sincronizzato in tempo reale;
- newsletter, area personale e checkout;
- salvataggio locale di carrello e preferiti;
- immagini editoriali di hero, categorie e racconto.

Il report completo dell’importazione è disponibile in
[`docs/catalog-import-report.md`](docs/catalog-import-report.md).

## Documentazione

- [Architettura](docs/architecture.md)
- [Standard di codice](docs/coding-standards.md)
- [Design system](docs/design-system.md)
- [Motion system](docs/motion-system.md)
- [Sicurezza](docs/security.md)
- [Stato contenuti legali](docs/legal-content-status.md)
- [Dati dimostrativi](docs/demo-data.md)
- [Inventario contenuti](docs/content-inventory.md)
- [Roadmap](docs/project-roadmap.md)
