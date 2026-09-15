import {
  promotionCodePreviewInputSchema,
  promotionCodePreviewResultSchema,
  type PromotionCodePreviewInput,
  type PromotionCodePreviewResult,
} from "@/lib/validation/checkout";

const genericError = "Non è stato possibile verificare il codice promozionale.";

export const promotionCodeService = {
  async validate(
    input: PromotionCodePreviewInput,
  ): Promise<PromotionCodePreviewResult> {
    const response = await fetch("/api/account/checkout/promotion-code", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(promotionCodePreviewInputSchema.parse(input)),
    });

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

    const parsed = promotionCodePreviewResultSchema.safeParse(body);

    if (!parsed.success) {
      throw new Error(genericError);
    }

    return parsed.data;
  },
};
