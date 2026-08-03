import type { Metadata } from "next";

import { AddressesPanel } from "@/features/account/addresses-panel";

export const metadata: Metadata = { title: "Indirizzi" };

export default function AccountAddressesPage() {
  return <AddressesPanel />;
}
