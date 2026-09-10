import "server-only";

import { createEmailEventKey } from "@/server/email/event-key";
import { createBrandedEmailMessage } from "@/server/email/message";
import { sendTrackedEmail } from "@/server/email/send";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

type AddressSnapshot = {
  first_name?: unknown;
  last_name?: unknown;
  company?: unknown;
  address_line_1?: unknown;
  address_line_2?: unknown;
  street?: unknown;
  street_number?: unknown;
  postal_code?: unknown;
  city?: unknown;
  province?: unknown;
  country?: unknown;
  phone?: unknown;
};

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function formatMoney(amountMinor: number, currency = "EUR") {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
  }).format(amountMinor / 100);
}

function paymentMethodLabel(method: "stripe" | "bank_transfer" | "satispay") {
  switch (method) {
    case "stripe":
      return "Carta";
    case "bank_transfer":
      return "Bonifico bancario";
    case "satispay":
      return "Satispay";
  }
}

function shippingMethodLabel(method: "store_pickup" | "tnt" | "fedex") {
  switch (method) {
    case "tnt":
      return "Spedizione TNT";
    case "fedex":
      return "Spedizione FedEx";
    case "store_pickup":
      return "Ritiro in negozio";
  }
}

function bankTransferInstructions(
  orderNumber: string,
  customerName: string,
  totalGrossAmountMinor: number,
  currency: string,
) {
  return [
    "Completa il pagamento tramite bonifico bancario:",
    "",
    "Intestatario: Giuliano Mietto",
    "IBAN: IT91D0306962722100000004605",
    "Banca: Intesa San Paolo",
    `Causale: Ordine ${orderNumber}${customerName ? ` - ${customerName}` : ""}`,
    `Importo: ${formatMoney(totalGrossAmountMinor, currency)}`,
    "",
    "Inserisci la causale esattamente come indicata, così potremo associare rapidamente il pagamento al tuo ordine.",
    "",
    "Non appena riceveremo il bonifico, l'ordine verrà confermato e successivamente spedito.",
    "La ricezione del bonifico può richiedere 5-7 giorni lavorativi.",
  ].join("\n");
}

function bankTransferEmailSection(
  title: string,
  orderNumber: string,
  customerName: string,
  totalGrossAmountMinor: number,
  currency: string,
) {
  const causale =
    `Ordine ${orderNumber}` + (customerName ? ` - ${customerName}` : "");

  return {
    title,
    content: bankTransferInstructions(
      orderNumber,
      customerName,
      totalGrossAmountMinor,
      currency,
    ),
    lead: "Completa il pagamento tramite bonifico bancario utilizzando i dati riportati di seguito.",
    fields: [
      {
        label: "Intestatario",
        value: "Giuliano Mietto",
      },
      {
        label: "IBAN",
        value: "IT91D0306962722100000004605",
      },
      {
        label: "Banca",
        value: "Intesa San Paolo",
      },
      {
        label: "Causale",
        value: causale,
      },
      {
        label: "Importo da pagare",
        value: formatMoney(totalGrossAmountMinor, currency),
        emphasize: true,
      },
    ],
    notes: [
      "Inserisci la causale esattamente come indicata, così potremo associare rapidamente il pagamento al tuo ordine.",
      "Non appena riceveremo il bonifico, l'ordine verrà confermato e successivamente spedito.",
      "La ricezione del bonifico può richiedere 5-7 giorni lavorativi.",
    ],
  };
}

function formatAddress(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return "Indirizzo non disponibile";
  }

  const address = value as AddressSnapshot;

  const recipient = [
    stringValue(address.first_name),
    stringValue(address.last_name),
  ]
    .filter(Boolean)
    .join(" ");

  const street = [
    stringValue(address.address_line_1) ?? stringValue(address.street),
    stringValue(address.street_number),
  ]
    .filter(Boolean)
    .join(" ");

  const location = [
    stringValue(address.postal_code),
    stringValue(address.city),
    stringValue(address.province),
  ]
    .filter(Boolean)
    .join(" ");

  return [
    recipient,
    stringValue(address.company),
    street,
    stringValue(address.address_line_2),
    location,
    stringValue(address.country),
  ]
    .filter(Boolean)
    .join("\n");
}

function formatProducts(
  products: readonly {
    name: string;
    code: string;
    quantity: number;
    unitGrossAmountMinor: number;
    lineGrossAmountMinor: number;
  }[],
  currency: string,
) {
  return products
    .map(
      (product) =>
        `${product.quantity} × ${product.name}` +
        ` (${product.code})` +
        ` — ${formatMoney(product.lineGrossAmountMinor, currency)}`,
    )
    .join("\n");
}

async function getOrderEmailData(orderId: string) {
  const admin = createSupabaseAdminClient();

  const orderResponse = await admin
    .from("orders")
    .select(
      `
      id,
      profile_id,
      order_number,
      created_at,
      currency,
      payment_method,
      payment_status,
      shipping_method,
      shipping_address,
      billing_address,
      shipping_gross_amount_minor,
      total_gross_amount_minor,
      order_items (
        id,
        product_code,
        product_name,
        quantity,
        unit_gross_amount_minor,
        line_gross_amount_minor
      )
    `,
    )
    .eq("id", orderId)
    .single();

  if (orderResponse.error || !orderResponse.data) {
    throw new Error("Ordine non disponibile per la notifica email.");
  }

  const order = orderResponse.data;

  const profileResponse = await admin
    .from("profiles")
    .select(
      `
      id,
      email,
      first_name,
      last_name,
      phone
    `,
    )
    .eq("id", order.profile_id)
    .single();

  if (profileResponse.error || !profileResponse.data) {
    throw new Error("Cliente non disponibile per la notifica email.");
  }

  return {
    id: order.id,
    orderNumber: order.order_number,
    createdAt: order.created_at,
    currency: order.currency,
    paymentMethod: order.payment_method,
    paymentStatus: order.payment_status,
    shippingMethod: order.shipping_method,
    shippingAddress: order.shipping_address,
    billingAddress: order.billing_address,
    shippingGrossAmountMinor: Number(order.shipping_gross_amount_minor),
    totalGrossAmountMinor: Number(order.total_gross_amount_minor),
    customer: {
      id: profileResponse.data.id,
      email: profileResponse.data.email,
      firstName: profileResponse.data.first_name,
      lastName: profileResponse.data.last_name,
      phone: profileResponse.data.phone,
    },
    products: order.order_items.map((item) => ({
      id: item.id,
      code: item.product_code,
      name: item.product_name,
      quantity: item.quantity,
      unitGrossAmountMinor: Number(item.unit_gross_amount_minor),
      lineGrossAmountMinor: Number(item.line_gross_amount_minor),
    })),
  };
}

async function getAdminRecipients() {
  const admin = createSupabaseAdminClient();

  const response = await admin
    .from("profiles")
    .select(
      `
      id,
      email,
      admin_notify_new_orders
    `,
    )
    .eq("role", "admin")
    .eq("admin_notify_new_orders", true);

  if (response.error) {
    throw new Error("Destinatari amministrativi non disponibili.");
  }

  return response.data;
}

function siteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!value) {
    throw new Error("NEXT_PUBLIC_SITE_URL non configurato.");
  }

  return value.replace(/\/+$/, "");
}

export async function sendNewOrderEmails(orderId: string) {
  const order = await getOrderEmailData(orderId);

  const customerName = [order.customer.firstName, order.customer.lastName]
    .filter(Boolean)
    .join(" ");

  const productSummary = formatProducts(order.products, order.currency);

  const customerMessage = createBrandedEmailMessage({
    to: order.customer.email,
    subject: `Ordine ${order.orderNumber} ricevuto — ` + "La Botola e Mietto",
    preheader: `Abbiamo ricevuto il tuo ordine ` + order.orderNumber,
    title: "Abbiamo ricevuto il tuo ordine",
    intro:
      `Ciao ${customerName || "cliente"}, ` +
      "grazie per il tuo acquisto. " +
      "Di seguito trovi il riepilogo dell’ordine.",
    sections: [
      {
        title: `Ordine ${order.orderNumber}`,
        content: productSummary,
      },
      {
        title: "Pagamento",
        content:
          `${paymentMethodLabel(order.paymentMethod)}\n` +
          `Totale: ${formatMoney(order.totalGrossAmountMinor, order.currency)}`,
      },
      ...(order.paymentMethod === "bank_transfer"
        ? [
            bankTransferEmailSection(
              "Come completare il pagamento",
              order.orderNumber,
              customerName,
              order.totalGrossAmountMinor,
              order.currency,
            ),
          ]
        : []),
      {
        title: "Consegna",
        content:
          `${shippingMethodLabel(order.shippingMethod)}` +
          (order.shippingMethod !== "store_pickup"
            ? `\n${formatAddress(order.shippingAddress)}`
            : ""),
      },
    ],
    action: {
      label: "Vedi il tuo ordine",
      href:
        `${siteUrl()}/account/ordini/` + encodeURIComponent(order.orderNumber),
    },
    outro: "Ti aggiorneremo via email quando lo stato dell’ordine cambierà.",
  });

  const customerEventKey = createEmailEventKey({
    eventType: "order.created",
    entityId: order.id,
    audience: "customer",
    recipient: order.customer.email,
  });

  const customerResult = await sendTrackedEmail({
    eventKey: customerEventKey,
    eventType: "order.created",
    templateKey: "customer-order-created",
    message: customerMessage,
    metadata: {
      order_id: order.id,
      order_number: order.orderNumber,
    },
  });

  const admins = await getAdminRecipients();

  const adminResults = [];

  for (const admin of admins) {
    const adminMessage = createBrandedEmailMessage({
      to: admin.email,
      subject: `Nuovo ordine ${order.orderNumber} — ` + "La Botola e Mietto",
      preheader: `Nuovo ordine ${order.orderNumber}`,
      title: "Nuovo ordine ricevuto",
      intro: "È stato registrato un nuovo ordine sul sito.",
      sections: [
        {
          title: "Cliente",
          content: [
            customerName || "Nome non disponibile",
            order.customer.email,
            order.customer.phone ?? "Telefono non disponibile",
          ].join("\n"),
        },
        {
          title: `Ordine ${order.orderNumber}`,
          content: productSummary,
        },
        {
          title: "Pagamento",
          content:
            `${paymentMethodLabel(order.paymentMethod)}\n` +
            `Stato: ${order.paymentStatus}\n` +
            `Totale: ${formatMoney(
              order.totalGrossAmountMinor,
              order.currency,
            )}`,
        },
        ...(order.paymentMethod === "bank_transfer"
          ? [
              bankTransferEmailSection(
                "Istruzioni bonifico inviate al cliente",
                order.orderNumber,
                customerName,
                order.totalGrossAmountMinor,
                order.currency,
              ),
            ]
          : []),
        {
          title: "Consegna",
          content:
            `${shippingMethodLabel(order.shippingMethod)}` +
            (order.shippingMethod !== "store_pickup"
              ? `\n${formatAddress(order.shippingAddress)}`
              : ""),
        },
      ],
      action: {
        label: "Apri ordine in admin",
        href:
          `${siteUrl()}/admin/ordini/` + encodeURIComponent(order.orderNumber),
      },
    });

    const adminEventKey = createEmailEventKey({
      eventType: "order.created",
      entityId: order.id,
      audience: "admin",
      recipient: admin.email,
    });

    const result = await sendTrackedEmail({
      eventKey: adminEventKey,
      eventType: "order.created",
      templateKey: "admin-new-order",
      message: adminMessage,
      metadata: {
        order_id: order.id,
        order_number: order.orderNumber,
      },
    });

    adminResults.push(result);
  }

  return {
    customer: customerResult,
    admins: adminResults,
  };
}
