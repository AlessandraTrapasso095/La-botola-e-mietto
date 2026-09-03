import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { accountNavigation } from "@/config/account";
import { initialAccountAddresses } from "@/content/account/account-data";
import { AddressesPanel } from "@/features/account/addresses-panel";
import { OrdersList } from "@/features/account/orders-list";
import type { AccountOrderView } from "@/server/account/orders";

const accountOrders: readonly AccountOrderView[] = [
  {
    id: "order-1",
    orderNumber: "LBM-260718",
    createdAt: "2026-07-18T12:00:00.000Z",
    status: "delivered",
    paymentStatus: "paid",
    cancellationRequestStatus: null,
    paymentMethod: "stripe",
    shippingMethod: "tnt",
    totalGrossAmountMinor: 8624,
    itemCount: 2,
    products: [
      {
        id: "order-item-1",
        name: "Don Julio 1942",
        code: "TEST-001",
        quantity: 1,
      },
      {
        id: "order-item-2",
        name: "Aalborg Jubilaemus Acquavite",
        code: "TEST-002",
        quantity: 1,
      },
    ],
  },
];

describe("account sections", () => {
  it("espone tutte le destinazioni account richieste", () => {
    expect(accountNavigation.map((link) => link.href)).toEqual([
      "/account",
      "/account/ordini",
      "/account/offerte",
      "/account/preferiti",
      "/account/indirizzi",
      "/account/profilo",
      "/account/impostazioni",
    ]);
  });

  it("mostra ordini e dettaglio prodotti", async () => {
    render(<OrdersList orders={accountOrders} />);

    expect(
      screen.getByRole("heading", { name: "I miei ordini" }),
    ).toBeVisible();

    expect(screen.getByText("LBM-260718")).toBeVisible();
    expect(screen.getByText("Pagamento: Pagato")).toBeVisible();
    expect(screen.getByText("86,24 €")).toBeVisible();

    await userEvent.click(
      screen.getByText("Mostra articoli", { selector: "summary" }),
    );

    expect(screen.getByText(/Don Julio 1942/)).toBeVisible();
    expect(screen.getByText("TEST-001")).toBeVisible();
  });

  it("gestisce lo stato vuoto degli ordini", () => {
    render(<OrdersList orders={[]} />);

    expect(
      screen.getByRole("heading", { name: "Nessun ordine" }),
    ).toBeVisible();
  });

  it("aggiunge e modifica indirizzi dal frontend", async () => {
    render(<AddressesPanel initialAddresses={[]} />);

    await userEvent.click(
      screen.getByRole("button", { name: "Aggiungi indirizzo" }),
    );

    expect(
      screen.getByRole("heading", { name: "Nuovo indirizzo" }),
    ).toBeVisible();

    await userEvent.type(screen.getByLabelText("Etichetta"), "Cantina");
    await userEvent.type(screen.getByLabelText("Nome"), "Giulia");
    await userEvent.type(screen.getByLabelText("Cognome"), "Ferri");
    await userEvent.type(screen.getByLabelText("Telefono"), "+39 333 000 0000");
    await userEvent.type(screen.getByLabelText("Indirizzo"), "Via Roma");
    await userEvent.type(screen.getByLabelText("Numero civico"), "1");
    await userEvent.type(screen.getByLabelText("CAP"), "35100");
    await userEvent.type(screen.getByLabelText("Città"), "Padova");
    await userEvent.type(screen.getByLabelText("Provincia"), "PD");

    await userEvent.click(
      screen.getByRole("button", { name: "Salva indirizzo" }),
    );

    expect(screen.getByText("Cantina")).toBeVisible();
    expect(screen.getByText("Indirizzo salvato.")).toBeVisible();
  });

  it("mostra lo stato vuoto e conferma l’eliminazione", async () => {
    const { unmount } = render(<AddressesPanel initialAddresses={[]} />);

    expect(screen.getByText("Nessun indirizzo salvato")).toBeVisible();

    unmount();

    render(<AddressesPanel initialAddresses={initialAccountAddresses} />);

    await userEvent.click(
      screen.getAllByRole("button", { name: "Elimina" })[0]!,
    );

    expect(
      screen.getByRole("heading", { name: "Eliminare l’indirizzo?" }),
    ).toBeVisible();

    await userEvent.click(
      screen.getByRole("button", { name: "Elimina indirizzo" }),
    );

    expect(screen.getByText("Indirizzo eliminato.")).toBeVisible();
  });
});
