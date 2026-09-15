"use client";

import Link from "next/link";

import { Heading } from "@/components/ui/heading";
import type { CatalogProductSummaryView } from "@/content/catalog/types";
import type {
  AccountAddress,
  AccountOrder,
} from "@/content/account/account-data";
import { useAccount } from "@/features/account/account-provider";
import { ProductCard } from "@/features/catalog/product-card";
import { useCommerce } from "@/features/commerce/commerce-provider";

export function AccountDashboard({
  addresses,
  offerProducts,
  orders,
}: {
  addresses: readonly AccountAddress[];
  offerProducts: readonly CatalogProductSummaryView[];
  orders: readonly AccountOrder[];
}) {
  const { user } = useAccount();
  const { wishlist } = useCommerce();
  const primaryAddress = addresses.find((address) => address.isDefaultShipping);

  if (!user) return null;

  return (
    <div className="max-w-full min-w-0">
      <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
        Bentornata
      </p>
      <Heading as="h1" size="xl" className="mt-4">
        Ciao, {user.firstName}.
      </Heading>
      <p className="text-text-muted mt-4 max-w-2xl break-words">
        Qui trovi le tue selezioni, gli aggiornamenti più recenti e gli accessi
        rapidi al profilo.
      </p>

      <div className="mt-8 grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 xl:mt-10 xl:grid-cols-4 xl:gap-4">
        <SummaryCard
          label="Ordini recenti"
          value={String(orders.length)}
          href="/account/ordini"
        />
        <SummaryCard
          label="Preferiti"
          value={String(wishlist.length)}
          href="/account/preferiti"
        />
        <SummaryCard
          label="Offerte disponibili"
          value={String(offerProducts.length)}
          href="/account/offerte"
        />
        <SummaryCard label="Profilo" value="Aggiorna" href="/account/profilo" />
      </div>

      <div className="mt-12 grid min-w-0 gap-5 xl:mt-14 xl:grid-cols-2 xl:gap-8">
        <section className="border-border-subtle min-w-0 overflow-hidden border p-4 sm:p-8">
          {orders[0] ? (
            <>
              <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                <div>
                  <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
                    Ultimo ordine
                  </p>
                  <h2 className="text-text-strong mt-3 font-serif text-2xl">
                    {orders[0].id}
                  </h2>
                </div>
                <Link
                  href="/account/ordini"
                  className="animated-underline text-accent-soft min-h-11 text-sm"
                >
                  Tutti gli ordini
                </Link>
              </div>
              <dl className="border-border-subtle mt-6 grid min-w-0 grid-cols-1 gap-4 border-t pt-6 text-sm sm:grid-cols-2 sm:gap-5">
                <div>
                  <dt className="text-text-muted">Data</dt>
                  <dd className="text-text-strong mt-1">
                    {orders[0].dateLabel}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-muted">Stato</dt>
                  <dd className="text-accent-soft mt-1 capitalize">
                    {orders[0].status}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-muted">Articoli</dt>
                  <dd className="text-text-strong mt-1">
                    {orders[0].itemCount}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-muted">Totale</dt>
                  <dd className="text-text-strong mt-1">{orders[0].total}</dd>
                </div>
              </dl>
            </>
          ) : (
            <>
              <h2 className="text-text-strong font-serif text-2xl">
                Nessun ordine
              </h2>
              <p className="text-text-muted mt-4 text-sm">
                Le tue prossime selezioni compariranno qui.
              </p>
            </>
          )}
        </section>
        <section className="border-border-subtle min-w-0 overflow-hidden border p-4 sm:p-8">
          <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
            Indirizzo principale
          </p>
          <h2 className="text-text-strong mt-3 font-serif text-2xl">
            {primaryAddress?.label ?? "Nessun indirizzo"}
          </h2>
          {primaryAddress ? (
            <address className="text-text-muted mt-5 max-w-full text-sm leading-relaxed [overflow-wrap:anywhere] break-words not-italic">
              {primaryAddress.firstName} {primaryAddress.lastName}
              <br />
              {primaryAddress.street} {primaryAddress.streetNumber}
              <br />
              {primaryAddress.postalCode} {primaryAddress.city} (
              {primaryAddress.province})
            </address>
          ) : (
            <p className="text-text-muted mt-5 text-sm">
              Non hai ancora salvato un indirizzo.
            </p>
          )}
          <Link
            href="/account/indirizzi"
            className="animated-underline text-accent-soft mt-5 inline-flex min-h-11 items-center text-sm"
          >
            Gestisci indirizzi
          </Link>
        </section>
      </div>

      {offerProducts.length > 0 ? (
        <section className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
                Occasioni selezionate
              </p>
              <Heading as="h2" className="mt-3">
                Offerte da scoprire
              </Heading>
            </div>
            <Link
              href="/account/offerte"
              className="animated-underline text-accent-soft min-h-11 text-sm"
            >
              Vedi tutte
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
            {offerProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="border-border-subtle hover:border-accent bg-surface group min-w-0 overflow-hidden border p-4 transition-colors sm:p-5"
    >
      <span className="text-text-muted block text-xs tracking-wide break-words uppercase">
        {label}
      </span>
      <span className="text-text-strong group-hover:text-accent-soft mt-3 block max-w-full font-serif text-2xl break-words transition-colors">
        {value}
      </span>
    </Link>
  );
}
