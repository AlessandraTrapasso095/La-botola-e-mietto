import { describe, expect, it } from "vitest";

import { addressInputSchema } from "@/lib/validation/address";

const validAddress = {
  label: "Casa",
  firstName: "Livia",
  lastName: "Conti",
  company: "",
  street: "Via Roma",
  streetNumber: "12/A",
  line2: "",
  postalCode: "35100",
  city: "Padova",
  province: "pd",
  countryCode: "it",
  phone: "+39 340 000 0000",
  type: "shipping" as const,
  isDefaultShipping: true,
  isDefaultBilling: false,
};

describe("validazione indirizzi", () => {
  it("normalizza provincia e paese italiani", () => {
    expect(addressInputSchema.parse(validAddress)).toMatchObject({
      province: "PD",
      countryCode: "IT",
    });
  });

  it("rifiuta CAP italiano non valido", () => {
    const result = addressInputSchema.safeParse({
      ...validAddress,
      postalCode: "3510",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["postalCode"]);
  });

  it("rifiuta sigle di provincia italiane inesistenti", () => {
    const result = addressInputSchema.safeParse({
      ...validAddress,
      province: "XX",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["province"]);
  });

  it("supporta codici postali esteri senza regole italiane", () => {
    expect(
      addressInputSchema.safeParse({
        ...validAddress,
        countryCode: "CH",
        postalCode: "8001",
        province: "Zürich",
      }).success,
    ).toBe(true);
  });
});
