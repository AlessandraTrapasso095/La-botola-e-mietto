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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Logo } from "@/components/ui/logo";
import {
  catalogMenuGroups,
  getCatalogMenuHref,
  primaryNavigation,
} from "@/config/catalog";
import { useCommerce } from "@/features/commerce/commerce-provider";
import { SearchDialog } from "@/features/search/search-dialog";
import { cn } from "@/lib/cn";

type UtilityPanel = "account" | null;

type SiteHeaderClientProps = {
  freeShippingThreshold: string;
};

const utilityMessages = {
  account: {
    title: "Area personale",
    description:
      "Uno spazio riservato per ritrovare ordini, indirizzi e preferenze.",
  },
} as const;

export function SiteHeaderClient({
  freeShippingThreshold,
}: SiteHeaderClientProps) {
  const router = useRouter();
  const { cart, setCartOpen, wishlist } = useCommerce();
  const [isScrolled, setIsScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [utilityPanel, setUtilityPanel] = useState<UtilityPanel>(null);
  const headerRef = useRef<HTMLElement>(null);
  const catalogButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 24);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

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

  const utilityContent = utilityPanel ? utilityMessages[utilityPanel] : null;

  return (
    <>
      <div className="border-border-subtle bg-surface border-b">
        <Container className="flex min-h-10 items-center justify-center text-center">
          <p className="text-text-muted text-[0.6875rem] tracking-[0.08em] sm:text-xs">
            Spedizione gratuita in Italia sopra{" "}
            <span className="text-accent-soft font-semibold">
              {freeShippingThreshold}
            </span>
          </p>
        </Container>
      </div>

      <header
        ref={headerRef}
        data-scrolled={isScrolled}
        className="site-header border-border-subtle bg-background/92 sticky top-0 z-[var(--z-header)] border-b"
      >
        <Container className="flex min-h-[4.5rem] items-center justify-between gap-3 xl:min-h-20">
          <Logo
            priority
            wordmarkClassName="hidden min-[25rem]:inline xl:text-xl"
          />

          <nav aria-label="Navigazione principale" className="hidden xl:block">
            <ul className="flex items-center gap-7">
              {primaryNavigation.map((link) => (
                <li key={link.label}>
                  {"menu" in link && link.menu ? (
                    <button
                      ref={catalogButtonRef}
                      type="button"
                      aria-expanded={megaMenuOpen}
                      aria-controls="catalog-mega-menu"
                      className="animated-underline flex min-h-11 items-center gap-1.5 py-3 text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase"
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
                      className="animated-underline flex min-h-11 items-center py-3 text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-0.5">
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
                <span className="bg-accent text-accent-contrast absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full text-[0.6rem] font-bold">
                  {wishlist.length}
                </span>
              ) : null}
            </IconButton>
            <IconButton
              aria-label="Apri area personale"
              className="hidden md:inline-flex"
              onClick={() => setUtilityPanel("account")}
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
                className="bg-accent text-accent-contrast absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full text-[0.6rem] font-bold"
              >
                {cart.itemCount}
              </span>
            </IconButton>
            <IconButton
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
                  {catalogMenuGroups.map((group) => (
                    <div key={group.title}>
                      <p className="text-text-strong font-serif text-lg">
                        {group.title}
                      </p>
                      <p className="text-text-muted mt-1.5 text-xs leading-relaxed">
                        {group.description}
                      </p>
                      <ul className="mt-4 grid gap-1">
                        {group.links.map((label) => (
                          <li key={label}>
                            <Link
                              href={getCatalogMenuHref(label)}
                              className="hover:text-accent-soft flex min-h-9 items-center text-sm transition-colors"
                              onClick={() => setMegaMenuOpen(false)}
                            >
                              {label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <Link
                  href="/categoria/bottiglie-rare"
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

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <MobileNavigation
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        onSearch={() => {
          setMobileMenuOpen(false);
          setSearchOpen(true);
        }}
        onUtility={(panel) => {
          setMobileMenuOpen(false);
          if (panel === "wishlist") router.push("/preferiti");
          else setUtilityPanel("account");
        }}
      />

      <Dialog
        open={Boolean(utilityContent)}
        onOpenChange={(open) => {
          if (!open) setUtilityPanel(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogTitle>{utilityContent?.title}</DialogTitle>
          <DialogDescription className="mt-3">
            {utilityContent?.description}
          </DialogDescription>
          <Link
            href="/#nuovi-arrivi"
            className="animated-underline text-accent-soft mt-5 inline-flex min-h-11 items-center text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase"
            onClick={() => setUtilityPanel(null)}
          >
            Esplora la selezione
          </Link>
        </DialogContent>
      </Dialog>
    </>
  );
}
