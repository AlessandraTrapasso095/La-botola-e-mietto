import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/features/catalog/breadcrumbs";
import { CheckoutContent } from "@/features/checkout/checkout-content";
import { loadCurrentAccountAddresses } from "@/server/addresses/account-addresses";
import { getServerAccountUser } from "@/server/auth/account-user";
import { getServerEnvironment } from "@/server/env";
import type { Address } from "@/types/customer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Conferma spedizione, pagamento e ordine.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CheckoutPage() {
  if (getServerEnvironment().AUTH_SERVICE !== "supabase") {
    redirect("/carrello");
  }

  const user = await getServerAccountUser();

  if (!user) {
    redirect("/accedi?redirect=/checkout");
  }

  let addresses: Address[] = [];
  let loadError = "";

  try {
    addresses = await loadCurrentAccountAddresses();
  } catch {
    loadError =
      "Non è stato possibile caricare gli indirizzi. Riprova tra poco.";
  }

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Carrello", href: "/carrello" },
          { label: "Checkout" },
        ]}
      />

      <Section spacing="standard">
        <Container>
          <CheckoutContent addresses={addresses} loadError={loadError} />
        </Container>
      </Section>
    </main>
  );
}
