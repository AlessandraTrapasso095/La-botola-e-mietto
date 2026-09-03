import { z } from "zod";

export const shippingMethodSchema = z.enum(["store_pickup", "tnt"]);

export const paymentMethodSchema = z.enum([
  "stripe",
  "bank_transfer",
  "satispay",
]);

export const checkoutInputSchema = z
  .object({
    shippingAddressId: z.uuid().nullable(),
    billingAddressId: z.uuid(),
    shippingMethod: shippingMethodSchema,
    paymentMethod: paymentMethodSchema,
  })
  .superRefine((input, context) => {
    if (input.shippingMethod === "tnt" && !input.shippingAddressId) {
      context.addIssue({
        code: "custom",
        path: ["shippingAddressId"],
        message: "Seleziona un indirizzo di spedizione.",
      });
    }
  });

export const checkoutResultSchema = z.object({
  orderId: z.uuid(),
  orderNumber: z.string().min(1),
  orderStatus: z.enum([
    "received",
    "preparing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
  paymentStatus: z.enum([
    "pending",
    "authorized",
    "paid",
    "failed",
    "refunded",
  ]),
  shippingMethod: shippingMethodSchema,
  paymentMethod: paymentMethodSchema,
  subtotalNetAmountMinor: z.number().int().nonnegative(),
  vatAmountMinor: z.number().int().nonnegative(),
  shippingGrossAmountMinor: z.number().int().nonnegative(),
  totalGrossAmountMinor: z.number().int().nonnegative(),
  createdAt: z.iso.datetime({ offset: true }),
});

export const stripeCheckoutSessionInputSchema = z.object({
  orderId: z.uuid(),
});

export const stripeCheckoutSessionResultSchema = z.object({
  sessionId: z.string().min(1),
  redirectUrl: z.url(),
});

export type CheckoutInput = z.infer<typeof checkoutInputSchema>;
export type CheckoutResult = z.infer<typeof checkoutResultSchema>;
export type ShippingMethod = z.infer<typeof shippingMethodSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export const cancelAccountOrderInputSchema = z.object({
  orderId: z.uuid(),
});

export const hideAccountOrderInputSchema = z.object({
  orderId: z.uuid(),
});
