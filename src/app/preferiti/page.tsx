import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/features/catalog/breadcrumbs";
import { WishlistPageContent } from "@/features/commerce/wishlist-page-content";

export const metadata: Metadata = {
  title: "Preferiti",
  description: "La tua selezione personale di bottiglie.",
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return (
    <main id="main-content">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Preferiti" }]}
      />
      <Section spacing="standard">
        <Container>
          <WishlistPageContent />
        </Container>
      </Section>
    </main>
  );
}
