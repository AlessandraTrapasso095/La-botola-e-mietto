import {
  cartMergeInputSchema,
  cartProductInputSchema,
  cartQuantityInputSchema,
  cartRemoveInputSchema,
  cartResponseSchema,
  type CartResponse,
} from "@/lib/validation/cart";

const genericError = "Non è stato possibile aggiornare il carrello.";

async function readResponse(response: Response): Promise<CartResponse> {
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

  return cartResponseSchema.parse(body);
}

async function mutateCart(
  method: "POST" | "PATCH" | "DELETE" | "PUT",
  path: string,
  payload: unknown,
) {
  return readResponse(
    await fetch(path, {
      method,
      credentials: "same-origin",
      cache: "no-store",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    }),
  );
}

export const supabaseCartService = {
  async read() {
    return readResponse(
      await fetch("/api/account/cart", {
        credentials: "same-origin",
        cache: "no-store",
      }),
    );
  },

  add(slug: string, quantity = 1) {
    return mutateCart(
      "POST",
      "/api/account/cart",
      cartProductInputSchema.parse({
        slug,
        quantity,
      }),
    );
  },

  setQuantity(slug: string, quantity: number) {
    return mutateCart(
      "PATCH",
      "/api/account/cart",
      cartQuantityInputSchema.parse({
        slug,
        quantity,
      }),
    );
  },

  remove(slug: string) {
    return mutateCart(
      "DELETE",
      "/api/account/cart",
      cartRemoveInputSchema.parse({
        slug,
      }),
    );
  },

  merge(items: readonly { slug: string; quantity: number }[]) {
    return mutateCart(
      "PUT",
      "/api/account/cart/merge",
      cartMergeInputSchema.parse({
        items: items.map((item) => ({
          slug: item.slug,
          quantity: item.quantity,
        })),
      }),
    );
  },
};
