import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("new order email contract", () => {
  const source = readFileSync(
    resolve("src/server/email/order-created.ts"),
    "utf8",
  );

  it("invia email cliente e admin", () => {
    expect(source).toContain("customer-order-created");

    expect(source).toContain("admin-new-order");
  });

  it("rispetta la preferenza admin nuovi ordini", () => {
    expect(source).toContain("admin_notify_new_orders");

    expect(source).toContain('.eq("admin_notify_new_orders", true)');
  });

  it("include prodotti e totale", () => {
    expect(source).toContain("order_items");

    expect(source).toContain("total_gross_amount_minor");

    expect(source).toContain("formatProducts");
  });

  it("include dati cliente e telefono admin", () => {
    expect(source).toContain("phone");

    expect(source).toContain("first_name");

    expect(source).toContain("last_name");
  });

  it("include indirizzo di spedizione", () => {
    expect(source).toContain("shipping_address");

    expect(source).toContain("formatAddress");
  });

  it("crea link cliente e admin", () => {
    expect(source).toContain("/account/ordini/");

    expect(source).toContain("/admin/ordini/");
  });

  it("usa event key idempotenti", () => {
    expect(source).toContain("createEmailEventKey");

    expect(source).toContain('eventType: "order.created"');
  });
});

describe("bank transfer email instructions", () => {
  it("include i dati reali del bonifico", () => {
    const source = readFileSync(
      resolve("src/server/email/order-created.ts"),
      "utf8",
    );

    expect(source).toContain("Giuliano Mietto");

    expect(source).toContain("IT91D0306962722100000004605");

    expect(source).toContain("Intesa San Paolo");

    expect(source).toContain("5-7 giorni lavorativi");
  });

  it("mostra le istruzioni solo per bonifico", () => {
    const source = readFileSync(
      resolve("src/server/email/order-created.ts"),
      "utf8",
    );

    expect(source).toContain('order.paymentMethod === "bank_transfer"');

    expect(source).toContain("bankTransferInstructions");
  });

  it("include nella causale bonifico numero ordine e nome cliente", () => {
    const source = readFileSync(
      resolve("src/server/email/order-created.ts"),
      "utf8",
    );

    expect(source).toContain(
      'Causale: Ordine ${orderNumber}${customerName ? ` - ${customerName}` : ""}',
    );

    expect(source).toContain(
      "Inserisci la causale esattamente come indicata, così potremo associare rapidamente il pagamento al tuo ordine.",
    );

    expect(source).toContain("customerName");
  });
});
