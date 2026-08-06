"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useRouter } from "next/navigation";
import { accountRoutes } from "@/config/account";
import { useAccount } from "@/features/account/account-provider";
import { PasswordField } from "@/features/account/password-field";
import { CookiePreferencesButton } from "@/features/cookie-consent/cookie-preferences-button";
import type { AccountConsentHistoryEntry } from "@/services/auth/auth-service";

const consentLabels = {
  privacy: "Privacy",
  marketing: "Marketing",
  age_confirmation: "Conferma maggiore età",
} as const;

export function SettingsPanel({
  consentHistory = [],
}: {
  consentHistory?: readonly AccountConsentHistoryEntry[];
}) {
  const router = useRouter();
  const { signOut, updatePassword, updatePreferences, user } = useAccount();
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [preferencesFeedback, setPreferencesFeedback] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(
    user?.marketingConsent ?? false,
  );
  const [emailUpdates, setEmailUpdates] = useState(user?.emailUpdates ?? true);

  if (!user) return null;

  const logout = async () => {
    await signOut();
    router.refresh();
    router.replace(accountRoutes.signIn);
  };

  return (
    <div>
      <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
        Controllo e privacy
      </p>
      <Heading as="h1" size="xl" className="mt-4">
        Impostazioni
      </Heading>
      <div className="mt-10 grid gap-6">
        <form
          className="border-border-subtle bg-surface grid gap-5 border p-6 sm:p-8"
          onSubmit={async (event) => {
            event.preventDefault();
            setPasswordFeedback("");
            if (newPassword !== passwordConfirmation) {
              setPasswordFeedback("Le password non coincidono.");
              return;
            }
            setSavingPassword(true);
            try {
              await updatePassword(newPassword);
              setNewPassword("");
              setPasswordConfirmation("");
              setPasswordFeedback("Password aggiornata.");
            } catch {
              setPasswordFeedback(
                "La password non rispetta i requisiti richiesti.",
              );
            } finally {
              setSavingPassword(false);
            }
          }}
        >
          <Heading as="h2">Password</Heading>
          <PasswordField
            id="settings-new-password"
            label="Nuova password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
          />
          <PasswordField
            id="settings-password-confirmation"
            label="Conferma nuova password"
            autoComplete="new-password"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            required
          />
          <Button type="submit" className="sm:w-fit" disabled={savingPassword}>
            {savingPassword ? "Aggiornamento…" : "Aggiorna password"}
          </Button>
          <p className="text-accent-soft min-h-6 text-sm" aria-live="polite">
            {passwordFeedback}
          </p>
        </form>
        <form
          className="border-border-subtle bg-surface grid gap-5 border p-6 sm:p-8"
          onSubmit={async (event) => {
            event.preventDefault();
            setSavingPreferences(true);
            setPreferencesFeedback("");
            try {
              await updatePreferences({ marketingConsent, emailUpdates });
              setPreferencesFeedback("Preferenze aggiornate.");
            } catch {
              setPreferencesFeedback(
                "Non è stato possibile aggiornare le preferenze.",
              );
            } finally {
              setSavingPreferences(false);
            }
          }}
        >
          <Heading as="h2">Comunicazioni</Heading>
          <label className="text-text-muted flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="accent-accent mt-0.5 size-5"
              checked={marketingConsent}
              onChange={(event) => setMarketingConsent(event.target.checked)}
            />
            <span>Desidero ricevere selezioni, novità e inviti.</span>
          </label>
          <label className="text-text-muted flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="accent-accent mt-0.5 size-5"
              checked={emailUpdates}
              onChange={(event) => setEmailUpdates(event.target.checked)}
            />
            <span>
              Desidero ricevere aggiornamenti relativi alle mie richieste.
            </span>
          </label>
          <Button
            type="submit"
            className="sm:w-fit"
            disabled={savingPreferences}
          >
            {savingPreferences ? "Salvataggio…" : "Salva preferenze"}
          </Button>
          <p className="text-accent-soft min-h-6 text-sm" aria-live="polite">
            {preferencesFeedback}
          </p>
        </form>
        {consentHistory.length > 0 ? (
          <section className="border-border-subtle bg-surface border p-6 sm:p-8">
            <Heading as="h2">Cronologia consensi</Heading>
            <ul className="border-border-subtle mt-5 divide-y border-t">
              {consentHistory.map((entry) => (
                <li
                  key={entry.id}
                  className="flex flex-wrap justify-between gap-3 py-4 text-sm"
                >
                  <span className="text-text-strong">
                    {consentLabels[entry.type]}
                  </span>
                  <span className="text-text-muted">
                    {entry.granted ? "Accettato" : "Non accettato"} ·{" "}
                    {new Intl.DateTimeFormat("it-IT", {
                      dateStyle: "medium",
                    }).format(new Date(entry.createdAt))}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <section className="border-border-subtle bg-surface border p-6 sm:p-8">
          <Heading as="h2">Privacy e accesso</Heading>
          <div className="mt-5 flex flex-wrap gap-4">
            <CookiePreferencesButton className="border-border-subtle min-h-11 border px-5" />
            <Button variant="secondary" onClick={logout}>
              Esci dall’account
            </Button>
          </div>
          <div className="border-border-subtle mt-8 border-t pt-6">
            <p className="text-text-strong font-semibold">
              Eliminazione account
            </p>
            <p className="text-text-muted mt-2 text-sm">
              Per tutelare i tuoi dati, la richiesta richiede una conferma
              dedicata.
            </p>
            <button
              type="button"
              disabled
              className="text-danger mt-4 min-h-11 cursor-not-allowed text-sm opacity-60"
            >
              Richiedi eliminazione account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
