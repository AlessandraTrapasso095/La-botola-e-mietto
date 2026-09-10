import "server-only";

import type {
  EmailEventType,
  EmailMessage,
  EmailTemplateKey,
} from "@/server/email/contracts";
import {
  markEmailDeliveryFailed,
  markEmailDeliverySent,
  reserveEmailDelivery,
} from "@/server/email/delivery-log";
import { sendEmailMessage } from "@/server/email/provider";
import type { Json } from "@/types/database.generated";

export async function sendTrackedEmail({
  eventKey,
  eventType,
  templateKey,
  message,
  metadata = {},
}: {
  eventKey: string;
  eventType: EmailEventType;
  templateKey: EmailTemplateKey;
  message: EmailMessage;
  metadata?: Json;
}) {
  const reservation = await reserveEmailDelivery({
    eventKey,
    eventType,
    templateKey,
    recipientEmail: message.to,
    metadata,
  });

  if (reservation.alreadyExists && reservation.status !== "failed") {
    return {
      sent: false,
      duplicate: true,
      deliveryId: reservation.id,
    };
  }

  try {
    const result = await sendEmailMessage(message);

    await markEmailDeliverySent({
      deliveryId: reservation.id,
      providerMessageId: result.providerMessageId,
    });

    return {
      sent: true,
      duplicate: false,
      deliveryId: reservation.id,
      providerMessageId: result.providerMessageId,
    };
  } catch (error) {
    await markEmailDeliveryFailed({
      deliveryId: reservation.id,
      errorMessage:
        error instanceof Error ? error.message : "Invio email non riuscito.",
    });

    throw error;
  }
}
