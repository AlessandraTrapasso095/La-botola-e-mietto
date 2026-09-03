import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { CatalogGridSkeleton } from "@/features/catalog/catalog-explorer";

export default function CategoryLoading() {
  return (
    <main id="main-content">
      <div className="skeleton h-[34rem]" />
      <Section spacing="standard">
        <Container className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <div className="skeleton hidden h-[36rem] lg:block" />
          <CatalogGridSkeleton />
        </Container>
      </Section>
    </main>
  );
}
