import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { CatalogGridSkeleton } from "@/features/catalog/catalog-explorer";

export default function CatalogLoading() {
  return (
    <main id="main-content">
      <div className="skeleton h-[34rem]" />
      <Section spacing="standard">
        <Container className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <div className="skeleton h-[38rem]" />
          </div>
          <CatalogGridSkeleton />
        </Container>
      </Section>
    </main>
  );
}
