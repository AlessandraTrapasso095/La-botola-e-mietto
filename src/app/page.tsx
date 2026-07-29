import { catalogProducts } from "@/content/catalog/products";
import { CategoryShowcase } from "@/features/home/category-showcase";
import {
  BrandSection,
  CurationStory,
  InstagramSection,
  ServiceSection,
  ShippingBanner,
} from "@/features/home/editorial-sections";
import { HeroSection } from "@/features/home/hero-section";
import { NewsletterSection } from "@/features/home/newsletter-section";
import { ProductShelf } from "@/features/home/product-shelf";
import { createCatalogProductViews } from "@/server/catalog-view";

export default function HomePage() {
  const newArrivals = createCatalogProductViews(
    catalogProducts.filter((product) => product.isNew).slice(0, 4),
  );
  const rareSelection = createCatalogProductViews(
    catalogProducts
      .filter((product) => product.isLimited)
      .sort((left, right) =>
        left.netPriceMinor === right.netPriceMinor
          ? 0
          : left.netPriceMinor > right.netPriceMinor
            ? -1
            : 1,
      )
      .slice(0, 4),
  );

  return (
    <main id="main-content">
      <HeroSection />
      <CategoryShowcase />
      <ProductShelf
        id="nuovi-arrivi"
        eyebrow="Appena arrivati"
        title="Nuove bottiglie da scoprire."
        description="Release recenti, edizioni speciali e interpretazioni contemporanee scelte per distinguersi."
        products={newArrivals}
      />
      <ProductShelf
        id="distillati-rari"
        eyebrow="La collezione"
        title="Distillati rari, scelti per restare."
        description="Bottiglie dalla disponibilità limitata e confezioni di pregio, pensate per la degustazione importante e il collezionismo."
        products={rareSelection}
        tone="surface"
      />
      <BrandSection />
      <CurationStory />
      <ServiceSection />
      <ShippingBanner />
      <NewsletterSection />
      <InstagramSection />
    </main>
  );
}
