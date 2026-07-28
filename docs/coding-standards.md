# Standard di codice

## Principi

- TypeScript strict, nessun `any` non motivato.
- Server Components per contenuti e letture dati.
- Client Components solo dove servono API browser o stato interattivo.
- Dipendenze introdotte solo per responsabilità concrete.
- Import tramite alias `@/`.
- Configurazioni e costanti di dominio fuori dai componenti.
- Importi monetari in unità minori intere.
- Componenti accessibili prima di aggiungere effetti.

## Convenzioni

- File e simboli con nomi di dominio espliciti.
- Nessun barrel file globale.
- Nessun HTML non sanitizzato o `dangerouslySetInnerHTML`.
- Classi Tailwind composte con `cn`; token in `src/styles/tokens.css`.
- Test unitari vicino ai confini di dominio, E2E per i flussi critici.

## Controlli prima di una proposta

1. `npm run format:check`
2. `npm run lint`
3. `npm run typecheck`
4. `npm test`
5. `npm run test:e2e` per flussi utente toccati
6. `npm run build`
