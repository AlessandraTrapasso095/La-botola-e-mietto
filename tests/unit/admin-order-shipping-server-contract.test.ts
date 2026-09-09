import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("contratto server shipping admin", () => {
  const shippingSource = readFileSync(
    resolve("src/server/admin/ship-order.ts"),
    "utf8",
  );

  const statusSource = readFileSync(
    resolve("src/server/admin/update-order-status.ts"),
    "utf8",
  );

  it("accetta tracking solo per spedizioni TNT", () => {
    expect(shippingSource).toContain(
      'order.shipping_method !== "tnt"',
    );

    expect(shippingSource).toContain(
      "Il tracking è disponibile solo per gli ordini con spedizione.",
    );
  });

  it("richiede che l'ordine sia in preparazione", () => {
    expect(shippingSource).toContain(
      'order.status !== "preparing"',
    );

    expect(shippingSource).toContain(
      "L’ordine deve essere in preparazione prima della spedizione.",
    );
  });

  it("richiede pagamento acquisito o autorizzato", () => {
    expect(shippingSource).toContain(
      'order.payment_status !== "paid"',
    );

    expect(shippingSource).toContain(
      'order.payment_status !== "authorized"',
    );
  });

  it("blocca la spedizione con richiesta di annullamento pendente", () => {
    expect(shippingSource).toContain(
      'order.cancellation_request_status === "pending"',
    );

    expect(shippingSource).toContain(
      "Gestisci prima la richiesta di annullamento.",
    );
  });

  it("salva tracking e timestamp insieme allo stato shipped", () => {
    expect(shippingSource).toContain('status: "shipped"');
    expect(shippingSource).toContain(
      "shipping_carrier: normalizedCarrier",
    );
    expect(shippingSource).toContain(
      "tracking_code: normalizedTrackingCode",
    );
    expect(shippingSource).toContain(
      "tracking_url: normalizedTrackingUrl",
    );
    expect(shippingSource).toContain("shipped_at: shippedAt");
  });

  it("protegge la spedizione da aggiornamenti concorrenti", () => {
    expect(shippingSource).toContain('.eq("status", "preparing")');
    expect(shippingSource).toContain(
      "Lo stato dell’ordine è cambiato nel frattempo.",
    );
  });

  it("impedisce a TNT di usare il vecchio flusso shipped", () => {
    expect(statusSource).toContain(
      'nextStatus === "shipped"',
    );

    expect(statusSource).toContain(
      'order.shipping_method === "tnt"',
    );

    expect(statusSource).toContain(
      "Per una spedizione TNT usa il flusso dedicato con corriere e tracking.",
    );
  });

  it("salva delivered_at quando l'ordine diventa consegnato", () => {
    expect(statusSource).toContain(
      'nextStatus === "delivered"',
    );

    expect(statusSource).toContain("delivered_at");
  });
});
