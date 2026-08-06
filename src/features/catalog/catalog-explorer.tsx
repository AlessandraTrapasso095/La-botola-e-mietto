"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { CloseIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import type {
  CatalogFilterOptions,
  CatalogFilters,
  CatalogSort,
  PaginatedProducts,
} from "@/content/catalog/types";
import { emptyCatalogFilters } from "@/features/catalog/catalog-filter";
import {
  CatalogFiltersPanel,
  catalogSortOptions,
} from "@/features/catalog/catalog-filters";
import { serializeCatalogQuery } from "@/features/catalog/catalog-query-params";
import {
  ProductCard,
  ProductCardSkeleton,
} from "@/features/catalog/product-card";

export function CatalogExplorer({
  result,
  filterOptions,
  initialFilters,
  initialSort,
  fixedCategory,
}: {
  result: PaginatedProducts;
  filterOptions: CatalogFilterOptions;
  initialFilters: CatalogFilters;
  initialSort: CatalogSort;
  fixedCategory?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState(initialSort);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const filterTriggerRef = useRef<HTMLButtonElement>(null);

  const navigate = (
    nextFilters: CatalogFilters,
    nextSort: CatalogSort,
    nextPage: number,
  ) => {
    const params = serializeCatalogQuery(nextFilters, nextSort, nextPage);
    const href = params.size > 0 ? `${pathname}?${params}` : pathname;
    startTransition(() => router.replace(href, { scroll: false }));
  };

  const activeFilterCount =
    filters.brands.length +
    filters.priceRanges.length +
    filters.capacities.length +
    filters.alcoholRanges.length +
    filters.countries.length +
    (fixedCategory ? 0 : filters.categories.length) +
    Number(filters.onlyOnOffer) +
    Number(filters.onlyNew) +
    Number(filters.onlyLimited) +
    Number(filters.onlyAvailable);

  const updateListFilter = (
    name: keyof Pick<
      CatalogFilters,
      | "brands"
      | "categories"
      | "priceRanges"
      | "capacities"
      | "alcoholRanges"
      | "countries"
    >,
    value: string,
  ) => {
    const nextFilters = {
      ...filters,
      [name]: filters[name].includes(value)
        ? filters[name].filter((candidate) => candidate !== value)
        : [...filters[name], value],
    };
    setFilters(nextFilters);
    navigate(nextFilters, sort, 1);
  };

  const updateBooleanFilter = (
    name: "onlyOnOffer" | "onlyNew" | "onlyLimited" | "onlyAvailable",
    value: boolean,
  ) => {
    const nextFilters = { ...filters, [name]: value };
    setFilters(nextFilters);
    navigate(nextFilters, sort, 1);
  };

  const resetFilters = () => {
    const nextFilters = {
      ...emptyCatalogFilters,
      categories: fixedCategory ? [fixedCategory] : [],
    };
    setFilters(nextFilters);
    navigate(nextFilters, sort, 1);
  };

  const filterPanel = (
    <CatalogFiltersPanel
      filters={filters}
      options={{
        ...filterOptions,
        categories: fixedCategory ? [] : filterOptions.categories,
      }}
      onListFilterChange={updateListFilter}
      onBooleanFilterChange={updateBooleanFilter}
      onReset={resetFilters}
    />
  );
  const visiblePageNumbers = [
    1,
    result.page - 1,
    result.page,
    result.page + 1,
    result.totalPages,
  ]
    .filter(
      (pageNumber, index, pageNumbers) =>
        pageNumber >= 1 &&
        pageNumber <= result.totalPages &&
        pageNumbers.indexOf(pageNumber) === index,
    )
    .sort((left, right) => left - right);

  return (
    <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] xl:gap-14">
      <aside className="hidden lg:block" aria-label="Filtri catalogo">
        <div className="sticky top-28">{filterPanel}</div>
      </aside>

      <div className="min-w-0" aria-busy={isPending}>
        <div className="border-border-subtle flex flex-col gap-4 border-y py-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center justify-between gap-4 sm:block">
            <p className="text-text-muted text-sm" aria-live="polite">
              <strong className="text-text-strong">{result.totalCount}</strong>{" "}
              {result.totalCount === 1 ? "bottiglia" : "bottiglie"}
            </p>
            <Button
              ref={filterTriggerRef}
              variant="secondary"
              size="sm"
              className="lg:hidden"
              onClick={() => setFilterDrawerOpen(true)}
            >
              Filtri{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </Button>
          </div>
          <label className="grid gap-2 sm:min-w-56">
            <span className="text-text-muted text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
              Ordina per
            </span>
            <select
              value={sort}
              onChange={(event) => {
                const nextSort = event.target.value as CatalogSort;
                setSort(nextSort);
                navigate(filters, nextSort, 1);
              }}
              className="border-border-subtle bg-surface min-h-11 border px-4 text-sm"
            >
              {catalogSortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {result.items.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 xl:gap-x-6">
            {result.items.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="border-border-subtle mt-8 border px-6 py-20 text-center">
            <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
              Una selezione molto precisa
            </p>
            <h2 className="text-text-strong mt-4 font-serif text-3xl">
              Nessuna bottiglia corrisponde ai filtri.
            </h2>
            <p className="text-text-muted mx-auto mt-4 max-w-md text-sm">
              Modifica uno o più criteri per ampliare la ricerca nella
              collezione.
            </p>
            <Button variant="secondary" className="mt-6" onClick={resetFilters}>
              Azzera i filtri
            </Button>
          </div>
        )}

        {result.totalPages > 1 ? (
          <nav
            aria-label="Paginazione catalogo"
            className="border-border-subtle mt-14 flex flex-wrap items-center justify-center gap-2 border-t pt-8"
          >
            <button
              type="button"
              disabled={result.page === 1 || isPending}
              className="border-border-subtle min-h-11 border px-4 text-sm disabled:opacity-[var(--opacity-disabled)]"
              onClick={() => navigate(filters, sort, result.page - 1)}
            >
              Precedente
            </button>
            {visiblePageNumbers.map((pageNumber, index) => (
              <div key={pageNumber} className="contents">
                {index > 0 &&
                pageNumber - (visiblePageNumbers[index - 1] ?? pageNumber) >
                  1 ? (
                  <span className="text-text-muted px-1" aria-hidden="true">
                    …
                  </span>
                ) : null}
                <button
                  type="button"
                  aria-current={pageNumber === result.page ? "page" : undefined}
                  aria-label={`Pagina ${pageNumber}`}
                  disabled={isPending}
                  className="border-border-subtle aria-[current=page]:border-accent aria-[current=page]:text-accent min-h-11 min-w-11 border px-3 text-sm transition-colors"
                  onClick={() => navigate(filters, sort, pageNumber)}
                >
                  {pageNumber}
                </button>
              </div>
            ))}
            <button
              type="button"
              disabled={result.page === result.totalPages || isPending}
              className="border-border-subtle min-h-11 border px-4 text-sm disabled:opacity-[var(--opacity-disabled)]"
              onClick={() => navigate(filters, sort, result.page + 1)}
            >
              Successiva
            </button>
          </nav>
        ) : null}
      </div>

      <Dialog open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
        <DialogContent
          showClose={false}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            filterTriggerRef.current?.focus();
          }}
          className="commerce-drawer bg-background inset-y-0 top-0 right-0 left-auto flex h-dvh max-h-none w-full max-w-sm translate-x-0 translate-y-0 flex-col rounded-none border-y-0 border-r-0 p-0"
        >
          <div className="border-border-subtle flex items-center justify-between border-b p-5">
            <div>
              <DialogTitle>Filtri</DialogTitle>
              <DialogDescription className="mt-1">
                Affina la selezione senza perdere il contesto.
              </DialogDescription>
            </div>
            <IconButton
              aria-label="Chiudi filtri"
              onClick={() => setFilterDrawerOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-8">
            {filterPanel}
          </div>
          <div className="border-border-subtle bg-background border-t p-5">
            <Button fullWidth onClick={() => setFilterDrawerOpen(false)}>
              Applica filtri
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function CatalogGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3">
      {Array.from({ length: 9 }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
