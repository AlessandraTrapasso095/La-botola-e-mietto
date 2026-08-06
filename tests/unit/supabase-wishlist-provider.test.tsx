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
  id: "local-account-id",
  firstName: "Livia",
  lastName: "Conti",
  email: "livia@example.test",
  phone: "",
  birthDate: "",
  marketingConsent: false,
  emailUpdates: true,
};

function WishlistControls() {
  const {
    isWishlistPending,
    toggleWishlist,
    wishlist,
    wishlistError,
    wishlistLoading,
  } = useCommerce();

  return (
    <div>
      <output aria-label="Numero preferiti">{wishlist.length}</output>
      <output aria-label="Caricamento preferiti">
        {wishlistLoading ? "sì" : "no"}
      </output>
      <output aria-label="Errore preferiti">{wishlistError ?? ""}</output>
      <button
        type="button"
        disabled={isWishlistPending(product.slug)}
        onClick={() => toggleWishlist(product)}
      >
        Preferito
      </button>
    </div>
  );
}

function renderProvider(user: AccountUser | null) {
  return render(
    <AccountProvider authMode="supabase" initialUser={user}>
      <CommerceProvider products={[product]}>
        <WishlistControls />
      </CommerceProvider>
    </AccountProvider>,
  );
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("wishlist Supabase nel CommerceProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("mantiene locale la wishlist dell'utente anonimo", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    renderProvider(null);

    await user.click(screen.getByRole("button", { name: "Preferito" }));
    await waitFor(() =>
      expect(screen.getByLabelText("Numero preferiti")).toHaveTextContent("1"),
    );
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(readCommerceState(window.localStorage)?.wishlist).toEqual([
      product.slug,
    ]);
  });

  it("unisce la wishlist locale e la svuota solo dopo il successo", async () => {
    window.localStorage.setItem(
      "lbm-demo-commerce",
      JSON.stringify({ cart: {}, wishlist: [product.slug] }),
    );
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async (input, init) => {
        const url = String(input);
        if (url === "/api/account/wishlist/merge" && init?.method === "PUT") {
          expect(JSON.parse(String(init.body))).toEqual({
            slugs: [product.slug],
          });
          return jsonResponse({ slugs: [product.slug] });
        }
        if (url.startsWith("/api/catalog/products?")) {
          return jsonResponse({ products: [product] });
        }
        throw new Error(`Richiesta inattesa: ${url}`);
      });

    renderProvider(accountUser);
    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith(
        "/api/account/wishlist/merge",
        expect.objectContaining({ method: "PUT" }),
      ),
    );
    await waitFor(() =>
      expect(screen.getByLabelText("Numero preferiti")).toHaveTextContent("1"),
    );
    expect(readCommerceState(window.localStorage)?.wishlist).toEqual([]);
  });

  it("serializza il doppio click e mantiene una sola aggiunta", async () => {
    let addRequests = 0;
    let mergeRequests = 0;
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const url = String(input);
      if (url === "/api/account/wishlist/merge") {
        mergeRequests += 1;
        return jsonResponse({ slugs: [] });
      }
      if (url === "/api/account/wishlist" && init?.method === "POST") {
        addRequests += 1;
        return jsonResponse({ slugs: [product.slug] });
      }
      throw new Error(`Richiesta inattesa: ${url}`);
    });
    renderProvider(accountUser);
    await waitFor(() => expect(mergeRequests).toBe(1));

    const button = screen.getByRole("button", { name: "Preferito" });
    button.click();
    button.click();
    await waitFor(() => expect(addRequests).toBe(1));
    expect(screen.getByLabelText("Numero preferiti")).toHaveTextContent("1");
  });

  it("ripristina lo stato ottimistico quando il salvataggio fallisce", async () => {
    const user = userEvent.setup();
    let mergeRequests = 0;
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const url = String(input);
      if (url === "/api/account/wishlist/merge") {
        mergeRequests += 1;
        return jsonResponse({ slugs: [] });
      }
      if (url === "/api/account/wishlist" && init?.method === "POST") {
        return jsonResponse(
          { message: "Aggiornamento dei preferiti non riuscito." },
          500,
        );
      }
      throw new Error(`Richiesta inattesa: ${url}`);
    });
    renderProvider(accountUser);
    await waitFor(() => expect(mergeRequests).toBe(1));

    await user.click(screen.getByRole("button", { name: "Preferito" }));
    await waitFor(() =>
      expect(screen.getByLabelText("Errore preferiti")).toHaveTextContent(
        "Aggiornamento dei preferiti non riuscito.",
      ),
    );
    expect(screen.getByLabelText("Numero preferiti")).toHaveTextContent("0");
  });
});
