import { z } from "zod";

export const shippingMethodSchema = z.enum(["store_pickup", "tnt", "fedex"]);

export const paymentMethodSchema = z.enum(["stripe", "bank_transfer"]);

export const checkoutInputSchema = z
  .object({
    shippingAddressId: z.uuid().nullable(),
    billingAddressId: z.uuid(),
    shippingMethod: shippingMethodSchema,
    paymentMethod: paymentMethodSchema,
    promotionCode: z
      .string()
      .trim()
      .min(3)
      .max(32)
      .regex(/^[A-Za-z0-9_-]+$/)
      .nullable()
      .optional(),
  })
  .superRefine((input, context) => {
    if (input.shippingMethod !== "store_pickup" && !input.shippingAddressId) {
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
  promotionCode: z.string().nullable(),
  discountGrossAmountMinor: z.number().int().nonnegative(),
  totalGrossAmountMinor: z.number().int().nonnegative(),
  createdAt: z.iso.datetime({ offset: true }),
});

export const promotionCodePreviewInputSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3)
    .max(32)
    .regex(/^[A-Za-z0-9_-]+$/),
  subtotalGrossAmountMinor: z.number().int().positive(),
});

export const promotionCodePreviewResultSchema = z.object({
  code: z.string().min(1),
  discountGrossAmountMinor: z.number().int().positive(),
});

export type PromotionCodePreviewInput = z.infer<
  typeof promotionCodePreviewInputSchema
>;

export type PromotionCodePreviewResult = z.infer<
  typeof promotionCodePreviewResultSchema
>;

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
