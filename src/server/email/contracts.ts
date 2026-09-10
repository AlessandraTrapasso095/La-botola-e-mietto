export type EmailAudience = "customer" | "admin";

export type EmailEventType =
  | "auth.registration_link"
  | "auth.registration_completed"
  | "auth.password_changed"
  | "auth.email_change_requested"
  | "auth.email_changed"
  | "order.created"
  | "order.preparing"
  | "payment.received"
  | "order.shipped"
  | "order.delivered"
  | "order.cancelled_by_admin"
  | "order.cancelled_by_customer"
  | "order.cancellation_requested"
  | "order.cancellation_approved"
  | "order.cancellation_rejected"
  | "payment.refunded"
  | "promotion.created";

export type EmailTemplateKey =
  | "customer-registration-completed"
  | "customer-order-created"
  | "customer-payment-received"
  | "customer-order-preparing"
  | "customer-order-shipped"
  | "customer-order-delivered"
  | "customer-order-cancelled-admin"
  | "customer-order-cancelled-self"
  | "customer-cancellation-requested"
  | "customer-cancellation-approved"
  | "customer-cancellation-rejected"
  | "customer-password-changed"
  | "customer-email-changed"
  | "customer-promotion"
  | "admin-new-order"
  | "admin-order-delivered"
  | "admin-order-cancellation"
  | "admin-password-changed"
  | "admin-email-changed";

export type EmailDeliveryStatus = "pending" | "sent" | "failed" | "skipped";

export type EmailDeliveryReservation = {
  id: string;
  eventKey: string;
  alreadyExists: boolean;
  status: EmailDeliveryStatus;
};

export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type EmailSendResult = {
  providerMessageId: string;
};
