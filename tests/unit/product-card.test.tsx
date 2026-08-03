import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ProductCard } from "@/features/catalog/product-card";
import { ProductPrice } from "@/features/catalog/product-price";
import {
  CommerceProvider,
  useCommerce,
} from "@/features/commerce/commerce-provider";
import { catalogProductFixtures } from "../fixtures/catalog";

function CommerceProbe() {
  const { cart, wishlist } = useCommerce();
  return (
    <output>
      Carrello {cart.itemCount}; preferiti {wishlist.length}
    </output>
  );
}

describe("ProductCard", () => {
  it("mostra i dati commerciali e aggiorna carrello e wishlist", async () => {
    const user = userEvent.setup();
    const product = catalogProductFixtures[2];

    render(
      <CommerceProvider products={catalogProductFixtures}>
        <ProductCard product={product} />
        <CommerceProbe />
      </CommerceProvider>,
    );

    expect(screen.getByRole("heading", { name: product.name })).toBeVisible();
    expect(screen.getByText(product.grossPrice)).toBeVisible();
    expect(screen.getByText(/43% Vol/)).toBeVisible();

    await user.click(
      screen.getByRole("button", {
        name: `Aggiungi ${product.name} ai preferiti`,
      }),
    );
    expect(screen.getByText(/preferiti 1/)).toBeVisible();

    await user.click(
      screen.getByRole("button", {
        name: `Aggiungi ${product.name} al carrello`,
      }),
    );
    expect(screen.getByText(/Carrello 1/)).toBeVisible();
  });

  it("mostra il badge solo sui prodotti realmente in offerta", () => {
    const offerProduct = {
      ...catalogProductFixtures[0],
      badges: ["In offerta"] as const,
      offer: {
        isActive: true,
        previousGrossPriceMinor: null,
        previousGrossPrice: null,
        discountPercentage: null,
      } as const,
    };

    const { rerender } = render(
      <CommerceProvider products={[offerProduct]}>
        <ProductCard product={offerProduct} />
      </CommerceProvider>,
    );
    expect(screen.getByText("In offerta")).toBeVisible();
    expect(screen.queryByRole("deletion")).not.toBeInTheDocument();

    rerender(
      <CommerceProvider products={[catalogProductFixtures[0]]}>
        <ProductCard product={catalogProductFixtures[0]} />
      </CommerceProvider>,
    );
    expect(screen.queryByText("In offerta")).not.toBeInTheDocument();
  });

  it("mostra prezzo precedente e percentuale solo quando forniti", () => {
    render(
      <ProductPrice
        product={{
          grossPrice: "40,00 €",
          offer: {
            isActive: true,
            previousGrossPriceMinor: 5_000,
            previousGrossPrice: "50,00 €",
            discountPercentage: 20,
          },
        }}
      />,
    );

    expect(screen.getByText("50,00 €").tagName).toBe("DEL");
    expect(screen.getByText("40,00 €")).toBeVisible();
    expect(screen.getByText("−20%")).toBeVisible();
  });
});
