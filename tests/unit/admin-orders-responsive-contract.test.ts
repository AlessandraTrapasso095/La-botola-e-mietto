import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/app/admin/(dashboard)/ordini/page.tsx"),
  "utf8",
);

describe("admin orders responsive contract", () => {
  it("usa card su mobile e tablet", () => {
    expect(source).toContain('className="divide-y divide-white/10 lg:hidden"');
    expect(source).toContain("Apri ordine");
  });

  it("mostra la tabella completa solo da desktop", () => {
    expect(source).toContain(
      'className="hidden w-full overflow-hidden lg:block"',
    );
    expect(source).toContain("<table");
  });

  it("non richiede overflow orizzontale su mobile", () => {
    expect(source).not.toContain('className="overflow-x-auto"');
  });

  it("mantiene le informazioni principali nelle card", () => {
    expect(source).toContain("order.orderNumber");
    expect(source).toContain("customerName");
    expect(source).toContain("order.totalGrossAmountMinor");
    expect(source).toContain("paymentStatusLabel");
    expect(source).toContain("orderStatusLabel");
    expect(source).toContain("shippingMethodLabel");
  });

  it("rende i filtri ordinati per telefono e tablet", () => {
    expect(source).toContain("sm:grid-cols-2");
    expect(source).toContain("lg:grid-cols-3");
    expect(source).toContain("xl:grid-cols-6");
  });

  it("rende le azioni filtri full-width sui viewport piccoli", () => {
    expect(source).toContain("min-h-10 w-full items-center justify-center");
    expect(source).toContain("xl:w-auto");
  });

  it("non mostra tre KPI affiancati già sui telefoni piccoli", () => {
    expect(source).toContain("md:grid-cols-3");
    expect(source).not.toContain("mt-8 grid gap-3 sm:grid-cols-3");
  });
});
