import "server-only";

import { createEmailEventKey } from "@/server/email/event-key";
import { createBrandedEmailMessage } from "@/server/email/message";
import { sendTrackedEmail } from "@/server/email/send";
import { createSupabaseAdminClient } from "@/server/supabase-admin";

function siteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!value) {
    throw new Error("NEXT_PUBLIC_SITE_URL non configurato.");
  }

  return value.replace(/\/+$/, "");
}

function formatMoney(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
  }).format(amountMinor / 100);
}

function formatDate(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function paymentMethodLabel(method: "stripe" | "bank_transfer" | "satispay") {
  switch (method) {
    case "stripe":
      return "Pagamento online tramite Stripe";
    case "bank_transfer":
      return "Bonifico bancario";
    case "satispay":
      return "Satispay";
  }
}

async function getOrderData(orderId: string) {
  const admin = createSupabaseAdminClient();

  const orderResponse = await admin
    .from("orders")
    .select(
      `
      id,
      profile_id,
      order_number,
      status,
      payment_status,
      payment_method,
      total_gross_amount_minor,
      currency,
      updated_at,
      paid_at,
      shipping_method,
      shipping_carrier,
      tracking_code,
      tracking_url,
      shipped_at,
      delivered_at
    `,
    )
    .eq("id", orderId)
    .single();

  if (orderResponse.error || !orderResponse.data) {
    throw new Error(
      orderResponse.error?.message ??
        "Ordine non disponibile per l'invio email.",
    );
  }

  const profileResponse = await admin
    .from("profiles")
    .select("email, first_name, last_name")
    .eq("id", orderResponse.data.profile_id)
    .single();

  if (profileResponse.error || !profileResponse.data?.email) {
    throw new Error("Email cliente non disponibile.");
  }

  return {
    order: orderResponse.data,
    customer: profileResponse.data,
  };
}

function customerName(customer: {
  first_name: string | null;
  last_name: string | null;
}) {
  return [customer.first_name, customer.last_name].filter(Boolean).join(" ");
}

function orderUrl(orderNumber: string) {
  return `${siteUrl()}/account/ordini/` + encodeURIComponent(orderNumber);
}

export async function sendPaymentReceivedEmail(orderId: string) {
  const { order, customer } = await getOrderData(orderId);

  if (order.payment_status !== "paid") {
    throw new Error(
      "Il pagamento non risulta ancora confermato come ricevuto.",
    );
  }

  const name = customerName(customer);

  const paymentDate = formatDate(order.paid_at) ?? formatDate(order.updated_at);

  const message = createBrandedEmailMessage({
    to: customer.email,
    subject:
      `Pagamento ricevuto — Ordine ${order.order_number} — ` +
      "La Botola e Mietto",
    preheader: `Pagamento ricevuto per l'ordine ${order.order_number}`,
    title: "Pagamento ricevuto",
    intro:
      `Ciao ${name || "cliente"}, ` +
      "abbiamo ricevuto correttamente il pagamento del tuo ordine.",
    sections: [
      {
        title: `Ordine ${order.order_number}`,
        content: [
          `Importo ricevuto: ${formatMoney(
            Number(order.total_gross_amount_minor),
            order.currency,
          )}`,
          `Metodo: ${paymentMethodLabel(order.payment_method)}`,
          paymentDate ? `Pagamento registrato il: ${paymentDate}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      },
      {
        title: "Cosa succede adesso",
        content:
          "Il pagamento è stato registrato correttamente. " +
          "Il tuo ordine può ora proseguire con la preparazione.",
      },
    ],
    action: {
      label: "Vedi il tuo ordine",
      href: orderUrl(order.order_number),
    },
    outro: "Ti aggiorneremo via email durante le successive fasi dell’ordine.",
  });

  const eventKey = createEmailEventKey({
    eventType: "payment.received",
    entityId: order.id,
    audience: "customer",
    recipient: customer.email,
  });

  return sendTrackedEmail({
    eventKey,
    eventType: "payment.received",
    templateKey: "customer-payment-received",
    message,
    metadata: {
      order_id: order.id,
      order_number: order.order_number,
      payment_status: order.payment_status,
    },
  });
}

export async function sendOrderPreparingEmail(orderId: string) {
  const { order, customer } = await getOrderData(orderId);

  if (order.status !== "preparing") {
    throw new Error("L'ordine non risulta preso in carico.");
  }

  const name = customerName(customer);

  const message = createBrandedEmailMessage({
    to: customer.email,
    subject:
      `Il tuo ordine è in preparazione — ${order.order_number} — ` +
      "La Botola e Mietto",
    preheader: `Stiamo preparando l'ordine ${order.order_number}`,
    title: "Il tuo ordine è in preparazione",
    intro:
      `Ciao ${name || "cliente"}, ` +
      "abbiamo preso in carico il tuo ordine e stiamo iniziando a prepararlo.",
    sections: [
      {
        title: `Ordine ${order.order_number}`,
        content:
          "Il tuo ordine è stato preso in carico correttamente e passerà ora alle successive fasi di preparazione.",
      },
    ],
    action: {
      label: "Vedi il tuo ordine",
      href: orderUrl(order.order_number),
    },
    outro: "Riceverai una nuova email non appena il tuo ordine verrà spedito.",
  });

  const eventKey = createEmailEventKey({
    eventType: "order.preparing",
    entityId: order.id,
    audience: "customer",
    recipient: customer.email,
  });

  return sendTrackedEmail({
    eventKey,
    eventType: "order.preparing",
    templateKey: "customer-order-preparing",
    message,
    metadata: {
      order_id: order.id,
      order_number: order.order_number,
    },
  });
}

export async function sendOrderShippedEmail(orderId: string) {
  const { order, customer } = await getOrderData(orderId);

  if (order.status !== "shipped") {
    throw new Error("L'ordine non risulta spedito.");
  }

  const name = customerName(customer);

  const trackingLines = [
    order.shipping_carrier ? `Corriere: ${order.shipping_carrier}` : null,
    order.tracking_code ? `Codice tracking: ${order.tracking_code}` : null,
    order.shipped_at ? `Spedito il: ${formatDate(order.shipped_at)}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const message = createBrandedEmailMessage({
    to: customer.email,
    subject:
      `Il tuo ordine è stato spedito — ${order.order_number} — ` +
      "La Botola e Mietto",
    preheader: `Ordine ${order.order_number} spedito`,
    title: "Il tuo ordine è stato spedito",
    intro:
      `Ciao ${name || "cliente"}, ` +
      "il tuo ordine ha lasciato la nostra sede ed è in viaggio verso di te.",
    sections: [
      {
        title: `Ordine ${order.order_number}`,
        content: trackingLines || "La spedizione è stata affidata al corriere.",
      },
    ],
    ...(order.tracking_url
      ? {
          action: {
            label: "Segui la spedizione",
            href: order.tracking_url,
          },
        }
      : {
          action: {
            label: "Vedi il tuo ordine",
            href: orderUrl(order.order_number),
          },
        }),
    outro: "Ti aggiorneremo nuovamente quando l’ordine risulterà consegnato.",
  });

  const eventKey = createEmailEventKey({
    eventType: "order.shipped",
    entityId: order.id,
    audience: "customer",
    recipient: customer.email,
  });

  return sendTrackedEmail({
    eventKey,
    eventType: "order.shipped",
    templateKey: "customer-order-shipped",
    message,
    metadata: {
      order_id: order.id,
      order_number: order.order_number,
      carrier: order.shipping_carrier,
      tracking_code: order.tracking_code,
      tracking_url: order.tracking_url,
    },
  });
}

export async function sendOrderDeliveredEmail(orderId: string) {
  const { order, customer } = await getOrderData(orderId);

  if (order.status !== "delivered") {
    throw new Error("L'ordine non risulta consegnato.");
  }

  const name = customerName(customer);

  const deliveredDate =
    formatDate(order.delivered_at) ?? formatDate(order.updated_at);

  const message = createBrandedEmailMessage({
    to: customer.email,
    subject:
      `Ordine consegnato — ${order.order_number} — ` + "La Botola e Mietto",
    preheader: `Ordine ${order.order_number} consegnato`,
    title: "Il tuo ordine è stato consegnato",
    intro: `Ciao ${name || "cliente"}, ` + "il tuo ordine risulta consegnato.",
    sections: [
      {
        title: `Ordine ${order.order_number}`,
        content: deliveredDate
          ? `Consegna registrata il: ${deliveredDate}`
          : "La consegna del tuo ordine è stata registrata.",
      },
    ],
    action: {
      label: "Vedi il tuo ordine",
      href: orderUrl(order.order_number),
    },
    outro: "Grazie per aver scelto La Botola e Mietto.",
  });

  const eventKey = createEmailEventKey({
    eventType: "order.delivered",
    entityId: order.id,
    audience: "customer",
    recipient: customer.email,
  });

  return sendTrackedEmail({
    eventKey,
    eventType: "order.delivered",
    templateKey: "customer-order-delivered",
    message,
    metadata: {
      order_id: order.id,
      order_number: order.order_number,
    },
  });
}
