import {
  checkoutInputSchema,
  checkoutResultSchema,
  type CheckoutInput,
  type CheckoutResult,
} from "@/lib/validation/checkout";

const genericError = "Non è stato possibile completare il checkout.";

async function readResponse(response: Response): Promise<CheckoutResult> {
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

  const parsed = checkoutResultSchema.safeParse(body);

  if (!parsed.success) {
    throw new Error(genericError);
  }

  return parsed.data;
}

export const checkoutService = {
  async create(input: CheckoutInput): Promise<CheckoutResult> {
    const response = await fetch("/api/account/checkout", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(checkoutInputSchema.parse(input)),
    });

    return readResponse(response);
  },
};
