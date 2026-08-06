import { expect, test, type Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

import { getLocalSupabaseEnvironment } from "@/server/catalog-import/local-supabase";
import type { Database } from "@/types/database.generated";

const enabled = process.env.AUTH_SERVICE === "supabase";
const email = `phase2-e2e-${Date.now()}@example.test`;
const initialPassword = "LocalE2e42!Secure";
const updatedPassword = "UpdatedE2e42!Secure";
const environment = enabled ? getLocalSupabaseEnvironment() : null;
const admin = environment
  ? createClient<Database>(environment.API_URL, environment.SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null;

test.describe.configure({ mode: "serial" });
test.beforeEach(() => {
  test.skip(!enabled, "Richiede AUTH_SERVICE=supabase e Supabase locale.");
});

async function enterSite(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 120_000 });
  const ageConfirmation = page.getByRole("button", {
    name: "Sì, ho almeno 18 anni",
  });
  await ageConfirmation.waitFor({ state: "visible" });
  await ageConfirmation.click();
  const cookieChoice = page.getByRole("button", {
    name: "Rifiuta non necessari",
  });
  if (await cookieChoice.isVisible()) await cookieChoice.click();
}

async function deleteTechnicalUser() {
  if (!admin) return;
  const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  for (const user of data.users.filter(
    (candidate) => candidate.email === email,
  )) {
    await admin.auth.admin.deleteUser(user.id);
  }
}

async function waitForMailLink(subject: string) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const response = await fetch("http://127.0.0.1:54324/api/v1/messages");
    const payload = (await response.json()) as {
      messages?: Array<{
        ID: string;
        Subject: string;
        To?: Array<{ Address: string }>;
      }>;
    };
    const message = payload.messages?.find(
      (candidate) =>
        candidate.Subject === subject &&
        candidate.To?.some((recipient) => recipient.Address === email),
    );
    if (message) {
      const detailResponse = await fetch(
        `http://127.0.0.1:54324/api/v1/message/${message.ID}`,
      );
      const detail = (await detailResponse.json()) as { HTML?: string };
      const link = detail.HTML?.match(/href="([^"]+)"/)?.[1];
      if (link) return link.replaceAll("&amp;", "&");
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Email locale non ricevuta: ${subject}`);
}

test.beforeAll(async () => {
  if (!enabled) return;
  await deleteTechnicalUser();
});

test.afterAll(async () => {
  if (!enabled) return;
  await deleteTechnicalUser();
  const { data } = await admin!.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  expect(data.users.some((candidate) => candidate.email === email)).toBe(false);
});

test("registrazione, conferma email, sessione, profilo, consensi e recupero password", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await enterSite(page);

  await page.goto("/account/profilo");
  await expect(page).toHaveURL(/\/accedi\?ritorno=%2Faccount%2Fprofilo$/);

  await page.goto("/registrati");
  await page.getByLabel("Nome", { exact: true }).fill("Livia");
  await page.getByLabel("Cognome").fill("Conti");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(initialPassword);
  await page.getByLabel("Conferma password").fill(initialPassword);
  await page.getByLabel(/Ho letto e accetto/).check();
  await page.getByLabel(/Confermo di avere almeno 18 anni/).check();
  await page.getByRole("button", { name: "Crea account" }).click();
  await expect(
    page.getByText(
      "Controlla la tua email e conferma l’indirizzo per accedere.",
    ),
  ).toBeVisible();

  await page.goto(await waitForMailLink("Conferma la tua area personale"));
  await expect(page).toHaveURL(/\/account$/);
  await expect(
    page.getByRole("heading", { name: "Ciao, Livia." }),
  ).toBeVisible();
  await expect(page.getByText("LBM-260718")).toHaveCount(0);
  await expect(page.getByText("Via delle Vigne 18")).toHaveCount(0);

  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Ciao, Livia." }),
  ).toBeVisible();

  await page.goto("/account/profilo");
  await expect(page.getByLabel("Email")).toHaveAttribute("readonly", "");
  await page.getByLabel("Nome", { exact: true }).fill("Olivia");
  await page.getByLabel("Telefono").fill("+39 340 000 0000");
  await page.getByRole("button", { name: "Salva modifiche" }).click();
  await expect(page.getByText("Profilo aggiornato.")).toBeVisible();

  await page.goto("/account/impostazioni");
  await page
    .getByLabel("Desidero ricevere selezioni, novità e inviti.")
    .check();
  await page
    .getByLabel("Desidero ricevere aggiornamenti relativi alle mie richieste.")
    .uncheck();
  await page.getByRole("button", { name: "Salva preferenze" }).click();
  await expect(page.getByText("Preferenze aggiornate.")).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Cronologia consensi" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Esci dall’account" }).click();
  await expect(page).toHaveURL(/\/accedi$/);
  await page.waitForLoadState("networkidle");
  const loginEmail = page.getByLabel("Email");
  const loginPassword = page.getByLabel("Password");
  await loginEmail.fill(email);
  await loginPassword.fill("WrongPassword42!");
  await expect(loginEmail).toHaveValue(email);
  await expect(loginPassword).toHaveValue("WrongPassword42!");
  await page.getByRole("button", { name: "Accedi" }).click();
  await expect(
    page.getByText("Le credenziali inserite non sono corrette."),
  ).toBeVisible({ timeout: 15_000 });

  await page.goto("/password-dimenticata");
  await page.getByLabel("Email").fill(email);
  await page.getByRole("button", { name: "Invia istruzioni" }).click();
  await expect(page.getByText(/riceverai le istruzioni/)).toBeVisible();
  await page.goto(await waitForMailLink("Imposta una nuova password"));
  await expect(page).toHaveURL(/\/nuova-password$/);
  await page
    .getByLabel("Nuova password", { exact: true })
    .fill(updatedPassword);
  await page.getByLabel("Conferma nuova password").fill(updatedPassword);
  await page.getByRole("button", { name: "Aggiorna password" }).click();
  await expect(page).toHaveURL(/\/account$/);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Apri menu" }).click();
  await page
    .getByRole("dialog", { name: "Menu principale" })
    .getByRole("button", { name: "Area personale" })
    .click();
  await expect(page).toHaveURL(/\/account$/);

  await page.goto("/account/impostazioni");
  await page.getByRole("button", { name: "Esci dall’account" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(updatedPassword);
  await page.getByRole("button", { name: "Accedi" }).click();
  await expect(page).toHaveURL(/\/account$/, { timeout: 30_000 });
});
