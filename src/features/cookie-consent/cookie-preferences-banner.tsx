"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { SiteNotice } from "@/components/ui/site-notice";
import { cookieConsentConfig } from "@/config/consent";
import {
  persistCookiePreferences,
  readCookiePreferences,
  type CookiePreferences,
} from "@/features/cookie-consent/cookie-preferences-storage";

type CookiePreferencesBannerProps = {
  initiallyConfigured: boolean;
};

export function CookiePreferencesBanner({
  initiallyConfigured,
}: CookiePreferencesBannerProps) {
  const [isVisible, setIsVisible] = useState(!initiallyConfigured);
  const [preferenceCenterOpen, setPreferenceCenterOpen] = useState(false);
  const [custom, setCustom] = useState({
    preferences: false,
    analytics: false,
    marketing: false,
  });

  const openPreferenceCenter = useCallback(() => {
    const storedPreferences = readCookiePreferences(document.cookie);
    if (storedPreferences) {
      setCustom({
        preferences: storedPreferences.preferences,
        analytics: storedPreferences.analytics,
        marketing: storedPreferences.marketing,
      });
    }
    setPreferenceCenterOpen(true);
  }, []);

  function save(preferences: CookiePreferences) {
    persistCookiePreferences(document, preferences);
    setIsVisible(false);
    setPreferenceCenterOpen(false);
  }

  useEffect(() => {
    const handleOpenPreferenceCenter = () => openPreferenceCenter();
    window.addEventListener(
      "lbm:open-cookie-preferences",
      handleOpenPreferenceCenter,
    );
    return () =>
      window.removeEventListener(
        "lbm:open-cookie-preferences",
        handleOpenPreferenceCenter,
      );
  }, [openPreferenceCenter]);

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

  return (
    <>
      {isVisible ? (
        <div className="fixed right-4 bottom-4 left-4 z-[var(--z-notice)] sm:left-auto sm:max-w-lg">
          <SiteNotice aria-labelledby="cookie-notice-title" tone="accent">
            <h2
              id="cookie-notice-title"
              className="text-text-strong font-serif text-xl"
            >
              Preferenze cookie
            </h2>
            <p className="text-text-muted mt-2 text-sm">
              Sono attive solo le funzioni necessarie. Le categorie facoltative
              restano sotto il tuo controllo.
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={chooseNecessaryOnly}
              >
                Rifiuta non necessari
              </Button>
              <Button size="sm" onClick={chooseAll}>
                Accetta tutti
              </Button>
            </div>
            <Button
              className="mt-2"
              variant="ghost"
              size="sm"
              fullWidth
              onClick={openPreferenceCenter}
            >
              Personalizza
            </Button>
          </SiteNotice>
        </div>
      ) : null}
      <Dialog
        open={preferenceCenterOpen}
        onOpenChange={(open) => {
          if (open) openPreferenceCenter();
          else setPreferenceCenterOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <div className="grid gap-5">
            <div className="border-border-subtle border-b pb-5">
              <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
                La tua esperienza
              </p>
              <DialogTitle className="mt-3">
                Personalizza le preferenze
              </DialogTitle>
              <DialogDescription className="mt-3">
                Le funzioni necessarie sono sempre attive. Nessun servizio
                facoltativo di statistica o marketing è attualmente utilizzato.
              </DialogDescription>
            </div>
            {Object.entries(cookieConsentConfig.categories).map(
              ([categoryKey, category]) => {
                const key = categoryKey as keyof typeof custom;
                const isNecessary = categoryKey === "necessary";

                return (
                  <label
                    key={categoryKey}
                    className="border-border-subtle flex min-h-16 items-start gap-4 border-b pb-5"
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
                      className="accent-accent mt-1 size-5 shrink-0"
                    />
                    <span>
                      <span className="text-text-strong block font-semibold">
                        {category.label}
                      </span>
                      <span className="text-text-muted mt-1 block text-sm leading-relaxed">
                        {category.description}
                      </span>
                    </span>
                  </label>
                );
              },
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="secondary" onClick={chooseNecessaryOnly}>
                Solo necessari
              </Button>
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
            <Link
              href="/cookie-policy"
              className="animated-underline text-text-muted mx-auto inline-flex min-h-11 items-center text-xs"
              onClick={() => setPreferenceCenterOpen(false)}
            >
              Leggi la cookie policy
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
