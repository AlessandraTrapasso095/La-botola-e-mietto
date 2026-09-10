export type BusinessAddress = {
  street: string;
  postalCode: string;
  city: string;
  province: string;
  country: string;
  countryCode: "IT";
};

export type BusinessInfo = {
  brandName: string;
  legalName: string;
  ownerName: string;
  vatNumber: string;
  fiscalCode: string;
  address: BusinessAddress;
  email: string;
  phone: string;
  whatsappMessage: string;
  freeShippingThresholdMinor: bigint;
  standardShippingGrossAmountMinor: bigint;
  internationalShippingGrossAmountMinor: bigint;
  currency: "EUR";
  locale: "it-IT";
};
