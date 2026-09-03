import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { CatalogGridSkeleton } from "@/features/catalog/catalog-explorer";

export default function OffersLoading() {
  return (
    <main id="main-content">
      <Section spacing="standard">
        <Container>
          <div className="skeleton h-4 w-32" />
          <div className="skeleton mt-5 h-14 max-w-xl" />
          <div className="mt-14">
            <CatalogGridSkeleton />
          </div>
        </Container>
      </Section>
    </main>
  );
}
