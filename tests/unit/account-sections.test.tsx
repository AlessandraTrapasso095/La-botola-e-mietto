import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { accountNavigation } from "@/config/account";
import { accountOrders } from "@/content/account/account-data";
import { AddressesPanel } from "@/features/account/addresses-panel";
import { OrdersList } from "@/features/account/orders-list";

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
    expect(screen.getByRole("heading", { name: "Ordini" })).toBeVisible();
    expect(screen.getByText("LBM-260718")).toBeVisible();

    await userEvent.click(
      screen.getAllByText("Vedi dettagli", { selector: "summary" })[0]!,
    );
    expect(screen.getByText(/Don Julio 1942/)).toBeVisible();
  });

  it("gestisce lo stato vuoto degli ordini", () => {
    render(<OrdersList orders={[]} />);
    expect(
      screen.getByRole("heading", { name: "Nessun ordine" }),
    ).toBeVisible();
  });

  it("aggiunge e modifica indirizzi dal frontend", async () => {
    render(<AddressesPanel />);
    await userEvent.click(
      screen.getByRole("button", { name: "Aggiungi indirizzo" }),
    );
    expect(
      screen.getByRole("heading", { name: "Nuovo indirizzo" }),
    ).toBeVisible();

    await userEvent.type(screen.getByLabelText("Etichetta"), "Cantina");
    await userEvent.type(screen.getByLabelText("Destinatario"), "Giulia Ferri");
    await userEvent.type(screen.getByLabelText("Indirizzo"), "Via Roma 1");
    await userEvent.type(screen.getByLabelText("CAP"), "35100");
    await userEvent.type(screen.getByLabelText("Città"), "Padova");
    await userEvent.type(screen.getByLabelText("Provincia"), "PD");
    await userEvent.click(
      screen.getByRole("button", { name: "Salva indirizzo" }),
    );

    expect(screen.getByText("Cantina")).toBeVisible();
    expect(screen.getByText("Indirizzo salvato.")).toBeVisible();
  });
});
