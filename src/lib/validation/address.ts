import { z } from "zod";

export const italianProvinceCodes = [
  "AG",
  "AL",
  "AN",
  "AO",
  "AP",
  "AQ",
  "AR",
  "AT",
  "AV",
  "BA",
  "BG",
  "BI",
  "BL",
  "BN",
  "BO",
  "BR",
  "BS",
  "BT",
  "BZ",
  "CA",
  "CB",
  "CE",
  "CH",
  "CL",
  "CN",
  "CO",
  "CR",
  "CS",
  "CT",
  "CZ",
  "EN",
  "FC",
  "FE",
  "FG",
  "FI",
  "FM",
  "FR",
  "GE",
  "GO",
  "GR",
  "IM",
  "IS",
  "KR",
  "LC",
  "LE",
  "LI",
  "LO",
  "LT",
  "LU",
  "MB",
  "MC",
  "ME",
  "MI",
  "MN",
  "MO",
  "MS",
  "MT",
  "NA",
  "NO",
  "NU",
  "OR",
  "PA",
  "PC",
  "PD",
  "PE",
  "PG",
  "PI",
  "PN",
  "PO",
  "PR",
  "PT",
  "PU",
  "PV",
  "PZ",
  "RA",
  "RC",
  "RE",
  "RG",
  "RI",
  "RM",
  "RN",
  "RO",
  "SA",
  "SI",
  "SO",
  "SP",
  "SR",
  "SS",
  "SU",
  "SV",
  "TA",
  "TE",
  "TN",
  "TO",
  "TP",
  "TR",
  "TS",
  "TV",
  "UD",
  "VA",
  "VB",
  "VC",
  "VE",
  "VI",
  "VR",
  "VT",
  "VV",
] as const;

const requiredText = (message: string, max = 120) =>
  z
    .string()
    .trim()
    .min(1, message)
    .max(max, "Il valore inserito è troppo lungo.");

export const addressInputSchema = z
  .object({
    label: requiredText("Inserisci un’etichetta.", 60),
    firstName: requiredText("Inserisci il nome.", 80),
    lastName: requiredText("Inserisci il cognome.", 80),
    company: z.string().trim().max(120).default(""),
    street: requiredText("Inserisci l’indirizzo.", 160),
    streetNumber: requiredText("Inserisci il numero civico.", 30),
    line2: z.string().trim().max(160).default(""),
    postalCode: requiredText("Inserisci il CAP o codice postale.", 20),
    city: requiredText("Inserisci la città.", 100),
    province: z.string().trim().toUpperCase().max(80),
    countryCode: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z]{2}$/, "Usa un codice paese di due lettere.")
      .default("IT"),
    phone: requiredText("Inserisci il telefono.", 40).min(
      6,
      "Inserisci un numero di telefono valido.",
    ),
    type: z.enum(["shipping", "billing"]),
    isDefaultShipping: z.boolean(),
    isDefaultBilling: z.boolean(),
  })
  .superRefine((address, context) => {
    if (address.countryCode !== "IT") return;
    if (!/^\d{5}$/.test(address.postalCode)) {
      context.addIssue({
        code: "custom",
        path: ["postalCode"],
        message: "Per l’Italia il CAP deve contenere 5 cifre.",
      });
    }
    if (
      !italianProvinceCodes.includes(
        address.province as (typeof italianProvinceCodes)[number],
      )
    ) {
      context.addIssue({
        code: "custom",
        path: ["province"],
        message: "Inserisci una sigla di provincia italiana valida.",
      });
    }
  });

export const addressSchema = addressInputSchema.safeExtend({
  id: z.uuid(),
  updatedAt: z.iso.datetime({ offset: true }),
});

export const addressIdSchema = z.uuid();
