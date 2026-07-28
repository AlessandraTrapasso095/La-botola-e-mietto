import { describe, expect, it } from "vitest";

import { formatEuroMinor } from "@/lib/money";

describe("formatEuroMinor", () => {
  it("formatta i centesimi in valuta italiana", () => {
    expect(formatEuroMinor(6_000n).replace(/\u00a0/g, " ")).toBe("60,00 €");
  });

  it("mantiene i centesimi senza calcoli in virgola mobile", () => {
    expect(formatEuroMinor(123_456n).replace(/\u00a0/g, " ")).toBe("1234,56 €");
  });
});
