import "server-only";

import { sendNewOrderEmails } from "@/server/email/order-created";
import {
  sendOrderDeliveredEmail,
  sendOrderPreparingEmail,
  sendOrderShippedEmail,
  sendPaymentReceivedEmail,
} from "@/server/email/order-status";

async function safelySend<T>(
  label: string,
  orderId: string,
  send: () => Promise<T>,
) {
  try {
    return await send();
  } catch (error) {
    console.error(`[email] ${label} non inviata`, {
      orderId,
      error:
        error instanceof Error ? error.message : "Errore email sconosciuto",
    });

    return null;
  }
}

export async function safelySendNewOrderEmails(orderId: string) {
  return safelySend("notifica nuovo ordine", orderId, () =>
    sendNewOrderEmails(orderId),
  );
}

export async function safelySendPaymentReceivedEmail(orderId: string) {
  return safelySend("notifica pagamento ricevuto", orderId, () =>
    sendPaymentReceivedEmail(orderId),
  );
}

export async function safelySendOrderPreparingEmail(orderId: string) {
  return safelySend("notifica ordine in preparazione", orderId, () =>
    sendOrderPreparingEmail(orderId),
  );
}

export async function safelySendOrderShippedEmail(orderId: string) {
  return safelySend("notifica ordine spedito", orderId, () =>
    sendOrderShippedEmail(orderId),
  );
}

export async function safelySendOrderDeliveredEmail(orderId: string) {
  return safelySend("notifica ordine consegnato", orderId, () =>
    sendOrderDeliveredEmail(orderId),
  );
}
