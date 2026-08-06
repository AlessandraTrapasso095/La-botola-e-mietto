import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import { Breadcrumbs } from "@/features/catalog/breadcrumbs";
import { ProductCard } from "@/features/catalog/product-card";
import { getCatalogRepository } from "@/server/catalog/get-catalog-repository";

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export const metadata: Metadata = {
  title: "Ricerca",
  description: "Cerca prodotti, marchi e categorie nella selezione.",
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = Array.isArray(params.q)
    ? (params.q[0] ?? "")
    : (params.q ?? "");
  const results = await getCatalogRepository().search(query, {
    productLimit: 48,
  });

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Catalogo", href: "/catalogo" },
          { label: "Ricerca" },
        ]}
      />
      <Section spacing="standard">
        <Container>
          <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
            Ricerca nel catalogo
          </p>
          <Heading as="h1" size="display" className="mt-4 max-w-4xl">
            {results.isSearchable
              ? `Risultati per “${results.query}”`
              : "Trova la bottiglia che cerchi"}
          </Heading>
          <Text tone="muted" className="mt-5 max-w-2xl">
            {results.isSearchable
              ? `${results.totalCount} ${results.totalCount === 1 ? "risultato trovato" : "risultati trovati"} tra prodotti, marchi e categorie.`
              : "Inserisci almeno 2 caratteri dalla ricerca in alto per esplorare prodotti, marchi e categorie."}
          </Text>

          {results.isSearchable && results.totalCount === 0 ? (
            <div className="border-border-subtle mt-12 border px-6 py-14 text-center">
              <Heading as="h2" size="lg">
                Nessun risultato per “{results.query}”
              </Heading>
              <Text tone="muted" className="mx-auto mt-3 max-w-lg">
                Controlla il termine oppure prova con il nome di un prodotto, un
                marchio, una categoria o un codice articolo.
              </Text>
              <Link
                href="/catalogo"
                className="animated-underline text-accent-soft mt-6 inline-flex min-h-11 items-center text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase"
              >
                Torna al catalogo
              </Link>
            </div>
          ) : null}

          {results.brands.length > 0 || results.categories.length > 0 ? (
            <div className="mt-12 grid gap-10 border-y border-[var(--color-border-subtle)] py-8 lg:grid-cols-2">
              {results.brands.length > 0 ? (
                <section aria-labelledby="result-brands-title">
                  <Heading as="h2" id="result-brands-title" size="sm">
                    Marchi
                  </Heading>
                  <ul className="mt-4 grid gap-x-6 sm:grid-cols-2">
                    {results.brands.map((brand) => (
                      <li
                        key={brand.slug}
                        className="border-border-subtle border-b"
                      >
                        <Link
                          href={`/marchio/${brand.slug}`}
                          className="hover:text-accent-soft flex min-h-12 items-center justify-between text-sm transition-colors"
                        >
                          {brand.name}
                          <span className="text-text-muted text-xs">
                            {brand.productCount}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
              {results.categories.length > 0 ? (
                <section aria-labelledby="result-categories-title">
                  <Heading as="h2" id="result-categories-title" size="sm">
                    Categorie
                  </Heading>
                  <ul className="mt-4 grid gap-x-6 sm:grid-cols-2">
                    {results.categories.map((category) => (
                      <li
                        key={category.slug}
                        className="border-border-subtle border-b"
                      >
                        <Link
                          href={`/categoria/${category.slug}`}
                          className="hover:text-accent-soft flex min-h-12 items-center text-sm transition-colors"
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          ) : null}

          {results.products.length > 0 ? (
            <section className="mt-14" aria-labelledby="result-products-title">
              <div className="flex items-end justify-between gap-4">
                <Heading as="h2" id="result-products-title" size="xl">
                  Prodotti
                </Heading>
                {results.products.length < results.totalCount ? (
                  <Text size="sm" tone="muted">
                    Prime {results.products.length} referenze
                  </Text>
                ) : null}
              </div>
              <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
                {results.products.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </section>
          ) : null}
        </Container>
      </Section>
    </main>
  );
}
