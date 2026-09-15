import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/admin/(dashboard)/ordini/[orderNumber]/page.tsx",
  ),
  "utf8",
);

describe("admin order detail layout contract", () => {
  it("mantiene prodotti e stato amministrativo nella colonna principale", () => {
    const productsIndex = source.indexOf(">Prodotti<");
    const adminStatusIndex = source.indexOf(">Stato amministrativo<");
    const customerIndex = source.indexOf(">Cliente<");

    expect(productsIndex).toBeGreaterThan(-1);
    expect(adminStatusIndex).toBeGreaterThan(productsIndex);
    expect(customerIndex).toBeGreaterThan(adminStatusIndex);
  });

  it("non usa più il vecchio blocco amministrativo separato in fondo", () => {
    expect(source).not.toContain(
      'className="mt-5 grid items-start gap-5 xl:grid-cols-2"',
    );
  });

  it("compatta lo stato amministrativo su più colonne", () => {
    expect(source).toContain(
      'className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3"',
    );
  });

  it("mantiene i riferimenti pagamento", () => {
    expect(source).toContain("Riferimenti pagamento");
    expect(source).toContain("paymentProviderReference");
    expect(source).toContain("stripeCheckoutSessionId");
    expect(source).toContain("stripePaymentIntentId");
  });

  it("collega il cliente al customer management", () => {
    expect(source).toContain("href={`/admin/clienti/${order.customer.id}`}");
    expect(source).toContain("Apri cliente");
  });
});
