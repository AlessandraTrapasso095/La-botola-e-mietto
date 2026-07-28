import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { AgeGate } from "@/features/age-gate/age-gate";

function renderAgeGate() {
  return render(
    <>
      <div id="site-shell">
        <button type="button">Azione pagina</button>
      </div>
      <AgeGate initiallyConfirmed={false} />
    </>,
  );
}

describe("AgeGate", () => {
  it("apre il dialog e porta il focus sulla conferma", async () => {
    renderAgeGate();

    const dialog = screen.getByRole("dialog", {
      name: /Per accedere a La Botola e Mietto/i,
    });
    const confirmButton = screen.getByRole("button", {
      name: "Sì, ho almeno 18 anni",
    });

    expect(dialog).toBeVisible();
    await waitFor(() => expect(confirmButton).toHaveFocus());
  });

  it("rende il background non interagibile e non si chiude con Escape", async () => {
    const user = userEvent.setup();
    renderAgeGate();

    const siteShell = document.getElementById("site-shell");
    expect(siteShell).toHaveAttribute("inert");
    expect(siteShell).toHaveAttribute("aria-hidden", "true");

    await user.keyboard("{Escape}");
    expect(
      screen.getByRole("dialog", {
        name: /Per accedere a La Botola e Mietto/i,
      }),
    ).toBeVisible();
  });

  it("persiste la conferma e riattiva la pagina", async () => {
    const user = userEvent.setup();
    renderAgeGate();

    await user.click(
      screen.getByRole("button", { name: "Sì, ho almeno 18 anni" }),
    );

    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", {
          name: /Per accedere a La Botola e Mietto/i,
        }),
      ).not.toBeInTheDocument(),
    );
    expect(document.getElementById("site-shell")).not.toHaveAttribute("inert");
    expect(document.cookie).toContain("lbm_age_confirmed=");
  });
});
