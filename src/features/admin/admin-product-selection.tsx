"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SelectionContextValue = {
  selectedIds: string[];
  selectedCount: number;
  pageProductIds: string[];
  allPageSelected: boolean;
  toggleProduct: (productId: string) => void;
  selectPage: () => void;
  clearSelection: () => void;
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function AdminProductSelectionProvider({
  pageProductIds,
  children,
}: {
  pageProductIds: string[];
  children: ReactNode;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const allPageSelected =
    pageProductIds.length > 0 &&
    pageProductIds.every((productId) => selectedSet.has(productId));

  function toggleProduct(productId: string) {
    setSelectedIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }

  function selectPage() {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (allPageSelected) {
        for (const id of pageProductIds) {
          next.delete(id);
        }
      } else {
        for (const id of pageProductIds) {
          next.add(id);
        }
      }

      return [...next];
    });
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  return (
    <SelectionContext.Provider
      value={{
        selectedIds,
        selectedCount: selectedIds.length,
        pageProductIds,
        allPageSelected,
        toggleProduct,
        selectPage,
        clearSelection,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
}

export function useAdminProductSelection() {
  const context = useContext(SelectionContext);

  if (!context) {
    throw new Error(
      "useAdminProductSelection deve essere usato dentro AdminProductSelectionProvider.",
    );
  }

  return context;
}

export function AdminProductSelectionCheckbox({
  productId,
  label,
}: {
  productId: string;
  label: string;
}) {
  const { selectedIds, toggleProduct } = useAdminProductSelection();
  const checked = selectedIds.includes(productId);

  return (
    <label
      className="inline-flex min-h-11 cursor-pointer items-center gap-3"
      title={`Seleziona ${label}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => toggleProduct(productId)}
        className="size-5 rounded border-white/20 bg-[#111111] accent-orange-500"
        aria-label={`Seleziona ${label}`}
      />
    </label>
  );
}

export function AdminProductSelectionToolbar() {
  const {
    selectedCount,
    pageProductIds,
    allPageSelected,
    selectPage,
    clearSelection,
  } = useAdminProductSelection();

  if (pageProductIds.length === 0) {
    return null;
  }

  return (
    <div className="flex min-w-0 flex-col gap-3 border-b border-white/10 bg-white/[0.025] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={selectPage}
          className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/10 px-4 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
        >
          {allPageSelected
            ? "Deseleziona questa pagina"
            : `Seleziona i ${pageProductIds.length} di questa pagina`}
        </button>

        <span className="text-sm text-white/45">
          {selectedCount === 0
            ? "Nessun prodotto selezionato"
            : `${selectedCount.toLocaleString("it-IT")} ${
                selectedCount === 1 ? "prodotto selezionato" : "prodotti selezionati"
              }`}
        </span>
      </div>

      {selectedCount > 0 ? (
        <button
          type="button"
          onClick={clearSelection}
          className="text-left text-sm font-medium text-orange-300 transition hover:text-orange-200 sm:text-right"
        >
          Azzera selezione
        </button>
      ) : null}
    </div>
  );
}
