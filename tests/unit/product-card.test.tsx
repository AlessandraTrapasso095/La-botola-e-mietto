import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ProductCard } from "@/features/catalog/product-card";
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
});
