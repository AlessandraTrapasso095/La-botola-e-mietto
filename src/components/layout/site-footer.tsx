import Link from "next/link";

import { ArrowUpRightIcon, InstagramIcon } from "@/components/icons";
import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Logo } from "@/components/ui/logo";
import { businessAddressLine, businessInfo } from "@/config/business";

const catalogLinks = [
  { label: "Nuovi arrivi", href: "/#nuovi-arrivi" },
  { label: "Distillati rari", href: "/categoria/bottiglie-rare" },
  { label: "Catalogo", href: "/catalogo" },
  { label: "Marchi", href: "/marchi" },
  { label: "Preferiti", href: "/preferiti" },
] as const;

const serviceLinks = [
  { label: "Spedizioni e resi", href: "/spedizioni-e-resi" },
  { label: "Contatti", href: "/contatti" },
  { label: "Termini e condizioni", href: "/termini-e-condizioni" },
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Cookie policy", href: "/cookie-policy" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-border-subtle border-t bg-[#0e0e0e]">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.8fr_1fr] lg:gap-14 lg:py-24">
        <div>
          <Logo />
          <p className="text-text-muted mt-5 max-w-sm text-sm leading-relaxed">
            Distillati, etichette di pregio e bottiglie da collezione
            selezionati con esperienza e passione.
          </p>
          <a
            className="animated-underline text-accent-soft mt-6 inline-flex min-h-11 items-center gap-2 text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase"
            href="https://www.instagram.com/labotolaemietto/"
            rel="noreferrer"
            target="_blank"
          >
            <InstagramIcon className="size-5" />
            Instagram
            <ArrowUpRightIcon className="size-4" />
          </a>
        </div>

        <nav aria-label="Catalogo">
          <h2 className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
            Esplora
          </h2>
          <ul className="mt-5 grid gap-1">
            {catalogLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className="animated-underline inline-flex min-h-10 items-center text-sm"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Assistenza">
          <h2 className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
            Assistenza
          </h2>
          <ul className="mt-5 grid gap-1">
            {serviceLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className="animated-underline inline-flex min-h-10 items-center text-sm"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
            Boutique
          </h2>
          <address className="text-text-muted mt-5 grid gap-2 text-sm leading-relaxed not-italic">
            <span className="text-text-strong font-semibold">
              {businessInfo.legalName}
            </span>
            <span>{businessAddressLine}</span>
            <a
              className="animated-underline w-fit"
              href={`mailto:${businessInfo.email}`}
            >
              {businessInfo.email}
            </a>
            <a
              className="animated-underline w-fit"
              href={`tel:${businessInfo.phone.replace(/\s/g, "")}`}
            >
              {businessInfo.phone}
            </a>
            <span>Partita IVA {businessInfo.vatNumber}</span>
            <span>Codice fiscale {businessInfo.fiscalCode}</span>
          </address>
        </div>
      </Container>

      <Divider />
      <Container className="text-text-muted flex flex-col gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {businessInfo.brandName}. Tutti i
          diritti riservati.
        </p>
        <p>Vendita di alcolici riservata ai maggiori di 18 anni.</p>
      </Container>
    </footer>
  );
}
