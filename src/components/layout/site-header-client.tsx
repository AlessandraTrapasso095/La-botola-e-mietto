"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  BagIcon,
  ChevronDownIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "@/components/icons";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Container } from "@/components/ui/container";
import { IconButton } from "@/components/ui/icon-button";
import { Logo } from "@/components/ui/logo";
import { accountRoutes } from "@/config/account";
import { primaryNavigation, type CatalogMenuGroup } from "@/config/catalog";
import { useAccount } from "@/features/account/account-provider";
import { useCommerce } from "@/features/commerce/commerce-provider";
import { SearchDialog } from "@/features/search/search-dialog";
import { cn } from "@/lib/cn";
import type { StorefrontPromotion } from "@/server/catalog/storefront-promotion";
import type { Brand, Category, ProductCardView } from "@/types/catalog";

function formatPromotionMoney(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
  }).format(amountMinor / 100);
}

type SiteHeaderClientProps = {
  freeShippingThreshold: string;
  storefrontPromotion: StorefrontPromotion | null;
  menuGroups: readonly CatalogMenuGroup[];
  featuredSearchProducts: readonly ProductCardView[];
  featuredSearchBrands: readonly Brand[];
  featuredSearchCategories: readonly Category[];
};

export function SiteHeaderClient({
  freeShippingThreshold,
  storefrontPromotion,
  menuGroups,
  featuredSearchProducts,
  featuredSearchBrands,
  featuredSearchCategories,
}: SiteHeaderClientProps) {
  const router = useRouter();
  const { hydrated: accountHydrated, user } = useAccount();
  const { cart, setCartOpen, wishlist } = useCommerce();
  const [isScrolled, setIsScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const catalogButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const promotionDialogCloseRef = useRef<HTMLButtonElement>(null);
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
  const [copiedPromotionCode, setCopiedPromotionCode] = useState(false);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 24);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    if (!storefrontPromotion) {
      return;
    }

    const storageKey = `storefront-promo-dismissed:${storefrontPromotion.code}`;

    if (window.localStorage.getItem(storageKey) === "true") {
      return;
    }

    const timer = window.setTimeout(() => {
      setCopiedPromotionCode(false);
      setPromotionDialogOpen(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [storefrontPromotion]);

  useEffect(() => {
    if (!promotionDialogOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    promotionDialogCloseRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (storefrontPromotion) {
        window.localStorage.setItem(
          `storefront-promo-dismissed:${storefrontPromotion.code}`,
          "true",
        );
      }

      setPromotionDialogOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [promotionDialogOpen, storefrontPromotion]);

  function closePromotionDialog() {
    if (storefrontPromotion) {
      window.localStorage.setItem(
        `storefront-promo-dismissed:${storefrontPromotion.code}`,
        "true",
      );
    }

    setCopiedPromotionCode(false);
    setPromotionDialogOpen(false);
  }

  async function copyPromotionCode() {
    if (!storefrontPromotion) {
      return;
    }

    try {
      await navigator.clipboard.writeText(storefrontPromotion.code);
      setCopiedPromotionCode(true);

      window.setTimeout(() => {
        setCopiedPromotionCode(false);
      }, 2000);
    } catch {
      setCopiedPromotionCode(false);
    }
  }

  useEffect(() => {
    if (!megaMenuOpen) return;

    const closeOnPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setMegaMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMegaMenuOpen(false);
      catalogButtonRef.current?.focus();
    };

    document.addEventListener("pointerdown", closeOnPointerDown);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnPointerDown);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [megaMenuOpen]);

  return (
    <>
      <div
        className={
          storefrontPromotion
            ? "border-b border-red-900/70 bg-red-950"
            : "border-border-subtle bg-surface border-b"
        }
      >
        {storefrontPromotion ? (
          <Container className="flex min-h-11 flex-col items-center justify-center gap-2 py-2 text-center sm:flex-row sm:justify-between sm:gap-6 sm:py-0">
            <p className="text-[0.6875rem] font-medium tracking-[0.08em] text-white sm:text-left sm:text-xs">
              Ottieni{" "}
              <span className="font-semibold">
                {storefrontPromotion.discountType === "percentage"
                  ? `${storefrontPromotion.discountValue}%`
                  : formatPromotionMoney(
                      storefrontPromotion.discountValue,
                      storefrontPromotion.currency,
                    )}
              </span>{" "}
              di sconto con il codice{" "}
              <span className="ml-1 inline-flex rounded-full bg-emerald-400 px-2.5 py-1 font-bold tracking-[0.12em] text-emerald-950">
                {storefrontPromotion.code}
              </span>
              {storefrontPromotion.minimumOrderGrossAmountMinor > 0 ? (
                <>
                  {" "}
                  su ordini da{" "}
                  {formatPromotionMoney(
                    storefrontPromotion.minimumOrderGrossAmountMinor,
                    storefrontPromotion.currency,
                  )}
                </>
              ) : null}
            </p>

            <p className="text-[0.6875rem] tracking-[0.08em] text-white/85 sm:text-right sm:text-xs">
              Spedizione gratuita in Italia sopra{" "}
              <span className="font-semibold text-white">
                {freeShippingThreshold}
              </span>
            </p>
          </Container>
        ) : (
          <Container className="flex min-h-10 items-center justify-center text-center">
            <p className="text-text-muted text-[0.6875rem] tracking-[0.08em] sm:text-xs">
              Spedizione gratuita in Italia sopra{" "}
              <span className="text-accent-soft font-semibold">
                {freeShippingThreshold}
              </span>
            </p>
          </Container>
        )}
      </div>

      {storefrontPromotion && promotionDialogOpen ? (
        <div
          className="fixed inset-0 z-[calc(var(--z-header)+20)] flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePromotionDialog();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="storefront-promotion-title"
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111111] p-7 text-center shadow-2xl sm:p-9"
          >
            <button
              ref={promotionDialogCloseRef}
              type="button"
              aria-label="Chiudi promozione"
              onClick={closePromotionDialog}
              className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full border border-white/10 text-xl text-white/60 transition hover:border-white/25 hover:text-white"
            >
              ×
            </button>

            <p className="text-xs font-semibold tracking-[0.18em] text-red-400 uppercase">
              Promozione esclusiva
            </p>

            <h2
              id="storefront-promotion-title"
              className="mt-3 text-2xl font-semibold text-white sm:text-3xl"
            >
              Ottieni il tuo sconto
            </h2>

            <p className="mt-4 text-sm leading-6 text-white/65">
              Usa questo codice al checkout e ottieni{" "}
              <span className="font-semibold text-white">
                {storefrontPromotion.discountType === "percentage"
                  ? `${storefrontPromotion.discountValue}%`
                  : formatPromotionMoney(
                      storefrontPromotion.discountValue,
                      storefrontPromotion.currency,
                    )}
              </span>{" "}
              di sconto
              {storefrontPromotion.minimumOrderGrossAmountMinor > 0
                ? ` su ordini da ${formatPromotionMoney(
                    storefrontPromotion.minimumOrderGrossAmountMinor,
                    storefrontPromotion.currency,
                  )}`
                : ""}
              .
            </p>

            <div className="mt-6 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-5 py-4">
              <p className="text-xs font-semibold tracking-[0.15em] text-emerald-300 uppercase">
                Codice promozionale
              </p>

              <p className="mt-2 text-2xl font-bold tracking-[0.12em] text-emerald-300">
                {storefrontPromotion.code}
              </p>

              <button
                type="button"
                onClick={copyPromotionCode}
                className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:border-emerald-300/50 hover:bg-emerald-400/15"
              >
                {copiedPromotionCode ? "Copiato!" : "Copia codice"}
              </button>

              <p
                aria-live="polite"
                className="mt-2 min-h-4 text-xs text-emerald-300"
              >
                {copiedPromotionCode ? "Codice copiato negli appunti." : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={closePromotionDialog}
              className="mt-6 min-h-11 w-full rounded-lg bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Continua lo shopping
            </button>
          </div>
        </div>
      ) : null}

      <header
        ref={headerRef}
        data-scrolled={isScrolled}
        className="site-header border-border-subtle bg-background/92 sticky top-0 z-[var(--z-header)] border-b"
      >
        <Container className="flex min-h-[4.5rem] flex-nowrap items-center justify-between gap-2 px-5 sm:px-6 xl:min-h-20 xl:px-5 2xl:gap-3 2xl:px-8">
          <Logo
            priority
            wordmarkClassName="hidden md:inline xl:text-lg 2xl:text-xl"
          />

          <nav
            aria-label="Navigazione principale"
            className="hidden min-w-0 flex-1 xl:block"
          >
            <ul className="flex flex-nowrap items-center justify-center gap-3 2xl:gap-5">
              {primaryNavigation.map((link) => (
                <li key={link.label} className="shrink-0 whitespace-nowrap">
                  {"menu" in link && link.menu ? (
                    <button
                      ref={catalogButtonRef}
                      type="button"
                      aria-expanded={megaMenuOpen}
                      aria-controls="catalog-mega-menu"
                      className="animated-underline flex min-h-11 items-center gap-1 py-3 text-xs font-semibold tracking-[0.08em] whitespace-nowrap uppercase 2xl:gap-1.5 2xl:tracking-[var(--letter-spacing-label)]"
                      onClick={() => setMegaMenuOpen((current) => !current)}
                      onKeyDown={(event) => {
                        if (event.key !== "ArrowDown") return;
                        event.preventDefault();
                        setMegaMenuOpen(true);
                        requestAnimationFrame(() => {
                          document
                            .querySelector<HTMLAnchorElement>(
                              "#catalog-mega-menu a",
                            )
                            ?.focus();
                        });
                      }}
                    >
                      {link.label}
                      <ChevronDownIcon
                        className={cn(
                          "size-4 transition-transform duration-[var(--motion-fast)]",
                          megaMenuOpen && "rotate-180",
                        )}
                      />
                    </button>
                  ) : (
                    <Link
                      className="animated-underline flex min-h-11 items-center py-3 text-xs font-semibold tracking-[0.08em] whitespace-nowrap uppercase 2xl:tracking-[var(--letter-spacing-label)]"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 flex-nowrap items-center gap-0.5">
            <IconButton
              aria-label="Cerca nel catalogo"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon />
            </IconButton>
            <IconButton
              aria-label="Apri wishlist"
              className="relative hidden sm:inline-flex"
              onClick={() => router.push("/preferiti")}
            >
              <HeartIcon />
              {wishlist.length > 0 ? (
                <span className="bg-accent absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full text-[0.6rem] font-bold text-black">
                  {wishlist.length}
                </span>
              ) : null}
            </IconButton>
            <IconButton
              aria-label="Apri area personale"
              className="hidden md:inline-flex"
              disabled={!accountHydrated}
              onClick={() =>
                router.push(
                  user ? accountRoutes.dashboard : accountRoutes.signIn,
                )
              }
            >
              <UserIcon />
            </IconButton>
            <IconButton
              aria-label="Apri carrello"
              onClick={() => setCartOpen(true)}
              className="relative"
            >
              <BagIcon />
              <span
                aria-hidden="true"
                className="bg-accent absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full text-[0.6rem] font-bold text-black"
              >
                {cart.itemCount}
              </span>
            </IconButton>
            <IconButton
              ref={mobileMenuButtonRef}
              aria-label="Apri menu"
              className="xl:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </div>
        </Container>

        {megaMenuOpen ? (
          <>
            <button
              type="button"
              aria-label="Chiudi menu catalogo"
              tabIndex={-1}
              className="fixed inset-0 top-[7rem] -z-10 cursor-default bg-black/45 backdrop-blur-[2px]"
              onClick={() => setMegaMenuOpen(false)}
            />
            <div
              id="catalog-mega-menu"
              className="border-border-subtle bg-background absolute inset-x-0 top-full border-y shadow-[var(--shadow-ambient)]"
            >
              <Container className="grid grid-cols-[1fr_17rem] gap-12 py-10">
                <div className="grid grid-cols-3 gap-x-10 gap-y-9">
                  {menuGroups.map((group) => (
                    <div key={group.title}>
                      <p className="text-text-strong font-serif text-lg">
                        {group.title}
                      </p>
                      <p className="text-text-muted mt-1.5 text-xs leading-relaxed">
                        {group.description}
                      </p>
                      <ul className="mt-4 grid gap-1">
                        {group.links.map((link) => (
                          <li key={`${link.href}-${link.label}`}>
                            <Link
                              href={link.href}
                              className="hover:text-accent-soft flex min-h-9 items-center text-sm transition-colors"
                              onClick={() => setMegaMenuOpen(false)}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <Link
                  href="/#distillati-rari"
                  className="mega-menu-feature image-hover group relative min-h-72 overflow-hidden border border-[var(--color-border-subtle)]"
                  onClick={() => setMegaMenuOpen(false)}
                >
                  <div className="absolute inset-0 bg-[url('/images/demo/rare-collection.webp')] bg-cover bg-center transition-transform duration-[var(--motion-editorial)] ease-[var(--ease-editorial)] group-hover:scale-[var(--image-zoom)]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-accent text-[0.65rem] font-semibold tracking-[var(--letter-spacing-label)] uppercase">
                      La collezione
                    </p>
                    <p className="text-text-strong mt-2 font-serif text-2xl">
                      Distillati rari
                    </p>
                    <p className="text-text-muted mt-2 text-sm">
                      Bottiglie scelte per carattere, storia e rarità.
                    </p>
                  </div>
                </Link>
              </Container>
            </div>
          </>
        ) : null}
      </header>

      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        featuredProducts={featuredSearchProducts}
        featuredBrands={featuredSearchBrands}
        featuredCategories={featuredSearchCategories}
      />
      <MobileNavigation
        accountReady={accountHydrated}
        menuGroups={menuGroups}
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        onSearch={() => {
          setMobileMenuOpen(false);
          requestAnimationFrame(() => setSearchOpen(true));
        }}
        onUtility={(panel) => {
          setMobileMenuOpen(false);
          if (panel === "wishlist") router.push("/preferiti");
          else
            router.push(user ? accountRoutes.dashboard : accountRoutes.signIn);
        }}
        triggerRef={mobileMenuButtonRef}
      />
    </>
  );
}
