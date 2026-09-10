import { describe, expect, it } from "vitest";

import {
  europeanCountries,
  isEuropeanCountryCode,
} from "@/lib/european-countries";

describe("Schengen shipping countries", () => {
  it("includes the 29 Schengen countries", () => {
    const expectedCodes = [
      "AT",
      "BE",
      "BG",
      "HR",
      "CZ",
      "DK",
      "EE",
      "FI",
      "FR",
      "DE",
      "GR",
      "HU",
      "IS",
      "IT",
      "LV",
      "LI",
      "LT",
      "LU",
      "MT",
      "NL",
      "NO",
      "PL",
      "PT",
      "RO",
      "SK",
      "SI",
      "ES",
      "SE",
      "CH",
    ];

    expect(europeanCountries.map((country) => country.code)).toEqual(
      expectedCodes,
    );
  });

  it("excludes European countries outside Schengen", () => {
    expect(isEuropeanCountryCode("GB")).toBe(false);
    expect(isEuropeanCountryCode("IE")).toBe(false);
    expect(isEuropeanCountryCode("CY")).toBe(false);
    expect(isEuropeanCountryCode("AL")).toBe(false);
    expect(isEuropeanCountryCode("RS")).toBe(false);
    expect(isEuropeanCountryCode("UA")).toBe(false);
    expect(isEuropeanCountryCode("TR")).toBe(false);
  });

  it("does not allow countries outside Europe", () => {
    expect(isEuropeanCountryCode("US")).toBe(false);
    expect(isEuropeanCountryCode("CA")).toBe(false);
    expect(isEuropeanCountryCode("JP")).toBe(false);
  });

  it("does not contain duplicate country codes", () => {
    const codes = europeanCountries.map((country) => country.code);

    expect(new Set(codes).size).toBe(codes.length);
  });
});
