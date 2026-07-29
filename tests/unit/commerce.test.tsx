import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { CartPageContent } from "@/features/commerce/cart-page-content";
import { CommerceProvider } from "@/features/commerce/commerce-provider";
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

    render(
      <CommerceProvider products={[product]}>
        <CartPageContent />
      </CommerceProvider>,
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
        { cart: { "caprisius-43": 2 }, wishlist: [] },
        catalogProductFixtures,
      ).subtotalMinor,
    ).toBe(7_784);
  });
});

describe("wishlist", () => {
  it("mostra la selezione persistente e permette la rimozione", async () => {
    const user = userEvent.setup();

    render(
      <CommerceProvider products={catalogProductFixtures}>
        <WishlistPageContent />
      </CommerceProvider>,
    );

    expect(
      screen.getByRole("heading", { name: "Yamazaki 18 Years Old" }),
    ).toBeVisible();
    await user.click(
      screen.getByRole("button", {
        name: "Rimuovi Yamazaki 18 Years Old dai preferiti",
      }),
    );
    expect(screen.getByText("Crea la tua collezione personale.")).toBeVisible();
  });
});
