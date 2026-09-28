import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("operational monitoring contract", () => {
  const logger = source("src/server/monitoring/operational-log.ts");
  const webhookRoute = source("src/app/api/stripe/webhook/route.ts");

  it("mantiene il logger esclusivamente server-side", () => {
    expect(logger).toContain('import "server-only"');
  });

  it("accetta soltanto eventi operativi a codice chiuso", () => {
    expect(logger).toContain('"stripe.webhook.signature_invalid"');
    expect(logger).toContain('"stripe.webhook.processing_failed"');

    expect(logger).not.toContain("error: unknown");
    expect(logger).not.toContain("metadata");
    expect(logger).not.toContain("context");
  });

  it("non accetta né serializza eccezioni o messaggi grezzi", () => {
    expect(logger).not.toContain("error: unknown");
    expect(logger).not.toContain("error: Error");
    expect(logger).not.toContain("error.message");
    expect(logger).not.toContain("String(error)");
    expect(logger).not.toContain("JSON.stringify");
  });

  it("registra firma webhook non valida senza dati Stripe", () => {
    expect(webhookRoute).toContain(
      'logOperationalError("stripe.webhook.signature_invalid")',
    );
  });

  it("registra errore di elaborazione webhook senza eccezione grezza", () => {
    expect(webhookRoute).toContain(
      'logOperationalError("stripe.webhook.processing_failed")',
    );

    expect(webhookRoute).not.toContain(
      'logOperationalError("stripe.webhook.processing_failed",',
    );
  });

  it("non modifica il contratto HTTP del webhook", () => {
    expect(webhookRoute).toContain(
      '{ message: "Firma webhook Stripe non valida." }',
    );

    expect(webhookRoute).toContain(
      '{ message: "Gestione webhook non riuscita." }',
    );

    expect(webhookRoute).toContain("{ received: true }");
  });
});
