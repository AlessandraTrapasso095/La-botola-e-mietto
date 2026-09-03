import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ProductCardSkeleton } from "@/features/catalog/product-card";

export default function SearchLoading() {
  return (
    <main id="main-content">
      <Section spacing="standard">
        <Container>
          <div className="skeleton h-4 w-36" />
          <div className="skeleton mt-5 h-14 max-w-2xl" />
          <div className="skeleton mt-5 h-5 max-w-xl" />
          <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
