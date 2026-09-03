import {
  cancelAccountOrderInputSchema,
  hideAccountOrderInputSchema,
} from "@/lib/validation/checkout";

async function getErrorMessage(response: Response, fallback: string) {
  const body: unknown = await response.json().catch(() => null);

  if (
    body &&
    typeof body === "object" &&
    "message" in body &&
    typeof body.message === "string"
  ) {
    return body.message;
  }

  return fallback;
}

export const accountOrderService = {
  async cancel(orderId: string) {
    const response = await fetch("/api/account/orders/cancel", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(
        cancelAccountOrderInputSchema.parse({
          orderId,
        }),
      ),
    });

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(
          response,
          "Non è stato possibile annullare l’ordine.",
        ),
      );
    }

    const body: unknown = await response.json();

    if (
      !body ||
      typeof body !== "object" ||
      !("action" in body) ||
      (body.action !== "cancelled" && body.action !== "requested")
    ) {
      throw new Error("Risposta di annullamento non valida.");
    }

    return body as {
      action: "cancelled" | "requested";
    };
  },

  async hide(orderId: string) {
    const response = await fetch("/api/account/orders/hide", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(
        hideAccountOrderInputSchema.parse({
          orderId,
        }),
      ),
    });

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(
          response,
          "Non è stato possibile eliminare l’ordine dalla cronologia.",
        ),
      );
    }

    return {
      hidden: true,
    };
  },
};
