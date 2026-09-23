import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("logging security contract", () => {
  const safeSend = source("src/server/email/safe-send.ts");
  const promotion = source("src/server/email/promotion.ts");
  const emailSend = source("src/server/email/send.ts");
  const authConfirm = source("src/app/(storefront)/auth/confirm/route.ts");
  const emailMarketing = source("src/server/admin/admin-email-marketing.ts");
  const storefrontPromotion = source(
    "src/server/catalog/storefront-promotion.ts",
  );
  const rateLimit = source("src/server/security/rate-limit.ts");
  const productImages = source("src/server/admin/admin-product-images.ts");
  const adminUser = source("src/server/admin/admin-user.ts");

  it("non registra messaggi email grezzi o identificativi destinatario", () => {
    expect(safeSend).not.toContain("error instanceof Error ? error.message");

    expect(promotion).not.toContain("profileId: recipient.id");
    expect(promotion).not.toContain("error instanceof Error ? error.message");
  });

  it("non persiste nel delivery log il messaggio grezzo del provider", () => {
    expect(emailSend).not.toContain("error instanceof Error ? error.message");

    expect(emailSend).toContain('errorMessage: "Invio email non riuscito."');
  });

  it("non registra indirizzi email o userId nel callback auth", () => {
    expect(authConfirm).not.toContain("previousEmail");

    expect(authConfirm).not.toContain("error: updateResponse.error.message");

    expect(authConfirm).not.toContain("userId: confirmedUser.id");

    expect(authConfirm).toContain("code: updateResponse.error.code");
  });

  it("non registra messaggi Postgres grezzi nello storico marketing", () => {
    expect(emailMarketing).not.toContain("error: update.error.message");

    expect(emailMarketing).not.toContain("error: failureUpdate.error.message");

    expect(emailMarketing).toContain("code: update.error.code");

    expect(emailMarketing).toContain("code: failureUpdate.error.code");
  });

  it("mantiene storefront promotion fail-safe senza loggare l'eccezione", () => {
    expect(storefrontPromotion).toContain("catch {");
    expect(storefrontPromotion).not.toContain(
      "error instanceof Error ? error.message",
    );
    expect(storefrontPromotion).not.toContain("String(error)");
    expect(storefrontPromotion).toContain("return null");
  });

  it("non registra il messaggio grezzo del rate limiter", () => {
    expect(rateLimit).not.toContain(
      '"[rate-limit] impossibile verificare il limite condiviso",\n      error.message',
    );

    expect(rateLimit).toContain("code: error.code");
  });

  it("non serializza StorageError completi nel cleanup immagini", () => {
    expect(productImages).not.toContain(
      '"[admin-product-image] Impossibile rimuovere il file dallo Storage.",\n        error',
    );

    expect(productImages).not.toContain(
      '"[admin-product-image] Rimozione del file dallo Storage fallita.",\n      error',
    );
  });

  it("non serializza l'Error completo della verifica admin", () => {
    expect(adminUser).not.toContain(
      '"[admin-auth] Impossibile verificare la sessione admin.", error',
    );
  });
});
