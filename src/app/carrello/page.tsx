import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/features/catalog/breadcrumbs";
import { CartPageContent } from "@/features/commerce/cart-page-content";

export const metadata: Metadata = {
  title: "Carrello",
  description: "Riepilogo delle bottiglie selezionate.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <main id="main-content">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Carrello" }]}
      />
      <Section spacing="standard">
        <Container>
          <CartPageContent />
        </Container>
      </Section>
    </main>
  );
}
