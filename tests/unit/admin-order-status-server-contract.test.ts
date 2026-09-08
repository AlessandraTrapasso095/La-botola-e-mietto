import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("contratto server Admin Order Status", () => {
  const source = readFileSync(
    resolve("src/server/admin/update-order-status.ts"),
    "utf8",
  );

  it("consente solo la progressione lineare degli stati", () => {
    expect(source).toContain('received: ["preparing"]');
    expect(source).toContain('preparing: ["shipped"]');
    expect(source).toContain('shipped: ["delivered"]');
    expect(source).toContain("delivered: []");
  });

  it("non consente l'annullamento attraverso il flusso stato generico", () => {
    expect(source).toContain('nextStatus === "cancelled"');
    expect(source).toContain(
      "L’annullamento deve essere gestito tramite il flusso dedicato.",
    );
  });

  it("blocca modifiche su un ordine già annullato", () => {
    expect(source).toContain('order.status === "cancelled"');
    expect(source).toContain(
      "Un ordine annullato non può cambiare stato.",
    );
  });

  it("blocca la spedizione se il pagamento non è acquisito o autorizzato", () => {
    expect(source).toContain('nextStatus === "shipped"');
    expect(source).toContain('order.payment_status !== "paid"');
    expect(source).toContain('order.payment_status !== "authorized"');
  });

  it("blocca spedizione e consegna con annullamento pendente", () => {
    expect(source).toContain(
      'order.cancellation_request_status === "pending"',
    );
    expect(source).toContain(
      '(nextStatus === "shipped" || nextStatus === "delivered")',
    );
  });

  it("protegge da aggiornamenti concorrenti dello stato", () => {
    expect(source).toContain('.eq("status", order.status)');
    expect(source).toContain(
      "Lo stato dell’ordine è cambiato nel frattempo.",
    );
  });
});
