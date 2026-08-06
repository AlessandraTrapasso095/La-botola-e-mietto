import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AccountProvider } from "@/features/account/account-provider";
import {
  CommerceProvider,
  useCommerce,
} from "@/features/commerce/commerce-provider";
import { readCommerceState } from "@/features/commerce/commerce-storage";
import type { AccountUser } from "@/services/auth/auth-service";
import { createCatalogProductFixture } from "../fixtures/catalog";

const product = createCatalogProductFixture();

const accountUser: AccountUser = {
  id: "local-cart-account-id",
  firstName: "Livia",
  lastName: "Conti",
  email: "livia@example.test",
  phone: "",
  birthDate: "",
  marketingConsent: false,
  emailUpdates: true,
};

function CartControls() {
  const {
    addToCart,
    cart,
    cartError,
    cartLoading,
    removeFromCart,
    setCartQuantity,
  } = useCommerce();

  const line = cart.lines.find(
    (currentLine) => currentLine.product.slug === product.slug,
  );

  return (
    <div>
      <output aria-label="Numero prodotti">{cart.itemCount}</output>

      <output aria-label="Quantità prodotto">{line?.quantity ?? 0}</output>

      <output aria-label="Caricamento carrello">
        {cartLoading ? "sì" : "no"}
      </output>

      <output aria-label="Errore carrello">{cartError ?? ""}</output>

      <button type="button" onClick={() => addToCart(product)}>
        Aggiungi
      </button>

      <button type="button" onClick={() => setCartQuantity(product.slug, 2)}>
        Imposta due
      </button>

      <button type="button" onClick={() => removeFromCart(product.slug)}>
        Rimuovi
      </button>
    </div>
  );
}

function renderProvider(user: AccountUser | null) {
  return render(
    <AccountProvider authMode="supabase" initialUser={user}>
      <CommerceProvider products={[product]}>
        <CartControls />
      </CommerceProvider>
    </AccountProvider>,
  );
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}

describe("carrello Supabase nel CommerceProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("mantiene locale il carrello dell'utente anonimo", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    renderProvider(null);

    await user.click(screen.getByRole("button", { name: "Aggiungi" }));

    await waitFor(() =>
      expect(screen.getByLabelText("Quantità prodotto")).toHaveTextContent("1"),
    );

    expect(fetchSpy).not.toHaveBeenCalled();

    expect(readCommerceState(window.localStorage)?.cart).toEqual({
      [product.slug]: 1,
    });
  });

  it("unisce il carrello locale e lo svuota dopo il successo", async () => {
    window.localStorage.setItem(
      "lbm-demo-commerce",
      JSON.stringify({
        cart: {
          [product.slug]: 2,
        },
        wishlist: [],
      }),
    );

    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async (input, init) => {
        const url = String(input);

        if (url === "/api/account/cart/merge" && init?.method === "PUT") {
          expect(JSON.parse(String(init.body))).toEqual({
            items: [
              {
                slug: product.slug,
                quantity: 2,
              },
            ],
          });

          return jsonResponse({
            items: [
              {
                slug: product.slug,
                quantity: 2,
              },
            ],
          });
        }

        if (url === "/api/account/wishlist/merge") {
          return jsonResponse({ slugs: [] });
        }

        if (url.startsWith("/api/catalog/products?")) {
          return jsonResponse({
            products: [product],
          });
        }

        throw new Error(`Richiesta inattesa: ${url}`);
      });

    renderProvider(accountUser);

    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith(
        "/api/account/cart/merge",
        expect.objectContaining({
          method: "PUT",
        }),
      ),
    );

    await waitFor(() =>
      expect(screen.getByLabelText("Quantità prodotto")).toHaveTextContent("2"),
    );

    await waitFor(() =>
      expect(readCommerceState(window.localStorage)?.cart).toEqual({}),
    );
  });

  it("aggiunge e aggiorna la quantità nel carrello remoto", async () => {
    const user = userEvent.setup();

    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const url = String(input);

      if (url === "/api/account/cart/merge") {
        return jsonResponse({ items: [] });
      }

      if (url === "/api/account/wishlist/merge") {
        return jsonResponse({ slugs: [] });
      }

      if (url === "/api/account/cart" && init?.method === "POST") {
        return jsonResponse({
          items: [
            {
              slug: product.slug,
              quantity: 1,
            },
          ],
        });
      }

      if (url === "/api/account/cart" && init?.method === "PATCH") {
        return jsonResponse({
          items: [
            {
              slug: product.slug,
              quantity: 2,
            },
          ],
        });
      }

      throw new Error(`Richiesta inattesa: ${url}`);
    });

    renderProvider(accountUser);

    await waitFor(() =>
      expect(screen.getByLabelText("Caricamento carrello")).toHaveTextContent(
        "no",
      ),
    );

    await user.click(screen.getByRole("button", { name: "Aggiungi" }));

    await waitFor(() =>
      expect(screen.getByLabelText("Quantità prodotto")).toHaveTextContent("1"),
    );

    await waitFor(() =>
      expect(screen.getByLabelText("Caricamento carrello")).toHaveTextContent(
        "no",
      ),
    );

    await user.click(screen.getByRole("button", { name: "Imposta due" }));

    await waitFor(() =>
      expect(screen.getByLabelText("Quantità prodotto")).toHaveTextContent("2"),
    );
  });

  it("rimuove il prodotto dal carrello remoto", async () => {
    const user = userEvent.setup();

    window.localStorage.setItem(
      "lbm-demo-commerce",
      JSON.stringify({
        cart: {
          [product.slug]: 1,
        },
        wishlist: [],
      }),
    );

    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const url = String(input);

      if (url === "/api/account/cart/merge") {
        return jsonResponse({
          items: [
            {
              slug: product.slug,
              quantity: 1,
            },
          ],
        });
      }

      if (url === "/api/account/wishlist/merge") {
        return jsonResponse({ slugs: [] });
      }

      if (url.startsWith("/api/catalog/products?")) {
        return jsonResponse({
          products: [product],
        });
      }

      if (url === "/api/account/cart" && init?.method === "DELETE") {
        return jsonResponse({ items: [] });
      }

      throw new Error(`Richiesta inattesa: ${url}`);
    });

    renderProvider(accountUser);

    await waitFor(() =>
      expect(screen.getByLabelText("Quantità prodotto")).toHaveTextContent("1"),
    );

    await waitFor(() =>
      expect(screen.getByLabelText("Caricamento carrello")).toHaveTextContent(
        "no",
      ),
    );

    await user.click(screen.getByRole("button", { name: "Rimuovi" }));

    await waitFor(() =>
      expect(screen.getByLabelText("Quantità prodotto")).toHaveTextContent("0"),
    );
  });

  it("ripristina il carrello quando il salvataggio fallisce", async () => {
    const user = userEvent.setup();

    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const url = String(input);

      if (url === "/api/account/cart/merge") {
        return jsonResponse({ items: [] });
      }

      if (url === "/api/account/wishlist/merge") {
        return jsonResponse({ slugs: [] });
      }

      if (url === "/api/account/cart" && init?.method === "POST") {
        return jsonResponse(
          {
            message: "Aggiornamento del carrello non riuscito.",
          },
          500,
        );
      }

      throw new Error(`Richiesta inattesa: ${url}`);
    });

    renderProvider(accountUser);

    await waitFor(() =>
      expect(screen.getByLabelText("Caricamento carrello")).toHaveTextContent(
        "no",
      ),
    );

    await user.click(screen.getByRole("button", { name: "Aggiungi" }));

    await waitFor(() =>
      expect(screen.getByLabelText("Errore carrello")).toHaveTextContent(
        "Aggiornamento del carrello non riuscito.",
      ),
    );

    expect(screen.getByLabelText("Quantità prodotto")).toHaveTextContent("0");
  });
});
