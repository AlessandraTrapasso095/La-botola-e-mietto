"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { businessInfo } from "@/config/business";
import {
  demoCartLines,
  demoWishlistSlugs,
} from "@/content/catalog/demo-commerce";
import type { CatalogProductSummaryView } from "@/content/catalog/types";
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
import { supabaseCartService } from "@/services/cart/supabase-cart-service";
import { supabaseWishlistService } from "@/services/wishlist/supabase-wishlist-service";

type ToastMessage = {
  id: number;
  message: string;
};

type CommerceContextValue = {
  products: readonly CatalogProductSummaryView[];
  cart: CartSummary;
  cartLoading: boolean;
  cartError: string | null;
  shippingProgress: ReturnType<typeof calculateShippingProgress>;
  wishlist: readonly string[];
  wishlistLoading: boolean;
  wishlistError: string | null;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: CatalogProductSummaryView, quantity?: number) => void;
  setCartQuantity: (slug: string, quantity: number) => void;
  removeFromCart: (slug: string) => void;
  clearCartAfterCheckout: () => void;
  toggleWishlist: (product: CatalogProductSummaryView) => void;
  isWishlisted: (slug: string) => boolean;
  isWishlistPending: (slug: string) => boolean;
  toast: ToastMessage | null;
};

const CommerceContext = createContext<CommerceContextValue | null>(null);

function createInitialState(
  initialWishlist: readonly string[],
  authMode: "demo" | "supabase",
): CommerceState {
  if (authMode === "supabase") {
    return {
      cart: {},
      wishlist: [...new Set(initialWishlist)],
    };
  }

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

function cartItemsToRecord(
  items: readonly {
    slug: string;
    quantity: number;
  }[],
) {
  return Object.fromEntries(items.map((item) => [item.slug, item.quantity]));
}

function sanitizeStoredCart(cart: Record<string, number>) {
  return Object.fromEntries(
    Object.entries(cart)
      .filter(
        ([slug, quantity]) =>
          typeof slug === "string" &&
          Number.isInteger(quantity) &&
          quantity >= 1 &&
          quantity <= 99,
      )
      .slice(0, 100),
  );
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

  const [initialState] = useState(() =>
    createInitialState(initialWishlist, authMode),
  );

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

  const [remoteCartReady, setRemoteCartReady] = useState(false);

  const [cartLoading, setCartLoading] = useState(
    authMode === "supabase" && Boolean(accountUserId),
  );

  const [cartError, setCartError] = useState<string | null>(null);

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

  const syncedCartUserRef = useRef<string | null>(null);

  const syncingCartUserRef = useRef<string | null>(null);

  const cartMutationPendingRef = useRef(false);

  const cartMutationQueueRef = useRef<Promise<void>>(Promise.resolve());

  const syncedWishlistUserRef = useRef<string | null>(null);

  const syncingWishlistUserRef = useRef<string | null>(null);

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

      const sanitizedCart = sanitizeStoredCart(cart);

      const requestedSlugs = [
        ...new Set([...Object.keys(sanitizedCart), ...wishlist]),
      ];

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
              Object.entries(sanitizedCart).filter(([slug]) =>
                availableSlugs.has(slug),
              ),
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
              Object.entries(sanitizedCart).filter(([slug]) =>
                knownSlugs.has(slug),
              ),
            ),
            wishlist: [...new Set(wishlist)].filter((slug) =>
              knownSlugs.has(slug),
            ),
          });
        } finally {
          if (!controller.signal.aborted) {
            setHydrated(true);
          }
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
    if (!hydrated || !accountHydrated || authMode !== "supabase") {
      return;
    }

    if (!accountUserId) {
      const hadRemoteSession = syncedCartUserRef.current !== null;

      syncedCartUserRef.current = null;
      syncingCartUserRef.current = null;
      cartMutationPendingRef.current = false;

      let active = true;

      window.queueMicrotask(() => {
        if (!active) return;

        setRemoteCartReady(false);
        setCartLoading(false);
        setCartError(null);

        if (hadRemoteSession) {
          const localCart = readCommerceState(window.localStorage)?.cart ?? {};

          setState((current) => ({
            ...current,
            cart: sanitizeStoredCart(localCart),
          }));
        }
      });

      return () => {
        active = false;
      };
    }

    if (
      syncedCartUserRef.current === accountUserId ||
      syncingCartUserRef.current === accountUserId
    ) {
      return;
    }

    let active = true;
    const controller = new AbortController();

    syncingCartUserRef.current = accountUserId;

    setRemoteCartReady(false);
    setCartLoading(true);
    setCartError(null);

    const synchronizeCart = async () => {
      try {
        const localCart = readCommerceState(window.localStorage)?.cart ?? {};

        const localItems = Object.entries(sanitizeStoredCart(localCart)).map(
          ([slug, quantity]) => ({
            slug,
            quantity,
          }),
        );

        const response = await supabaseCartService.merge(localItems);

        const productsForCart = await fetchProductCards(
          response.items.map((item) => item.slug),
          controller.signal,
        );

        if (!active) return;

        const resolvedSlugs = new Set(
          productsForCart.map((product) => product.slug),
        );

        const resolvedItems = response.items.filter((item) =>
          resolvedSlugs.has(item.slug),
        );

        setProductIndex((current) =>
          addProductsToIndex(current, productsForCart),
        );

        setState((current) => ({
          ...current,
          cart: cartItemsToRecord(resolvedItems),
        }));

        const storedCommerce = readCommerceState(window.localStorage) ?? {
          cart: {},
          wishlist: [],
        };

        writeCommerceState(window.localStorage, {
          cart: {},
          wishlist: storedCommerce.wishlist,
        });

        syncedCartUserRef.current = accountUserId;

        setRemoteCartReady(true);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        if (!active) return;

        setCartError(
          error instanceof Error
            ? error.message
            : "Sincronizzazione del carrello non riuscita.",
        );
      } finally {
        if (!active) return;

        syncingCartUserRef.current = null;
        setCartLoading(false);
      }
    };

    void synchronizeCart();

    return () => {
      active = false;
      controller.abort();
    };
  }, [accountHydrated, accountUserId, authMode, hydrated]);

  useEffect(() => {
    if (!hydrated || !accountHydrated || authMode !== "supabase") {
      return;
    }

    if (!accountUserId) {
      const hadRemoteSession = syncedWishlistUserRef.current !== null;

      syncedWishlistUserRef.current = null;
      syncingWishlistUserRef.current = null;

      let active = true;

      window.queueMicrotask(() => {
        if (!active) return;

        setRemoteWishlistReady(false);
        setWishlistLoading(false);
        setWishlistError(null);

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
      syncedWishlistUserRef.current === accountUserId ||
      syncingWishlistUserRef.current === accountUserId
    ) {
      return;
    }

    let active = true;
    const controller = new AbortController();

    syncingWishlistUserRef.current = accountUserId;

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

        const storedCommerce = readCommerceState(window.localStorage) ?? {
          cart: {},
          wishlist: [],
        };

        writeCommerceState(window.localStorage, {
          cart: storedCommerce.cart,
          wishlist: [],
        });

        syncedWishlistUserRef.current = accountUserId;

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

        syncingWishlistUserRef.current = null;

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
      return;
    }

    writeCommerceState(window.localStorage, state);
  }, [accountUserId, authMode, hydrated, state]);

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => setToast(null), 2400);

    return () => {
      window.clearTimeout(timeout);
    };
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

  const announce = useCallback((message: string) => {
    setToast({
      id: Date.now(),
      message,
    });
  }, []);

  const value = useMemo<CommerceContextValue>(
    () => ({
      products: availableProducts,
      cart,
      cartLoading,
      cartError,
      shippingProgress,
      wishlist: state.wishlist,
      wishlistLoading,
      wishlistError,
      cartOpen,
      setCartOpen,

      addToCart: (product, quantity = 1) => {
        const normalizedQuantity = Math.min(
          Math.max(Math.trunc(quantity), 1),
          99,
        );

        if (authMode === "supabase" && accountUserId && !remoteCartReady) {
          announce("Attendi il caricamento del carrello.");
          return;
        }

        if (
          authMode === "supabase" &&
          accountUserId &&
          cartMutationPendingRef.current
        ) {
          announce("Attendi il salvataggio del carrello.");
          return;
        }

        const previousCart = {
          ...stateRef.current.cart,
        };

        const currentQuantity = previousCart[product.slug] ?? 0;

        const optimisticQuantity = Math.min(
          currentQuantity + normalizedQuantity,
          99,
        );

        setProductIndex((current) => addProductsToIndex(current, [product]));

        setState((current) => ({
          ...current,
          cart: {
            ...current.cart,
            [product.slug]: optimisticQuantity,
          },
        }));

        setCartOpen(true);
        setCartError(null);

        if (authMode !== "supabase" || !accountUserId) {
          announce("Bottiglia aggiunta al carrello.");
          return;
        }

        cartMutationPendingRef.current = true;

        setCartLoading(true);

        const operation = cartMutationQueueRef.current.then(async () => {
          try {
            const response = await supabaseCartService.add(
              product.slug,
              normalizedQuantity,
            );

            setState((current) => ({
              ...current,
              cart: cartItemsToRecord(response.items),
            }));

            announce("Bottiglia aggiunta al carrello.");
          } catch (error: unknown) {
            setState((current) => ({
              ...current,
              cart: previousCart,
            }));

            const message =
              error instanceof Error
                ? error.message
                : "Aggiornamento del carrello non riuscito.";

            setCartError(message);
            announce(message);
          } finally {
            cartMutationPendingRef.current = false;

            setCartLoading(false);
          }
        });

        cartMutationQueueRef.current = operation.catch(() => undefined);
      },

      setCartQuantity: (slug, quantity) => {
        const normalizedQuantity = Math.min(
          Math.max(Math.trunc(quantity), 0),
          99,
        );

        if (authMode === "supabase" && accountUserId && !remoteCartReady) {
          announce("Attendi il caricamento del carrello.");
          return;
        }

        if (
          authMode === "supabase" &&
          accountUserId &&
          cartMutationPendingRef.current
        ) {
          announce("Attendi il salvataggio del carrello.");
          return;
        }

        const previousCart = {
          ...stateRef.current.cart,
        };

        setState((current) => {
          const nextCart = {
            ...current.cart,
          };

          if (normalizedQuantity < 1) {
            delete nextCart[slug];
          } else {
            nextCart[slug] = normalizedQuantity;
          }

          return {
            ...current,
            cart: nextCart,
          };
        });

        setCartError(null);

        if (authMode !== "supabase" || !accountUserId) {
          return;
        }

        cartMutationPendingRef.current = true;

        setCartLoading(true);

        const operation = cartMutationQueueRef.current.then(async () => {
          try {
            const response = await supabaseCartService.setQuantity(
              slug,
              normalizedQuantity,
            );

            setState((current) => ({
              ...current,
              cart: cartItemsToRecord(response.items),
            }));
          } catch (error: unknown) {
            setState((current) => ({
              ...current,
              cart: previousCart,
            }));

            const message =
              error instanceof Error
                ? error.message
                : "Aggiornamento del carrello non riuscito.";

            setCartError(message);
            announce(message);
          } finally {
            cartMutationPendingRef.current = false;

            setCartLoading(false);
          }
        });

        cartMutationQueueRef.current = operation.catch(() => undefined);
      },

      removeFromCart: (slug) => {
        if (authMode === "supabase" && accountUserId && !remoteCartReady) {
          announce("Attendi il caricamento del carrello.");
          return;
        }

        if (
          authMode === "supabase" &&
          accountUserId &&
          cartMutationPendingRef.current
        ) {
          announce("Attendi il salvataggio del carrello.");
          return;
        }

        const previousCart = {
          ...stateRef.current.cart,
        };

        setState((current) => {
          const nextCart = {
            ...current.cart,
          };

          delete nextCart[slug];

          return {
            ...current,
            cart: nextCart,
          };
        });

        setCartError(null);

        if (authMode !== "supabase" || !accountUserId) {
          announce("Bottiglia rimossa dal carrello.");
          return;
        }

        cartMutationPendingRef.current = true;

        setCartLoading(true);

        const operation = cartMutationQueueRef.current.then(async () => {
          try {
            const response = await supabaseCartService.remove(slug);

            setState((current) => ({
              ...current,
              cart: cartItemsToRecord(response.items),
            }));

            announce("Bottiglia rimossa dal carrello.");
          } catch (error: unknown) {
            setState((current) => ({
              ...current,
              cart: previousCart,
            }));

            const message =
              error instanceof Error
                ? error.message
                : "Rimozione dal carrello non riuscita.";

            setCartError(message);
            announce(message);
          } finally {
            cartMutationPendingRef.current = false;

            setCartLoading(false);
          }
        });

        cartMutationQueueRef.current = operation.catch(() => undefined);
      },

      clearCartAfterCheckout: () => {
        setState((current) => ({
          ...current,
          cart: {},
        }));

        stateRef.current = {
          ...stateRef.current,
          cart: {},
        };

        setCartOpen(false);
        setCartError(null);
        setCartLoading(false);
        cartMutationPendingRef.current = false;

        if (authMode !== "supabase" || !accountUserId) {
          const storedCommerce = readCommerceState(window.localStorage) ?? {
            cart: {},
            wishlist: stateRef.current.wishlist,
          };

          writeCommerceState(window.localStorage, {
            cart: {},
            wishlist: storedCommerce.wishlist,
          });
        }
      },

      toggleWishlist: (product) => {
        if (pendingWishlistRef.current.has(product.slug)) {
          return;
        }

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
      announce,
      authMode,
      availableProducts,
      cart,
      cartError,
      cartLoading,
      cartOpen,
      pendingWishlistSlugs,
      remoteCartReady,
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
