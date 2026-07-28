# Sicurezza

## Header

`next.config.ts` configura:

- Content Security Policy;
- `frame-ancestors 'none'` e `X-Frame-Options: DENY`;
- `X-Content-Type-Options: nosniff`;
- referrer policy;
- permissions policy restrittiva;
- Cross-Origin-Opener-Policy;
- rimozione di `X-Powered-By`.

La CSP consente connessioni Supabase e asset locali. `unsafe-inline` per gli
stili e gli script Next è una scelta iniziale compatibile con App Router; una
CSP con nonce potrà essere valutata quando il rendering e le integrazioni
saranno stabilizzati.

## Segreti

- Solo `NEXT_PUBLIC_*` può raggiungere il browser.
- Supabase service role e segreti Stripe sono letti esclusivamente da
  `src/server`.
- `.env.example` non contiene valori reali.
- `reference-private/` e i formati cliente sono ignorati da Git.

## Supabase

RLS è attivo. La migrazione non concede scritture al client pubblico.
L’accesso amministrativo verrà progettato in una milestone separata.

## Dipendenze

Il lockfile è versionato. Gli override npm correggono advisory transitive
presenti nelle versioni incluse da Next ed ESLint. Eseguire `npm audit` in CI e
riesaminare gli override a ogni aggiornamento dello stack.
