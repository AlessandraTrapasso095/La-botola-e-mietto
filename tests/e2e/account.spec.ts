import { expect, test, type Page } from "@playwright/test";

import { accountAccessCredentials } from "@/features/account/auth-adapter";

test.describe.configure({ mode: "serial" });
test.beforeEach(() => {
  test.skip(
    process.env.AUTH_SERVICE === "supabase",
    "I flussi Supabase sono verificati nello scenario auth locale dedicato.",
  );
});

async function enterSite(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 120_000 });
  const ageConfirmation = page.getByRole("button", {
    name: "Sì, ho almeno 18 anni",
  });
  await expect(ageConfirmation).toBeVisible({ timeout: 120_000 });
  await ageConfirmation.click();
  const cookieChoice = page.getByRole("button", {
    name: "Rifiuta non necessari",
  });
  const visible = await cookieChoice
    .waitFor({ state: "visible", timeout: 5_000 })
    .then(() => true)
    .catch(() => false);
  if (visible) await cookieChoice.click();
}

async function signIn(page: Page) {
  await page.getByLabel("Email").fill(accountAccessCredentials.email);
  await page.getByLabel("Password").fill(accountAccessCredentials.password);
  await page.getByRole("button", { name: "Accedi" }).click();
  await expect(page).toHaveURL(/\/account$/, { timeout: 30_000 });
}

test("accesso da header, dashboard, sezioni account e logout", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await enterSite(page);

  await page.getByRole("button", { name: "Apri area personale" }).click();
  await expect(page).toHaveURL(/\/accedi$/, { timeout: 30_000 });
  await expect(
    page.getByRole("heading", { name: "La tua selezione, sempre con te." }),
  ).toBeVisible();

  await page.getByLabel("Email").fill("indirizzo-non-valido");
  await page.getByRole("button", { name: "Accedi" }).click();
  await expect(
    page.getByText("Inserisci un indirizzo email valido."),
  ).toBeVisible();

  await page.getByLabel("Email").fill("cliente@example.com");
  await page.getByLabel("Password").fill("Password18!");
  await page.getByRole("button", { name: "Accedi" }).click();
  await expect(
    page.getByText("Le credenziali inserite non sono corrette."),
  ).toBeVisible();

  await signIn(page);
  await expect(
    page.getByRole("heading", { name: "Ciao, Giulia." }),
  ).toBeVisible();

  await page.goto("/");
  await page.getByRole("button", { name: "Apri area personale" }).click();
  await expect(page).toHaveURL(/\/account$/, { timeout: 30_000 });

  const routes = [
    ["Ordini", "/account/ordini", "Ordini"],
    ["Offerte", "/account/offerte", "Offerte"],
    ["Preferiti", "/account/preferiti", "Crea la tua collezione personale."],
    ["Indirizzi", "/account/indirizzi", "Indirizzi"],
    ["Profilo", "/account/profilo", "Profilo"],
    ["Impostazioni", "/account/impostazioni", "Impostazioni"],
  ] as const;

  for (const [label, route, heading] of routes) {
    await page
      .getByRole("navigation", { name: "Navigazione account" })
      .getByRole("link", { name: label })
      .click();
    await expect(page).toHaveURL(new RegExp(`${route}$`), { timeout: 30_000 });
    await expect(
      page.getByRole("heading", { name: heading, exact: true }).first(),
    ).toBeVisible();
    if (route === "/account/offerte") {
      await expect(page.locator("article.product-card").first()).toBeVisible();
      await expect(
        page
          .locator("article.product-card")
          .first()
          .getByText("In offerta", { exact: true }),
      ).toBeVisible();
    }
  }

  await page.getByRole("button", { name: "Esci dall’account" }).click();
  await expect(page).toHaveURL(/\/accedi$/, { timeout: 30_000 });
});

test("registrazione, recupero password e accesso da menu mobile", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await enterSite(page);

  await page.goto("/account");
  await expect(page).toHaveURL(/\/accedi$/, { timeout: 30_000 });
  await page.goto("/");

  await page.getByRole("button", { name: "Apri menu" }).click();
  const mobileMenu = page.getByRole("dialog", { name: "Menu principale" });
  await mobileMenu.getByRole("button", { name: "Area personale" }).click();
  await expect(page).toHaveURL(/\/accedi$/, { timeout: 30_000 });

  await page.getByRole("link", { name: "Password dimenticata?" }).click();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(250);
  const resetEmail = page.getByLabel("Email");
  await resetEmail.fill("cliente@example.com");
  await expect(resetEmail).toHaveValue("cliente@example.com");
  await page.getByRole("button", { name: "Invia istruzioni" }).click();
  await expect(
    page.getByText(/riceverai le istruzioni per procedere/),
  ).toBeVisible({ timeout: 15_000 });

  await page.goto("/registrati", { waitUntil: "networkidle" });
  await page.waitForTimeout(250);
  await page.getByLabel("Nome", { exact: true }).fill("Livia");
  await page.getByLabel("Cognome").fill("Conti");
  await page.getByLabel("Email").fill("livia@example.com");
  await page.getByLabel("Password", { exact: true }).fill("Cantina18!");
  await page.getByLabel("Conferma password").fill("Cantina18!");
  await page.getByLabel(/Ho letto e accetto/).check();
  await page.getByLabel(/Confermo di avere almeno 18 anni/).check();
  await page.getByRole("button", { name: "Crea account" }).click();
  await expect(page).toHaveURL(/\/account$/, { timeout: 30_000 });
  await expect(
    page.getByRole("heading", { name: "Ciao, Livia." }),
  ).toBeVisible();

  const mobileAccountNavigation = page.locator("#account-mobile-navigation");
  await mobileAccountNavigation.selectOption("/account/ordini");
  await expect(page).toHaveURL(/\/account\/ordini$/, { timeout: 30_000 });
});
