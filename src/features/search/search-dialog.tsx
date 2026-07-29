"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { ArrowRightIcon, SearchIcon } from "@/components/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { catalogBrands } from "@/content/catalog/brands";
import { catalogCategories } from "@/content/catalog/categories";
import { demoSearchTerms } from "@/content/demo-assets/home";
import { useCommerce } from "@/features/commerce/commerce-provider";

type SearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const suggestedCategorySlugs = [
  "whisky-whiskey",
  "rum-rhum",
  "gin",
  "tequila-mezcal",
  "bottiglie-rare",
] as const;

function normalizeSearchValue(value: string) {
  return value.trim().toLocaleLowerCase("it-IT");
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const { products } = useCommerce();
  const [query, setQuery] = useState("");
  const [settledQuery, setSettledQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const focusFrame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(focusFrame);
  }, [open]);

  useEffect(() => {
    const timer = window.setTimeout(() => setSettledQuery(query), 220);
    return () => window.clearTimeout(timer);
  }, [query]);

  const normalizedQuery = normalizeSearchValue(settledQuery);
  const isLoading = query !== settledQuery;
  const productResults = useMemo(() => {
    if (!normalizedQuery) return products.slice(0, 5);

    return products
      .filter((product) =>
        [
          product.name,
          product.brandName,
          product.categoryName,
          product.subcategory,
          product.country,
        ].some((value) =>
          normalizeSearchValue(value).includes(normalizedQuery),
        ),
      )
      .slice(0, 7);
  }, [normalizedQuery, products]);
  const brandResults = useMemo(
    () =>
      normalizedQuery
        ? catalogBrands
            .filter((brand) =>
              normalizeSearchValue(
                `${brand.name} ${brand.country} ${brand.description}`,
              ).includes(normalizedQuery),
            )
            .slice(0, 4)
        : catalogBrands.slice(0, 3),
    [normalizedQuery],
  );
  const categoryResults = useMemo(
    () =>
      normalizedQuery
        ? catalogCategories
            .filter((category) =>
              normalizeSearchValue(
                `${category.name} ${category.description} ${category.subcategories.join(" ")}`,
              ).includes(normalizedQuery),
            )
            .slice(0, 4)
        : catalogCategories.filter((category) =>
            suggestedCategorySlugs.includes(
              category.slug as (typeof suggestedCategorySlugs)[number],
            ),
          ),
    [normalizedQuery],
  );
  const totalResults =
    productResults.length + brandResults.length + categoryResults.length;

  const closeSearch = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background top-2 max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-6xl -translate-y-0 p-0 sm:top-6 sm:max-h-[calc(100dvh-3rem)]">
        <div className="border-border-subtle border-b px-5 pt-8 pb-6 sm:px-9 sm:pt-10">
          <DialogTitle className="text-3xl sm:text-4xl">
            Cerca nella selezione
          </DialogTitle>
          <DialogDescription className="mt-2">
            Trova una bottiglia, un marchio o un percorso di degustazione.
          </DialogDescription>
          <div className="border-border bg-surface mt-6 flex min-h-14 items-center gap-3 border px-4 focus-within:border-[var(--color-accent)] focus-within:shadow-[var(--focus-ring)]">
            <SearchIcon className="text-accent shrink-0" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== "ArrowDown") return;
                event.preventDefault();
                resultsRef.current
                  ?.querySelector<HTMLAnchorElement>("a")
                  ?.focus();
              }}
              placeholder="Prova “Yamazaki”, “gin” o “Islay”"
              aria-label="Cerca prodotti, marchi e categorie"
              aria-controls="search-results"
              className="search-dialog-input placeholder:text-text-muted min-h-12 w-full bg-transparent outline-none"
            />
            <kbd className="border-border-subtle text-text-muted hidden border px-2 py-1 text-[0.65rem] sm:block">
              ESC
            </kbd>
          </div>
        </div>

        <div className="grid min-h-0 overflow-y-auto lg:grid-cols-[16rem_1fr]">
          <aside className="border-border-subtle bg-surface/60 border-b p-5 lg:border-r lg:border-b-0 lg:p-7">
            <p className="text-accent text-[0.65rem] font-semibold tracking-[var(--letter-spacing-label)] uppercase">
              Ricerche recenti
            </p>
            <div className="mt-3 grid gap-2">
              {demoSearchTerms.map((term) => (
                <button
                  key={term}
                  type="button"
                  className="border-border-subtle hover:border-accent hover:text-accent-soft min-h-10 w-full border px-3 text-left text-xs transition-colors"
                  onClick={() => setQuery(term)}
                >
                  {term}
                </button>
              ))}
            </div>
            <p className="text-accent mt-7 text-[0.65rem] font-semibold tracking-[var(--letter-spacing-label)] uppercase">
              Suggerimenti
            </p>
            <ul className="mt-2">
              {catalogCategories
                .filter((category) =>
                  suggestedCategorySlugs.includes(
                    category.slug as (typeof suggestedCategorySlugs)[number],
                  ),
                )
                .map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/categoria/${category.slug}`}
                      className="hover:text-accent-soft flex min-h-10 items-center justify-between text-sm transition-colors"
                      onClick={closeSearch}
                    >
                      {category.shortName}
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  </li>
                ))}
            </ul>
          </aside>

          <div ref={resultsRef} id="search-results" className="p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <p className="text-text-strong font-serif text-xl">
                {normalizedQuery ? "Risultati" : "In evidenza"}
              </p>
              <p className="text-text-muted text-xs" aria-live="polite">
                {isLoading
                  ? "Ricerca in corso"
                  : `${totalResults} ${totalResults === 1 ? "risultato" : "risultati"}`}
              </p>
            </div>

            {isLoading ? (
              <div className="mt-5 grid gap-3" aria-label="Ricerca in corso">
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={index}
                    className="border-border-subtle flex gap-4 border p-3"
                  >
                    <div className="skeleton size-20 shrink-0" />
                    <div className="flex-1 py-2">
                      <div className="skeleton h-3 w-24" />
                      <div className="skeleton mt-3 h-5 max-w-72" />
                    </div>
                  </div>
                ))}
              </div>
            ) : totalResults > 0 ? (
              <div className="mt-5 grid gap-8">
                {productResults.length > 0 ? (
                  <section aria-labelledby="search-products-title">
                    <h3
                      id="search-products-title"
                      className="text-accent text-[0.65rem] font-semibold tracking-[var(--letter-spacing-label)] uppercase"
                    >
                      Prodotti
                    </h3>
                    <ul className="mt-3 grid gap-3">
                      {productResults.map((product) => {
                        const media = product.media[0];
                        return (
                          <li key={product.code}>
                            <Link
                              href={`/prodotto/${product.slug}`}
                              className="group border-border-subtle hover:border-accent flex gap-4 border p-3 transition-colors"
                              onClick={closeSearch}
                            >
                              <div className="bg-surface relative size-20 shrink-0 overflow-hidden">
                                <Image
                                  src={media.src}
                                  alt=""
                                  fill
                                  sizes="80px"
                                  className="object-cover transition-transform duration-[var(--motion-standard)] group-hover:scale-[var(--image-zoom)]"
                                  style={{ objectPosition: media.position }}
                                />
                              </div>
                              <div className="min-w-0 flex-1 self-center">
                                <p className="text-accent text-[0.65rem] tracking-[var(--letter-spacing-label)] uppercase">
                                  {product.brandName}
                                </p>
                                <p className="text-text-strong mt-1 truncate font-serif text-lg">
                                  {product.name}
                                </p>
                                <p className="text-text-muted mt-1 text-xs">
                                  {product.categoryName} ·{" "}
                                  {product.capacityLabel}
                                </p>
                              </div>
                              <p className="text-text-strong hidden self-center text-sm font-semibold sm:block">
                                {product.grossPrice}
                              </p>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ) : null}

                {(brandResults.length > 0 || categoryResults.length > 0) && (
                  <div className="grid gap-7 sm:grid-cols-2">
                    {brandResults.length > 0 ? (
                      <section aria-labelledby="search-brands-title">
                        <h3
                          id="search-brands-title"
                          className="text-accent text-[0.65rem] font-semibold tracking-[var(--letter-spacing-label)] uppercase"
                        >
                          Marchi
                        </h3>
                        <ul className="mt-3 border-t border-[var(--color-border-subtle)]">
                          {brandResults.map((brand) => (
                            <li
                              key={brand.slug}
                              className="border-border-subtle border-b"
                            >
                              <Link
                                href={`/marchio/${brand.slug}`}
                                className="hover:text-accent-soft flex min-h-12 items-center justify-between text-sm transition-colors"
                                onClick={closeSearch}
                              >
                                <span>
                                  {brand.name}
                                  <span className="text-text-muted ml-2 text-xs">
                                    {brand.country}
                                  </span>
                                </span>
                                <ArrowRightIcon className="size-4" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ) : null}

                    {categoryResults.length > 0 ? (
                      <section aria-labelledby="search-categories-title">
                        <h3
                          id="search-categories-title"
                          className="text-accent text-[0.65rem] font-semibold tracking-[var(--letter-spacing-label)] uppercase"
                        >
                          Categorie
                        </h3>
                        <ul className="mt-3 border-t border-[var(--color-border-subtle)]">
                          {categoryResults.map((category) => (
                            <li
                              key={category.slug}
                              className="border-border-subtle border-b"
                            >
                              <Link
                                href={`/categoria/${category.slug}`}
                                className="hover:text-accent-soft flex min-h-12 items-center justify-between text-sm transition-colors"
                                onClick={closeSearch}
                              >
                                {category.name}
                                <ArrowRightIcon className="size-4" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ) : null}
                  </div>
                )}
              </div>
            ) : (
              <div className="border-border-subtle mt-5 border px-6 py-12 text-center">
                <p className="text-text-strong font-serif text-2xl">
                  Nessun risultato per “{settledQuery}”
                </p>
                <p className="text-text-muted mx-auto mt-3 max-w-md text-sm">
                  Prova con un marchio, una categoria, un paese o un termine più
                  breve.
                </p>
                <button
                  type="button"
                  className="animated-underline text-accent-soft mt-5 min-h-11 text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase"
                  onClick={() => setQuery("")}
                >
                  Azzera la ricerca
                </button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
