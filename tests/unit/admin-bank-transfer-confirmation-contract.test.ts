import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const root = process.cwd();

const migration = fs.readFileSync(
  path.join(root, "supabase/migrations/0032_admin_confirm_bank_transfer.sql"),
  "utf8",
);

const server = fs.readFileSync(
  path.join(root, "src/server/admin/confirm-bank-transfer.ts"),
  "utf8",
);

const page = fs.readFileSync(
  path.join(root, "src/app/admin/(dashboard)/ordini/[orderNumber]/page.tsx"),
  "utf8",
);

const button = fs.readFileSync(
  path.join(root, "src/features/admin/confirm-bank-transfer-button.tsx"),
  "utf8",
);

describe("conferma bonifico admin", () => {
  it("consente solo ordini con bonifico", () => {
    expect(migration).toContain("v_order.payment_method <> 'bank_transfer'");
  });

  it("consente la conferma solo da pagamento pending", () => {
    expect(migration).toContain("v_order.payment_status <> 'pending'");
  });

  it("porta il pagamento a paid", () => {
    expect(migration).toContain("payment_status = 'paid'");
  });

  it("registra la data del pagamento", () => {
    expect(migration).toContain("paid_at = now()");
    expect(server).toContain("paidAt: row.paid_at");
  });

  it("non modifica lo stato ordine", () => {
    expect(migration).not.toContain("status = 'preparing'");
    expect(migration).not.toContain("status = 'shipped'");
  });

  it("mostra il pulsante solo per bonifico pending", () => {
    expect(page).toContain('order.paymentMethod === "bank_transfer"');
    expect(page).toContain('order.paymentStatus === "pending"');
    expect(button).toContain("Conferma bonifico ricevuto");
  });
});
