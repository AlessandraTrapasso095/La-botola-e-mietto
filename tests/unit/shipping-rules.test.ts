import { describe, expect, it } from "vitest";

import { businessInfo } from "@/config/business";
import {
  calculateShippingGrossAmountMinor,
  shippingCarrierLabel,
  shippingMethodForCountry,
} from "@/lib/shipping";

describe("regole spedizione Italia / estero", () => {
  it("usa TNT per Italia", () => {
    expect(shippingMethodForCountry("IT")).toBe("tnt");
    expect(shippingMethodForCountry("it")).toBe("tnt");
    expect(shippingCarrierLabel("tnt")).toBe("TNT");
  });

  it("usa FedEx per estero", () => {
    expect(shippingMethodForCountry("FR")).toBe("fedex");
    expect(shippingMethodForCountry("DE")).toBe("fedex");
    expect(shippingCarrierLabel("fedex")).toBe("FedEx");
  });

  it("Italia costa 9,90 sotto i 100 euro", () => {
    expect(
      calculateShippingGrossAmountMinor({
        method: "tnt",
        subtotalMinor: 9_999,
      }),
    ).toBe(990);
  });

  it("Italia è gratuita da 100 euro", () => {
    expect(
      calculateShippingGrossAmountMinor({
        method: "tnt",
        subtotalMinor: 10_000,
      }),
    ).toBe(0);

    expect(Number(businessInfo.freeShippingThresholdMinor)).toBe(10_000);
  });

  it("estero costa sempre 22,90 anche sopra 100 euro", () => {
    expect(
      calculateShippingGrossAmountMinor({
        method: "fedex",
        subtotalMinor: 5_000,
      }),
    ).toBe(2_290);

    expect(
      calculateShippingGrossAmountMinor({
        method: "fedex",
        subtotalMinor: 50_000,
      }),
    ).toBe(2_290);
  });

  it("ritiro in negozio è gratuito", () => {
    expect(
      calculateShippingGrossAmountMinor({
        method: "store_pickup",
        subtotalMinor: 5_000,
      }),
    ).toBe(0);
  });
});
