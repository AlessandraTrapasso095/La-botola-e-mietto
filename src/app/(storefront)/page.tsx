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
import { emptyCatalogFilters } from "@/features/catalog/catalog-filter";
import { getCatalogRepository } from "@/server/catalog/get-catalog-repository";

export default async function HomePage() {
  const repository = getCatalogRepository();
  const [newArrivalsResult, offersResult, rareResult] = await Promise.all([
    repository.queryProducts({
      page: 1,
      pageSize: 4,
      sort: "newest",
      filters: { ...emptyCatalogFilters, onlyNew: true },
    }),
    repository.queryProducts({
      page: 1,
      pageSize: 4,
      sort: "featured",
      filters: emptyCatalogFilters,
      scope: { onlyOffers: true },
    }),
    repository.queryProducts({
      page: 1,
      pageSize: 4,
      sort: "price-desc",
      filters: { ...emptyCatalogFilters, onlyLimited: true },
    }),
  ]);
  const newArrivals = newArrivalsResult.items;
  const offerSelection = offersResult.items;
  const rareSelection = rareResult.items;

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
      {offerSelection.length > 0 ? (
        <ProductShelf
          id="in-offerta"
          eyebrow="Occasioni selezionate"
          title="In offerta"
          description="Bottiglie scelte con cura e proposte a condizioni speciali, disponibili per un tempo limitato."
          products={offerSelection}
          cta={{
            label: "Scopri tutte le offerte",
            href: "/in-offerta",
          }}
        />
      ) : null}
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
