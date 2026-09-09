import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminOrderShippingForm } from "@/features/admin/order-shipping-form";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh,
  }),
}));

describe("AdminOrderShippingForm", () => {
  beforeEach(() => {
    refresh.mockReset();
    vi.restoreAllMocks();
  });

  it("mostra i campi richiesti per la spedizione", () => {
    render(
      <AdminOrderShippingForm
        orderId="11111111-1111-4111-8111-111111111111"
      />,
    );

    expect(screen.getByLabelText("Corriere")).toHaveValue("TNT");
    expect(screen.getByLabelText("Codice tracking")).toBeRequired();
    expect(screen.getByLabelText("Link tracking")).toBeRequired();

    expect(
      screen.getByRole("button", { name: "Conferma spedizione" }),
    ).toBeEnabled();
  });

  it("invia tracking e aggiorna la pagina", async () => {
    const user = userEvent.setup();

    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            status: "shipped",
            carrier: "TNT",
            trackingCode: "TRACK123",
            trackingUrl: "https://example.com/track/TRACK123",
            shippedAt: "2026-09-09T08:00:00.000Z",
          }),
          {
            status: 200,
            headers: {
              "content-type": "application/json",
            },
          },
        ),
      );

    render(
      <AdminOrderShippingForm
        orderId="11111111-1111-4111-8111-111111111111"
      />,
    );

    await user.clear(screen.getByLabelText("Corriere"));
    await user.type(screen.getByLabelText("Corriere"), "TNT");

    await user.type(
      screen.getByLabelText("Codice tracking"),
      "TRACK123",
    );

    await user.type(
      screen.getByLabelText("Link tracking"),
      "https://example.com/track/TRACK123",
    );

    await user.click(
      screen.getByRole("button", { name: "Conferma spedizione" }),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/admin/orders/shipping",
      expect.objectContaining({
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify({
          orderId: "11111111-1111-4111-8111-111111111111",
          carrier: "TNT",
          trackingCode: "TRACK123",
          trackingUrl: "https://example.com/track/TRACK123",
        }),
      }),
    );

    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("mostra l'errore restituito dall'API", async () => {
    const user = userEvent.setup();

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          message: "Gestisci prima la richiesta di annullamento.",
        }),
        {
          status: 409,
          headers: {
            "content-type": "application/json",
          },
        },
      ),
    );

    render(
      <AdminOrderShippingForm
        orderId="11111111-1111-4111-8111-111111111111"
      />,
    );

    await user.type(
      screen.getByLabelText("Codice tracking"),
      "TRACK123",
    );

    await user.type(
      screen.getByLabelText("Link tracking"),
      "https://example.com/track/TRACK123",
    );

    await user.click(
      screen.getByRole("button", { name: "Conferma spedizione" }),
    );

    expect(
      await screen.findByText(
        "Gestisci prima la richiesta di annullamento.",
      ),
    ).toBeVisible();

    expect(refresh).not.toHaveBeenCalled();
  });

  it("disabilita tutto quando il form è bloccato", () => {
    render(
      <AdminOrderShippingForm
        orderId="11111111-1111-4111-8111-111111111111"
        disabled
      />,
    );

    expect(screen.getByLabelText("Corriere")).toBeDisabled();
    expect(screen.getByLabelText("Codice tracking")).toBeDisabled();
    expect(screen.getByLabelText("Link tracking")).toBeDisabled();

    expect(
      screen.getByRole("button", { name: "Conferma spedizione" }),
    ).toBeDisabled();
  });
});
