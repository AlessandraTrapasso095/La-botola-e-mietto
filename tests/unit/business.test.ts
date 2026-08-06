import { describe, expect, it } from "vitest";

import { businessInfo } from "@/config/business";

describe("businessInfo", () => {
  it("centralizza i dati aziendali confermati", () => {
    expect(businessInfo).toMatchObject({
      brandName: "La Botola e Mietto",
      legalName: "Mietto Giuliano",
      vatNumber: "01989480288",
      fiscalCode: "MTTGLN65S29B564C",
      email: "info@labotolaemietto.com",
      phone: "+39 348 260 7738",
      currency: "EUR",
      locale: "it-IT",
    });
  });

  it("conserva soglia e costo di spedizione in unità minori", () => {
    expect(businessInfo.freeShippingThresholdMinor).toBe(6_000n);
    expect(businessInfo.standardShippingGrossAmountMinor).toBe(750n);
  });
});
