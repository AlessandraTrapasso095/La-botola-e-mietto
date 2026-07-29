import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { CommerceProvider } from "@/features/commerce/commerce-provider";
import { SearchDialog } from "@/features/search/search-dialog";
import { catalogProductFixtures } from "../fixtures/catalog";

describe("ricerca catalogo", () => {
  it("mostra prodotti, marchi e stato senza risultati", async () => {
    const user = userEvent.setup();

    render(
      <CommerceProvider products={catalogProductFixtures}>
        <SearchDialog open onOpenChange={() => undefined} />
      </CommerceProvider>,
    );

    const input = screen.getByRole("searchbox", {
      name: "Cerca prodotti, marchi e categorie",
    });
    await user.type(input, "Yamazaki");
    await waitFor(() =>
      expect(
        screen.getByRole("link", { name: /Suntory Yamazaki 18 Y.O./ }),
      ).toBeVisible(),
    );
    expect(screen.getByRole("heading", { name: "Prodotti" })).toBeVisible();

    await user.clear(input);
    await user.type(input, "termine inesistente");
    await waitFor(() =>
      expect(
        screen.getByText(/Nessun risultato per “termine inesistente”/),
      ).toBeVisible(),
    );
  }, 15_000);

  it("sposta il focus al primo risultato con Freccia giù", async () => {
    const user = userEvent.setup();

    render(
      <CommerceProvider products={catalogProductFixtures}>
        <SearchDialog open onOpenChange={() => undefined} />
      </CommerceProvider>,
    );

    const input = screen.getByRole("searchbox");
    await user.click(input);
    await user.keyboard("{ArrowDown}");
    expect(
      screen.getByRole("link", {
        name: /Scopri|The Macallan 12 Y.O. Double Cask/,
      }),
    ).toHaveFocus();
  }, 15_000);
});
