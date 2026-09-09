import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("tracking ordine area cliente", () => {
  const pageSource = readFileSync(
    resolve(
      "src/app/(storefront)/account/ordini/[orderNumber]/page.tsx",
    ),
    "utf8",
  );

  const ordersSource = readFileSync(
    resolve("src/server/account/orders.ts"),
    "utf8",
  );

  it("recupera i campi tracking dal server", () => {
    expect(ordersSource).toContain("shipping_carrier");
    expect(ordersSource).toContain("tracking_code");
    expect(ordersSource).toContain("tracking_url");
    expect(ordersSource).toContain("shipped_at");
    expect(ordersSource).toContain("delivered_at");
  });

  it("mostra tracking solo per spedizione TNT", () => {
    expect(pageSource).toContain(
      'order.shippingMethod === "tnt"',
    );
  });

  it("mostra corriere codice e date della spedizione", () => {
    expect(pageSource).toContain("Segui il tuo ordine");
    expect(pageSource).toContain("Codice tracking");
    expect(pageSource).toContain("Spedito il");
    expect(pageSource).toContain("Consegnato il");
  });

  it("espone il link pubblico di tracking", () => {
    expect(pageSource).toContain("order.trackingUrl");
    expect(pageSource).toContain("Segui la spedizione");
    expect(pageSource).toContain('target="_blank"');
    expect(pageSource).toContain('rel="noreferrer"');
  });
});
