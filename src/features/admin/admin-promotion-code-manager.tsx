"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { AdminConfirmDialog } from "@/features/admin/admin-confirm-dialog";
import {
  createAdminPromotionCode,
  type AdminPromotionCode,
  type AdminPromotionCodeDiscountType,
  setAdminPromotionCodeActive,
  updateAdminPromotionCode,
} from "@/server/admin/admin-promotion-codes";

type EditorMode =
  | {
      kind: "create";
    }
  | {
      kind: "edit";
      promotionCode: AdminPromotionCode;
    }
  | null;

type ActivationTarget = {
  promotionCode: AdminPromotionCode;
  nextActive: boolean;
} | null;

type PromotionFormState = {
  code: string;
  description: string;
  discountType: AdminPromotionCodeDiscountType;
  discountValue: string;
  minimumOrderEuro: string;
  startsAt: string;
  endsAt: string;
  usageLimit: string;
};

const emptyForm: PromotionFormState = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: "10",
  minimumOrderEuro: "",
  startsAt: "",
  endsAt: "",
  usageLimit: "",
};

function toDateTimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function moneyMinorToInput(value: number) {
  if (value === 0) {
    return "";
  }

  return (value / 100).toFixed(2).replace(".", ",");
}

function fixedMinorToInput(value: number) {
  return (value / 100).toFixed(2).replace(".", ",");
}

function parseEuroToMinor(value: string) {
  const normalized = value.trim().replace(",", ".");

  if (!normalized) {
    return 0;
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return Math.round(parsed * 100);
}

function formatMoney(amountMinor: number, currency = "EUR") {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
  }).format(amountMinor / 100);
}

function formFromPromotionCode(
  promotionCode: AdminPromotionCode,
): PromotionFormState {
  return {
    code: promotionCode.code,
    description: promotionCode.description ?? "",
    discountType: promotionCode.discountType,
    discountValue:
      promotionCode.discountType === "percentage"
        ? String(promotionCode.discountValue)
        : fixedMinorToInput(promotionCode.discountValue),
    minimumOrderEuro: moneyMinorToInput(
      promotionCode.minimumOrderGrossAmountMinor,
    ),
    startsAt: toDateTimeLocal(promotionCode.startsAt),
    endsAt: toDateTimeLocal(promotionCode.endsAt),
    usageLimit:
      promotionCode.usageLimit === null ? "" : String(promotionCode.usageLimit),
  };
}

export function AdminPromotionCodeManager({
  promotionCodes,
}: {
  promotionCodes: AdminPromotionCode[];
}) {
  const router = useRouter();

  const [editorMode, setEditorMode] = useState<EditorMode>(null);
  const [form, setForm] = useState<PromotionFormState>(emptyForm);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [activationTarget, setActivationTarget] =
    useState<ActivationTarget>(null);
  const [isPending, startTransition] = useTransition();

  const editingPromotionCode =
    editorMode?.kind === "edit" ? editorMode.promotionCode : null;

  const parsed = useMemo(() => {
    const code = form.code.trim().toUpperCase();

    const discountRaw = form.discountValue.trim().replace(",", ".");
    const discountNumber = Number(discountRaw);

    const discountValue =
      form.discountType === "percentage"
        ? discountNumber
        : Math.round(discountNumber * 100);

    const minimumOrderGrossAmountMinor = parseEuroToMinor(
      form.minimumOrderEuro,
    );

    const usageLimit =
      form.usageLimit.trim() === "" ? null : Number(form.usageLimit.trim());

    return {
      code,
      description: form.description.trim() || null,
      discountType: form.discountType,
      discountValue,
      minimumOrderGrossAmountMinor,
      usageLimit,
      startsAt: form.startsAt || null,
      endsAt: form.endsAt || null,
    };
  }, [form]);

  function closeEditor() {
    if (isPending) {
      return;
    }

    setActivationTarget(null);
    setEditorMode(null);
    setForm(emptyForm);
    setValidationError(null);
    setActionError(null);
    setConfirmOpen(false);
  }

  function openCreate() {
    if (isPending) {
      return;
    }

    setEditorMode({ kind: "create" });
    setForm(emptyForm);
    setValidationError(null);
    setActionError(null);
    setConfirmOpen(false);
  }

  function openEdit(promotionCode: AdminPromotionCode) {
    if (isPending) {
      return;
    }

    setEditorMode({
      kind: "edit",
      promotionCode,
    });

    setForm(formFromPromotionCode(promotionCode));
    setValidationError(null);
    setActionError(null);
    setConfirmOpen(false);
  }

  function validateForm() {
    if (!/^[A-Z0-9_-]{3,32}$/.test(parsed.code)) {
      return "Il codice deve contenere da 3 a 32 caratteri: lettere, numeri, trattino o underscore.";
    }

    if (
      !Number.isSafeInteger(parsed.discountValue) ||
      parsed.discountValue <= 0
    ) {
      return form.discountType === "percentage"
        ? "Inserisci una percentuale di sconto valida."
        : "Inserisci un importo di sconto valido.";
    }

    if (form.discountType === "percentage" && parsed.discountValue > 90) {
      return "La percentuale di sconto deve essere compresa tra 1 e 90.";
    }

    if (parsed.minimumOrderGrossAmountMinor === null) {
      return "L’importo minimo ordine non è valido.";
    }

    if (
      parsed.usageLimit !== null &&
      (!Number.isSafeInteger(parsed.usageLimit) || parsed.usageLimit <= 0)
    ) {
      return "Il limite utilizzi deve essere un numero intero maggiore di zero.";
    }

    if (
      parsed.startsAt &&
      parsed.endsAt &&
      new Date(parsed.endsAt).getTime() <= new Date(parsed.startsAt).getTime()
    ) {
      return "La data di fine deve essere successiva alla data di inizio.";
    }

    return null;
  }

  function requestSave() {
    if (isPending) {
      return;
    }

    const error = validateForm();

    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    setActionError(null);
    setConfirmOpen(true);
  }

  function requestActivationChange(
    promotionCode: AdminPromotionCode,
    nextActive: boolean,
  ) {
    if (isPending) {
      return;
    }

    setActionError(null);
    setActivationTarget({
      promotionCode,
      nextActive,
    });
  }

  function confirmActivationChange() {
    if (!activationTarget || isPending) {
      return;
    }

    const { promotionCode, nextActive } = activationTarget;

    setActionError(null);

    startTransition(async () => {
      try {
        await setAdminPromotionCodeActive(promotionCode.id, nextActive);

        setActivationTarget(null);
        router.refresh();
      } catch (caught) {
        setActionError(
          caught instanceof Error
            ? caught.message
            : "Impossibile aggiornare lo stato del codice promozionale.",
        );
      }
    });
  }

  function confirmSave() {
    const error = validateForm();

    if (error || isPending) {
      setValidationError(error);
      setConfirmOpen(false);
      return;
    }

    const minimumOrderGrossAmountMinor = parsed.minimumOrderGrossAmountMinor;

    if (minimumOrderGrossAmountMinor === null) {
      return;
    }

    setActionError(null);

    startTransition(async () => {
      try {
        const input = {
          code: parsed.code,
          description: parsed.description,
          discountType: parsed.discountType,
          discountValue: parsed.discountValue,
          minimumOrderGrossAmountMinor,
          startsAt: parsed.startsAt,
          endsAt: parsed.endsAt,
          usageLimit: parsed.usageLimit,
          isActive: editingPromotionCode?.isActive ?? true,
        };

        if (editingPromotionCode) {
          await updateAdminPromotionCode(editingPromotionCode.id, input);
        } else {
          await createAdminPromotionCode(input);
        }

        setConfirmOpen(false);
        setEditorMode(null);
        setForm(emptyForm);
        router.refresh();
      } catch (caught) {
        setActionError(
          caught instanceof Error
            ? caught.message
            : "Impossibile salvare il codice promozionale.",
        );
      }
    });
  }

  return (
    <>
      <div className="flex min-w-0 flex-col gap-4 rounded-lg border border-white/10 bg-[#171717] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="text-sm font-semibold text-white">
            Gestione codici promozionali
          </p>

          <p className="mt-1 text-sm text-white/40">
            Crea nuovi codici oppure modifica le condizioni di quelli esistenti.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          disabled={isPending}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-orange-500 px-5 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-wait disabled:opacity-50 sm:w-auto"
        >
          Nuovo codice
        </button>
      </div>

      {promotionCodes.length > 0 ? (
        <div className="grid min-w-0 gap-3 lg:grid-cols-2">
          {promotionCodes.map((promotionCode) => (
            <div
              key={promotionCode.id}
              className="flex min-w-0 flex-col gap-3 rounded-md border border-white/10 bg-[#171717] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-semibold text-orange-300">
                    {promotionCode.code}
                  </span>

                  <span
                    className={[
                      "rounded-full px-2 py-0.5 text-xs font-semibold",
                      promotionCode.isActive
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-white/5 text-white/40",
                    ].join(" ")}
                  >
                    {promotionCode.isActive ? "Attivo" : "Disattivato"}
                  </span>
                </div>

                <p className="mt-1 truncate text-xs text-white/35">
                  {promotionCode.description || "Nessuna descrizione"}
                </p>
              </div>

              <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:shrink-0 sm:flex-wrap">
                <button
                  type="button"
                  onClick={() => openEdit(promotionCode)}
                  disabled={isPending}
                  className="inline-flex min-h-10 w-full items-center justify-center rounded-md border border-white/10 px-4 text-sm font-medium text-white/70 transition hover:border-orange-400/30 hover:text-white disabled:opacity-50 sm:w-auto"
                >
                  Modifica
                </button>

                <button
                  type="button"
                  onClick={() =>
                    requestActivationChange(
                      promotionCode,
                      !promotionCode.isActive,
                    )
                  }
                  disabled={isPending}
                  className={[
                    "inline-flex min-h-10 w-full items-center justify-center rounded-md border px-4 text-sm font-semibold transition disabled:opacity-50 sm:w-auto",
                    promotionCode.isActive
                      ? "border-red-400/20 bg-red-400/10 text-red-300 hover:bg-red-400/15"
                      : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/15",
                  ].join(" ")}
                >
                  {promotionCode.isActive ? "Disattiva" : "Attiva"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {editorMode ? (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-black/75 p-2 backdrop-blur-sm sm:p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isPending) {
              closeEditor();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="promotion-code-editor-title"
            className="my-auto max-h-[calc(100dvh-1rem)] w-full max-w-3xl overflow-y-auto rounded-xl border border-white/10 bg-[#171717] p-4 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-orange-400 uppercase">
                  Codice promozionale
                </p>

                <h2
                  id="promotion-code-editor-title"
                  className="mt-2 text-2xl font-semibold text-white"
                >
                  {editingPromotionCode
                    ? `Modifica ${editingPromotionCode.code}`
                    : "Nuovo codice"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeEditor}
                disabled={isPending}
                aria-label="Chiudi"
                className="flex size-9 items-center justify-center rounded-full border border-white/10 text-lg text-white/50 transition hover:border-white/20 hover:text-white disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid min-w-0 gap-4 md:grid-cols-2 md:gap-5">
              <label className="space-y-2">
                <span className="text-xs font-medium text-white/50">
                  Codice
                </span>

                <input
                  type="text"
                  value={form.code}
                  maxLength={32}
                  autoComplete="off"
                  placeholder="ES. BENVENUTO10"
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      code: event.target.value.toUpperCase(),
                    }));
                    setValidationError(null);
                  }}
                  className="h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 font-mono text-sm text-white uppercase outline-none placeholder:text-white/25 focus:border-orange-400/60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-medium text-white/50">
                  Tipo sconto
                </span>

                <select
                  value={form.discountType}
                  onChange={(event) => {
                    const discountType = event.target
                      .value as AdminPromotionCodeDiscountType;

                    setForm((current) => ({
                      ...current,
                      discountType,
                      discountValue:
                        discountType === "percentage" ? "10" : "10,00",
                    }));

                    setValidationError(null);
                  }}
                  className="h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none focus:border-orange-400/60"
                >
                  <option value="percentage">Percentuale</option>
                  <option value="fixed">Importo fisso</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-xs font-medium text-white/50">
                  {form.discountType === "percentage"
                    ? "Percentuale"
                    : "Importo sconto"}
                </span>

                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={form.discountValue}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        discountValue: event.target.value,
                      }));
                      setValidationError(null);
                    }}
                    className="h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 pr-12 text-sm text-white outline-none focus:border-orange-400/60"
                  />

                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-white/35">
                    {form.discountType === "percentage" ? "%" : "€"}
                  </span>
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-xs font-medium text-white/50">
                  Ordine minimo
                </span>

                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={form.minimumOrderEuro}
                    placeholder="Nessun minimo"
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        minimumOrderEuro: event.target.value,
                      }));
                      setValidationError(null);
                    }}
                    className="h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 pr-10 text-sm text-white outline-none placeholder:text-white/25 focus:border-orange-400/60"
                  />

                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-white/35">
                    €
                  </span>
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-xs font-medium text-white/50">
                  Valido dal
                </span>

                <input
                  type="datetime-local"
                  value={form.startsAt}
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      startsAt: event.target.value,
                    }));
                    setValidationError(null);
                  }}
                  className="h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none focus:border-orange-400/60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-medium text-white/50">
                  Valido fino al
                </span>

                <input
                  type="datetime-local"
                  value={form.endsAt}
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      endsAt: event.target.value,
                    }));
                    setValidationError(null);
                  }}
                  className="h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none focus:border-orange-400/60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-medium text-white/50">
                  Limite utilizzi
                </span>

                <input
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  value={form.usageLimit}
                  placeholder="Illimitato"
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      usageLimit: event.target.value,
                    }));
                    setValidationError(null);
                  }}
                  className="h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-orange-400/60"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-xs font-medium text-white/50">
                  Descrizione interna
                </span>

                <textarea
                  value={form.description}
                  rows={3}
                  placeholder="Es. Campagna newsletter settembre"
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }));
                    setValidationError(null);
                  }}
                  className="w-full resize-y rounded-md border border-white/10 bg-[#111111] px-3 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-orange-400/60"
                />
              </label>
            </div>

            <div className="mt-6 rounded-md border border-white/10 bg-[#111111] p-4">
              <p className="text-xs font-medium text-white/40">Anteprima</p>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="font-mono font-semibold text-white">
                  {parsed.code || "CODICE"}
                </span>

                <span className="rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-300">
                  {form.discountType === "percentage"
                    ? `${Number.isFinite(parsed.discountValue) ? parsed.discountValue : 0}%`
                    : formatMoney(
                        Number.isFinite(parsed.discountValue)
                          ? parsed.discountValue
                          : 0,
                      )}
                </span>

                {parsed.minimumOrderGrossAmountMinor !== null &&
                parsed.minimumOrderGrossAmountMinor > 0 ? (
                  <span className="text-xs text-white/40">
                    Minimo {formatMoney(parsed.minimumOrderGrossAmountMinor)}
                  </span>
                ) : null}
              </div>
            </div>

            {validationError ? (
              <p
                role="alert"
                className="mt-5 rounded-md border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300"
              >
                {validationError}
              </p>
            ) : null}

            {actionError ? (
              <p
                role="alert"
                className="mt-5 rounded-md border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300"
              >
                {actionError}
              </p>
            ) : null}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeEditor}
                disabled={isPending}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-white/15 px-5 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white disabled:opacity-50 sm:w-auto"
              >
                Annulla
              </button>

              <button
                type="button"
                onClick={requestSave}
                disabled={isPending}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-orange-500 px-5 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-wait disabled:opacity-50 sm:w-auto"
              >
                {editingPromotionCode ? "Salva modifiche" : "Crea codice"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <AdminConfirmDialog
        open={activationTarget !== null}
        eyebrow={
          activationTarget?.nextActive ? "Attiva codice" : "Disattiva codice"
        }
        title={
          activationTarget
            ? `${
                activationTarget.nextActive ? "Attivare" : "Disattivare"
              } ${activationTarget.promotionCode.code}?`
            : "Aggiorna codice"
        }
        description={
          activationTarget?.nextActive
            ? "Il codice tornerà utilizzabile al checkout, purché rispetti date, importo minimo e limite utilizzi configurati."
            : "Il codice non sarà più accettato nei nuovi checkout. Gli ordini e lo storico degli utilizzi resteranno invariati."
        }
        confirmLabel={
          activationTarget?.nextActive ? "Attiva codice" : "Disattiva codice"
        }
        pendingLabel="Aggiornamento…"
        pending={isPending}
        error={actionError}
        tone={activationTarget?.nextActive ? "success" : "danger"}
        onConfirm={confirmActivationChange}
        onCancel={() => {
          if (!isPending) {
            setActivationTarget(null);
            setActionError(null);
          }
        }}
      />

      <AdminConfirmDialog
        open={confirmOpen}
        eyebrow={editingPromotionCode ? "Aggiorna codice" : "Nuovo codice"}
        title={
          editingPromotionCode
            ? `Salvare le modifiche a ${parsed.code}?`
            : `Creare il codice ${parsed.code}?`
        }
        description={
          editingPromotionCode
            ? "Le nuove condizioni verranno utilizzate per le successive validazioni del codice al checkout."
            : "Il codice sarà immediatamente disponibile al checkout se non hai impostato una data di inizio futura."
        }
        confirmLabel={editingPromotionCode ? "Salva modifiche" : "Crea codice"}
        pendingLabel="Salvataggio…"
        pending={isPending}
        error={actionError}
        onConfirm={confirmSave}
        onCancel={() => {
          if (!isPending) {
            setConfirmOpen(false);
            setActionError(null);
          }
        }}
      />
    </>
  );
}
