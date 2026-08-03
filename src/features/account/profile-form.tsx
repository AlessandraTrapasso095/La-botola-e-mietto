"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { useAccount } from "@/features/account/account-provider";

export function ProfileForm() {
  const { updateProfile, user } = useAccount();
  const [feedback, setFeedback] = useState("");
  const [profile, setProfile] = useState(() => ({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    birthDate: user?.birthDate ?? "",
  }));

  if (!user) return null;

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        updateProfile(profile);
        setFeedback("Profilo aggiornato.");
      }}
    >
      <div>
        <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
          Dati personali
        </p>
        <Heading as="h1" size="xl" className="mt-4">
          Profilo
        </Heading>
      </div>
      <div className="border-border-subtle bg-surface mt-4 grid gap-5 border p-6 sm:grid-cols-2 sm:p-9">
        <Input
          id="profile-first-name"
          label="Nome"
          autoComplete="given-name"
          value={profile.firstName}
          onChange={(event) =>
            setProfile((current) => ({
              ...current,
              firstName: event.target.value,
            }))
          }
        />
        <Input
          id="profile-last-name"
          label="Cognome"
          autoComplete="family-name"
          value={profile.lastName}
          onChange={(event) =>
            setProfile((current) => ({
              ...current,
              lastName: event.target.value,
            }))
          }
        />
        <Input
          id="profile-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={profile.email}
          onChange={(event) =>
            setProfile((current) => ({ ...current, email: event.target.value }))
          }
        />
        <Input
          id="profile-phone"
          label="Telefono"
          type="tel"
          autoComplete="tel"
          value={profile.phone}
          onChange={(event) =>
            setProfile((current) => ({ ...current, phone: event.target.value }))
          }
        />
        <Input
          id="profile-birth-date"
          label="Data di nascita, facoltativa"
          type="date"
          value={profile.birthDate}
          onChange={(event) =>
            setProfile((current) => ({
              ...current,
              birthDate: event.target.value,
            }))
          }
        />
        <div className="flex items-end">
          <Button type="submit" fullWidth>
            Salva modifiche
          </Button>
        </div>
      </div>
      <p className="text-accent-soft min-h-6 text-sm" aria-live="polite">
        {feedback}
      </p>
    </form>
  );
}
