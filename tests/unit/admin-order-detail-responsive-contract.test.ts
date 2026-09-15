import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const pageSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/admin/(dashboard)/ordini/[orderNumber]/page.tsx",
  ),
  "utf8",
);

const bankTransferSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/features/admin/confirm-bank-transfer-button.tsx",
  ),
  "utf8",
);

const shippingSource = fs.readFileSync(
  path.join(process.cwd(), "src/features/admin/order-shipping-form.tsx"),
  "utf8",
);

describe("admin order detail responsive contract", () => {
  it("rende il titolo ordine sicuro su viewport stretti", () => {
    expect(pageSource).toContain("text-2xl");
    expect(pageSource).toContain("break-all");
    expect(pageSource).toContain("sm:text-3xl");
    expect(pageSource).toContain("sm:break-words");
  });

  it("usa una visualizzazione prodotti mobile separata dalla tabella desktop", () => {
    expect(pageSource).toContain('className="hidden lg:block"');
    expect(pageSource).toContain(
      'className="divide-y divide-white/5 lg:hidden"',
    );
    expect(pageSource).not.toContain("overflow-x-auto");
    expect(pageSource).not.toContain("min-w-[720px]");
    expect(pageSource).toContain(">Quantità<");
    expect(pageSource).toContain(">Unitario<");
  });

  it("protegge le colonne principali dall'overflow", () => {
    expect(pageSource).toContain("grid min-w-0 items-start");
    expect(pageSource).toContain("grid min-w-0 content-start");
  });

  it("rende il link cliente full-width su telefono", () => {
    expect(pageSource).toContain("min-h-10 w-full items-center justify-center");
    expect(pageSource).toContain("sm:w-auto");
  });

  it("rende la conferma bonifico leggibile su mobile", () => {
    expect(bankTransferSource).toContain("w-full");
    expect(bankTransferSource).toContain("text-center");
    expect(bankTransferSource).toContain("leading-5");
  });

  it("limita l'altezza della modale bonifico", () => {
    expect(bankTransferSource).toContain("max-h-[calc(100dvh-2rem)]");
    expect(bankTransferSource).toContain("overflow-y-auto");
  });

  it("protegge il form spedizione dall'overflow", () => {
    expect(shippingSource).toContain("grid min-w-0 gap-4");
  });
});
