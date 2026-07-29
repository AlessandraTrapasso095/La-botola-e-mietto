import { catalogCollections } from "@/content/catalog/collections";
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
  const newArrivalSlugs: readonly string[] =
    catalogCollections.find((collection) => collection.slug === "nuovi-arrivi")
      ?.productSlugs ?? [];
  const rareSlugs: readonly string[] =
    catalogCollections.find(
      (collection) => collection.slug === "distillati-rari",
    )?.productSlugs ?? [];
  const newArrivals = createCatalogProductViews(
    catalogProducts
      .filter((product) => newArrivalSlugs.includes(product.slug))
      .slice(0, 4),
  );
  const rareSelection = createCatalogProductViews(
    catalogProducts
      .filter((product) => rareSlugs.includes(product.slug))
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
        description="Una selezione reale dal catalogo cliente: release recenti, edizioni speciali e interpretazioni contemporanee."
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
