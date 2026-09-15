"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { AdminLogoutButton } from "@/features/admin/admin-logout-button";

type Props = {
  firstName: string;
  lastName: string;
};

const navigationItems = [
  { label: "Dashboard", href: "/admin", exact: true },
  { label: "Ordini", href: "/admin/ordini" },
  {
    label: "Richieste annullamento",
    href: "/admin/richieste-annullamento",
  },
  { label: "Prodotti", href: "/admin/prodotti" },
  { label: "Catalogo", href: "/admin/catalogo" },
  { label: "Sconti", href: "/admin/sconti" },
  { label: "Email marketing", href: "/admin/email-marketing" },
  { label: "Clienti", href: "/admin/clienti" },
  { label: "Impostazioni", href: "/admin/impostazioni" },
] as const;

function isCurrentPath(
  pathname: string,
  item: (typeof navigationItems)[number],
) {
  if ("exact" in item && item.exact) {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function AdminMobileNavigation({ firstName, lastName }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function closeNavigation(restoreFocus = true) {
    setOpen(false);

    if (restoreFocus) {
      window.setTimeout(() => triggerRef.current?.focus(), 0);
    }
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeNavigation();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Apri menu amministrazione"
        aria-expanded={open}
        aria-controls="admin-mobile-navigation"
        onClick={() => setOpen(true)}
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white transition hover:bg-white/[0.07] lg:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[200] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigazione amministrazione"
        >
          <button
            type="button"
            aria-label="Chiudi menu amministrazione"
            onClick={() => closeNavigation()}
            className="absolute inset-0 z-0 bg-black/80"
          />

          <aside
            id="admin-mobile-navigation"
            className="absolute inset-y-0 left-0 z-10 flex h-[100dvh] w-full min-w-0 flex-col overflow-hidden bg-[#171717] text-white shadow-2xl sm:w-[360px] sm:max-w-[88vw] sm:border-r sm:border-white/10"
          >
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-5">
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold tracking-[0.18em] text-orange-400 uppercase">
                  La Botola e Mietto
                </p>

                <p className="mt-1 text-xl font-semibold text-white">Admin</p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Chiudi menu amministrazione"
                onClick={() => closeNavigation()}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.02] text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-4">
              <p className="mb-3 px-3 text-[11px] font-semibold tracking-[0.16em] text-white/30 uppercase">
                Navigazione
              </p>

              <nav className="flex flex-col gap-1">
                {navigationItems.map((item) => {
                  const active = isCurrentPath(pathname, item);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => closeNavigation(false)}
                      className={[
                        "flex min-h-12 w-full items-center rounded-md px-4 py-3 text-sm transition",
                        active
                          ? "border border-orange-400/20 bg-orange-500/10 font-semibold text-orange-300"
                          : "border border-transparent text-white/75 hover:bg-white/5 hover:text-white",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="shrink-0 border-t border-white/10 bg-[#171717] p-3 sm:p-4">
              <Link
                href="/admin/impostazioni"
                onClick={() => closeNavigation(false)}
                className="mb-3 block rounded-md border border-white/[0.08] bg-[#111111] p-3 transition hover:border-white/15"
              >
                <p className="truncate text-sm font-medium text-white/90">
                  {firstName} {lastName}
                </p>

                <p className="mt-1 truncate text-xs text-white/40">
                  Amministratore · Impostazioni
                </p>
              </Link>

              <AdminLogoutButton />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
