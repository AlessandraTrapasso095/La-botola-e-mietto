import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { Container } from "@/components/ui/container";
import { businessInfo } from "@/config/business";
import { defaultSiteUrl } from "@/config/metadata";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/features/catalog/breadcrumbs";
import { ProductCard } from "@/features/catalog/product-card";
import { ProductEditorial } from "@/features/product/product-editorial";
import { ProductGallery } from "@/features/product/product-gallery";
import { ProductPurchasePanel } from "@/features/product/product-purchase-panel";
import { RecentlyViewed } from "@/features/product/recently-viewed";
import { getCatalogRepository } from "@/server/catalog/get-catalog-repository";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

const loadProduct = cache((slug: string) =>
  getCatalogRepository().getProductBySlug(slug),
);

function createSeoDescription(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= 160) {
    return normalized;
  }

  return `${normalized.slice(0, 157).trimEnd()}…`;
}

function absoluteUrl(value: string) {
  return new URL(value, defaultSiteUrl).toString();
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) return {};

  const description = createSeoDescription(product.overview);
  const imageUrl = absoluteUrl(product.media[0].src);

  return {
    title: product.name,
    description,
    alternates: { canonical: `/prodotto/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} | ${businessInfo.brandName}`,
      description,
      url: `/prodotto/${product.slug}`,
      images: [
        {
          url: imageUrl,
          alt: product.media[0].alt || product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${businessInfo.brandName}`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const repository = getCatalogRepository();
  const [productView, relatedProducts] = await Promise.all([
    loadProduct(slug),
    repository.getRelatedProducts(slug, 4),
  ]);
  if (!productView) notFound();

  const productUrl = `${defaultSiteUrl}/prodotto/${productView.slug}`;
  const productImageUrls = productView.media.map((media) =>
    absoluteUrl(media.src),
  );

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productView.name,
    description: productView.overview,
    image: productImageUrls,
    sku: productView.code,
    ...(productView.brandName
      ? {
          brand: {
            "@type": "Brand",
            name: productView.brandName,
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "EUR",
      price: (productView.grossPriceMinor / 100).toFixed(2),
      availability:
        (productView.stockQuantity ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: businessInfo.brandName,
        url: defaultSiteUrl,
      },
    },
  };

  const breadcrumbItems = [
    {
      name: "Home",
      url: defaultSiteUrl,
    },
    {
      name: "Catalogo",
      url: `${defaultSiteUrl}/catalogo`,
    },
    {
      name: productView.categoryName,
      url: `${defaultSiteUrl}/categoria/${productView.categorySlug}`,
    },
    ...(productView.brandSlug && productView.brandName
      ? [
          {
            name: productView.brandName,
            url: `${defaultSiteUrl}/marchio/${productView.brandSlug}`,
          },
        ]
      : []),
    {
      name: productView.name,
      url: productUrl,
    },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Catalogo", href: "/catalogo" },
          {
            label: productView.categoryName,
            href: `/categoria/${productView.categorySlug}`,
          },
          ...(productView.brandSlug && productView.brandName
            ? [
                {
                  label: productView.brandName,
                  href: `/marchio/${productView.brandSlug}`,
                },
              ]
            : []),
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
              <ProductCard key={relatedProduct.slug} product={relatedProduct} />
            ))}
          </div>
          <RecentlyViewed currentSlug={productView.slug} />
        </Container>
      </Section>
    </main>
  );
}
