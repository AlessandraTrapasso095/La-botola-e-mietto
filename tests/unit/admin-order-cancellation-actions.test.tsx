import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminOrderCancellationActions } from "@/features/admin/order-cancellation-actions";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh,
  }),
}));

describe("AdminOrderCancellationActions", () => {
  beforeEach(() => {
    refresh.mockReset();
    vi.restoreAllMocks();
  });

  it("mostra approvazione automatica per Stripe", () => {
    render(
      <AdminOrderCancellationActions
        orderId="11111111-1111-4111-8111-111111111111"
        paymentMethod="stripe"
        totalGrossAmountMinor={12_345}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Approva e rimborsa",
      }),
    ).toBeEnabled();

    expect(
      screen.queryByLabelText("Riferimento rimborso effettuato"),
    ).not.toBeInTheDocument();
  });

  it("richiede riferimento manuale per bonifico", () => {
    render(
      <AdminOrderCancellationActions
        orderId="11111111-1111-4111-8111-111111111111"
        paymentMethod="bank_transfer"
        totalGrossAmountMinor={12_345}
      />,
    );

    expect(
      screen.getByLabelText("Riferimento rimborso effettuato"),
    ).toBeVisible();

    expect(
      screen.getByRole("button", {
        name: "Conferma rimborso e annulla",
      }),
    ).toBeEnabled();
  });

  it("conferma esplicitamente prima del refund Stripe", async () => {
    const user = userEvent.setup();

    render(
      <AdminOrderCancellationActions
        orderId="11111111-1111-4111-8111-111111111111"
        paymentMethod="stripe"
        totalGrossAmountMinor={12_345}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Approva e rimborsa",
      }),
    );

    expect(screen.getByText("Confermare il rimborso Stripe?")).toBeVisible();

    expect(
      screen.getByRole("button", {
        name: "Sì, conferma",
      }),
    ).toBeVisible();
  });

  it("invia approvazione e aggiorna la pagina", async () => {
    const user = userEvent.setup();

    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          action: "approved",
          alreadyResolved: false,
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
      <AdminOrderCancellationActions
        orderId="11111111-1111-4111-8111-111111111111"
        paymentMethod="stripe"
        totalGrossAmountMinor={12_345}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Approva e rimborsa",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Sì, conferma",
      }),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/admin/orders/cancellation",
      expect.objectContaining({
        method: "POST",
        credentials: "same-origin",
      }),
    );

    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
