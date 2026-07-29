import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { catalogProducts } from "@/content/catalog/products";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/content/catalog/selectors";
import { Breadcrumbs } from "@/features/catalog/breadcrumbs";
import { ProductCard } from "@/features/catalog/product-card";
import { ProductEditorial } from "@/features/product/product-editorial";
import { ProductGallery } from "@/features/product/product-gallery";
import { ProductPurchasePanel } from "@/features/product/product-purchase-panel";
import { RecentlyViewed } from "@/features/product/recently-viewed";
import {
  createCatalogProductView,
  createCatalogProductViews,
} from "@/server/catalog-view";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return catalogProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const view = createCatalogProductView(product);

  return {
    title: product.name,
    description: product.overview,
    alternates: { canonical: `/prodotto/${product.slug}` },
    openGraph: {
      title: `${product.name} | La Botola e Mietto`,
      description: product.overview,
      images: [{ url: view.media[0].src }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const productView = createCatalogProductView(product);
  const relatedProducts = createCatalogProductViews(
    getRelatedProducts(slug, 4),
  );
  const allProducts = createCatalogProductViews(catalogProducts);

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Catalogo", href: "/catalogo" },
          {
            label: productView.categoryName,
            href: `/categoria/${productView.categorySlug}`,
          },
          { label: productView.name },
        ]}
      />

      <Section spacing="compact">
        <Container className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 xl:gap-24">
          <ProductGallery
            media={productView.media}
            productName={productView.name}
          />
          <ProductPurchasePanel product={productView} />
        </Container>
      </Section>

      <Section className="border-border-subtle bg-surface/45 border-y">
        <Container>
          <ProductEditorial product={productView} />
        </Container>
      </Section>

      <Section spacing="standard">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
                Continua la scoperta
              </p>
              <Heading className="mt-4">Bottiglie correlate</Heading>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 lg:gap-x-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.code} product={relatedProduct} />
            ))}
          </div>
          <RecentlyViewed
            currentSlug={productView.slug}
            products={allProducts}
          />
        </Container>
      </Section>
    </main>
  );
}
