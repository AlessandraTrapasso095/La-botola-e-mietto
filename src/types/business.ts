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
  freeShippingThresholdMinor: bigint;
  currency: "EUR";
  locale: "it-IT";
};
