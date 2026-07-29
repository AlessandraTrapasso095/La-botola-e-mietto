"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { businessInfo } from "@/config/business";
import type { CatalogProductSummaryView } from "@/content/catalog/types";
import {
  demoCartLines,
  demoWishlistSlugs,
} from "@/content/catalog/demo-commerce";
import {
  readCommerceState,
  writeCommerceState,
} from "@/features/commerce/commerce-storage";
import {
  calculateShippingProgress,
  createCartSummary,
  type CartSummary,
  type CommerceState,
} from "@/features/commerce/commerce-state";

type ToastMessage = {
  id: number;
  message: string;
};

type CommerceContextValue = {
  products: readonly CatalogProductSummaryView[];
  cart: CartSummary;
  shippingProgress: ReturnType<typeof calculateShippingProgress>;
  wishlist: readonly string[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (slug: string, quantity?: number) => void;
  setCartQuantity: (slug: string, quantity: number) => void;
  removeFromCart: (slug: string) => void;
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  toast: ToastMessage | null;
};

const CommerceContext = createContext<CommerceContextValue | null>(null);

const initialState: CommerceState = {
  cart: Object.fromEntries(
    demoCartLines.map((line) => [line.productSlug, line.quantity]),
  ),
  wishlist: [...demoWishlistSlugs],
};

export function CommerceProvider({
  children,
  products,
}: {
  children: ReactNode;
  products: readonly CatalogProductSummaryView[];
}) {
  const [state, setState] = useState<CommerceState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    const hydrationFrame = window.requestAnimationFrame(() => {
      const storedState = readCommerceState(window.localStorage);
      if (storedState) setState(storedState);
      setHydrated(true);
    });

    return () => window.cancelAnimationFrame(hydrationFrame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeCommerceState(window.localStorage, state);
  }, [hydrated, state]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const cart = useMemo(
    () => createCartSummary(state, products),
    [products, state],
  );
  const shippingProgress = calculateShippingProgress(
    cart.subtotalMinor,
    Number(businessInfo.freeShippingThresholdMinor),
  );

  const announce = (message: string) => {
    setToast({ id: Date.now(), message });
  };

  const value = useMemo<CommerceContextValue>(
    () => ({
      products,
      cart,
      shippingProgress,
      wishlist: state.wishlist,
      cartOpen,
      setCartOpen,
      addToCart: (slug, quantity = 1) => {
        setState((current) => ({
          ...current,
          cart: {
            ...current.cart,
            [slug]: (current.cart[slug] ?? 0) + quantity,
          },
        }));
        setCartOpen(true);
        announce("Bottiglia aggiunta al carrello.");
      },
      setCartQuantity: (slug, quantity) => {
        setState((current) => {
          const nextCart = { ...current.cart };
          if (quantity < 1) delete nextCart[slug];
          else nextCart[slug] = quantity;
          return { ...current, cart: nextCart };
        });
      },
      removeFromCart: (slug) => {
        setState((current) => {
          const nextCart = { ...current.cart };
          delete nextCart[slug];
          return { ...current, cart: nextCart };
        });
        announce("Bottiglia rimossa dal carrello.");
      },
      toggleWishlist: (slug) => {
        const willAdd = !state.wishlist.includes(slug);
        setState((current) => ({
          ...current,
          wishlist: current.wishlist.includes(slug)
            ? current.wishlist.filter((candidate) => candidate !== slug)
            : [...current.wishlist, slug],
        }));
        announce(
          willAdd
            ? "Aggiunta alla tua selezione."
            : "Rimossa dalla tua selezione.",
        );
      },
      isWishlisted: (slug) => state.wishlist.includes(slug),
      toast,
    }),
    [cart, cartOpen, products, shippingProgress, state.wishlist, toast],
  );

  return (
    <CommerceContext.Provider value={value}>
      {children}
    </CommerceContext.Provider>
  );
}

export function useCommerce() {
  const context = useContext(CommerceContext);
  if (!context) {
    throw new Error("useCommerce deve essere usato dentro CommerceProvider.");
  }
  return context;
}
