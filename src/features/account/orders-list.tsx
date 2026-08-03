import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import type { AccountOrder } from "@/content/account/account-data";

export function OrdersList({ orders }: { orders: readonly AccountOrder[] }) {
  if (orders.length === 0) {
    return (
      <div className="border-border-subtle border px-6 py-20 text-center">
        <Heading as="h1">Nessun ordine</Heading>
        <p className="text-text-muted mt-4">
          Le tue prossime selezioni compariranno qui.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
        Le tue selezioni
      </p>
      <Heading as="h1" size="xl" className="mt-4">
        Ordini
      </Heading>
      <p className="text-text-muted mt-4">
        Consulta lo stato e il riepilogo delle tue richieste più recenti.
      </p>
      <div className="mt-10 grid gap-4">
        {orders.map((order) => (
          <article
            key={order.id}
            className="border-border-subtle bg-surface border p-5 sm:p-7"
          >
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="text-text-muted text-xs tracking-wide uppercase">
                  Ordine
                </p>
                <h2 className="text-text-strong mt-1 font-serif text-xl">
                  {order.id}
                </h2>
                <time
                  dateTime={order.date}
                  className="text-text-muted mt-2 block text-sm"
                >
                  {order.dateLabel}
                </time>
              </div>
              <Badge className="capitalize">{order.status}</Badge>
            </div>
            <dl className="border-border-subtle mt-6 grid grid-cols-2 gap-5 border-t pt-5 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-text-muted">Articoli</dt>
                <dd className="text-text-strong mt-1">{order.itemCount}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Totale</dt>
                <dd className="text-text-strong mt-1">{order.total}</dd>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <details>
                  <summary className="text-accent-soft flex min-h-11 cursor-pointer items-center">
                    Vedi dettagli
                  </summary>
                  <ul className="mt-2 grid gap-2">
                    {order.products.map((product) => (
                      <li key={product.name} className="text-text-muted">
                        {product.quantity} × {product.name}
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
