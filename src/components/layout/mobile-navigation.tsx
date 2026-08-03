"use client";

import Link from "next/link";
import type { RefObject } from "react";

import {
  ArrowRightIcon,
  CloseIcon,
  HeartIcon,
  InstagramIcon,
  SearchIcon,
  UserIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Logo } from "@/components/ui/logo";
import { primaryNavigation, type CatalogMenuGroup } from "@/config/catalog";

type MobileNavigationProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: () => void;
  onUtility: (panel: "wishlist" | "account") => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  menuGroups: readonly CatalogMenuGroup[];
};

export function MobileNavigation({
  open,
  onOpenChange,
  onSearch,
  onUtility,
  triggerRef,
  menuGroups,
}: MobileNavigationProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showClose={false}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          triggerRef.current?.focus();
        }}
        className="bg-background inset-0 top-0 left-0 flex h-dvh max-h-none w-full max-w-none translate-x-0 translate-y-0 flex-col overflow-hidden rounded-none border-0 p-0"
      >
        <div className="border-border-subtle flex min-h-[4.5rem] items-center justify-between border-b px-5">
          <DialogTitle className="sr-only">Menu principale</DialogTitle>
          <DialogDescription className="sr-only">
            Esplora categorie, collezioni e servizi di La Botola e Mietto.
          </DialogDescription>
          <Logo wordmarkClassName="text-base" />
          <IconButton
            aria-label="Chiudi menu"
            onClick={() => onOpenChange(false)}
          >
            <CloseIcon />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <Button
            variant="secondary"
            fullWidth
            className="justify-between"
            onClick={onSearch}
          >
            Cerca nel catalogo
            <SearchIcon />
          </Button>

          <nav aria-label="Navigazione mobile" className="mt-7">
            <ul className="grid">
              {primaryNavigation
                .filter((link) => !("menu" in link && link.menu))
                .map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="border-border-subtle text-text-strong flex min-h-14 items-center justify-between border-b font-serif text-xl"
                      onClick={() => onOpenChange(false)}
                    >
                      {link.label}
                      <ArrowRightIcon className="text-accent size-5" />
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          <div className="mt-9">
            <p className="text-accent text-[0.65rem] font-semibold tracking-[var(--letter-spacing-label)] uppercase">
              Esplora il catalogo
            </p>
            <div className="mt-3 grid">
              {menuGroups.map((group) => (
                <details
                  key={group.title}
                  className="group border-border-subtle border-b"
                >
                  <summary className="text-text-strong flex min-h-14 cursor-pointer list-none items-center justify-between font-serif text-lg [&::-webkit-details-marker]:hidden">
                    {group.title}
                    <span
                      aria-hidden="true"
                      className="text-accent text-xl transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <ul className="grid gap-1 pb-5">
                    {group.links.map((link) => (
                      <li key={`${link.href}-${link.label}`}>
                        <Link
                          href={link.href}
                          className="text-text-muted hover:text-accent-soft flex min-h-11 items-center text-sm"
                          onClick={() => onOpenChange(false)}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>

          <nav aria-label="Informazioni" className="mt-9">
            <p className="text-accent text-[0.65rem] font-semibold tracking-[var(--letter-spacing-label)] uppercase">
              Boutique e assistenza
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-5">
              {[
                { label: "Chi siamo", href: "/chi-siamo" },
                { label: "Contatti", href: "/contatti" },
                { label: "Spedizioni e resi", href: "/spedizioni-e-resi" },
                { label: "Privacy", href: "/privacy-policy" },
                { label: "Cookie", href: "/cookie-policy" },
                { label: "Termini", href: "/termini-e-condizioni" },
              ].map((link) => (
                <li key={link.href} className="border-border-subtle border-b">
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-accent-soft flex min-h-12 items-center text-sm"
                    onClick={() => onOpenChange(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-9 grid gap-3">
            <a
              href="https://www.instagram.com/labotolaemietto/"
              target="_blank"
              rel="noreferrer"
              className="border-border-subtle hover:border-accent flex min-h-12 items-center justify-between border px-4 text-sm transition-colors"
            >
              Seguici su Instagram
              <InstagramIcon className="size-5" />
            </a>
            <button
              type="button"
              className="border-border-subtle hover:border-accent min-h-12 border px-4 text-left text-sm transition-colors"
              onClick={() => {
                onOpenChange(false);
                requestAnimationFrame(() =>
                  window.dispatchEvent(
                    new Event("lbm:open-cookie-preferences"),
                  ),
                );
              }}
            >
              Modifica preferenze cookie
            </button>
            <p className="text-text-muted border-border-subtle border-t pt-5 text-xs leading-relaxed">
              Vendita responsabile: l’accesso e l’acquisto di bevande alcoliche
              sono riservati ai maggiori di 18 anni.
            </p>
          </div>
        </div>

        <div className="border-border-subtle bg-surface grid grid-cols-2 border-t pb-[env(safe-area-inset-bottom)]">
          <button
            type="button"
            className="border-border-subtle flex min-h-16 items-center justify-center gap-2 border-r text-xs font-semibold tracking-wide uppercase"
            onClick={() => onUtility("wishlist")}
          >
            <HeartIcon className="size-5" />
            Preferiti
          </button>
          <button
            type="button"
            className="flex min-h-16 items-center justify-center gap-2 text-xs font-semibold tracking-wide uppercase"
            onClick={() => onUtility("account")}
          >
            <UserIcon className="size-5" />
            Area personale
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
