import Link from "next/link";

import { BagIcon, MenuIcon, SearchIcon } from "@/components/icons";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { businessInfo } from "@/config/business";
import { primaryNavigation } from "@/config/catalog";
import { formatEuroMinor } from "@/lib/money";

export function SiteHeader() {
  return (
    <>
      <div className="border-border-subtle bg-surface border-b">
        <Container className="flex min-h-10 items-center justify-center text-center">
          <p className="text-text-muted text-xs tracking-wide">
            Spedizione gratuita in Italia sopra{" "}
            <span className="text-accent-soft font-semibold">
              {formatEuroMinor(businessInfo.freeShippingThresholdMinor)}
            </span>
          </p>
        </Container>
      </div>
      <header className="border-border-subtle bg-background/90 sticky top-0 z-[var(--z-header)] border-b backdrop-blur-xl">
        <Container className="flex min-h-18 items-center justify-between gap-4">
          <Logo priority wordmarkClassName="hidden sm:inline" />
          <nav aria-label="Navigazione principale" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {primaryNavigation.map((link) => (
                <li key={link.label}>
                  <Link
                    className="animated-underline min-h-11 py-3 text-sm font-semibold tracking-[var(--letter-spacing-label)] uppercase"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-1">
            <Link
              className="hover:text-accent flex size-12 items-center justify-center rounded-xs transition-colors focus-visible:shadow-[var(--focus-ring)]"
              href="/#selezione"
              aria-label="Vai alla selezione"
            >
              <SearchIcon />
            </Link>
            <button
              className="flex size-12 cursor-not-allowed items-center justify-center rounded-xs opacity-[var(--opacity-disabled)]"
              aria-label="Carrello non ancora disponibile"
              disabled
            >
              <BagIcon />
            </button>
            <details className="group relative lg:hidden">
              <summary className="hover:text-accent flex size-12 cursor-pointer list-none items-center justify-center rounded-xs transition-colors focus-visible:shadow-[var(--focus-ring)] [&::-webkit-details-marker]:hidden">
                <span className="sr-only">Apri menu</span>
                <MenuIcon />
              </summary>
              <nav
                aria-label="Navigazione mobile"
                className="border-border-subtle bg-surface absolute top-[calc(100%+0.5rem)] right-0 w-[min(19rem,calc(100vw-2rem))] border p-3 shadow-[var(--shadow-ambient)]"
              >
                <ul>
                  {primaryNavigation.map((link) => (
                    <li key={link.label}>
                      <Link
                        className="hover:bg-surface-elevated hover:text-accent flex min-h-12 items-center border-b border-[var(--color-border-subtle)] px-4 text-sm font-semibold tracking-wide uppercase transition-colors"
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </details>
          </div>
        </Container>
      </header>
    </>
  );
}
