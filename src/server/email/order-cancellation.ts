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

async function getCancellationOrderData(orderId: string) {
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
      cancellation_request_status,
      cancellation_requested_at,
      cancellation_request_resolved_at,
      cancellation_resolution_note,
      customer_cancellation_note,
      cancelled_at,
      refund_provider,
      refund_reference,
      refund_amount_minor,
      refunded_at
    `,
    )
    .eq("id", orderId)
    .single();

  if (orderResponse.error || !orderResponse.data) {
    throw new Error(
      orderResponse.error?.message ??
        "Ordine non disponibile per la notifica di annullamento.",
    );
  }

  const profileResponse = await admin
    .from("profiles")
    .select("id, email, first_name, last_name, phone")
    .eq("id", orderResponse.data.profile_id)
    .single();

  if (profileResponse.error || !profileResponse.data?.email) {
    throw new Error("Cliente non disponibile per la notifica di annullamento.");
  }

  return {
    order: orderResponse.data,
    customer: profileResponse.data,
  };
}

async function getCancellationAdminRecipients() {
  const admin = createSupabaseAdminClient();

  const response = await admin
    .from("profiles")
    .select("id, email")
    .eq("role", "admin")
    .eq("admin_notify_cancellations", true);

  if (response.error) {
    throw new Error(
      "Destinatari amministrativi per gli annullamenti non disponibili.",
    );
  }

  return response.data.filter(
    (recipient): recipient is typeof recipient & { email: string } =>
      Boolean(recipient.email),
  );
}

function customerName(customer: {
  first_name: string | null;
  last_name: string | null;
}) {
  return [customer.first_name, customer.last_name].filter(Boolean).join(" ");
}

function orderUrl(orderNumber: string) {
  return `${siteUrl()}/account/ordini/${encodeURIComponent(orderNumber)}`;
}

function adminOrderUrl(orderNumber: string) {
  return `${siteUrl()}/admin/ordini/${encodeURIComponent(orderNumber)}`;
}

function refundSection(order: {
  payment_status: string;
  refund_provider: string | null;
  refund_reference: string | null;
  refund_amount_minor: number | null;
  currency: string;
  refunded_at: string | null;
}) {
  if (
    order.payment_status !== "refunded" &&
    order.refund_amount_minor === null &&
    !order.refund_provider
  ) {
    return [];
  }

  const fields = [];

  if (order.refund_amount_minor !== null) {
    fields.push({
      label: "Importo rimborsato",
      value: formatMoney(Number(order.refund_amount_minor), order.currency),
      emphasize: true,
    });
  }

  if (order.refund_reference) {
    fields.push({
      label: "Riferimento rimborso",
      value: order.refund_reference,
    });
  }

  return [
    {
      title: "Rimborso",
      content: "Il rimborso relativo all’ordine è stato registrato.",
      lead:
        order.refund_provider === "stripe"
          ? "Il rimborso è stato disposto tramite il circuito di pagamento utilizzato per l’acquisto."
          : "Il rimborso dell’ordine è stato registrato.",
      fields,
      notes: [
        "I tempi effettivi di accredito possono dipendere dalla banca o dal metodo di pagamento utilizzato.",
      ],
    },
  ];
}

async function sendAdminCancellationEmail({
  orderId,
  eventType,
  title,
  intro,
}: {
  orderId: string;
  eventType: "order.cancelled_by_customer" | "order.cancellation_requested";
  title: string;
  intro: string;
}) {
  const { order, customer } = await getCancellationOrderData(orderId);
  const admins = await getCancellationAdminRecipients();

  const name = customerName(customer) || "Cliente";

  const results = [];

  for (const recipient of admins) {
    const message = createBrandedEmailMessage({
      to: recipient.email,
      subject: `${title} — ordine ${order.order_number}`,
      preheader: `${title} — ${order.order_number}`,
      title,
      intro,
      sections: [
        {
          title: "Ordine",
          content: `Numero ordine: ${order.order_number}\nTotale: ${formatMoney(
            Number(order.total_gross_amount_minor),
            order.currency,
          )}`,
        },
        {
          title: "Cliente",
          content: [
            name,
            customer.email,
            customer.phone ?? "Telefono non disponibile",
          ].join("\n"),
        },
      ],
      action: {
        label: "Apri ordine in admin",
        href: adminOrderUrl(order.order_number),
      },
    });

    const eventKey = createEmailEventKey({
      eventType,
      entityId: order.id,
      audience: "admin",
      recipient: recipient.email,
    });

    results.push(
      await sendTrackedEmail({
        eventKey,
        eventType,
        templateKey: "admin-order-cancellation",
        message,
        metadata: {
          order_id: order.id,
          order_number: order.order_number,
        },
      }),
    );
  }

  return results;
}

export async function sendCustomerCancellationRequestedEmails(orderId: string) {
  const { order, customer } = await getCancellationOrderData(orderId);

  const name = customerName(customer);

  const customerMessage = createBrandedEmailMessage({
    to: customer.email,
    subject:
      `Richiesta di annullamento ordine ${order.order_number} ricevuta — ` +
      "La Botola e Mietto",
    preheader: `Abbiamo ricevuto la richiesta di annullamento per ${order.order_number}`,
    title: "Abbiamo ricevuto la tua richiesta di annullamento",
    intro:
      `Ciao ${name || "cliente"}, ` +
      "la tua richiesta è stata registrata correttamente.",
    sections: [
      {
        title: `Ordine ${order.order_number}`,
        content:
          "La richiesta dovrà essere verificata dall’amministrazione. " +
          "L’ordine non è ancora annullato.",
      },
    ],
    action: {
      label: "Vedi il tuo ordine",
      href: orderUrl(order.order_number),
    },
    outro:
      "Ti invieremo una nuova email non appena la richiesta sarà stata verificata.",
  });

  const customerEventKey = createEmailEventKey({
    eventType: "order.cancellation_requested",
    entityId: order.id,
    audience: "customer",
    recipient: customer.email,
  });

  const customerResult = await sendTrackedEmail({
    eventKey: customerEventKey,
    eventType: "order.cancellation_requested",
    templateKey: "customer-cancellation-requested",
    message: customerMessage,
    metadata: {
      order_id: order.id,
      order_number: order.order_number,
    },
  });

  const adminResults = await sendAdminCancellationEmail({
    orderId,
    eventType: "order.cancellation_requested",
    title: "Nuova richiesta di annullamento",
    intro: `Il cliente ${name || customer.email} ha richiesto l’annullamento dell’ordine.`,
  });

  return {
    customer: customerResult,
    admins: adminResults,
  };
}

export async function sendCustomerOrderCancelledEmails(orderId: string) {
  const { order, customer } = await getCancellationOrderData(orderId);

  const name = customerName(customer);

  const customerMessage = createBrandedEmailMessage({
    to: customer.email,
    subject: `Ordine ${order.order_number} annullato — ` + "La Botola e Mietto",
    preheader: `Il tuo ordine ${order.order_number} è stato annullato`,
    title: "Il tuo ordine è stato annullato",
    intro:
      `Ciao ${name || "cliente"}, ` +
      "la tua richiesta è stata completata e l’ordine è stato annullato.",
    sections: [
      {
        title: `Ordine ${order.order_number}`,
        content:
          "L’ordine non verrà più elaborato. Puoi consultare i dettagli dalla tua area personale.",
      },
      ...refundSection(order),
    ],
    action: {
      label: "Vedi il tuo ordine",
      href: orderUrl(order.order_number),
    },
  });

  const customerEventKey = createEmailEventKey({
    eventType: "order.cancelled_by_customer",
    entityId: order.id,
    audience: "customer",
    recipient: customer.email,
  });

  const customerResult = await sendTrackedEmail({
    eventKey: customerEventKey,
    eventType: "order.cancelled_by_customer",
    templateKey: "customer-order-cancelled-self",
    message: customerMessage,
    metadata: {
      order_id: order.id,
      order_number: order.order_number,
    },
  });

  const adminResults = await sendAdminCancellationEmail({
    orderId,
    eventType: "order.cancelled_by_customer",
    title: "Ordine annullato dal cliente",
    intro: `Il cliente ${name || customer.email} ha annullato l’ordine.`,
  });

  return {
    customer: customerResult,
    admins: adminResults,
  };
}

export async function sendAdminOrderCancelledEmail(orderId: string) {
  const { order, customer } = await getCancellationOrderData(orderId);

  const name = customerName(customer);

  const customerMessage = createBrandedEmailMessage({
    to: customer.email,
    subject: `Ordine ${order.order_number} annullato — ` + "La Botola e Mietto",
    preheader: `Il tuo ordine ${order.order_number} è stato annullato`,
    title: "Il tuo ordine è stato annullato",
    intro: `Ciao ${name || "cliente"}, l’ordine è stato annullato.`,
    sections: [
      {
        title: `Ordine ${order.order_number}`,
        content:
          order.customer_cancellation_note ||
          "L’ordine non verrà più elaborato.",
      },
      ...refundSection(order),
    ],
    action: {
      label: "Vedi il tuo ordine",
      href: orderUrl(order.order_number),
    },
  });

  const eventKey = createEmailEventKey({
    eventType: "order.cancelled_by_admin",
    entityId: order.id,
    audience: "customer",
    recipient: customer.email,
  });

  return sendTrackedEmail({
    eventKey,
    eventType: "order.cancelled_by_admin",
    templateKey: "customer-order-cancelled-admin",
    message: customerMessage,
    metadata: {
      order_id: order.id,
      order_number: order.order_number,
    },
  });
}

export async function sendCancellationApprovedEmail(orderId: string) {
  const { order, customer } = await getCancellationOrderData(orderId);

  const name = customerName(customer);

  const message = createBrandedEmailMessage({
    to: customer.email,
    subject: `Richiesta di annullamento approvata — ordine ${order.order_number}`,
    preheader: `La richiesta per ${order.order_number} è stata approvata`,
    title: "La tua richiesta di annullamento è stata approvata",
    intro:
      `Ciao ${name || "cliente"}, ` +
      "abbiamo verificato la tua richiesta e l’ordine è stato annullato.",
    sections: [
      ...(order.cancellation_resolution_note
        ? [
            {
              title: "Comunicazione",
              content: order.cancellation_resolution_note,
            },
          ]
        : []),
      ...refundSection(order),
    ],
    action: {
      label: "Vedi il tuo ordine",
      href: orderUrl(order.order_number),
    },
  });

  const eventKey = createEmailEventKey({
    eventType: "order.cancellation_approved",
    entityId: order.id,
    audience: "customer",
    recipient: customer.email,
  });

  return sendTrackedEmail({
    eventKey,
    eventType: "order.cancellation_approved",
    templateKey: "customer-cancellation-approved",
    message,
    metadata: {
      order_id: order.id,
      order_number: order.order_number,
    },
  });
}

export async function sendCancellationRejectedEmail(orderId: string) {
  const { order, customer } = await getCancellationOrderData(orderId);

  const name = customerName(customer);

  const message = createBrandedEmailMessage({
    to: customer.email,
    subject: `Aggiornamento richiesta di annullamento — ordine ${order.order_number}`,
    preheader: `Aggiornamento sulla richiesta per ${order.order_number}`,
    title: "La richiesta di annullamento non è stata approvata",
    intro:
      `Ciao ${name || "cliente"}, ` +
      "abbiamo verificato la tua richiesta di annullamento.",
    sections: [
      {
        title: `Ordine ${order.order_number}`,
        content:
          order.cancellation_resolution_note ||
          "La richiesta non è stata approvata e l’ordine continuerà a essere elaborato.",
      },
    ],
    action: {
      label: "Vedi il tuo ordine",
      href: orderUrl(order.order_number),
    },
  });

  const eventKey = createEmailEventKey({
    eventType: "order.cancellation_rejected",
    entityId: order.id,
    audience: "customer",
    recipient: customer.email,
  });

  return sendTrackedEmail({
    eventKey,
    eventType: "order.cancellation_rejected",
    templateKey: "customer-cancellation-rejected",
    message,
    metadata: {
      order_id: order.id,
      order_number: order.order_number,
    },
  });
}
