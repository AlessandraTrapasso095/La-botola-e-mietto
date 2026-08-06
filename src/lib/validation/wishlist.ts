import { z } from "zod";

export const wishlistProductSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(180)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const wishlistProductInputSchema = z
  .object({ slug: wishlistProductSlugSchema })
  .strict();

export const wishlistMergeInputSchema = z
  .object({
    slugs: z
      .array(wishlistProductSlugSchema)
      .max(100)
      .transform((slugs) => [...new Set(slugs)]),
  })
  .strict();

export const wishlistResponseSchema = z.object({
  slugs: z.array(wishlistProductSlugSchema),
});

export type WishlistResponse = z.infer<typeof wishlistResponseSchema>;
