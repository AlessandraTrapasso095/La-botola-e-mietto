import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(path), "utf8");
}

describe("technical error leak hardening", () => {
  const bankServer = source("src/server/admin/confirm-bank-transfer.ts");

  const bankRoute = source(
    "src/app/api/admin/orders/payment/bank-transfer/route.ts",
  );

  const imageServer = source("src/server/admin/admin-product-images.ts");

  const imageUpload = source(
    "src/features/admin/admin-product-image-upload.ts",
  );

  it("non espone il messaggio RPC grezzo nella conferma bonifico", () => {
    expect(bankServer).not.toContain("throw new Error(response.error.message)");

    expect(bankServer).toContain("AuthHttpError");

    expect(bankServer).toContain(
      "Non è stato possibile confermare il bonifico.",
    );

    expect(bankServer).toContain("code: response.error.code");
  });

  it("gestisce input e errori della route bonifico in modo centralizzato", () => {
    expect(bankRoute).toContain("inputSchema.safeParse(payload)");

    expect(bankRoute).toContain(
      'throw new AuthHttpError(400, "Richiesta non valida.")',
    );

    expect(bankRoute).toContain("return authErrorResponse(error)");

    expect(bankRoute).not.toContain("error instanceof Error");
  });

  it("non concatena errori database o storage nei messaggi immagini", () => {
    expect(imageServer).not.toContain("${productError.message}");

    expect(imageServer).not.toContain("${error.message}");

    expect(imageServer).not.toContain("originalUpload.error?.message");

    expect(imageServer).not.toContain("thumbnailUpload.error?.message");
  });

  it("mantiene il mapping degli errori business noti delle immagini", () => {
    expect(imageServer).toContain(
      'error.message.includes("PRODUCT_IMAGE_OBJECT_MISSING")',
    );

    expect(imageServer).toContain(
      'error.message.includes("PRODUCT_IMAGE_THUMBNAIL_OBJECT_MISSING")',
    );

    expect(imageServer).toContain(
      'error.message.includes("PRODUCT_IMAGE_NOT_FOUND")',
    );
  });

  it("non mostra errori Supabase Storage grezzi nel browser", () => {
    expect(imageUpload).not.toContain("originalUploadError.message");

    expect(imageUpload).not.toContain("thumbnailUploadError.message");

    expect(imageUpload).toContain("Impossibile caricare l’immagine. Riprova.");

    expect(imageUpload).toContain(
      "Impossibile caricare l’anteprima dell’immagine. Riprova.",
    );
  });

  it("mantiene errori leggibili senza dettagli infrastrutturali", () => {
    expect(imageServer).toContain(
      "Non è stato possibile verificare il prodotto. Riprova.",
    );

    expect(imageServer).toContain(
      "Impossibile preparare il caricamento dell’immagine. Riprova.",
    );

    expect(imageServer).toContain(
      "Impossibile registrare l’immagine prodotto. Riprova.",
    );
  });
});
