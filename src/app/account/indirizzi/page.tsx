import type { Metadata } from "next";

import { AddressesPanel } from "@/features/account/addresses-panel";
import {
  initialAccountAddresses,
  type AccountAddress,
} from "@/content/account/account-data";
import { loadCurrentAccountAddresses } from "@/server/addresses/account-addresses";
import { getServerEnvironment } from "@/server/env";

export const metadata: Metadata = { title: "Indirizzi" };

export default async function AccountAddressesPage() {
  const demoMode = getServerEnvironment().AUTH_SERVICE === "demo";
  if (demoMode) {
    return (
      <AddressesPanel mode="demo" initialAddresses={initialAccountAddresses} />
    );
  }

  let addresses: AccountAddress[] = [];
  let loadError = "";
  try {
    addresses = await loadCurrentAccountAddresses();
  } catch {
    loadError =
      "Non è stato possibile caricare gli indirizzi. Riprova tra poco.";
  }
  return (
    <AddressesPanel
      mode="supabase"
      initialAddresses={addresses}
      loadError={loadError}
    />
  );
}
