"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { AccountAddress } from "@/content/account/account-data";
import { addressInputSchema } from "@/lib/validation/address";
import { supabaseAddressService } from "@/services/addresses/address-service";
import type { AddressInput } from "@/types/customer";

type AddressField = keyof AddressInput;
type FieldErrors = Partial<Record<AddressField, string>>;

const emptyAddress: AddressInput = {
  label: "",
  firstName: "",
  lastName: "",
  company: "",
  street: "",
  streetNumber: "",
  line2: "",
  postalCode: "",
  city: "",
  province: "",
  countryCode: "IT",
  phone: "",
  type: "shipping",
  isDefaultShipping: false,
  isDefaultBilling: false,
};

function toInput(address: AccountAddress): AddressInput {
  const { id, updatedAt, ...input } = address;
  void id;
  void updatedAt;
  return input;
}

function mergeAddress(
  current: AccountAddress[],
  saved: AccountAddress,
): AccountAddress[] {
  let found = false;
  const normalized = current.map((candidate) => {
    if (candidate.id === saved.id) {
      found = true;
      return saved;
    }
    return {
      ...candidate,
      isDefaultShipping: saved.isDefaultShipping
        ? false
        : candidate.isDefaultShipping,
      isDefaultBilling: saved.isDefaultBilling
        ? false
        : candidate.isDefaultBilling,
    };
  });
  return found ? normalized : [...normalized, saved];
}

export function AddressesPanel({
  initialAddresses = [],
  loadError = "",
  mode = "demo",
}: {
  initialAddresses?: readonly AccountAddress[];
  loadError?: string;
  mode?: "demo" | "supabase";
}) {
  const [addresses, setAddresses] = useState<AccountAddress[]>([
    ...initialAddresses,
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AddressInput>(emptyAddress);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [feedback, setFeedback] = useState(loadError);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<AccountAddress | null>(
    null,
  );
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editingId) return;
    firstFieldRef.current?.focus();
  }, [editingId]);

  const startNew = () => {
    setEditingId("new");
    setDraft(emptyAddress);
    setFieldErrors({});
    setFeedback("");
  };

  const startEdit = (address: AccountAddress) => {
    setEditingId(address.id);
    setDraft(toInput(address));
    setFieldErrors({});
    setFeedback("");
  };

  const setDraftField = <Field extends AddressField>(
    field: Field,
    value: AddressInput[Field],
  ) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const saveAddress = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pendingAction) return;

    const result = addressInputSchema.safeParse(draft);
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as AddressField | undefined;
        if (field && !errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      setFeedback("Controlla i campi evidenziati.");
      return;
    }

    setPendingAction("save");
    setFeedback("");
    try {
      const saved =
        mode === "supabase"
          ? editingId === "new"
            ? await supabaseAddressService.create(result.data)
            : await supabaseAddressService.update(editingId!, result.data)
          : {
              ...result.data,
              id: editingId === "new" ? `address-${Date.now()}` : editingId!,
              updatedAt: new Date().toISOString(),
            };
      setAddresses((current) => mergeAddress(current, saved));
      setEditingId(null);
      setFeedback("Indirizzo salvato.");
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "Salvataggio dell’indirizzo non riuscito.",
      );
    } finally {
      setPendingAction(null);
    }
  };

  const setDefault = async (
    address: AccountAddress,
    kind: "shipping" | "billing",
  ) => {
    if (pendingAction) return;
    setPendingAction(`default-${address.id}-${kind}`);
    setFeedback("");
    const input = {
      ...toInput(address),
      isDefaultShipping: kind === "shipping" ? true : address.isDefaultShipping,
      isDefaultBilling: kind === "billing" ? true : address.isDefaultBilling,
    };
    try {
      const saved =
        mode === "supabase"
          ? await supabaseAddressService.update(address.id, input)
          : { ...address, ...input, updatedAt: new Date().toISOString() };
      setAddresses((current) => mergeAddress(current, saved));
      setFeedback(
        kind === "shipping"
          ? "Indirizzo di spedizione predefinito aggiornato."
          : "Indirizzo di fatturazione predefinito aggiornato.",
      );
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "Aggiornamento dell’indirizzo non riuscito.",
      );
    } finally {
      setPendingAction(null);
    }
  };

  const deleteAddress = async () => {
    if (!deleteCandidate || pendingAction) return;
    setPendingAction(`delete-${deleteCandidate.id}`);
    setFeedback("");
    try {
      if (mode === "supabase") {
        await supabaseAddressService.remove(deleteCandidate.id);
      }
      setAddresses((current) =>
        current.filter((address) => address.id !== deleteCandidate.id),
      );
      setDeleteCandidate(null);
      setFeedback("Indirizzo eliminato.");
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "Eliminazione dell’indirizzo non riuscita.",
      );
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div aria-busy={Boolean(pendingAction)}>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-accent text-xs font-semibold tracking-[var(--letter-spacing-label)] uppercase">
            Recapiti
          </p>
          <Heading as="h1" size="xl" className="mt-4">
            Indirizzi
          </Heading>
        </div>
        <Button onClick={startNew} disabled={Boolean(pendingAction)}>
          Aggiungi indirizzo
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="border-border-subtle mt-10 border px-6 py-20 text-center">
          <p className="text-text-strong font-serif text-2xl">
            Nessun indirizzo salvato
          </p>
          <p className="text-text-muted mt-4">
            Aggiungi un recapito per preparare le future spedizioni e la
            fatturazione.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              disabled={Boolean(pendingAction)}
              onDelete={() => setDeleteCandidate(address)}
              onEdit={() => startEdit(address)}
              onSetDefault={setDefault}
            />
          ))}
        </div>
      )}

      {editingId ? (
        <AddressForm
          draft={draft}
          editingId={editingId}
          errors={fieldErrors}
          firstFieldRef={firstFieldRef}
          pending={pendingAction === "save"}
          onCancel={() => setEditingId(null)}
          onChange={setDraftField}
          onSubmit={saveAddress}
        />
      ) : null}

      <p className="text-accent-soft mt-5 min-h-6 text-sm" aria-live="polite">
        {feedback}
      </p>

      <Dialog
        open={Boolean(deleteCandidate)}
        onOpenChange={(open) => {
          if (!open && !pendingAction) setDeleteCandidate(null);
        }}
      >
        <DialogContent>
          <DialogTitle>Eliminare l’indirizzo?</DialogTitle>
          <DialogDescription className="mt-3">
            {deleteCandidate
              ? `“${deleteCandidate.label}” verrà rimosso dall’area personale.`
              : "L’indirizzo verrà rimosso dall’area personale."}
          </DialogDescription>
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button variant="secondary" disabled={Boolean(pendingAction)}>
                Annulla
              </Button>
            </DialogClose>
            <Button
              className="border-danger bg-danger text-white"
              disabled={Boolean(pendingAction)}
              onClick={deleteAddress}
            >
              {pendingAction?.startsWith("delete-")
                ? "Eliminazione…"
                : "Elimina indirizzo"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddressCard({
  address,
  disabled,
  onDelete,
  onEdit,
  onSetDefault,
}: {
  address: AccountAddress;
  disabled: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onSetDefault: (address: AccountAddress, kind: "shipping" | "billing") => void;
}) {
  return (
    <article className="border-border-subtle bg-surface border p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-text-strong font-serif text-xl">{address.label}</p>
          <p className="text-accent mt-1 text-xs uppercase">
            {address.type === "shipping" ? "Spedizione" : "Fatturazione"}
          </p>
        </div>
        <div className="grid shrink-0 gap-1 text-right text-xs">
          {address.isDefaultShipping ? (
            <span className="text-accent-soft">Spedizione predefinita</span>
          ) : null}
          {address.isDefaultBilling ? (
            <span className="text-accent-soft">Fatturazione predefinita</span>
          ) : null}
        </div>
      </div>
      <address className="text-text-muted mt-5 text-sm leading-relaxed not-italic">
        {address.firstName} {address.lastName}
        {address.company ? (
          <>
            <br />
            {address.company}
          </>
        ) : null}
        <br />
        {address.street} {address.streetNumber}
        {address.line2 ? (
          <>
            <br />
            {address.line2}
          </>
        ) : null}
        <br />
        {address.postalCode} {address.city}
        {address.province ? ` (${address.province})` : ""}
        <br />
        {address.countryCode}
        <br />
        {address.phone}
      </address>
      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <button
          type="button"
          className="text-accent-soft min-h-11 disabled:opacity-50"
          disabled={disabled}
          onClick={onEdit}
        >
          Modifica
        </button>
        {!address.isDefaultShipping ? (
          <button
            type="button"
            className="text-text-muted hover:text-accent-soft min-h-11 disabled:opacity-50"
            disabled={disabled}
            onClick={() => onSetDefault(address, "shipping")}
          >
            Predefinito spedizione
          </button>
        ) : null}
        {!address.isDefaultBilling ? (
          <button
            type="button"
            className="text-text-muted hover:text-accent-soft min-h-11 disabled:opacity-50"
            disabled={disabled}
            onClick={() => onSetDefault(address, "billing")}
          >
            Predefinito fatturazione
          </button>
        ) : null}
        <button
          type="button"
          className="text-danger min-h-11 disabled:opacity-50"
          disabled={disabled}
          onClick={onDelete}
        >
          Elimina
        </button>
      </div>
    </article>
  );
}

function AddressForm({
  draft,
  editingId,
  errors,
  firstFieldRef,
  pending,
  onCancel,
  onChange,
  onSubmit,
}: {
  draft: AddressInput;
  editingId: string;
  errors: FieldErrors;
  firstFieldRef: React.RefObject<HTMLInputElement | null>;
  pending: boolean;
  onCancel: () => void;
  onChange: <Field extends AddressField>(
    field: Field,
    value: AddressInput[Field],
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form
      className="border-border-subtle bg-surface mt-8 grid gap-5 border p-6 sm:grid-cols-2 sm:p-8"
      onSubmit={onSubmit}
      noValidate
    >
      <Heading as="h2" className="sm:col-span-2">
        {editingId === "new" ? "Nuovo indirizzo" : "Modifica indirizzo"}
      </Heading>
      <Input
        ref={firstFieldRef}
        id="address-label"
        label="Etichetta"
        value={draft.label}
        error={errors.label}
        onChange={(event) => onChange("label", event.target.value)}
        required
      />
      <Select
        id="address-type"
        label="Tipologia"
        value={draft.type}
        onChange={(event) =>
          onChange("type", event.target.value as AddressInput["type"])
        }
      >
        <option value="shipping">Spedizione</option>
        <option value="billing">Fatturazione</option>
      </Select>
      <Input
        id="address-first-name"
        label="Nome"
        value={draft.firstName}
        error={errors.firstName}
        onChange={(event) => onChange("firstName", event.target.value)}
        autoComplete="given-name"
        required
      />
      <Input
        id="address-last-name"
        label="Cognome"
        value={draft.lastName}
        error={errors.lastName}
        onChange={(event) => onChange("lastName", event.target.value)}
        autoComplete="family-name"
        required
      />
      <Input
        id="address-company"
        label="Azienda (facoltativa)"
        value={draft.company}
        error={errors.company}
        onChange={(event) => onChange("company", event.target.value)}
        autoComplete="organization"
      />
      <Input
        id="address-phone"
        label="Telefono"
        type="tel"
        value={draft.phone}
        error={errors.phone}
        onChange={(event) => onChange("phone", event.target.value)}
        autoComplete="tel"
        required
      />
      <Input
        id="address-street"
        label="Indirizzo"
        value={draft.street}
        error={errors.street}
        onChange={(event) => onChange("street", event.target.value)}
        autoComplete="address-line1"
        required
      />
      <Input
        id="address-street-number"
        label="Numero civico"
        value={draft.streetNumber}
        error={errors.streetNumber}
        onChange={(event) => onChange("streetNumber", event.target.value)}
        required
      />
      <Input
        id="address-line-2"
        label="Seconda riga (facoltativa)"
        value={draft.line2}
        error={errors.line2}
        onChange={(event) => onChange("line2", event.target.value)}
        autoComplete="address-line2"
      />
      <Input
        id="address-postal-code"
        label="CAP"
        inputMode="numeric"
        value={draft.postalCode}
        error={errors.postalCode}
        onChange={(event) => onChange("postalCode", event.target.value)}
        autoComplete="postal-code"
        required
      />
      <Input
        id="address-city"
        label="Città"
        value={draft.city}
        error={errors.city}
        onChange={(event) => onChange("city", event.target.value)}
        autoComplete="address-level2"
        required
      />
      <Input
        id="address-province"
        label="Provincia"
        value={draft.province}
        error={errors.province}
        onChange={(event) => onChange("province", event.target.value)}
        autoComplete="address-level1"
        maxLength={80}
        required={draft.countryCode === "IT"}
      />
      <Select
        id="address-country"
        label="Paese"
        value={draft.countryCode}
        error={errors.countryCode}
        onChange={(event) => onChange("countryCode", event.target.value)}
        autoComplete="country"
      >
        <option value="IT">Italia</option>
        <option value="AT">Austria</option>
        <option value="CH">Svizzera</option>
        <option value="DE">Germania</option>
        <option value="FR">Francia</option>
        <option value="SI">Slovenia</option>
      </Select>
      <fieldset className="border-border-subtle grid gap-3 border p-4 sm:col-span-2">
        <legend className="text-text-muted px-2 text-xs font-semibold uppercase">
          Preferenze
        </legend>
        <label className="text-text flex min-h-11 items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={draft.isDefaultShipping}
            onChange={(event) =>
              onChange("isDefaultShipping", event.target.checked)
            }
          />
          Predefinito per la spedizione
        </label>
        <label className="text-text flex min-h-11 items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={draft.isDefaultBilling}
            onChange={(event) =>
              onChange("isDefaultBilling", event.target.checked)
            }
          />
          Predefinito per la fatturazione
        </label>
      </fieldset>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
        <Button type="submit" disabled={pending}>
          {pending ? "Salvataggio…" : "Salva indirizzo"}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={pending}>
          Annulla
        </Button>
      </div>
    </form>
  );
}
