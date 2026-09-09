import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("rimborso ordine area cliente", () => {
  const pageSource = readFileSync(
    resolve("src/app/(storefront)/account/ordini/[orderNumber]/page.tsx"),
    "utf8",
  );

  const ordersSource = readFileSync(
    resolve("src/server/account/orders.ts"),
    "utf8",
  );

  it("recupera importo e data rimborso", () => {
    expect(ordersSource).toContain("refund_amount_minor");
    expect(ordersSource).toContain("refunded_at");
  });

  it("mostra rimborso soltanto quando payment status è refunded", () => {
    expect(pageSource).toContain('order.paymentStatus === "refunded"');
  });

  it("mostra importo e data senza riferimento tecnico", () => {
    expect(pageSource).toContain("Rimborso effettuato");
    expect(pageSource).toContain("Importo rimborsato");
    expect(pageSource).toContain("Rimborsato il");
    expect(pageSource).not.toContain("order.refundReference");
  });
});
