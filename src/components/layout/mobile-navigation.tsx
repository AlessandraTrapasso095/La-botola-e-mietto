"use client";

import Link from "next/link";

import {
  ArrowRightIcon,
  CloseIcon,
  HeartIcon,
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
import {
  catalogMenuGroups,
  getCatalogMenuHref,
  primaryNavigation,
} from "@/config/catalog";

type MobileNavigationProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: () => void;
  onUtility: (panel: "wishlist" | "account") => void;
};

export function MobileNavigation({
  open,
  onOpenChange,
  onSearch,
  onUtility,
}: MobileNavigationProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showClose={false}
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
              {catalogMenuGroups.map((group) => (
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
                    {group.links.map((label) => (
                      <li key={label}>
                        <Link
                          href={getCatalogMenuHref(label)}
                          className="text-text-muted hover:text-accent-soft flex min-h-11 items-center text-sm"
                          onClick={() => onOpenChange(false)}
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>
        </div>

        <div className="border-border-subtle bg-surface grid grid-cols-2 border-t">
          <button
            type="button"
            className="border-border-subtle flex min-h-16 items-center justify-center gap-2 border-r text-xs font-semibold tracking-wide uppercase"
            onClick={() => onUtility("wishlist")}
          >
            <HeartIcon className="size-5" />
            Wishlist
          </button>
          <button
            type="button"
            className="flex min-h-16 items-center justify-center gap-2 text-xs font-semibold tracking-wide uppercase"
            onClick={() => onUtility("account")}
          >
            <UserIcon className="size-5" />
            Account
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
