import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Logo } from "@/components/ui/logo";
import { businessAddressLine, businessInfo } from "@/config/business";

const legalLinks = [
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Cookie policy", href: "/cookie-policy" },
  { label: "Termini e condizioni", href: "/termini-e-condizioni" },
  { label: "Spedizioni e resi", href: "/spedizioni-e-resi" },
  { label: "Contatti", href: "/contatti" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-border-subtle border-t bg-[#0e0e0e]">
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.3fr_0.7fr_1fr] lg:gap-16 lg:py-24">
        <div>
          <Logo />
          <p className="text-text-muted mt-5 max-w-md">
            Selezioni di distillati, vini ed etichette di pregio. Catalogo
            digitale in preparazione.
          </p>
          <a
            className="animated-underline text-accent-soft mt-5 inline-flex min-h-11 items-center"
            href="https://www.instagram.com/labotolaemietto/"
            rel="noreferrer"
            target="_blank"
          >
            Instagram
          </a>
        </div>
        <nav aria-label="Informazioni">
          <h2 className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
            Informazioni
          </h2>
          <ul className="mt-5 grid gap-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  className="animated-underline inline-flex min-h-11 items-center text-sm"
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
            {businessInfo.legalName}
          </h2>
          <address className="text-text-muted mt-5 grid gap-2 text-sm not-italic">
            <span>{businessAddressLine}</span>
            <a
              className="animated-underline"
              href={`mailto:${businessInfo.email}`}
            >
              {businessInfo.email}
            </a>
            <a
              className="animated-underline"
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
      <Container className="text-text-muted flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {businessInfo.brandName}
        </p>
        <p>Vendita di alcolici riservata ai maggiori di 18 anni.</p>
      </Container>
    </footer>
  );
}
