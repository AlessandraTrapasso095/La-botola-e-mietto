import type { BusinessInfo } from "@/types/business";

export const businessInfo = {
  brandName: "La Botola e Mietto",
  legalName: "Mietto Giuliano",
  ownerName: "Mietto Giuliano",
  vatNumber: "01989480288",
  fiscalCode: "MTTGLN65S29B564C",
  address: {
    street: "Via Stradona 27",
    postalCode: "35010",
    city: "Campo San Martino",
    province: "PD",
    country: "Italia",
    countryCode: "IT",
  },
  email: "info@labotolaemietto.com",
  phone: "+39 348 260 7738",
  freeShippingThresholdMinor: 6_000n,
  currency: "EUR",
  locale: "it-IT",
} as const satisfies BusinessInfo;

export const businessAddressLine = `${businessInfo.address.street}, ${businessInfo.address.postalCode} ${businessInfo.address.city} (${businessInfo.address.province}), ${businessInfo.address.country}`;
