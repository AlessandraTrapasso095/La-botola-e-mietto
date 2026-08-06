import { z } from "zod";

export const cartProductSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(180)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const cartQuantitySchema = z.number().int().min(1).max(99);

export const cartProductInputSchema = z
  .object({
    slug: cartProductSlugSchema,
    quantity: cartQuantitySchema.default(1),
  })
  .strict();

export const cartQuantityInputSchema = z
  .object({
    slug: cartProductSlugSchema,
    quantity: z.number().int().min(0).max(99),
  })
  .strict();

export const cartRemoveInputSchema = z
  .object({
    slug: cartProductSlugSchema,
  })
  .strict();

export const cartMergeInputSchema = z
  .object({
    items: z
      .array(
        z
          .object({
            slug: cartProductSlugSchema,
            quantity: cartQuantitySchema,
          })
          .strict(),
      )
      .max(100)
      .transform((items) => {
        const quantities = new Map<string, number>();

        for (const item of items) {
          quantities.set(
            item.slug,
            Math.max(quantities.get(item.slug) ?? 0, item.quantity),
          );
        }

        return [...quantities.entries()].map(([slug, quantity]) => ({
          slug,
          quantity,
        }));
      }),
  })
  .strict();

export const cartLineSchema = z.object({
  slug: cartProductSlugSchema,
  quantity: cartQuantitySchema,
});

export const cartResponseSchema = z.object({
  items: z.array(cartLineSchema),
});

export type CartResponse = z.infer<typeof cartResponseSchema>;
export type CartMergeInput = z.infer<typeof cartMergeInputSchema>;
