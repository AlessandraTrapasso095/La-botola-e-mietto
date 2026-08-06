export type AccountOrderStatus =
  | "ricevuto"
  | "in preparazione"
  | "spedito"
  | "consegnato"
  | "annullato";

export type AccountOrder = {
  id: string;
  date: string;
  dateLabel: string;
  status: AccountOrderStatus;
  total: string;
  itemCount: number;
  products: readonly {
    name: string;
    quantity: number;
  }[];
};

export type AccountAddress = Address;

export const accountOrders: readonly AccountOrder[] = [
  {
    id: "LBM-260718",
    date: "2026-07-18",
    dateLabel: "18 luglio 2026",
    status: "consegnato",
    total: "86,24 €",
    itemCount: 2,
    products: [
      { name: "Don Julio 1942", quantity: 1 },
      { name: "Aalborg Jubilaemus Acquavite", quantity: 1 },
    ],
  },
  {
    id: "LBM-260726",
    date: "2026-07-26",
    dateLabel: "26 luglio 2026",
    status: "spedito",
    total: "71,90 €",
    itemCount: 2,
    products: [
      { name: "Purity 34 Premium BIO", quantity: 1 },
      { name: "Bathtub Gin", quantity: 1 },
    ],
  },
  {
    id: "LBM-260729",
    date: "2026-07-29",
    dateLabel: "29 luglio 2026",
    status: "annullato",
    total: "25,68 €",
    itemCount: 1,
    products: [{ name: "Absolut Tabasco", quantity: 1 }],
  },
] as const;

export const initialAccountAddresses: readonly AccountAddress[] = [
  {
    id: "address-primary",
    label: "Casa",
    firstName: "Giulia",
    lastName: "Ferri",
    company: "",
    street: "Via delle Vigne",
    streetNumber: "18",
    line2: "",
    postalCode: "35100",
    city: "Padova",
    province: "PD",
    countryCode: "IT",
    phone: "+39 333 000 0000",
    type: "shipping",
    isDefaultShipping: true,
    isDefaultBilling: false,
    updatedAt: "2026-07-18T10:00:00.000Z",
  },
  {
    id: "address-billing",
    label: "Fatturazione",
    firstName: "Giulia",
    lastName: "Ferri",
    company: "",
    street: "Via delle Vigne",
    streetNumber: "18",
    line2: "",
    postalCode: "35100",
    city: "Padova",
    province: "PD",
    countryCode: "IT",
    phone: "+39 333 000 0000",
    type: "billing",
    isDefaultShipping: false,
    isDefaultBilling: true,
    updatedAt: "2026-07-18T10:00:00.000Z",
  },
] as const;
import type { Address } from "@/types/customer";
