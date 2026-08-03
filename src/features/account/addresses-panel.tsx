"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import {
  initialAccountAddresses,
  type AccountAddress,
} from "@/content/account/account-data";

const emptyAddress: Omit<AccountAddress, "id" | "isDefault"> = {
  label: "",
  recipient: "",
  street: "",
  postalCode: "",
  city: "",
  province: "",
  type: "Spedizione",
};

export function AddressesPanel() {
  const [addresses, setAddresses] = useState<AccountAddress[]>([
    ...initialAccountAddresses,
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyAddress);
  const [feedback, setFeedback] = useState("");

  const startNew = () => {
    setEditingId("new");
    setDraft(emptyAddress);
    setFeedback("");
  };

  const startEdit = (address: AccountAddress) => {
    setEditingId(address.id);
    setDraft(address);
    setFeedback("");
  };

  const saveAddress = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingId === "new") {
      setAddresses((current) => [
        ...current,
        {
          ...draft,
          id: `address-${Date.now()}`,
          isDefault: current.length === 0,
        },
      ]);
    } else {
      setAddresses((current) =>
        current.map((address) =>
          address.id === editingId ? { ...address, ...draft } : address,
        ),
      );
    }
    setEditingId(null);
    setFeedback("Indirizzo salvato.");
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
            Recapiti
          </p>
          <Heading as="h1" size="xl" className="mt-4">
            Indirizzi
          </Heading>
        </div>
        <Button onClick={startNew}>Aggiungi indirizzo</Button>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {addresses.map((address) => (
          <article
            key={address.id}
            className="border-border-subtle bg-surface border p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-text-strong font-serif text-xl">
                  {address.label}
                </p>
                <p className="text-accent mt-1 text-xs uppercase">
                  {address.type}
                </p>
              </div>
              {address.isDefault ? (
                <span className="text-accent-soft text-xs">Predefinito</span>
              ) : null}
            </div>
            <address className="text-text-muted mt-5 text-sm leading-relaxed not-italic">
              {address.recipient}
              <br />
              {address.street}
              <br />
              {address.postalCode} {address.city} ({address.province})
            </address>
            <div className="mt-5 flex flex-wrap gap-4 text-sm">
              <button
                type="button"
                className="text-accent-soft min-h-11"
                onClick={() => startEdit(address)}
              >
                Modifica
              </button>
              {!address.isDefault ? (
                <button
                  type="button"
                  className="text-text-muted hover:text-accent-soft min-h-11"
                  onClick={() =>
                    setAddresses((current) =>
                      current.map((candidate) => ({
                        ...candidate,
                        isDefault: candidate.id === address.id,
                      })),
                    )
                  }
                >
                  Imposta come predefinito
                </button>
              ) : null}
              <button
                type="button"
                className="text-danger min-h-11"
                onClick={() =>
                  setAddresses((current) =>
                    current.filter((candidate) => candidate.id !== address.id),
                  )
                }
              >
                Elimina
              </button>
            </div>
          </article>
        ))}
      </div>
      {editingId ? (
        <form
          className="border-border-subtle bg-surface mt-8 grid gap-5 border p-6 sm:grid-cols-2 sm:p-8"
          onSubmit={saveAddress}
        >
          <Heading as="h2" className="sm:col-span-2">
            {editingId === "new" ? "Nuovo indirizzo" : "Modifica indirizzo"}
          </Heading>
          <AddressInput
            id="address-label"
            label="Etichetta"
            value={draft.label}
            onChange={(label) => setDraft((current) => ({ ...current, label }))}
          />
          <label className="grid gap-2">
            <span className="text-text-muted text-xs font-semibold uppercase">
              Tipologia
            </span>
            <select
              value={draft.type}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  type: event.target.value as AccountAddress["type"],
                }))
              }
              className="border-border-subtle bg-background min-h-12 border px-4"
            >
              <option>Spedizione</option>
              <option>Fatturazione</option>
            </select>
          </label>
          <AddressInput
            id="address-recipient"
            label="Destinatario"
            value={draft.recipient}
            onChange={(recipient) =>
              setDraft((current) => ({ ...current, recipient }))
            }
          />
          <AddressInput
            id="address-street"
            label="Indirizzo"
            value={draft.street}
            onChange={(street) =>
              setDraft((current) => ({ ...current, street }))
            }
          />
          <AddressInput
            id="address-postal-code"
            label="CAP"
            value={draft.postalCode}
            onChange={(postalCode) =>
              setDraft((current) => ({ ...current, postalCode }))
            }
          />
          <AddressInput
            id="address-city"
            label="Città"
            value={draft.city}
            onChange={(city) => setDraft((current) => ({ ...current, city }))}
          />
          <AddressInput
            id="address-province"
            label="Provincia"
            value={draft.province}
            onChange={(province) =>
              setDraft((current) => ({ ...current, province }))
            }
          />
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit">Salva indirizzo</Button>
            <Button variant="secondary" onClick={() => setEditingId(null)}>
              Annulla
            </Button>
          </div>
        </form>
      ) : null}
      <p className="text-accent-soft mt-5 min-h-6 text-sm" aria-live="polite">
        {feedback}
      </p>
    </div>
  );
}

function AddressInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Input
      id={id}
      label={label}
      value={value}
      required
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
