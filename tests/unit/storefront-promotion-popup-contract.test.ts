import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/components/layout/site-header-client.tsx"),
  "utf8",
);

describe("storefront promotion popup contract", () => {
  it("mostra il popup solo con una promo attiva", () => {
    expect(source).toContain("storefrontPromotion && promotionDialogOpen");
  });

  it("usa un dialog accessibile", () => {
    expect(source).toContain('role="dialog"');
    expect(source).toContain('aria-modal="true"');
    expect(source).toContain('aria-labelledby="storefront-promotion-title"');
  });

  it("espone una X per chiudere il popup", () => {
    expect(source).toContain('aria-label="Chiudi promozione"');
    expect(source).toContain("closePromotionDialog");
    expect(source).toContain("×");
  });

  it("chiude il popup con Escape", () => {
    expect(source).toContain('event.key !== "Escape"');
    expect(source).toContain(
      'document.addEventListener("keydown", closeOnEscape)',
    );
    expect(source).toContain(
      'document.removeEventListener("keydown", closeOnEscape)',
    );
  });

  it("memorizza il dismiss per il singolo codice", () => {
    expect(source).toContain(
      "storefront-promo-dismissed:${storefrontPromotion.code}",
    );
    expect(source).toContain("window.localStorage.setItem");
    expect(source).toContain("window.localStorage.getItem");
  });

  it("evidenzia il codice promo in verde", () => {
    expect(source).toContain("bg-emerald-400");
    expect(source).toContain("text-emerald-950");
  });

  it("rende la promo visibile con sfondo rosso", () => {
    expect(source).toContain("bg-red-950");
  });

  it("mantiene la spedizione nella barra promo", () => {
    expect(source).toContain("Spedizione gratuita in Italia sopra");
  });

  it("mostra il codice anche nel popup", () => {
    expect(source).toContain("Codice promozionale");
    expect(source).toContain("{storefrontPromotion.code}");
  });

  it("permette di copiare il codice promo", () => {
    expect(source).toContain("navigator.clipboard.writeText");
    expect(source).toContain("storefrontPromotion.code");
    expect(source).toContain("Copia codice");
  });

  it("mostra feedback dopo la copia", () => {
    expect(source).toContain("copiedPromotionCode");
    expect(source).toContain("Copiato!");
    expect(source).toContain("Codice copiato negli appunti.");
    expect(source).toContain('aria-live="polite"');
  });

  it("blocca lo scroll mentre il popup è aperto", () => {
    expect(source).toContain('document.body.style.overflow = "hidden"');
    expect(source).toContain("document.body.style.overflow = previousOverflow");
  });

  it("porta il focus sul pulsante di chiusura", () => {
    expect(source).toContain("promotionDialogCloseRef.current?.focus()");
  });
});
