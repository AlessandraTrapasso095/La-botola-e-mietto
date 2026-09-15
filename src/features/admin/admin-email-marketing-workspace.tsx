"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { AdminConfirmDialog } from "@/features/admin/admin-confirm-dialog";

import {
  AdminEmailMarketingRecipientSelector,
  type AdminMarketingAudienceSelection,
} from "@/features/admin/admin-email-marketing-recipient-selector";
import {
  sendAdminMarketingCampaign,
  type AdminMarketingRecipient,
  type SendAdminMarketingCampaignResult,
} from "@/server/admin/admin-email-marketing";

type ComposerState = {
  subject: string;
  title: string;
  intro: string;
  content: string;
  ctaLabel: string;
  ctaHref: string;
};

const initialComposerState: ComposerState = {
  subject: "",
  title: "",
  intro: "",
  content: "",
  ctaLabel: "Scopri la selezione",
  ctaHref: "",
};

export function AdminEmailMarketingWorkspace({
  recipients,
}: {
  recipients: AdminMarketingRecipient[];
}) {
  const router = useRouter();
  const eligibleRecipients = useMemo(
    () => recipients.filter((recipient) => recipient.marketingConsent),
    [recipients],
  );

  const [audience, setAudience] = useState<AdminMarketingAudienceSelection>({
    mode: "all",
    profileIds: [],
  });

  const [composer, setComposer] = useState<ComposerState>(initialComposerState);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [sendResult, setSendResult] =
    useState<SendAdminMarketingCampaignResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedEligibleCount =
    audience.mode === "all"
      ? eligibleRecipients.length
      : audience.profileIds.filter((profileId) =>
          eligibleRecipients.some((recipient) => recipient.id === profileId),
        ).length;

  const previewTitle = composer.title.trim() || "Titolo della promozione";

  const previewIntro =
    composer.intro.trim() ||
    "Qui comparirà l’introduzione della tua email promozionale.";

  const previewContent =
    composer.content.trim() ||
    "Qui comparirà il contenuto principale della campagna.";

  const previewCta = composer.ctaLabel.trim() || "Scopri la selezione";

  function updateComposer<Key extends keyof ComposerState>(
    key: Key,
    value: ComposerState[Key],
  ) {
    setComposer((current) => ({
      ...current,
      [key]: value,
    }));

    setValidationError(null);
    setSendResult(null);
  }

  function validateComposer() {
    if (selectedEligibleCount === 0) {
      return "Non ci sono destinatari idonei selezionati.";
    }

    if (!composer.subject.trim()) {
      return "Inserisci l’oggetto dell’email.";
    }

    if (!composer.title.trim()) {
      return "Inserisci il titolo principale.";
    }

    if (!composer.intro.trim()) {
      return "Inserisci l’introduzione.";
    }

    if (!composer.content.trim()) {
      return "Inserisci il contenuto della campagna.";
    }

    const ctaLabel = composer.ctaLabel.trim();
    const ctaHref = composer.ctaHref.trim();

    if ((ctaLabel && !ctaHref) || (!ctaLabel && ctaHref)) {
      return "Testo e link del pulsante devono essere compilati insieme.";
    }

    if (ctaHref) {
      try {
        const parsedUrl = new URL(ctaHref);

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          return "Il link del pulsante deve usare http o https.";
        }
      } catch {
        return "Inserisci un link valido per il pulsante.";
      }
    }

    return null;
  }

  function requestSend() {
    if (isPending) {
      return;
    }

    const error = validateComposer();

    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    setActionError(null);
    setSendResult(null);
    setCampaignId(crypto.randomUUID());
    setConfirmOpen(true);
  }

  function cancelSend() {
    if (isPending) {
      return;
    }

    setConfirmOpen(false);
    setCampaignId(null);
    setActionError(null);
  }

  function confirmSend() {
    if (isPending || !campaignId) {
      return;
    }

    const error = validateComposer();

    if (error) {
      setValidationError(error);
      setConfirmOpen(false);
      setCampaignId(null);
      return;
    }

    setActionError(null);

    startTransition(async () => {
      try {
        const result = await sendAdminMarketingCampaign({
          campaignId,
          subject: composer.subject,
          title: composer.title,
          intro: composer.intro,
          content: composer.content,
          ctaLabel: composer.ctaLabel,
          ctaHref: composer.ctaHref,
          audience:
            audience.mode === "all"
              ? { mode: "all" }
              : {
                  mode: "selected",
                  profileIds: audience.profileIds,
                },
        });

        setSendResult(result);
        setConfirmOpen(false);
        setCampaignId(null);
        router.refresh();
      } catch (caught) {
        setActionError(
          caught instanceof Error
            ? caught.message
            : "Impossibile inviare la campagna.",
        );
      }
    });
  }

  return (
    <div className="min-w-0 space-y-6 sm:space-y-8">
      <AdminEmailMarketingRecipientSelector
        recipients={recipients}
        onChange={setAudience}
      />

      <section className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-[#171717]">
        <div className="border-b border-white/10 p-5 sm:p-6">
          <p className="text-xs font-semibold tracking-[0.16em] text-orange-400 uppercase">
            Composizione
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Crea l’email promozionale
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/45">
            Compila il messaggio e controlla l’anteprima prima dell’invio.
          </p>
        </div>

        <div className="grid min-w-0 gap-6 p-4 sm:p-6 xl:grid-cols-[minmax(0,1fr)_minmax(340px,0.85fr)] xl:gap-8">
          <div className="min-w-0 space-y-5">
            <label className="block">
              <span className="text-xs font-medium text-white/50">
                Oggetto email
              </span>

              <input
                type="text"
                value={composer.subject}
                onChange={(event) =>
                  updateComposer("subject", event.target.value)
                }
                placeholder="Es. Solo per te: 15% di sconto"
                maxLength={160}
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-orange-400/60"
              />

              <p className="mt-1.5 text-right text-xs text-white/25">
                {composer.subject.length}/160
              </p>
            </label>

            <label className="block">
              <span className="text-xs font-medium text-white/50">
                Titolo principale
              </span>

              <input
                type="text"
                value={composer.title}
                onChange={(event) =>
                  updateComposer("title", event.target.value)
                }
                placeholder="Es. Un vantaggio esclusivo per te"
                maxLength={120}
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-orange-400/60"
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-white/50">
                Introduzione
              </span>

              <textarea
                value={composer.intro}
                onChange={(event) =>
                  updateComposer("intro", event.target.value)
                }
                rows={3}
                placeholder="Es. Abbiamo riservato per te una promozione speciale."
                className="mt-2 w-full resize-y rounded-md border border-white/10 bg-[#111111] px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-orange-400/60"
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-white/50">
                Contenuto
              </span>

              <textarea
                value={composer.content}
                onChange={(event) =>
                  updateComposer("content", event.target.value)
                }
                rows={7}
                placeholder="Scrivi qui il contenuto completo della promozione..."
                className="mt-2 w-full resize-y rounded-md border border-white/10 bg-[#111111] px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-orange-400/60"
              />
            </label>

            <div className="grid min-w-0 gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-xs font-medium text-white/50">
                  Testo pulsante
                </span>

                <input
                  type="text"
                  value={composer.ctaLabel}
                  onChange={(event) =>
                    updateComposer("ctaLabel", event.target.value)
                  }
                  placeholder="Scopri la selezione"
                  maxLength={80}
                  className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-orange-400/60"
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-white/50">
                  Link pulsante
                </span>

                <input
                  type="url"
                  value={composer.ctaHref}
                  onChange={(event) =>
                    updateComposer("ctaHref", event.target.value)
                  }
                  placeholder="https://..."
                  className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#111111] px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-orange-400/60"
                />
              </label>
            </div>

            <div className="rounded-md border border-white/10 bg-[#111111] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium text-white/40">
                    Destinatari previsti
                  </p>

                  <p className="mt-1 text-lg font-semibold text-white">
                    {selectedEligibleCount.toLocaleString("it-IT")}
                  </p>
                </div>

                <span className="inline-flex w-fit rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1.5 text-xs font-semibold text-orange-300">
                  {audience.mode === "all"
                    ? "Tutti gli idonei"
                    : "Selezione manuale"}
                </span>
              </div>

              {audience.mode === "selected" && selectedEligibleCount === 0 ? (
                <p className="mt-3 text-xs text-amber-300">
                  Seleziona almeno un cliente con consenso marketing attivo
                  prima dell’invio.
                </p>
              ) : null}
            </div>

            {validationError ? (
              <p
                role="alert"
                className="rounded-md border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-300"
              >
                {validationError}
              </p>
            ) : null}

            {sendResult ? (
              <div className="rounded-md border border-emerald-400/20 bg-emerald-400/10 p-4">
                <p className="text-sm font-semibold text-emerald-300">
                  Campagna elaborata
                </p>

                <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-white/60 sm:grid-cols-4">
                  <div>
                    <p className="text-white/35">Idonei</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {sendResult.eligible}
                    </p>
                  </div>

                  <div>
                    <p className="text-white/35">Inviate</p>
                    <p className="mt-1 text-sm font-semibold text-emerald-300">
                      {sendResult.sent}
                    </p>
                  </div>

                  <div>
                    <p className="text-white/35">Duplicate</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {sendResult.duplicate}
                    </p>
                  </div>

                  <div>
                    <p className="text-white/35">Fallite</p>
                    <p className="mt-1 text-sm font-semibold text-red-300">
                      {sendResult.failed}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex min-w-0 justify-stretch border-t border-white/10 pt-5 sm:justify-end">
              <button
                type="button"
                onClick={requestSend}
                disabled={isPending || selectedEligibleCount === 0}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-orange-500 px-6 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                {isPending ? "Invio in corso…" : "Invia campagna"}
              </button>
            </div>
          </div>

          <div>
            <div className="min-w-0 xl:sticky xl:top-24">
              <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-white/40 uppercase">
                Anteprima
              </p>

              <div className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#f5f1e8] shadow-2xl">
                <div className="border-b border-black/10 bg-[#171717] px-6 py-5 text-center">
                  <p className="text-xs font-semibold tracking-[0.18em] text-orange-400 uppercase">
                    La Botola e Mietto
                  </p>
                </div>

                <div className="min-w-0 px-4 py-6 sm:px-8 sm:py-8">
                  <p className="max-w-full text-xs font-medium tracking-[0.12em] break-words text-black/45 uppercase">
                    {composer.subject.trim() || "Oggetto della tua email"}
                  </p>

                  <h3 className="mt-4 max-w-full text-xl leading-tight font-semibold break-words text-[#171717] sm:text-2xl">
                    {previewTitle}
                  </h3>

                  <p className="mt-5 max-w-full text-sm leading-6 break-words text-black/65">
                    Ciao Cliente, {previewIntro}
                  </p>

                  <div className="mt-6 rounded-lg border border-black/10 bg-white/60 p-5">
                    <p className="text-sm font-semibold text-[#171717]">
                      La Botola e Mietto
                    </p>

                    <p className="mt-3 max-w-full text-sm leading-6 [overflow-wrap:anywhere] break-words whitespace-pre-wrap text-black/65">
                      {previewContent}
                    </p>
                  </div>

                  <div className="mt-7">
                    <span className="inline-flex min-h-11 w-full max-w-full items-center justify-center rounded-md bg-[#d97706] px-5 text-center text-sm font-semibold break-words text-black sm:w-auto">
                      {previewCta}
                    </span>
                  </div>

                  <p className="mt-8 border-t border-black/10 pt-5 text-xs leading-5 text-black/45">
                    Ricevi questa comunicazione perché hai fornito il consenso
                    alle comunicazioni promozionali.
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs leading-5 text-white/30">
                L’anteprima riproduce struttura e contenuti principali. L’email
                reale utilizzerà il template branded del sito.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AdminConfirmDialog
        open={confirmOpen}
        eyebrow="Invio email marketing"
        title="Confermare l’invio della campagna?"
        description={
          <div className="space-y-3">
            <p>
              La campagna verrà inviata a{" "}
              <strong className="text-white">
                {selectedEligibleCount.toLocaleString("it-IT")}{" "}
                {selectedEligibleCount === 1
                  ? "destinatario idoneo"
                  : "destinatari idonei"}
              </strong>
              .
            </p>

            <p>
              Solo i clienti che hanno un consenso marketing attivo al momento
              dell’invio riceveranno l’email.
            </p>

            <div className="rounded-md border border-white/10 bg-black/20 p-3">
              <p className="text-xs text-white/35">Oggetto</p>
              <p className="mt-1 font-medium text-white/80">
                {composer.subject.trim() || "—"}
              </p>
            </div>

            <p className="text-amber-300">
              Dopo la conferma l’invio è reale e non può essere annullato.
            </p>
          </div>
        }
        confirmLabel="Conferma e invia"
        pendingLabel="Invio in corso…"
        pending={isPending}
        error={actionError}
        tone="success"
        onConfirm={confirmSend}
        onCancel={cancelSend}
      />
    </div>
  );
}
