import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { catalogCategories } from "@/content/catalog/categories";
import { CatalogExplorer } from "@/features/catalog/catalog-explorer";
import { CommerceProvider } from "@/features/commerce/commerce-provider";
import { catalogProductFixtures } from "../fixtures/catalog";

describe("filtri catalogo mobile", () => {
  it("applica i filtri, chiude il drawer e restituisce il focus", async () => {
    const user = userEvent.setup();

    render(
      <CommerceProvider products={catalogProductFixtures}>
        <CatalogExplorer
          products={catalogProductFixtures}
          categories={catalogCategories}
        />
      </CommerceProvider>,
    );

    const trigger = screen.getByRole("button", { name: "Filtri" });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Filtri" });
    await user.click(within(dialog).getByLabelText("Caprisius"));

    const applyButton = within(dialog).getByRole("button", {
      name: "Applica filtri",
    });
    expect(applyButton.className).toContain("active:scale-[0.98]");
    applyButton.focus();
    await user.keyboard("{Enter}");

    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
    expect(
      screen.getByRole("heading", { name: "Caprisius 43 Gin" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("heading", {
        name: "The Macallan 12 Double Cask",
      }),
    ).not.toBeInTheDocument();
    expect(trigger).toHaveAccessibleName("Filtri (1)");
  });
});
