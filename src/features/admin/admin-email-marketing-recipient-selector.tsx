"use client";

import { useMemo, useState } from "react";

import type { AdminMarketingRecipient } from "@/server/admin/admin-email-marketing";

export type AdminMarketingAudienceSelection =
  | {
      mode: "all";
      profileIds: [];
    }
  | {
      mode: "selected";
      profileIds: string[];
    };

type Props = {
  recipients: AdminMarketingRecipient[];
  onChange?: (selection: AdminMarketingAudienceSelection) => void;
};

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("it-IT");
}

export function AdminEmailMarketingRecipientSelector({
  recipients,
  onChange,
}: Props) {
  const [mode, setMode] = useState<"all" | "selected">("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const filteredRecipients = useMemo(() => {
    const query = normalize(search);

    if (!query) {
      return recipients;
    }

    return recipients.filter((recipient) => {
      const searchable = [
        recipient.firstName,
        recipient.lastName,
        recipient.email,
        recipient.phone ?? "",
      ]
        .join(" ")
        .toLocaleLowerCase("it-IT");

      return searchable.includes(query);
    });
  }, [recipients, search]);

  const eligibleRecipients = recipients.filter(
    (recipient) => recipient.marketingConsent,
  );

  const filteredEligibleRecipients = filteredRecipients.filter(
    (recipient) => recipient.marketingConsent,
  );

  const filteredSelectedCount = filteredEligibleRecipients.filter((recipient) =>
    selectedIds.has(recipient.id),
  ).length;

  const allFilteredSelected =
    filteredEligibleRecipients.length > 0 &&
    filteredSelectedCount === filteredEligibleRecipients.length;

  function emit(nextMode: "all" | "selected", nextIds: Set<string>) {
    if (nextMode === "all") {
      onChange?.({
        mode: "all",
        profileIds: [],
      });

      return;
    }

    onChange?.({
      mode: "selected",
      profileIds: [...nextIds],
    });
  }

  function changeMode(nextMode: "all" | "selected") {
    setMode(nextMode);
    emit(nextMode, selectedIds);
  }

  function toggleRecipient(profileId: string) {
    const recipient = recipients.find(
      (candidate) => candidate.id === profileId,
    );

    if (!recipient?.marketingConsent) {
      return;
    }

    const next = new Set(selectedIds);

    if (next.has(profileId)) {
      next.delete(profileId);
    } else {
      next.add(profileId);
    }

    setSelectedIds(next);
    emit("selected", next);
  }

  function toggleAllFiltered() {
    const next = new Set(selectedIds);

    if (allFilteredSelected) {
      for (const recipient of filteredEligibleRecipients) {
        next.delete(recipient.id);
      }
    } else {
      for (const recipient of filteredEligibleRecipients) {
        next.add(recipient.id);
      }
    }

    setSelectedIds(next);
    emit("selected", next);
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-[#171717]">
      <div className="border-b border-white/10 p-5 sm:p-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-orange-400 uppercase">
            Destinatari
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            A chi vuoi inviare l’email?
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/45">
            Sono disponibili esclusivamente i clienti che hanno fornito il
            consenso alle comunicazioni promozionali.
          </p>
        </div>

        <div className="mt-6 grid min-w-0 gap-3 lg:grid-cols-2">
          <button
            type="button"
            onClick={() => changeMode("all")}
            className={[
              "min-w-0 rounded-lg border p-4 text-left transition",
              mode === "all"
                ? "border-orange-400/40 bg-orange-500/10"
                : "border-white/10 bg-[#111111] hover:border-white/20",
            ].join(" ")}
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={[
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                  mode === "all"
                    ? "border-orange-400 bg-orange-400"
                    : "border-white/30",
                ].join(" ")}
              >
                {mode === "all" ? (
                  <span className="size-2 rounded-full bg-black" />
                ) : null}
              </span>

              <div>
                <p className="font-semibold text-white">
                  Tutti gli utenti idonei
                </p>

                <p className="mt-1 text-sm text-white/40">
                  Invia a tutti i{" "}
                  {eligibleRecipients.length.toLocaleString("it-IT")} clienti
                  con consenso marketing.
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => changeMode("selected")}
            className={[
              "min-w-0 rounded-lg border p-4 text-left transition",
              mode === "selected"
                ? "border-orange-400/40 bg-orange-500/10"
                : "border-white/10 bg-[#111111] hover:border-white/20",
            ].join(" ")}
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={[
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                  mode === "selected"
                    ? "border-orange-400 bg-orange-400"
                    : "border-white/30",
                ].join(" ")}
              >
                {mode === "selected" ? (
                  <span className="size-2 rounded-full bg-black" />
                ) : null}
              </span>

              <div>
                <p className="font-semibold text-white">
                  Seleziona manualmente
                </p>

                <p className="mt-1 text-sm text-white/40">
                  Scegli uno o più utenti dalla lista.
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {mode === "selected" ? (
        <>
          <div className="border-b border-white/10 p-5 sm:p-6">
            <label className="block">
              <span className="text-xs font-medium text-white/50">
                Cerca utenti
              </span>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nome, cognome, email o telefono..."
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-orange-400/60"
              />
            </label>

            <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-white/45">
                {filteredRecipients.length.toLocaleString("it-IT")} risultati ·{" "}
                <span className="font-semibold text-white/75">
                  {selectedIds.size.toLocaleString("it-IT")} selezionati
                </span>
              </p>

              {selectedIds.size > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    const next = new Set<string>();
                    setSelectedIds(next);
                    emit("selected", next);
                  }}
                  className="text-left text-sm font-medium text-orange-300 transition hover:text-orange-200"
                >
                  Deseleziona tutti
                </button>
              ) : null}
            </div>
          </div>

          <>
            <div className="border-b border-white/10 px-4 py-3 lg:hidden">
              <label className="flex min-w-0 items-center gap-3 text-sm text-white/60">
                <input
                  type="checkbox"
                  aria-label="Seleziona tutti i risultati idonei"
                  checked={allFilteredSelected}
                  disabled={filteredEligibleRecipients.length === 0}
                  onChange={toggleAllFiltered}
                  className="size-4 shrink-0 accent-orange-500"
                />

                <span className="min-w-0 break-words">
                  Seleziona tutti i risultati idonei
                </span>
              </label>
            </div>

            <div className="divide-y divide-white/10 lg:hidden">
              {filteredRecipients.length === 0 ? (
                <div className="px-5 py-12 text-center text-sm text-white/40">
                  Nessun utente corrisponde alla ricerca.
                </div>
              ) : (
                filteredRecipients.map((recipient) => {
                  const checked = selectedIds.has(recipient.id);
                  const eligible = recipient.marketingConsent;

                  return (
                    <article
                      key={recipient.id}
                      className={[
                        "min-w-0 p-4 sm:p-5",
                        checked ? "bg-orange-500/[0.06]" : "",
                      ].join(" ")}
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <input
                          type="checkbox"
                          aria-label={`Seleziona ${recipient.firstName} ${recipient.lastName}`}
                          checked={checked}
                          disabled={!eligible}
                          onChange={() => toggleRecipient(recipient.id)}
                          className="mt-1 size-4 shrink-0 accent-orange-500 disabled:cursor-not-allowed disabled:opacity-35"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <p className="font-medium break-words text-white">
                              {[recipient.firstName, recipient.lastName]
                                .filter(Boolean)
                                .join(" ") || "Cliente"}
                            </p>

                            {eligible ? (
                              <span className="inline-flex w-fit shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                                Consenso attivo
                              </span>
                            ) : (
                              <span className="inline-flex w-fit shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-semibold text-white/40">
                                Consenso assente
                              </span>
                            )}
                          </div>

                          <dl className="mt-3 grid min-w-0 gap-2 sm:grid-cols-2">
                            <div className="min-w-0">
                              <dt className="text-[11px] text-white/30">
                                Email
                              </dt>
                              <dd className="mt-1 text-sm break-all text-white/65">
                                {recipient.email}
                              </dd>
                            </div>

                            <div className="min-w-0">
                              <dt className="text-[11px] text-white/30">
                                Telefono
                              </dt>
                              <dd className="mt-1 text-sm break-words text-white/55">
                                {recipient.phone || "—"}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            <div className="hidden lg:block">
              <table className="w-full divide-y divide-white/10 text-sm">
                <thead className="bg-white/[0.03]">
                  <tr className="text-left text-xs font-semibold tracking-wide text-white/40 uppercase">
                    <th className="w-14 px-5 py-4">
                      <input
                        type="checkbox"
                        aria-label="Seleziona tutti i risultati idonei"
                        checked={allFilteredSelected}
                        disabled={filteredEligibleRecipients.length === 0}
                        onChange={toggleAllFiltered}
                        className="size-4 accent-orange-500"
                      />
                    </th>
                    <th className="px-5 py-4">Cliente</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Telefono</th>
                    <th className="px-5 py-4">Marketing</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {filteredRecipients.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-14 text-center text-white/40"
                      >
                        Nessun utente corrisponde alla ricerca.
                      </td>
                    </tr>
                  ) : (
                    filteredRecipients.map((recipient) => {
                      const checked = selectedIds.has(recipient.id);
                      const eligible = recipient.marketingConsent;

                      return (
                        <tr
                          key={recipient.id}
                          className={[
                            "transition",
                            checked
                              ? "bg-orange-500/[0.06]"
                              : "hover:bg-white/[0.025]",
                          ].join(" ")}
                        >
                          <td className="px-5 py-4">
                            <input
                              type="checkbox"
                              aria-label={`Seleziona ${recipient.firstName} ${recipient.lastName}`}
                              checked={checked}
                              disabled={!eligible}
                              onChange={() => toggleRecipient(recipient.id)}
                              className="size-4 accent-orange-500 disabled:cursor-not-allowed disabled:opacity-35"
                            />
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-medium text-white">
                              {[recipient.firstName, recipient.lastName]
                                .filter(Boolean)
                                .join(" ") || "Cliente"}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-white/65">
                            {recipient.email}
                          </td>

                          <td className="px-5 py-4 text-white/55">
                            {recipient.phone || "—"}
                          </td>

                          <td className="px-5 py-4">
                            {eligible ? (
                              <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                                Consenso attivo
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-semibold text-white/40">
                                Consenso assente
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        </>
      ) : (
        <div className="px-5 py-5 text-sm text-white/45 sm:px-6">
          La campagna verrà inviata a{" "}
          <span className="font-semibold text-white/75">
            tutti i {eligibleRecipients.length.toLocaleString("it-IT")} utenti
            idonei
          </span>
          .
        </div>
      )}
    </section>
  );
}
