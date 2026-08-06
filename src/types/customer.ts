export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  birthDate: string | null;
  marketingConsent: boolean;
};

export type AddressType = "shipping" | "billing";

export type AddressInput = {
  label: string;
  firstName: string;
  lastName: string;
  company: string;
  street: string;
  streetNumber: string;
  line2: string;
  postalCode: string;
  city: string;
  province: string;
  countryCode: string;
  phone: string;
  type: AddressType;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
};

export type Address = AddressInput & {
  id: string;
  updatedAt: string;
};
