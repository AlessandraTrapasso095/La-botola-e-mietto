"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SiteNotice } from "@/components/ui/site-notice";
import { cookieConsentConfig } from "@/config/consent";
import {
  persistCookiePreferences,
  type CookiePreferences,
} from "@/features/cookie-consent/cookie-preferences-storage";

type CookiePreferencesBannerProps = {
  initiallyConfigured: boolean;
};

export function CookiePreferencesBanner({
  initiallyConfigured,
}: CookiePreferencesBannerProps) {
  const [isVisible, setIsVisible] = useState(!initiallyConfigured);
  const [custom, setCustom] = useState({
    preferences: false,
    analytics: false,
    marketing: false,
  });

  function save(preferences: CookiePreferences) {
    persistCookiePreferences(document, preferences);
    setIsVisible(false);
  }

  function chooseNecessaryOnly() {
    save({
      choice: "necessary-only",
      preferences: false,
      analytics: false,
      marketing: false,
      updatedAt: new Date().toISOString(),
    });
  }

  function chooseAll() {
    save({
      choice: "all",
      preferences: true,
      analytics: true,
      marketing: true,
      updatedAt: new Date().toISOString(),
    });
  }

  if (!isVisible) return null;

  return (
    <div className="fixed right-4 bottom-4 left-4 z-[var(--z-notice)] sm:left-auto sm:max-w-lg">
      <SiteNotice aria-labelledby="cookie-notice-title" tone="accent">
        <h2
          id="cookie-notice-title"
          className="text-text-strong font-serif text-xl"
        >
          Preferenze cookie
        </h2>
        <p className="text-text-muted mt-2 text-sm">
          Al momento sono utilizzate solo preferenze necessarie al funzionamento
          del sito. Puoi mantenere disattivate le categorie facoltative.
        </p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Button variant="secondary" size="sm" onClick={chooseNecessaryOnly}>
            Rifiuta non necessari
          </Button>
          <Button size="sm" onClick={chooseAll}>
            Accetta tutti
          </Button>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-2" variant="ghost" size="sm" fullWidth>
              Personalizza
            </Button>
          </DialogTrigger>
          <DialogContent>
            <div className="grid gap-5">
              <DialogTitle>Personalizza le preferenze</DialogTitle>
              <DialogDescription>
                Nessun servizio facoltativo è attivo. Queste opzioni
                predispongono il modello di consenso per le prossime fasi.
              </DialogDescription>
              {Object.entries(cookieConsentConfig.categories).map(
                ([categoryKey, category]) => {
                  const key = categoryKey as keyof typeof custom;
                  const isNecessary = categoryKey === "necessary";

                  return (
                    <label
                      key={categoryKey}
                      className="border-border-subtle flex min-h-14 items-start gap-3 border-b pb-4"
                    >
                      <input
                        type="checkbox"
                        checked={isNecessary ? true : custom[key]}
                        disabled={isNecessary}
                        onChange={(event) => {
                          if (isNecessary) return;
                          setCustom((current) => ({
                            ...current,
                            [key]: event.target.checked,
                          }));
                        }}
                        className="accent-accent mt-1 size-5"
                      />
                      <span>
                        <span className="text-text-strong block font-semibold">
                          {category.label}
                        </span>
                        <span className="text-text-muted block text-sm">
                          {category.description}
                        </span>
                      </span>
                    </label>
                  );
                },
              )}
              <Button
                onClick={() =>
                  save({
                    choice: "custom",
                    ...custom,
                    updatedAt: new Date().toISOString(),
                  })
                }
              >
                Salva preferenze
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </SiteNotice>
    </div>
  );
}
