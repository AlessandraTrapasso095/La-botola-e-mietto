import { expect, test, type Page } from "@playwright/test";

test.describe.configure({ mode: "serial" });

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
  const cookieChoiceVisible = await cookieChoice
    .waitFor({ state: "visible", timeout: 5_000 })
    .then(() => true)
    .catch(() => false);
  if (cookieChoiceVisible) await cookieChoice.click();
  await expect(
    page.getByRole("heading", {
      name: "Ogni bottiglia racconta una storia rara.",
      level: 1,
    }),
  ).toBeVisible({ timeout: 120_000 });
}

test("le offerte reali sono navigabili da header, pagina e prodotto", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await enterSite(page);

  const offerNavigation = page
    .getByRole("navigation", { name: "Navigazione principale" })
    .getByRole("link", { name: "In offerta", exact: true });
  await expect(offerNavigation).toHaveAttribute("href", "/in-offerta");
  await offerNavigation.click();

  await expect(page).toHaveURL(/\/in-offerta$/, { timeout: 120_000 });
  await expect(
    page.getByRole("heading", { name: "In offerta", level: 1 }),
  ).toBeVisible();
  await expect(page.getByText("50 bottiglie")).toBeVisible();

  const visibleCards = page.locator("article.product-card");
  await expect(visibleCards).toHaveCount(12);
  for (const card of await visibleCards.all()) {
    await expect(card.getByText("In offerta", { exact: true })).toBeVisible();
    await expect(card.locator("del")).toHaveCount(0);
  }

  const firstOfferLink = visibleCards
    .first()
    .locator('a[href^="/prodotto/"]')
    .first();
  const productHref = await firstOfferLink.getAttribute("href");
  expect(productHref).toMatch(/^\/prodotto\//);
  await firstOfferLink.click();
  await expect(page).toHaveURL(new RegExp(`${productHref}$`), {
    timeout: 60_000,
  });
  await expect(
    page.getByText("In offerta", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.locator("main del")).toHaveCount(0);

  await page.getByRole("button", { name: "Aggiungi al carrello" }).click();
  const cartDrawer = page.getByRole("dialog", { name: "Il tuo carrello" });
  await expect(cartDrawer).toBeVisible();
  await expect(
    cartDrawer.getByText("In offerta", { exact: true }),
  ).toBeVisible();
  await expect(cartDrawer.locator("del")).toHaveCount(0);
});

test("filtro e ricerca restituiscono soltanto prodotti in offerta", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await enterSite(page);
  await page.goto("/catalogo");

  await page.getByLabel("In offerta", { exact: true }).check();
  await expect(page).toHaveURL(/\/catalogo\?offer=1$/, {
    timeout: 60_000,
  });
  await expect(page.getByText("50 bottiglie")).toBeVisible({
    timeout: 60_000,
  });
  const filteredCards = page.locator("article.product-card");
  await expect(filteredCards).toHaveCount(12);
  for (const card of await filteredCards.all()) {
    await expect(card.getByText("In offerta", { exact: true })).toBeVisible();
  }

  await page.getByRole("button", { name: "Cerca nel catalogo" }).click();
  const searchDialog = page.getByRole("dialog", {
    name: "Cerca nella selezione",
  });
  await searchDialog.getByRole("searchbox").fill("In offerta");
  await expect(
    searchDialog.getByText("In offerta", { exact: true }).first(),
  ).toBeVisible({ timeout: 30_000 });
  await searchDialog.getByRole("searchbox").press("Enter");

  await expect(page).toHaveURL(/\/cerca\?q=In(?:%20|\+)offerta$/, {
    timeout: 60_000,
  });
  await expect(page.locator("article.product-card").first()).toBeVisible();
  await expect(
    page.locator("article.product-card").first().getByText("In offerta"),
  ).toBeVisible();
});

test("il menu mobile espone la pagina offerte", async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await enterSite(page);

  await page.getByRole("button", { name: "Apri menu" }).click();
  const mobileMenu = page.getByRole("dialog", { name: "Menu principale" });
  const offerNavigation = mobileMenu.getByRole("link", {
    name: "In offerta",
    exact: true,
  });
  await expect(offerNavigation).toHaveAttribute("href", "/in-offerta");
  await offerNavigation.click();

  await expect(page).toHaveURL(/\/in-offerta$/, { timeout: 60_000 });
  await expect(
    page.getByRole("heading", { name: "In offerta", level: 1 }),
  ).toBeVisible();
});
