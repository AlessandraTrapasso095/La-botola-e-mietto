import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AccountProvider } from "@/features/account/account-provider";
import { LoginForm } from "@/features/account/login-form";
import { PasswordResetForm } from "@/features/account/password-reset-form";
import { RegisterForm } from "@/features/account/register-form";

const push = vi.fn();
const replace = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh, replace }),
}));

function renderAccountForm(form: React.ReactNode) {
  return render(<AccountProvider>{form}</AccountProvider>);
}

describe("account forms", () => {
  beforeEach(() => {
    push.mockReset();
    refresh.mockReset();
    replace.mockReset();
  });

  it("valida i campi di accesso", async () => {
    renderAccountForm(<LoginForm />);
    await userEvent.click(screen.getByRole("button", { name: "Accedi" }));

    expect(
      await screen.findByText("Inserisci un indirizzo email valido."),
    ).toBeVisible();
    expect(
      screen.getByText("Inserisci una password di almeno 8 caratteri."),
    ).toBeVisible();
  });

  it("mantiene visibili e separati i consensi di registrazione", async () => {
    renderAccountForm(<RegisterForm />);

    expect(
      screen.getByLabelText(/Ho letto e accetto la privacy policy/),
    ).toBeVisible();
    expect(screen.getByLabelText(/Desidero ricevere novità/)).toBeVisible();
    expect(
      screen.getByLabelText(/Confermo di avere almeno 18 anni/),
    ).toBeVisible();

    await userEvent.click(screen.getByRole("button", { name: "Crea account" }));
    expect(
      await screen.findByText("Accetta l’informativa privacy per continuare."),
    ).toBeVisible();
    expect(screen.getByText("Conferma di avere almeno 18 anni.")).toBeVisible();
  });

  it("mostra e nasconde la password", async () => {
    renderAccountForm(<LoginForm />);
    const password = screen.getByLabelText("Password");
    expect(password).toHaveAttribute("type", "password");
    await userEvent.click(screen.getByRole("button", { name: "Mostra" }));
    expect(password).toHaveAttribute("type", "text");
  });

  it("valida l’email per il recupero password", async () => {
    renderAccountForm(<PasswordResetForm />);
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "indirizzo-non-valido" },
    });
    await userEvent.click(
      screen.getByRole("button", { name: "Invia istruzioni" }),
    );

    expect(
      await screen.findByText("Inserisci un indirizzo email valido."),
    ).toBeVisible();
  });

  it("completa la richiesta di recupero", async () => {
    renderAccountForm(<PasswordResetForm />);
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "cliente@example.com" },
    });
    await userEvent.click(
      screen.getByRole("button", { name: "Invia istruzioni" }),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(/riceverai le istruzioni per procedere/),
        ).toBeVisible(),
      { timeout: 2_000 },
    );
  });
});
