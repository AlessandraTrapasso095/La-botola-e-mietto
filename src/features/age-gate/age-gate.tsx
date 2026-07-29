"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Logo } from "@/components/ui/logo";
import { ageGateConfig } from "@/config/consent";
import {
  clearAgeConfirmation,
  persistAgeConfirmation,
} from "@/features/age-gate/age-gate-storage";

type AgeGateProps = {
  initiallyConfirmed: boolean;
};

export function AgeGate({ initiallyConfirmed }: AgeGateProps) {
  const [isConfirmed, setIsConfirmed] = useState(initiallyConfirmed);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const isOpen = !isConfirmed;

  useEffect(() => {
    const reopenAgeGate = () => {
      clearAgeConfirmation(document);
      setIsConfirmed(false);
    };

    window.addEventListener(ageGateConfig.reopenEventName, reopenAgeGate);
    return () =>
      window.removeEventListener(ageGateConfig.reopenEventName, reopenAgeGate);
  }, []);

  useEffect(() => {
    const siteShell = document.getElementById("site-shell");

    if (!isOpen) {
      document.documentElement.classList.remove("age-gate-active");
      siteShell?.removeAttribute("inert");
      siteShell?.removeAttribute("aria-hidden");
      return;
    }

    document.documentElement.classList.add("age-gate-active");
    siteShell?.setAttribute("inert", "");
    siteShell?.setAttribute("aria-hidden", "true");

    return () => {
      document.documentElement.classList.remove("age-gate-active");
      siteShell?.removeAttribute("inert");
      siteShell?.removeAttribute("aria-hidden");
    };
  }, [isOpen]);

  function confirmAge() {
    persistAgeConfirmation(document);
    setIsConfirmed(true);
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent
        dismissible={false}
        showClose={false}
        className="max-w-2xl overflow-hidden [background-image:radial-gradient(circle_at_90%_5%,rgb(230_196_91_/_12%),transparent_18rem)] p-0"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          confirmButtonRef.current?.focus();
        }}
      >
        <div className="border-border-subtle flex items-center justify-between gap-5 border-b px-6 py-5 md:px-10">
          <Logo priority wordmarkClassName="hidden min-[27rem]:inline" />
          <span
            aria-hidden="true"
            className="border-accent/45 text-accent flex size-12 shrink-0 items-center justify-center rounded-full border font-serif text-sm font-semibold"
          >
            18+
          </span>
        </div>
        <div className="grid gap-6 px-6 py-8 md:gap-8 md:px-10 md:py-10">
          <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
            Accesso responsabile
          </p>
          <DialogTitle className="text-2xl md:text-3xl">
            Per accedere a La Botola e Mietto devi avere almeno 18 anni.
          </DialogTitle>
          <DialogDescription className="text-base">
            Questo sito presenta e vende bevande alcoliche. Conferma di avere
            l’età minima richiesta per continuare.
          </DialogDescription>
          <div className="grid gap-3 md:grid-cols-2">
            <Button ref={confirmButtonRef} size="lg" onClick={confirmAge}>
              Sì, ho almeno 18 anni
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() =>
                window.location.assign(ageGateConfig.exitDestination)
              }
            >
              No, esci dal sito
            </Button>
          </div>
          <p className="text-text-muted text-sm">
            La conferma dell’età è distinta dalle preferenze cookie, dalla
            privacy e dalle condizioni di vendita. Consulta la{" "}
            <Link
              className="animated-underline text-text"
              href="/privacy-policy"
            >
              privacy policy
            </Link>{" "}
            e la{" "}
            <Link
              className="animated-underline text-text"
              href="/cookie-policy"
            >
              cookie policy
            </Link>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
