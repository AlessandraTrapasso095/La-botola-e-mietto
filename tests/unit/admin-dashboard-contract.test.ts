import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("admin dashboard contract", () => {
  const serverSource = readFileSync(
    resolve("src/server/admin/dashboard.ts"),
    "utf8",
  );

  const pageSource = readFileSync(
    resolve("src/app/admin/(dashboard)/page.tsx"),
    "utf8",
  );

  it("calcola incassato solo dagli ordini paid", () => {
    expect(serverSource).toContain('order.paymentStatus === "paid"');

    expect(serverSource).toContain("paidRevenueMinor");
  });

  it("mantiene i rimborsi separati dagli incassi", () => {
    expect(serverSource).toContain('order.paymentStatus === "refunded"');

    expect(serverSource).toContain("refundedAmountMinor");

    expect(serverSource).toContain("refundedOrderCount");
  });

  it("calcola clienti unici", () => {
    expect(serverSource).toContain("new Set(");

    expect(serverSource).toContain("order.customer.id");

    expect(serverSource).toContain("customerCount");
  });

  it("limita ultimi ordini e ordini da attenzionare a cinque", () => {
    expect(serverSource).toContain("recentOrders: orders.slice(0, 5)");

    expect(serverSource).toContain(".filter(needsAttention)");

    expect(serverSource).toContain(".slice(0, 5)");
  });

  it("considera received pending authorized e cancellation pending come attenzione", () => {
    expect(serverSource).toContain('order.status === "received"');

    expect(serverSource).toContain('order.paymentStatus === "pending"');

    expect(serverSource).toContain('order.paymentStatus === "authorized"');

    expect(serverSource).toContain(
      'order.cancellationRequestStatus === "pending"',
    );
  });

  it("mostra i principali KPI nella dashboard", () => {
    expect(pageSource).toContain("Ordini da gestire");

    expect(pageSource).toContain("Incassato");

    expect(pageSource).toContain("Annullamenti da gestire");

    expect(pageSource).toContain("Clienti con ordini");

    expect(pageSource).toContain("Totale rimborsato");
  });

  it("mostra ultimi ordini e sezione attenzione", () => {
    expect(pageSource).toContain("Ultimi ordini");

    expect(pageSource).toContain("Richiede attenzione");

    expect(pageSource).toContain("Tutto sotto controllo");
  });
});
