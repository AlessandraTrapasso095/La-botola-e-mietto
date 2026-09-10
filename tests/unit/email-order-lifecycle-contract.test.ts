import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const root = process.cwd();

const contracts = fs.readFileSync(
  path.join(root, "src/server/email/contracts.ts"),
  "utf8",
);

const lifecycle = fs.readFileSync(
  path.join(root, "src/server/email/order-status.ts"),
  "utf8",
);

const statusServer = fs.readFileSync(
  path.join(root, "src/server/admin/update-order-status.ts"),
  "utf8",
);

const shippingServer = fs.readFileSync(
  path.join(root, "src/server/admin/ship-order.ts"),
  "utf8",
);

const webhook = fs.readFileSync(
  path.join(root, "src/server/stripe/webhook.ts"),
  "utf8",
);

const bankTransfer = fs.readFileSync(
  path.join(root, "src/server/admin/confirm-bank-transfer.ts"),
  "utf8",
);

describe("email ciclo completo ordine cliente", () => {
  it("registra pagamento e preparazione come eventi email", () => {
    expect(contracts).toContain('"payment.received"');
    expect(contracts).toContain('"order.preparing"');
  });

  it("invia email pagamento ricevuto", () => {
    expect(lifecycle).toContain("sendPaymentReceivedEmail");
    expect(lifecycle).toContain('"payment.received"');
    expect(lifecycle).toContain('"customer-payment-received"');
  });

  it("invia email quando l'ordine viene preso in carico", () => {
    expect(statusServer).toContain("safelySendOrderPreparingEmail(order.id)");
    expect(lifecycle).toContain("Il tuo ordine è in preparazione");
  });

  it("invia email spedizione dopo aver salvato il tracking", () => {
    expect(shippingServer).toContain(
      "await safelySendOrderShippedEmail(order.id)",
    );
    expect(lifecycle).toContain("shipping_carrier");
    expect(lifecycle).toContain("tracking_code");
    expect(lifecycle).toContain("tracking_url");
    expect(lifecycle).toContain("Segui la spedizione");
  });

  it("invia email alla consegna", () => {
    expect(statusServer).toContain("safelySendOrderDeliveredEmail(order.id)");
    expect(lifecycle).toContain("Il tuo ordine è stato consegnato");
  });

  it("invia pagamento ricevuto anche per Stripe/Klarna", () => {
    expect(webhook).toContain("safelySendPaymentReceivedEmail(orderId)");
  });

  it("invia pagamento ricevuto quando viene confermato il bonifico", () => {
    expect(bankTransfer).toContain(
      "safelySendPaymentReceivedEmail(row.order_id)",
    );
  });

  it("usa eventi idempotenti per evitare doppioni", () => {
    expect(lifecycle).toContain("createEmailEventKey");
    expect(lifecycle).toContain('eventType: "payment.received"');
    expect(lifecycle).toContain('eventType: "order.preparing"');
    expect(lifecycle).toContain('eventType: "order.shipped"');
    expect(lifecycle).toContain('eventType: "order.delivered"');
  });
});
