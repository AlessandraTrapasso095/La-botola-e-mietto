# La Botola e Mietto

E-commerce premium italiano **La Botola e Mietto**. Il repository comprende la
fondazione tecnica della Milestone 0 e l’esperienza frontend della Milestone
1A: homepage editoriale, catalogo navigabile, categorie, marchi, schede
prodotto, ricerca, carrello e preferiti.

I dati commerciali della Milestone 1A sono statici e tipizzati. Database,
autenticazione, checkout, pagamenti e ordini reali restano intenzionalmente
fuori dallo scope.

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
- `src/content/demo-assets`: riferimenti centralizzati agli asset editoriali provvisori
- `src/config`: business, commercio, brand, consensi e metadata
- `src/lib`: utility condivise e client browser
- `src/server`: logica e segreti esclusivamente server
- `supabase`: migrazioni RLS e seed intenzionalmente vuoto
- `tests`: test unitari e end-to-end
- `docs`: decisioni tecniche e stato della milestone

## Dati privati

`reference-private/`, listini, archivi e documenti del cliente sono esclusi da
Git. Non spostare asset originali o segreti in `public/`. Le icone presenti in
`public/brand/` e le immagini in `public/images/demo/` sono asset provvisori
isolati e sostituibili dopo la consegna dei materiali definitivi.

## Stato funzionale

Funzionano realmente nel browser:

- age gate persistente, gestione focus e blocco del contenuto;
- navigazione tra catalogo, categorie, marchi e schede prodotto;
- filtri, ordinamento, ricerca e drawer mobile;
- carrello, quantità, soglia di spedizione gratuita e preferiti;
- persistenza locale di carrello, wishlist e prodotti visti di recente;
- metadata, sitemap e route informative.

Sono simulati o statici:

- disponibilità e contenuti prodotto;
- dataset commerciale derivato da una selezione del listino cliente;
- newsletter, area personale e checkout;
- immagini prodotto e immagini editoriali.

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
