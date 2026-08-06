"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { businessInfo } from "@/config/business";
import type { CatalogProductSummaryView } from "@/content/catalog/types";
import {
  demoCartLines,
  demoWishlistSlugs,
} from "@/content/catalog/demo-commerce";
import { useOptionalAccount } from "@/features/account/account-provider";
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
import { fetchProductCards } from "@/lib/browser/catalog-client";
import { supabaseWishlistService } from "@/services/wishlist/supabase-wishlist-service";

type ToastMessage = {
  id: number;
  message: string;
};

type CommerceContextValue = {
  products: readonly CatalogProductSummaryView[];
  cart: CartSummary;
  shippingProgress: ReturnType<typeof calculateShippingProgress>;
  wishlist: readonly string[];
  wishlistLoading: boolean;
  wishlistError: string | null;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: CatalogProductSummaryView, quantity?: number) => void;
  setCartQuantity: (slug: string, quantity: number) => void;
  removeFromCart: (slug: string) => void;
  toggleWishlist: (product: CatalogProductSummaryView) => void;
  isWishlisted: (slug: string) => boolean;
  isWishlistPending: (slug: string) => boolean;
  toast: ToastMessage | null;
};

const CommerceContext = createContext<CommerceContextValue | null>(null);

function createInitialState(initialWishlist: readonly string[]): CommerceState {
  return {
    cart: Object.fromEntries(
      demoCartLines.map((line) => [line.productSlug, line.quantity]),
    ),
    wishlist: [...new Set([...demoWishlistSlugs, ...initialWishlist])],
  };
}

function addProductsToIndex(
  current: Record<string, CatalogProductSummaryView>,
  products: readonly CatalogProductSummaryView[],
) {
  return {
    ...current,
    ...Object.fromEntries(products.map((product) => [product.slug, product])),
  };
}

export function CommerceProvider({
  children,
  products = [],
  initialWishlist = [],
}: {
  children: ReactNode;
  products?: readonly CatalogProductSummaryView[];
  initialWishlist?: readonly string[];
}) {
  const account = useOptionalAccount();
  const authMode = account?.authMode ?? "demo";
  const accountHydrated = account?.hydrated ?? true;
  const accountUserId = account?.user?.id ?? null;
  const [initialState] = useState(() => createInitialState(initialWishlist));
  const initialStateRef = useRef(initialState);
  const initialContextRef = useRef({
    authMode,
    accountUserId,
    initialWishlist: [...initialWishlist],
    products,
  });
  const [state, setState] = useState<CommerceState>(initialState);
  const stateRef = useRef(state);
  const [productIndex, setProductIndex] = useState<
    Record<string, CatalogProductSummaryView>
  >(() =>
    Object.fromEntries(products.map((product) => [product.slug, product])),
  );
  const [hydrated, setHydrated] = useState(false);
  const [remoteWishlistReady, setRemoteWishlistReady] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(
    authMode === "supabase" && Boolean(accountUserId),
  );
  const [wishlistError, setWishlistError] = useState<string | null>(null);
  const [pendingWishlistSlugs, setPendingWishlistSlugs] = useState<string[]>(
    [],
  );
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const syncedUserRef = useRef<string | null>(null);
  const syncingUserRef = useRef<string | null>(null);
  const pendingWishlistRef = useRef(new Set<string>());
  const wishlistMutationQueueRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const controller = new AbortController();
    const hydrationFrame = window.requestAnimationFrame(() => {
      const storedState = readCommerceState(window.localStorage);
      const initialContext = initialContextRef.current;
      const cart = storedState?.cart ?? initialStateRef.current.cart;
      const wishlist =
        initialContext.authMode === "supabase" && initialContext.accountUserId
          ? initialContext.initialWishlist
          : (storedState?.wishlist ?? initialStateRef.current.wishlist);
      const requestedSlugs = [...new Set([...Object.keys(cart), ...wishlist])];
      const knownSlugs = new Set(
        initialContext.products.map((product) => product.slug),
      );
      const missingSlugs = requestedSlugs.filter(
        (slug) => !knownSlugs.has(slug),
      );

      const hydrateProducts = async () => {
        try {
          const fetchedProducts = await fetchProductCards(
            missingSlugs,
            controller.signal,
          );
          const availableSlugs = new Set([
            ...knownSlugs,
            ...fetchedProducts.map((product) => product.slug),
          ]);
          setProductIndex((current) =>
            addProductsToIndex(current, fetchedProducts),
          );
          setState({
            cart: Object.fromEntries(
              Object.entries(cart).filter(([slug]) => availableSlugs.has(slug)),
            ),
            wishlist: [...new Set(wishlist)].filter((slug) =>
              availableSlugs.has(slug),
            ),
          });
        } catch (error: unknown) {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }
          setState({
            cart: Object.fromEntries(
              Object.entries(cart).filter(([slug]) => knownSlugs.has(slug)),
            ),
            wishlist: [...new Set(wishlist)].filter((slug) =>
              knownSlugs.has(slug),
            ),
          });
        } finally {
          if (!controller.signal.aborted) setHydrated(true);
        }
      };

      void hydrateProducts();
    });

    return () => {
      controller.abort();
      window.cancelAnimationFrame(hydrationFrame);
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !accountHydrated || authMode !== "supabase") return;

    if (!accountUserId) {
      const hadRemoteSession = syncedUserRef.current !== null;
      syncedUserRef.current = null;
      syncingUserRef.current = null;
      let active = true;
      window.queueMicrotask(() => {
        if (!active) return;
        setRemoteWishlistReady(false);
        setWishlistLoading(false);
        if (hadRemoteSession) {
          const localWishlist =
            readCommerceState(window.localStorage)?.wishlist ?? [];
          setState((current) => ({
            ...current,
            wishlist: [...new Set(localWishlist)],
          }));
        }
      });
      return () => {
        active = false;
      };
    }

    if (
      syncedUserRef.current === accountUserId ||
      syncingUserRef.current === accountUserId
    ) {
      return;
    }

    let active = true;
    const controller = new AbortController();
    syncingUserRef.current = accountUserId;
    setRemoteWishlistReady(false);
    setWishlistLoading(true);
    setWishlistError(null);

    const synchronizeWishlist = async () => {
      try {
        const localWishlist =
          readCommerceState(window.localStorage)?.wishlist ?? [];
        const response = await supabaseWishlistService.merge(localWishlist);
        const productsForWishlist = await fetchProductCards(
          response.slugs,
          controller.signal,
        );
        if (!active) return;

        const resolvedSlugs = new Set(
          productsForWishlist.map((product) => product.slug),
        );
        setProductIndex((current) =>
          addProductsToIndex(current, productsForWishlist),
        );
        setState((current) => ({
          ...current,
          wishlist: response.slugs.filter((slug) => resolvedSlugs.has(slug)),
        }));
        writeCommerceState(window.localStorage, {
          cart: stateRef.current.cart,
          wishlist: [],
        });
        syncedUserRef.current = accountUserId;
        setRemoteWishlistReady(true);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        if (!active) return;
        setWishlistError(
          error instanceof Error
            ? error.message
            : "Sincronizzazione dei preferiti non riuscita.",
        );
      } finally {
        if (!active) return;
        syncingUserRef.current = null;
        setWishlistLoading(false);
      }
    };

    void synchronizeWishlist();
    return () => {
      active = false;
      controller.abort();
    };
  }, [accountHydrated, accountUserId, authMode, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (authMode === "supabase" && accountUserId) {
      if (!remoteWishlistReady) return;
      writeCommerceState(window.localStorage, {
        cart: state.cart,
        wishlist: [],
      });
      return;
    }
    writeCommerceState(window.localStorage, state);
  }, [accountUserId, authMode, hydrated, remoteWishlistReady, state]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const availableProducts = useMemo(
    () => Object.values(productIndex),
    [productIndex],
  );
  const cart = useMemo(
    () => createCartSummary(state, availableProducts),
    [availableProducts, state],
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
      products: availableProducts,
      cart,
      shippingProgress,
      wishlist: state.wishlist,
      wishlistLoading,
      wishlistError,
      cartOpen,
      setCartOpen,
      addToCart: (product, quantity = 1) => {
        setProductIndex((current) => addProductsToIndex(current, [product]));
        setState((current) => ({
          ...current,
          cart: {
            ...current.cart,
            [product.slug]: (current.cart[product.slug] ?? 0) + quantity,
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
      toggleWishlist: (product) => {
        if (pendingWishlistRef.current.has(product.slug)) return;
        if (authMode === "supabase" && accountUserId && !remoteWishlistReady) {
          announce("Attendi il caricamento dei preferiti.");
          return;
        }

        const previousWishlist = stateRef.current.wishlist;
        const willAdd = !previousWishlist.includes(product.slug);
        setProductIndex((current) => addProductsToIndex(current, [product]));
        setState((current) => ({
          ...current,
          wishlist: willAdd
            ? [...current.wishlist, product.slug]
            : current.wishlist.filter((slug) => slug !== product.slug),
        }));

        if (authMode !== "supabase" || !accountUserId) {
          announce(
            willAdd
              ? "Aggiunta alla tua selezione."
              : "Rimossa dalla tua selezione.",
          );
          return;
        }

        pendingWishlistRef.current.add(product.slug);
        setPendingWishlistSlugs((current) => [...current, product.slug]);
        setWishlistError(null);
        const operation = wishlistMutationQueueRef.current.then(async () => {
          try {
            const response = willAdd
              ? await supabaseWishlistService.add(product.slug)
              : await supabaseWishlistService.remove(product.slug);
            setState((current) => ({
              ...current,
              wishlist: response.slugs,
            }));
            announce(
              willAdd
                ? "Aggiunta alla tua selezione."
                : "Rimossa dalla tua selezione.",
            );
          } catch (error: unknown) {
            setState((current) => ({
              ...current,
              wishlist: willAdd
                ? current.wishlist.filter((slug) => slug !== product.slug)
                : current.wishlist.includes(product.slug)
                  ? current.wishlist
                  : [...current.wishlist, product.slug],
            }));
            const message =
              error instanceof Error
                ? error.message
                : "Aggiornamento dei preferiti non riuscito.";
            setWishlistError(message);
            announce(message);
          } finally {
            pendingWishlistRef.current.delete(product.slug);
            setPendingWishlistSlugs((current) =>
              current.filter((slug) => slug !== product.slug),
            );
          }
        });
        wishlistMutationQueueRef.current = operation.catch(() => undefined);
      },
      isWishlisted: (slug) => state.wishlist.includes(slug),
      isWishlistPending: (slug) =>
        wishlistLoading || pendingWishlistSlugs.includes(slug),
      toast,
    }),
    [
      accountUserId,
      authMode,
      availableProducts,
      cart,
      cartOpen,
      pendingWishlistSlugs,
      remoteWishlistReady,
      shippingProgress,
      state.wishlist,
      toast,
      wishlistError,
      wishlistLoading,
    ],
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
