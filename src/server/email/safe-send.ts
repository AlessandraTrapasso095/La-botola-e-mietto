import "server-only";

import {
  sendAdminEmailChangedEmail,
  sendAdminEmailChangeRequestedEmail,
  sendPasswordChangedEmail,
} from "@/server/email/account-security";
import { sendNewOrderEmails } from "@/server/email/order-created";
import { sendRegistrationCompletedEmail } from "@/server/email/registration";
import {
  sendAdminOrderCancelledEmail,
  sendCancellationApprovedEmail,
  sendCancellationRejectedEmail,
  sendCustomerCancellationRequestedEmails,
  sendCustomerOrderCancelledEmails,
} from "@/server/email/order-cancellation";
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

export async function safelySendCustomerCancellationRequestedEmails(
  orderId: string,
) {
  return safelySend("richiesta annullamento ordine", orderId, () =>
    sendCustomerCancellationRequestedEmails(orderId),
  );
}

export async function safelySendCustomerOrderCancelledEmails(orderId: string) {
  return safelySend("annullamento ordine cliente", orderId, () =>
    sendCustomerOrderCancelledEmails(orderId),
  );
}

export async function safelySendAdminOrderCancelledEmail(orderId: string) {
  return safelySend("annullamento ordine admin", orderId, () =>
    sendAdminOrderCancelledEmail(orderId),
  );
}

export async function safelySendCancellationApprovedEmail(orderId: string) {
  return safelySend("annullamento ordine approvato", orderId, () =>
    sendCancellationApprovedEmail(orderId),
  );
}

export async function safelySendCancellationRejectedEmail(orderId: string) {
  return safelySend("annullamento ordine rifiutato", orderId, () =>
    sendCancellationRejectedEmail(orderId),
  );
}

export async function safelySendPasswordChangedEmail(
  userId: string,
  occurrenceId: string,
) {
  return safelySend("notifica cambio password", userId, () =>
    sendPasswordChangedEmail(userId, occurrenceId),
  );
}

export async function safelySendAdminEmailChangeRequestedEmail(
  userId: string,
  newEmail: string,
  occurrenceId: string,
) {
  return safelySend("richiesta cambio email admin", userId, () =>
    sendAdminEmailChangeRequestedEmail({
      userId,
      newEmail,
      occurrenceId,
    }),
  );
}

export async function safelySendAdminEmailChangedEmail(
  userId: string,
  email: string,
  occurrenceId: string,
) {
  return safelySend("conferma cambio email admin", userId, () =>
    sendAdminEmailChangedEmail({
      userId,
      email,
      occurrenceId,
    }),
  );
}

export async function safelySendRegistrationCompletedEmail(userId: string) {
  return safelySend("conferma registrazione completata", userId, () =>
    sendRegistrationCompletedEmail(userId),
  );
}
