import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminOrderStatusActions } from "@/features/admin/order-status-actions";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh,
  }),
}));

describe("AdminOrderStatusActions", () => {
  beforeEach(() => {
    refresh.mockReset();
    vi.restoreAllMocks();
  });

  it("propone Presa in carico per un ordine ricevuto", () => {
    render(
      <AdminOrderStatusActions
        orderId="11111111-1111-4111-8111-111111111111"
        status="received"
        paymentStatus="paid"
        cancellationRequestStatus={null}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Prendi in carico" }),
    ).toBeEnabled();
  });

  it("propone la spedizione per un ordine preso in carico e pagato", () => {
    render(
      <AdminOrderStatusActions
        orderId="11111111-1111-4111-8111-111111111111"
        status="preparing"
        paymentStatus="paid"
        cancellationRequestStatus={null}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Segna come spedito" }),
    ).toBeEnabled();
  });

  it("blocca la spedizione quando il pagamento non è acquisito", () => {
    render(
      <AdminOrderStatusActions
        orderId="11111111-1111-4111-8111-111111111111"
        status="preparing"
        paymentStatus="pending"
        cancellationRequestStatus={null}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Segna come spedito" }),
    ).toBeDisabled();

    expect(
      screen.getByText(
        "Prima di spedire è necessario registrare il pagamento.",
      ),
    ).toBeVisible();
  });

  it("blocca la spedizione con richiesta di annullamento pendente", () => {
    render(
      <AdminOrderStatusActions
        orderId="11111111-1111-4111-8111-111111111111"
        status="preparing"
        paymentStatus="paid"
        cancellationRequestStatus="pending"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Segna come spedito" }),
    ).toBeDisabled();

    expect(
      screen.getByText("Gestisci prima la richiesta di annullamento."),
    ).toBeVisible();
  });

  it("blocca la consegna con richiesta di annullamento pendente", () => {
    render(
      <AdminOrderStatusActions
        orderId="11111111-1111-4111-8111-111111111111"
        status="shipped"
        paymentStatus="paid"
        cancellationRequestStatus="pending"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Segna come consegnato" }),
    ).toBeDisabled();
  });

  it("non propone altre azioni per un ordine consegnato", () => {
    const { container } = render(
      <AdminOrderStatusActions
        orderId="11111111-1111-4111-8111-111111111111"
        status="delivered"
        paymentStatus="paid"
        cancellationRequestStatus={null}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("non propone altre azioni per un ordine annullato", () => {
    const { container } = render(
      <AdminOrderStatusActions
        orderId="11111111-1111-4111-8111-111111111111"
        status="cancelled"
        paymentStatus="refunded"
        cancellationRequestStatus="approved"
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("invia al server esclusivamente lo stato successivo previsto", async () => {
    const user = userEvent.setup();

    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ status: "preparing" }), {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      }),
    );

    render(
      <AdminOrderStatusActions
        orderId="11111111-1111-4111-8111-111111111111"
        status="received"
        paymentStatus="paid"
        cancellationRequestStatus={null}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Prendi in carico" }));

    await user.click(screen.getByRole("button", { name: "Conferma" }));

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/admin/orders/status",
      expect.objectContaining({
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify({
          orderId: "11111111-1111-4111-8111-111111111111",
          nextStatus: "preparing",
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
          message: "Transizione non consentita.",
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
      <AdminOrderStatusActions
        orderId="11111111-1111-4111-8111-111111111111"
        status="received"
        paymentStatus="paid"
        cancellationRequestStatus={null}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Prendi in carico" }));

    await user.click(screen.getByRole("button", { name: "Conferma" }));

    expect(
      await screen.findByText("Transizione non consentita."),
    ).toBeVisible();

    expect(refresh).not.toHaveBeenCalled();
  });
});
