import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { CartPageContent } from "@/features/commerce/cart-page-content";
import {
  CommerceProvider,
  useCommerce,
} from "@/features/commerce/commerce-provider";
import {
  calculateShippingProgress,
  createCartSummary,
} from "@/features/commerce/commerce-state";
import { WishlistPageContent } from "@/features/commerce/wishlist-page-content";
import {
  catalogProductFixtures,
  createCatalogProductFixture,
} from "../fixtures/catalog";

describe("carrello e spedizione gratuita", () => {
  it("aggiorna quantità, subtotale e soglia gratuita", async () => {
    const user = userEvent.setup();
    const product = createCatalogProductFixture({
      grossPriceMinor: 3_000,
      grossPrice: "30,00 €",
    });

    window.localStorage.setItem(
      "lbm-demo-commerce",
      JSON.stringify({ cart: { [product.slug]: 1 }, wishlist: [] }),
    );

    render(
      <CommerceProvider products={[product]}>
        <CartPageContent />
      </CommerceProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText(/Aggiungi 30,00 € per/)).toBeVisible(),
    );
    expect(screen.getByText(/Aggiungi 30,00 € per/)).toBeVisible();
    await user.selectOptions(
      screen.getByLabelText(`Quantità di ${product.name}`),
      "2",
    );
    expect(
      screen.getByText("Hai ottenuto la spedizione gratuita in Italia."),
    ).toBeVisible();
    expect(screen.getAllByText("60,00 €").length).toBeGreaterThan(0);
  });

  it("calcola il limite senza importi frazionari", () => {
    expect(calculateShippingProgress(5_999, 6_000)).toMatchObject({
      qualified: false,
      remainingMinor: 1,
    });
    expect(calculateShippingProgress(6_000, 6_000)).toMatchObject({
      qualified: true,
      remainingMinor: 0,
      percentage: 100,
    });
    expect(
      createCartSummary(
        { cart: { caprisius: 2 }, wishlist: [] },
        catalogProductFixtures,
      ).subtotalMinor,
    ).toBe(7_784);
  });
});

describe("wishlist", () => {
  function WishlistCount() {
    const { wishlist } = useCommerce();

    return <output aria-label="Numero preferiti">{wishlist.length}</output>;
  }

  it("ignora i preferiti non più presenti nel catalogo", async () => {
    window.localStorage.setItem(
      "lbm-demo-commerce",
      JSON.stringify({ cart: {}, wishlist: ["prodotto-non-disponibile"] }),
    );

    render(
      <CommerceProvider products={catalogProductFixtures}>
        <WishlistCount />
      </CommerceProvider>,
    );

    await waitFor(() =>
      expect(screen.getByLabelText("Numero preferiti")).toHaveTextContent("0"),
    );
  });

  it("mostra la selezione persistente e permette la rimozione", async () => {
    const user = userEvent.setup();

    window.localStorage.setItem(
      "lbm-demo-commerce",
      JSON.stringify({
        cart: {},
        wishlist: ["suntory-yamazaki-18-y-o"],
      }),
    );

    render(
      <CommerceProvider products={catalogProductFixtures}>
        <WishlistPageContent />
      </CommerceProvider>,
    );

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Suntory Yamazaki 18 Y.O." }),
      ).toBeVisible(),
    );
    expect(
      screen.getByRole("button", {
        name: "Rimuovi Suntory Yamazaki 18 Y.O. dai preferiti",
      }),
    ).toBeVisible();
    await user.click(
      screen.getByRole("button", {
        name: "Rimuovi Suntory Yamazaki 18 Y.O. dai preferiti",
      }),
    );
    expect(screen.getByText("Crea la tua collezione personale.")).toBeVisible();
  });
});
