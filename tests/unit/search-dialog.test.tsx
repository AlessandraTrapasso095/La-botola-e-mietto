import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

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

  it("avvia la ricerca con Invio verso la route risultati", async () => {
    const user = userEvent.setup();

    render(
      <CommerceProvider products={catalogProductFixtures}>
        <SearchDialog open onOpenChange={() => undefined} />
      </CommerceProvider>,
    );

    const searchForm = screen.getByRole("search");
    const submitSpy = vi.fn((event: Event) => event.preventDefault());
    searchForm.addEventListener("submit", submitSpy);
    await user.type(screen.getByRole("searchbox"), "Yamazaki{Enter}");

    expect(submitSpy).toHaveBeenCalledOnce();
    expect(searchForm).toHaveAttribute("action", "/cerca");
    expect(searchForm).toHaveAttribute("method", "get");
    expect(screen.getByRole("searchbox")).toHaveAttribute("name", "q");
  });

  it("avvia la ricerca con il pulsante submit", async () => {
    const user = userEvent.setup();

    render(
      <CommerceProvider products={catalogProductFixtures}>
        <SearchDialog open onOpenChange={() => undefined} />
      </CommerceProvider>,
    );

    const searchForm = screen.getByRole("search");
    const submitSpy = vi.fn((event: Event) => event.preventDefault());
    searchForm.addEventListener("submit", submitSpy);
    await user.type(screen.getByRole("searchbox"), "AB6895");
    await user.click(screen.getByRole("button", { name: "Avvia ricerca" }));

    expect(submitSpy).toHaveBeenCalledOnce();
  });

  it("apre il prodotto selezionato e chiude il dialogo", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <CommerceProvider products={catalogProductFixtures}>
        <SearchDialog open onOpenChange={onOpenChange} />
      </CommerceProvider>,
    );

    await user.type(screen.getByRole("searchbox"), "Yamazaki");
    const productLink = await screen.findByRole("link", {
      name: /Suntory Yamazaki 18 Y.O./,
    });

    expect(productLink).toHaveAttribute(
      "href",
      "/prodotto/suntory-yamazaki-18-y-o",
    );
    productLink.addEventListener("click", (event) => event.preventDefault(), {
      once: true,
    });
    await user.click(productLink);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("chiude il dialogo con Escape", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <CommerceProvider products={catalogProductFixtures}>
        <SearchDialog open onOpenChange={onOpenChange} />
      </CommerceProvider>,
    );

    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
