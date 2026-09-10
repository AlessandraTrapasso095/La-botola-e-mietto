import { describe, expect, it } from "vitest";

import {
  europeanCountries,
  isEuropeanCountryCode,
} from "@/lib/european-countries";

describe("European shipping countries", () => {
  it("includes Italy and major European destinations", () => {
    expect(isEuropeanCountryCode("IT")).toBe(true);
    expect(isEuropeanCountryCode("FR")).toBe(true);
    expect(isEuropeanCountryCode("DE")).toBe(true);
    expect(isEuropeanCountryCode("ES")).toBe(true);
    expect(isEuropeanCountryCode("GB")).toBe(true);
    expect(isEuropeanCountryCode("CH")).toBe(true);
    expect(isEuropeanCountryCode("NO")).toBe(true);
  });

  it("includes European non-EU countries", () => {
    expect(isEuropeanCountryCode("AL")).toBe(true);
    expect(isEuropeanCountryCode("RS")).toBe(true);
    expect(isEuropeanCountryCode("ME")).toBe(true);
    expect(isEuropeanCountryCode("UA")).toBe(true);
    expect(isEuropeanCountryCode("MD")).toBe(true);
  });

  it("does not allow countries outside the supported European list", () => {
    expect(isEuropeanCountryCode("US")).toBe(false);
    expect(isEuropeanCountryCode("CA")).toBe(false);
    expect(isEuropeanCountryCode("JP")).toBe(false);
  });

  it("does not contain duplicate country codes", () => {
    const codes = europeanCountries.map((country) => country.code);

    expect(new Set(codes).size).toBe(codes.length);
  });
});
