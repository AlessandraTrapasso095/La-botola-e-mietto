import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { catalogCategories } from "@/content/catalog/categories";
import { emptyCatalogFilters } from "@/features/catalog/catalog-filter";
import { CatalogExplorer } from "@/features/catalog/catalog-explorer";
import { CommerceProvider } from "@/features/commerce/commerce-provider";
import { catalogProductFixtures } from "../fixtures/catalog";

const navigation = vi.hoisted(() => ({ replace: vi.fn() }));

vi.mock("next/navigation", () => ({
  usePathname: () => "/catalogo",
  useRouter: () => ({ replace: navigation.replace }),
}));

const filterOptions = {
  brands: catalogProductFixtures.map((product) => ({
    value: product.brandSlug ?? product.slug,
    label: product.brandName ?? product.name,
  })),
  categories: catalogCategories.map((category) => ({
    value: category.slug,
    label: category.name,
  })),
  countries: [{ value: "Italia", label: "Italia" }],
};

describe("filtri catalogo mobile", () => {
  beforeEach(() => navigation.replace.mockReset());

  it("applica i filtri, chiude il drawer e restituisce il focus", async () => {
    const user = userEvent.setup();

    render(
      <CommerceProvider products={catalogProductFixtures}>
        <CatalogExplorer
          result={{
            items: [...catalogProductFixtures],
            page: 1,
            pageSize: 12,
            totalCount: catalogProductFixtures.length,
            totalPages: 1,
          }}
          filterOptions={filterOptions}
          initialFilters={emptyCatalogFilters}
          initialSort="featured"
        />
      </CommerceProvider>,
    );

    const trigger = screen.getByRole("button", { name: "Filtri" });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Filtri" });
    await user.click(within(dialog).getByLabelText("Caprisius"));

    expect(navigation.replace).toHaveBeenCalledWith(
      "/catalogo?brands=caprisius",
      { scroll: false },
    );
    const applyButton = within(dialog).getByRole("button", {
      name: "Applica filtri",
    });
    expect(applyButton.className).toContain("active:scale-[0.98]");
    applyButton.focus();
    await user.keyboard("{Enter}");

    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAccessibleName("Filtri (1)");
  }, 15_000);
});
