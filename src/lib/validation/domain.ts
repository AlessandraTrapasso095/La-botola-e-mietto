import { z } from "zod";

export const productCodeSchema = z.string().trim().min(1).max(64);
export const productSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(180)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const minorAmountSchema = z.bigint().nonnegative();
export const vatRateBasisPointsSchema = z.number().int().min(0).max(10_000);

export const cartQuantitySchema = z.number().int().min(1).max(99);
export const cartMutationSchema = z.object({
  productId: z.uuid(),
  quantity: cartQuantitySchema,
});

export const profileInputSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.email(),
  phone: z.string().trim().max(40).nullable(),
  birthDate: z.iso.date().nullable(),
  marketingConsent: z.boolean(),
});

export const addressInputSchema = z.object({
  type: z.enum(["shipping", "billing"]),
  recipientName: z.string().trim().min(1).max(160),
  line1: z.string().trim().min(1).max(200),
  line2: z.string().trim().max(200).nullable(),
  postalCode: z.string().trim().min(3).max(20),
  city: z.string().trim().min(1).max(120),
  province: z.string().trim().max(80).nullable(),
  countryCode: z.string().trim().length(2).toUpperCase(),
  isDefault: z.boolean(),
});
