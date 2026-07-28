# La Botola e Mietto

Fondazione tecnica dell’e-commerce premium italiano **La Botola e Mietto**.
Questa repository contiene esclusivamente la Milestone 0: architettura,
design system, prototipi di consenso e route informative. Catalogo reale,
autenticazione, checkout, pagamenti e ordini non sono ancora implementati.

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
```

Per la prima esecuzione E2E:

```bash
npx playwright install chromium
```

## Struttura

- `src/app`: route, metadata e layout App Router
- `src/components`: primitive UI, layout e motion
- `src/features`: age gate, preferenze cookie e demo design system
- `src/config`: business, commercio, brand, consensi e metadata
- `src/lib`: utility condivise e client browser
- `src/server`: logica e segreti esclusivamente server
- `supabase`: migrazioni RLS e seed intenzionalmente vuoto
- `tests`: test unitari e end-to-end
- `docs`: decisioni tecniche e stato della milestone

## Dati privati

`reference-private/`, listini, archivi e documenti del cliente sono esclusi da
Git. Non spostare asset originali o segreti in `public/`. Le icone presenti in
`public/brand/` sono proposte provvisorie isolate e devono essere sostituite
dopo la consegna di asset brand adatti al web.

## Documentazione

- [Architettura](docs/architecture.md)
- [Standard di codice](docs/coding-standards.md)
- [Design system](docs/design-system.md)
- [Motion system](docs/motion-system.md)
- [Sicurezza](docs/security.md)
- [Stato contenuti legali](docs/legal-content-status.md)
- [Roadmap](docs/project-roadmap.md)
