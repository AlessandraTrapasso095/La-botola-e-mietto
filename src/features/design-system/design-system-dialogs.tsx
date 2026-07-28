"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Logo } from "@/components/ui/logo";

export function DesignSystemDialogs() {
  const [agePreviewOpen, setAgePreviewOpen] = useState(false);
  const ageConfirmRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Apri dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <div className="grid gap-5">
            <DialogTitle>Dialog informativo</DialogTitle>
            <DialogDescription>
              Esempio dismissibile con focus trap, overlay e chiusura da
              tastiera.
            </DialogDescription>
            <Button>Conferma</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={agePreviewOpen} onOpenChange={setAgePreviewOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setAgePreviewOpen(true)}>
            Anteprima age gate
          </Button>
        </DialogTrigger>
        <DialogContent
          dismissible={false}
          showClose={false}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            ageConfirmRef.current?.focus();
          }}
        >
          <div className="grid gap-6">
            <Logo />
            <DialogTitle>Devi avere almeno 18 anni.</DialogTitle>
            <DialogDescription>
              Anteprima isolata del controllo obbligatorio presente all’ingresso
              del sito.
            </DialogDescription>
            <Button
              ref={ageConfirmRef}
              onClick={() => setAgePreviewOpen(false)}
            >
              Sì, ho almeno 18 anni
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
