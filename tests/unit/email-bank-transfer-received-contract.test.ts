import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const root = process.cwd();

const emailSource = fs.readFileSync(
  path.join(root, "src/server/email/order-status.ts"),
  "utf8",
);

const bankTransferSource = fs.readFileSync(
  path.join(root, "src/server/admin/confirm-bank-transfer.ts"),
  "utf8",
);

const stripeWebhookSource = fs.readFileSync(
  path.join(root, "src/server/stripe/webhook.ts"),
  "utf8",
);

const safeSource = fs.readFileSync(
  path.join(root, "src/server/email/safe-send.ts"),
  "utf8",
);

describe("email pagamento ricevuto", () => {
  it("viene inviata soltanto quando il pagamento risulta paid", () => {
    expect(emailSource).toContain('order.payment_status !== "paid"');
  });

  it("supporta sia bonifico sia pagamenti Stripe", () => {
    expect(emailSource).toContain('"stripe" | "bank_transfer" | "satispay"');

    expect(emailSource).toContain('case "bank_transfer"');

    expect(emailSource).toContain('case "stripe"');
  });

  it("usa paid_at quando disponibile e updated_at come fallback", () => {
    expect(emailSource).toContain("formatDate(order.paid_at)");

    expect(emailSource).toContain("formatDate(order.updated_at)");
  });

  it("usa event key idempotente", () => {
    expect(emailSource).toContain('eventType: "payment.received"');

    expect(emailSource).toContain('templateKey: "customer-payment-received"');
  });

  it("include numero ordine importo metodo e data", () => {
    expect(emailSource).toContain("order.order_number");
    expect(emailSource).toContain("total_gross_amount_minor");
    expect(emailSource).toContain("paymentMethodLabel(order.payment_method)");
    expect(emailSource).toContain("paymentDate");
  });

  it("parte quando l'admin conferma un bonifico", () => {
    expect(bankTransferSource).toContain(
      "safelySendPaymentReceivedEmail(row.order_id)",
    );
  });

  it("parte anche quando Stripe conferma il pagamento", () => {
    expect(stripeWebhookSource).toContain(
      "safelySendPaymentReceivedEmail(orderId)",
    );
  });

  it("un errore email non blocca il pagamento", () => {
    expect(safeSource).toContain("safelySendPaymentReceivedEmail");

    expect(safeSource).toContain("try {");
    expect(safeSource).toContain("catch (error)");
  });

  it("contiene il messaggio corretto per il cliente", () => {
    expect(emailSource).toContain("Pagamento ricevuto");

    expect(emailSource).toContain(
      "abbiamo ricevuto correttamente il pagamento del tuo ordine.",
    );

    expect(emailSource).toContain("Vedi il tuo ordine");
  });
});
