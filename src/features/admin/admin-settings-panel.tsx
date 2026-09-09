"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { AdminSettingsView } from "@/server/admin/settings";

export function AdminSettingsPanel({
  initialSettings,
}: {
  initialSettings: AdminSettingsView;
}) {
  const router = useRouter();

  const [firstName, setFirstName] = useState(initialSettings.firstName);
  const [lastName, setLastName] = useState(initialSettings.lastName);
  const [phone, setPhone] = useState(initialSettings.phone);
  const [birthDate, setBirthDate] = useState(initialSettings.birthDate);

  const [email, setEmail] = useState(initialSettings.email);

  const [notifyNewOrders, setNotifyNewOrders] = useState(
    initialSettings.notifyNewOrders,
  );

  const [notifyCancellations, setNotifyCancellations] = useState(
    initialSettings.notifyCancellations,
  );

  const [notifyPayments, setNotifyPayments] = useState(
    initialSettings.notifyPayments,
  );

  const [notifyShipping, setNotifyShipping] = useState(
    initialSettings.notifyShipping,
  );

  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [profileLoading, setProfileLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profileFeedback, setProfileFeedback] = useState("");
  const [emailFeedback, setEmailFeedback] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState("");

  async function saveProfile() {
    setProfileLoading(true);
    setProfileFeedback("");

    try {
      const response = await fetch("/api/admin/settings/profile", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          birthDate,
          notifyNewOrders,
          notifyCancellations,
          notifyPayments,
          notifyShipping,
        }),
      });

      const body: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          body &&
          typeof body === "object" &&
          "message" in body &&
          typeof body.message === "string"
            ? body.message
            : "Aggiornamento non riuscito.";

        throw new Error(message);
      }

      setProfileFeedback("Impostazioni salvate.");

      router.refresh();
    } catch (error) {
      setProfileFeedback(
        error instanceof Error ? error.message : "Aggiornamento non riuscito.",
      );
    } finally {
      setProfileLoading(false);
    }
  }

  async function updateEmail() {
    setEmailLoading(true);
    setEmailFeedback("");

    try {
      const response = await fetch("/api/admin/settings/email", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const body: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          body &&
          typeof body === "object" &&
          "message" in body &&
          typeof body.message === "string"
            ? body.message
            : "Modifica email non riuscita.";

        throw new Error(message);
      }

      if (
        body &&
        typeof body === "object" &&
        "unchanged" in body &&
        body.unchanged === true
      ) {
        setEmailFeedback("L’indirizzo email è già quello attuale.");

        return;
      }

      setEmailFeedback(
        "Richiesta inviata. Controlla la nuova casella email e completa la verifica.",
      );
    } catch (error) {
      setEmailFeedback(
        error instanceof Error ? error.message : "Modifica email non riuscita.",
      );
    } finally {
      setEmailLoading(false);
    }
  }

  async function updatePassword() {
    setPasswordFeedback("");

    if (newPassword !== passwordConfirmation) {
      setPasswordFeedback("Le password non coincidono.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordFeedback("La password deve contenere almeno 8 caratteri.");
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch("/api/auth/password", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      });

      const body: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          body &&
          typeof body === "object" &&
          "message" in body &&
          typeof body.message === "string"
            ? body.message
            : "Aggiornamento password non riuscito.";

        throw new Error(message);
      }

      setNewPassword("");
      setPasswordConfirmation("");

      setPasswordFeedback("Password aggiornata.");
    } catch (error) {
      setPasswordFeedback(
        error instanceof Error
          ? error.message
          : "Aggiornamento password non riuscito.",
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="mt-8 grid gap-6">
      <section className="rounded-lg border border-white/10 bg-[#171717] p-4 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold">Profilo</h2>

          <p className="mt-1 text-sm text-white/45">
            Dati personali dell’amministratore.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm">
            <span className="text-xs text-white/50">Nome</span>

            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="min-h-11 rounded-md border border-white/10 bg-[#111111] px-3 outline-none focus:border-orange-400"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-xs text-white/50">Cognome</span>

            <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="min-h-11 rounded-md border border-white/10 bg-[#111111] px-3 outline-none focus:border-orange-400"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-xs text-white/50">Telefono</span>

            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="min-h-11 rounded-md border border-white/10 bg-[#111111] px-3 outline-none focus:border-orange-400"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-xs text-white/50">Data di nascita</span>

            <input
              type="date"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              className="min-h-11 rounded-md border border-white/10 bg-[#111111] px-3 outline-none focus:border-orange-400"
            />
          </label>
        </div>

        <button
          type="button"
          disabled={profileLoading}
          onClick={saveProfile}
          className="mt-6 min-h-11 rounded-md bg-orange-400 px-5 text-sm font-semibold text-black transition hover:bg-orange-300 disabled:opacity-40"
        >
          {profileLoading ? "Salvataggio..." : "Salva profilo"}
        </button>

        {profileFeedback && (
          <p className="mt-3 text-sm text-white/55">{profileFeedback}</p>
        )}
      </section>

      <section className="rounded-lg border border-white/10 bg-[#171717] p-4 sm:p-6">
        <h2 className="text-lg font-semibold">Email</h2>

        <p className="mt-1 text-sm leading-6 text-white/45">
          La modifica dell’email richiede la verifica del nuovo indirizzo.
        </p>

        <div className="mt-5 max-w-xl">
          <label className="grid gap-2 text-sm">
            <span className="text-xs text-white/50">Indirizzo email</span>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-11 rounded-md border border-white/10 bg-[#111111] px-3 outline-none focus:border-orange-400"
            />
          </label>

          <button
            type="button"
            disabled={emailLoading}
            onClick={updateEmail}
            className="mt-4 min-h-11 rounded-md border border-orange-400/40 px-5 text-sm font-semibold text-orange-300 transition hover:bg-orange-400/10 disabled:opacity-40"
          >
            {emailLoading ? "Invio..." : "Modifica email"}
          </button>

          {emailFeedback && (
            <p className="mt-3 text-sm leading-6 text-white/55">
              {emailFeedback}
            </p>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-[#171717] p-4 sm:p-6">
        <h2 className="text-lg font-semibold">Sicurezza</h2>

        <p className="mt-1 text-sm text-white/45">
          Modifica la password dell’account amministratore.
        </p>

        <div className="mt-5 grid max-w-xl gap-4">
          <label className="grid gap-2 text-sm">
            <span className="text-xs text-white/50">Nuova password</span>

            <input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="min-h-11 rounded-md border border-white/10 bg-[#111111] px-3 outline-none focus:border-orange-400"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-xs text-white/50">
              Conferma nuova password
            </span>

            <input
              type="password"
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              className="min-h-11 rounded-md border border-white/10 bg-[#111111] px-3 outline-none focus:border-orange-400"
            />
          </label>

          <button
            type="button"
            disabled={passwordLoading}
            onClick={updatePassword}
            className="min-h-11 w-fit rounded-md border border-white/10 px-5 text-sm font-semibold text-white/75 transition hover:bg-white/5 disabled:opacity-40"
          >
            {passwordLoading ? "Aggiornamento..." : "Aggiorna password"}
          </button>

          {passwordFeedback && (
            <p className="text-sm text-white/55">{passwordFeedback}</p>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-[#171717] p-4 sm:p-6">
        <h2 className="text-lg font-semibold">Notifiche</h2>

        <p className="mt-1 text-sm leading-6 text-white/45">
          Scegli quali notifiche amministrative vuoi ricevere. L’invio effettivo
          verrà collegato nello Step 32.
        </p>

        <div className="mt-6 grid gap-3">
          {[
            {
              label: "Nuovi ordini",
              description: "Quando viene registrato un nuovo ordine.",
              checked: notifyNewOrders,
              setChecked: setNotifyNewOrders,
            },
            {
              label: "Richieste annullamento",
              description: "Quando un cliente richiede di annullare un ordine.",
              checked: notifyCancellations,
              setChecked: setNotifyCancellations,
            },
            {
              label: "Pagamenti e rimborsi",
              description:
                "Aggiornamenti relativi a pagamenti, errori e rimborsi.",
              checked: notifyPayments,
              setChecked: setNotifyPayments,
            },
            {
              label: "Spedizioni e problemi ordine",
              description: "Eventi relativi alla gestione della spedizione.",
              checked: notifyShipping,
              setChecked: setNotifyShipping,
            },
          ].map((preference) => (
            <label
              key={preference.label}
              className="flex cursor-pointer items-start justify-between gap-5 rounded-md border border-white/10 bg-black/10 p-4"
            >
              <span>
                <span className="block text-sm font-semibold">
                  {preference.label}
                </span>

                <span className="mt-1 block text-xs leading-5 text-white/40">
                  {preference.description}
                </span>
              </span>

              <input
                type="checkbox"
                checked={preference.checked}
                onChange={(event) =>
                  preference.setChecked(event.target.checked)
                }
                className="mt-1 size-4 shrink-0 accent-orange-400"
              />
            </label>
          ))}
        </div>

        <button
          type="button"
          disabled={profileLoading}
          onClick={saveProfile}
          className="mt-6 min-h-11 rounded-md bg-orange-400 px-5 text-sm font-semibold text-black transition hover:bg-orange-300 disabled:opacity-40"
        >
          {profileLoading ? "Salvataggio..." : "Salva preferenze"}
        </button>
      </section>
    </div>
  );
}
