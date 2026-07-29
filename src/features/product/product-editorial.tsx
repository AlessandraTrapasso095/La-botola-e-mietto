import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import type { CatalogProductView } from "@/content/catalog/types";

export function ProductEditorial({ product }: { product: CatalogProductView }) {
  return (
    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
      <div>
        <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
          Panoramica
        </p>
        <Heading className="mt-4">Il carattere della bottiglia.</Heading>
        <p className="text-text mt-6 text-lg leading-relaxed">
          {product.overview}
        </p>
        <Divider className="my-9" />
        <h3 className="text-text-strong font-serif text-2xl">
          Note degustative
        </h3>
        <p className="text-text-muted mt-4 leading-relaxed">
          {product.tastingNotes}
        </p>
        <h3 className="text-text-strong mt-9 font-serif text-2xl">
          Consigli di servizio
        </h3>
        <p className="text-text-muted mt-4 leading-relaxed">
          {product.service}
        </p>
      </div>

      <div className="border-border-subtle bg-surface border p-6 sm:p-8">
        <h2 className="text-text-strong font-serif text-2xl">
          Caratteristiche
        </h2>
        <dl className="mt-6">
          {[
            ...product.characteristics,
            { label: "Produttore", value: product.producer },
          ].map((characteristic) => (
            <div
              key={characteristic.label}
              className="border-border-subtle grid grid-cols-[0.8fr_1.2fr] gap-4 border-b py-4 text-sm"
            >
              <dt className="text-text-muted">{characteristic.label}</dt>
              <dd className="text-text-strong">{characteristic.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8">
          <h3 className="text-text-strong font-serif text-xl">Abbinamenti</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {product.pairings.map((pairing) => (
              <li
                key={pairing}
                className="border-border-subtle text-text-muted border px-3 py-2 text-xs"
              >
                {pairing}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="lg:col-span-2">
        <details className="group border-border-subtle border-y">
          <summary className="text-text-strong flex min-h-16 cursor-pointer list-none items-center justify-between font-serif text-xl [&::-webkit-details-marker]:hidden">
            Origine e produzione
            <span className="text-accent text-2xl transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="text-text-muted max-w-3xl pb-6 leading-relaxed">
            {product.origin}
          </p>
        </details>
        <details className="group border-border-subtle border-b">
          <summary className="text-text-strong flex min-h-16 cursor-pointer list-none items-center justify-between font-serif text-xl [&::-webkit-details-marker]:hidden">
            Spedizione e resi
            <span className="text-accent text-2xl transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="text-text-muted max-w-3xl pb-6 leading-relaxed">
            Spedizione in Italia con imballaggio protettivo. Il reso è previsto
            entro 14 giorni per bottiglie integre e sigillate, secondo le
            condizioni applicabili.
          </p>
        </details>
      </div>
    </div>
  );
}
