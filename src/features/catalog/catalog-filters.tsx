"use client";

import { useMemo, useState, type ReactNode } from "react";

import type {
  CatalogFilters,
  CatalogSort,
} from "@/features/catalog/catalog-filter";

type FilterOption = {
  value: string;
  label: string;
};

export type CatalogFilterOptions = {
  brands: readonly FilterOption[];
  categories: readonly FilterOption[];
  countries: readonly FilterOption[];
};

type CatalogFiltersPanelProps = {
  filters: CatalogFilters;
  options: CatalogFilterOptions;
  onListFilterChange: (
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
  ) => void;
  onBooleanFilterChange: (
    name: keyof Pick<
      CatalogFilters,
      "onlyNew" | "onlyLimited" | "onlyAvailable"
    >,
    value: boolean,
  ) => void;
  onReset: () => void;
};

const priceOptions = [
  { value: "under-30", label: "Fino a 30 €" },
  { value: "30-60", label: "Da 30 € a 60 €" },
  { value: "60-150", label: "Da 60 € a 150 €" },
  { value: "over-150", label: "Oltre 150 €" },
] as const;

const capacityOptions = [
  { value: "small", label: "Fino a 50 cl" },
  { value: "700", label: "70 cl" },
  { value: "750", label: "75 cl" },
  { value: "large", label: "1 L e oltre" },
] as const;

const alcoholOptions = [
  { value: "under-30", label: "Meno di 30% Vol." },
  { value: "30-40", label: "Da 30% a 40% Vol." },
  { value: "over-40", label: "Oltre 40% Vol." },
  { value: "not-declared", label: "Non dichiarata" },
] as const;

function FilterGroup({
  legend,
  name,
  options,
  selected,
  onChange,
  beforeOptions,
}: {
  legend: string;
  name: Parameters<CatalogFiltersPanelProps["onListFilterChange"]>[0];
  options: readonly FilterOption[];
  selected: readonly string[];
  onChange: CatalogFiltersPanelProps["onListFilterChange"];
  beforeOptions?: ReactNode;
}) {
  return (
    <fieldset className="border-border-subtle border-b py-5">
      <legend className="text-text-strong font-serif text-lg">{legend}</legend>
      {beforeOptions}
      <div className="mt-3 grid max-h-72 gap-1 overflow-y-auto">
        {options.map((option) => (
          <label
            key={option.value}
            className="hover:text-accent-soft flex min-h-10 cursor-pointer items-center gap-3 text-sm transition-colors"
          >
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => onChange(name, option.value)}
              className="border-border bg-background accent-accent size-4"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function CatalogFiltersPanel({
  filters,
  options,
  onListFilterChange,
  onBooleanFilterChange,
  onReset,
}: CatalogFiltersPanelProps) {
  const [brandQuery, setBrandQuery] = useState("");
  const visibleBrands = useMemo(() => {
    const normalizedQuery = brandQuery.trim().toLocaleLowerCase("it-IT");
    if (!normalizedQuery) return options.brands.slice(0, 48);
    return options.brands
      .filter((brand) =>
        brand.label.toLocaleLowerCase("it-IT").includes(normalizedQuery),
      )
      .slice(0, 48);
  }, [brandQuery, options.brands]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
          Affina la selezione
        </p>
        <button
          type="button"
          className="animated-underline text-text-muted min-h-10 text-xs uppercase"
          onClick={onReset}
        >
          Azzera
        </button>
      </div>
      <FilterGroup
        legend="Marca"
        name="brands"
        options={visibleBrands}
        selected={filters.brands}
        onChange={onListFilterChange}
        beforeOptions={
          <label className="mt-4 block">
            <span className="sr-only">Cerca una marca</span>
            <input
              type="search"
              value={brandQuery}
              onChange={(event) => setBrandQuery(event.target.value)}
              placeholder="Cerca una marca"
              className="border-border-subtle bg-surface focus:border-accent min-h-11 w-full border px-3 text-sm outline-none"
            />
          </label>
        }
      />
      <FilterGroup
        legend="Prezzo"
        name="priceRanges"
        options={priceOptions}
        selected={filters.priceRanges}
        onChange={onListFilterChange}
      />
      <FilterGroup
        legend="Categoria"
        name="categories"
        options={options.categories}
        selected={filters.categories}
        onChange={onListFilterChange}
      />
      <FilterGroup
        legend="Capacità"
        name="capacities"
        options={capacityOptions}
        selected={filters.capacities}
        onChange={onListFilterChange}
      />
      <FilterGroup
        legend="Gradazione"
        name="alcoholRanges"
        options={alcoholOptions}
        selected={filters.alcoholRanges}
        onChange={onListFilterChange}
      />
      {options.countries.length > 0 ? (
        <FilterGroup
          legend="Paese"
          name="countries"
          options={options.countries}
          selected={filters.countries}
          onChange={onListFilterChange}
        />
      ) : null}
      <fieldset className="grid gap-1 pt-5">
        <legend className="text-text-strong mb-3 font-serif text-lg">
          Disponibilità
        </legend>
        {[
          { name: "onlyNew", label: "Nuovi arrivi" },
          { name: "onlyLimited", label: "Edizioni limitate" },
          { name: "onlyAvailable", label: "Disponibili" },
        ].map((option) => (
          <label
            key={option.name}
            className="hover:text-accent-soft flex min-h-10 cursor-pointer items-center gap-3 text-sm transition-colors"
          >
            <input
              type="checkbox"
              checked={filters[option.name as keyof CatalogFilters] as boolean}
              onChange={(event) =>
                onBooleanFilterChange(
                  option.name as "onlyNew" | "onlyLimited" | "onlyAvailable",
                  event.target.checked,
                )
              }
              className="border-border bg-background accent-accent size-4"
            />
            {option.label}
          </label>
        ))}
      </fieldset>
    </div>
  );
}

export const catalogSortOptions: readonly {
  value: CatalogSort;
  label: string;
}[] = [
  { value: "featured", label: "In evidenza" },
  { value: "newest", label: "Novità" },
  { value: "price-asc", label: "Prezzo crescente" },
  { value: "price-desc", label: "Prezzo decrescente" },
  { value: "name", label: "Nome A–Z" },
];
