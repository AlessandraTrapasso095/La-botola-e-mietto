import Link from "next/link";

import type { AdminProductInventoryMovement } from "@/server/admin/admin-products";

const fallbackMovementConfig = {
  label: "Regolazione manuale",
  className: "bg-orange-500/10 text-orange-300",
};

const movementConfig: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  admin_adjustment: fallbackMovementConfig,
  order_fulfilled: {
    label: "Ordine evaso",
    className: "bg-emerald-500/10 text-emerald-300",
  },
  reservation_reconciliation: {
    label: "Riconciliazione riservati",
    className: "bg-blue-500/10 text-blue-300",
  },
};

const dateFormatter = new Intl.DateTimeFormat("it-IT", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Rome",
});

function formatDelta(delta: number) {
  if (delta > 0) {
    return `+${delta}`;
  }

  if (delta < 0) {
    return `−${Math.abs(delta)}`;
  }

  return "0";
}

function deltaClass(delta: number) {
  if (delta > 0) {
    return "text-emerald-300";
  }

  if (delta < 0) {
    return "text-red-300";
  }

  return "text-white/40";
}

export function AdminProductInventoryHistory({
  movements,
}: {
  movements: AdminProductInventoryMovement[];
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#171717] p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">
            Storico magazzino
          </h2>

          <p className="mt-1 text-xs leading-5 text-white/35">
            Regolazioni manuali, riconciliazioni e scarichi degli ordini.
          </p>
        </div>

        <p className="text-xs text-white/30">Ultimi 25 movimenti</p>
      </div>

      {movements.length === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-white/10 px-4 py-8 text-center">
          <p className="text-sm text-white/40">
            Nessun movimento di magazzino registrato.
          </p>
        </div>
      ) : (
        <ol className="mt-6 space-y-4">
          {movements.map((movement) => {
            const config =
              movementConfig[movement.movementType] ?? fallbackMovementConfig;

            const availableBefore =
              movement.stockBefore - movement.reservedBefore;

            const availableAfter = movement.stockAfter - movement.reservedAfter;

            return (
              <li
                key={movement.id}
                className="rounded-lg border border-white/10 bg-[#111111] p-4 sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span
                    className={[
                      "w-fit rounded-full px-2.5 py-1 text-xs font-medium",
                      config.className,
                    ].join(" ")}
                  >
                    {config.label}
                  </span>

                  <time
                    dateTime={movement.createdAt}
                    className="text-xs text-white/35"
                  >
                    {dateFormatter.format(new Date(movement.createdAt))}
                  </time>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <MovementValue
                    label="Stock totale"
                    before={movement.stockBefore}
                    after={movement.stockAfter}
                    delta={movement.stockDelta}
                  />

                  <MovementValue
                    label="Riservati"
                    before={movement.reservedBefore}
                    after={movement.reservedAfter}
                    delta={movement.reservedDelta}
                  />

                  <MovementValue
                    label="Disponibili"
                    before={availableBefore}
                    after={availableAfter}
                    delta={availableAfter - availableBefore}
                  />
                </div>

                {movement.note ? (
                  <div className="mt-4 border-t border-white/5 pt-4">
                    <p className="text-xs text-white/35">Motivazione</p>

                    <p className="mt-1.5 text-sm leading-6 text-white/65">
                      {movement.note}
                    </p>
                  </div>
                ) : null}

                <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
                  <span>Autore: {movement.createdByName}</span>

                  {movement.orderNumber ? (
                    <Link
                      href={`/admin/ordini/${movement.orderNumber}`}
                      className="font-medium text-orange-300 transition hover:text-orange-200"
                    >
                      Ordine {movement.orderNumber} ↗
                    </Link>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

function MovementValue({
  label,
  before,
  after,
  delta,
}: {
  label: string;
  before: number;
  after: number;
  delta: number;
}) {
  return (
    <div className="rounded-md border border-white/10 px-3.5 py-3">
      <p className="text-xs text-white/35">{label}</p>

      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-white/75">
          {before} → {after}
        </span>

        <span
          className={["text-xs font-semibold", deltaClass(delta)].join(" ")}
        >
          {formatDelta(delta)}
        </span>
      </div>
    </div>
  );
}
