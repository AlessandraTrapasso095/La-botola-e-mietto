import {
  wishlistMergeInputSchema,
  wishlistProductInputSchema,
  wishlistResponseSchema,
  type WishlistResponse,
} from "@/lib/validation/wishlist";

const genericError = "Non è stato possibile aggiornare i preferiti.";

async function readResponse(response: Response): Promise<WishlistResponse> {
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      body &&
      typeof body === "object" &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : genericError;
    throw new Error(message);
  }
  return wishlistResponseSchema.parse(body);
}

async function mutateWishlist(
  method: "POST" | "DELETE" | "PUT",
  path: string,
  payload: unknown,
) {
  return readResponse(
    await fetch(path, {
      method,
      credentials: "same-origin",
      cache: "no-store",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export const supabaseWishlistService = {
  async read() {
    return readResponse(
      await fetch("/api/account/wishlist", {
        credentials: "same-origin",
        cache: "no-store",
      }),
    );
  },
  add(slug: string) {
    return mutateWishlist(
      "POST",
      "/api/account/wishlist",
      wishlistProductInputSchema.parse({ slug }),
    );
  },
  remove(slug: string) {
    return mutateWishlist(
      "DELETE",
      "/api/account/wishlist",
      wishlistProductInputSchema.parse({ slug }),
    );
  },
  merge(slugs: readonly string[]) {
    return mutateWishlist(
      "PUT",
      "/api/account/wishlist/merge",
      wishlistMergeInputSchema.parse({ slugs }),
    );
  },
};
