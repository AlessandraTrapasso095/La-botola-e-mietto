import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const serverSource = fs.readFileSync(
  path.join(process.cwd(), "src/server/admin/admin-customers.ts"),
  "utf8",
);

const pageSource = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/app/admin/(dashboard)/clienti/[customerId]/page.tsx",
  ),
  "utf8",
);

describe("admin customer detail contract", () => {
  it("espone il backend dettaglio cliente protetto", () => {
    expect(serverSource).toContain("getAdminCustomerById");
    expect(serverSource).toContain("await requireAdmin()");
    expect(serverSource).toContain('.eq("role", "customer")');
    expect(serverSource).toContain('.is("deleted_at", null)');
  });

  it("carica gli indirizzi reali del cliente", () => {
    expect(serverSource).toContain('.from("addresses")');
    expect(serverSource).toContain("first_name");
    expect(serverSource).toContain("last_name");
    expect(serverSource).toContain("street_number");
    expect(serverSource).toContain("is_default_shipping");
    expect(serverSource).toContain("is_default_billing");
  });

  it("carica lo storico ordini cliente", () => {
    expect(serverSource).toContain('.from("orders")');
    expect(serverSource).toContain('.eq("profile_id", normalizedCustomerId)');
    expect(serverSource).toContain("order_number");
    expect(serverSource).toContain("payment_method");
  });

  it("calcola acquisti solo da ordini pagati e non annullati", () => {
    expect(serverSource).toContain('order.status !== "cancelled"');
    expect(serverSource).toContain('order.paymentStatus === "paid"');
    expect(serverSource).toContain("paidGrossAmountMinor");
  });

  it("mostra anagrafica consenso e metriche", () => {
    expect(pageSource).toContain("Dettaglio cliente");
    expect(pageSource).toContain("Consenso marketing attivo");
    expect(pageSource).toContain("Anagrafica");
    expect(pageSource).toContain('label="Ordini pagati"');
    expect(pageSource).toContain('label="Totale acquistato"');
  });

  it("mostra gli indirizzi salvati", () => {
    expect(pageSource).toContain("Indirizzi salvati");
    expect(pageSource).toContain("Predefinito spedizione");
    expect(pageSource).toContain("Predefinito fatturazione");
  });

  it("mostra lo storico ordini", () => {
    expect(pageSource).toContain("Storico ordini");
    expect(pageSource).toContain("orderStatusLabel");
    expect(pageSource).toContain("paymentStatusLabel");
    expect(pageSource).toContain("paymentMethodLabel");
  });

  it("collega ogni ordine al dettaglio ordine esistente", () => {
    expect(pageSource).toContain("href={`/admin/ordini/${encodeURIComponent(");
    expect(pageSource).toContain("Apri ordine");
  });

  it("gestisce cliente inesistente con notFound", () => {
    expect(pageSource).toContain("notFound()");
  });
});
