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
}

async function openSearch(page: Page) {
  await page.getByRole("button", { name: "Cerca nel catalogo" }).click();
  const dialog = page.getByRole("dialog", { name: "Cerca nella selezione" });
  await expect(dialog).toBeVisible({ timeout: 30_000 });
  return dialog;
}

test("il mega menu mostra soltanto collezioni verificate e non vuote", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await enterSite(page);

  await page.getByRole("button", { name: "Catalogo", exact: true }).click();
  const megaMenu = page.locator("#catalog-mega-menu");
  await expect(megaMenu).toBeVisible();
  const collectionSection = megaMenu
    .getByText("Collezioni", { exact: true })
    .locator("..");

  const expectedCollections = [
    ["Etichette di Pregio", "/collezione/etichette-di-pregio"],
    ["Confezioni Regalo", "/collezione/confezioni-regalo"],
    ["Nuovi Arrivi", "/collezione/nuovi-arrivi"],
  ] as const;

  for (const [label, href] of expectedCollections) {
    await expect(
      collectionSection.getByRole("link", { name: label }),
    ).toHaveAttribute("href", href);
  }
  await expect(
    collectionSection.getByRole("link", { name: "Bottiglie Rare" }),
  ).toHaveCount(0);
  await expect(
    collectionSection.getByRole("link", { name: "Distillati Rari" }),
  ).toHaveCount(0);
  await expect(
    collectionSection.getByRole("link", { name: "Edizioni da Collezione" }),
  ).toHaveCount(0);

  for (const [label, href] of expectedCollections) {
    await page.goto(href);
    await expect(
      page.getByRole("heading", { name: label, level: 1 }),
    ).toBeVisible();
    await expect(page.locator("article.product-card").first()).toBeVisible();
  }

  await page.goto("/collezione/etichette-di-pregio");
  await expect(
    page.getByRole("link", { name: "Don Julio 1942", exact: true }),
  ).toBeVisible();
});

test("menu mobile e desktop condividono lo stesso mapping collezioni", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await enterSite(page);

  await page.getByRole("button", { name: "Apri menu" }).click();
  const mobileMenu = page.getByRole("dialog", { name: "Menu principale" });
  const collectionGroup = mobileMenu.locator("details").filter({
    has: page.locator("summary", { hasText: "Collezioni" }),
  });
  await collectionGroup.locator("summary").click();

  await expect(
    collectionGroup.getByRole("link", { name: "Etichette di Pregio" }),
  ).toHaveAttribute("href", "/collezione/etichette-di-pregio");
  await expect(
    collectionGroup.getByRole("link", { name: "Confezioni Regalo" }),
  ).toHaveAttribute("href", "/collezione/confezioni-regalo");
  await expect(
    collectionGroup.getByRole("link", { name: "Nuovi Arrivi" }),
  ).toHaveAttribute("href", "/collezione/nuovi-arrivi");
  await expect(collectionGroup.getByRole("link")).toHaveCount(3);
});

test("la ricerca globale usa Invio, submit, suggerimenti e query URL", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await enterSite(page);

  let searchDialog = await openSearch(page);
  await page.keyboard.press("Escape");
  await expect(searchDialog).toBeHidden();
  searchDialog = await openSearch(page);
  await searchDialog.getByRole("searchbox").fill("Absolut");
  await searchDialog.getByRole("searchbox").press("Enter");
  await expect(page).toHaveURL(/\/cerca\?q=Absolut$/, { timeout: 60_000 });
  await expect(
    page.getByRole("heading", { name: "Risultati per “Absolut”", level: 1 }),
  ).toBeVisible();
  await expect(page.locator("article.product-card").first()).toBeVisible();

  searchDialog = await openSearch(page);
  await searchDialog.getByRole("searchbox").fill("AB1319");
  await searchDialog.getByRole("button", { name: "Avvia ricerca" }).click();
  await expect(page).toHaveURL(/\/cerca\?q=AB1319$/, { timeout: 60_000 });
  await expect(
    page.getByRole("link", { name: "Don Julio 1942", exact: true }),
  ).toBeVisible();

  searchDialog = await openSearch(page);
  await searchDialog.getByRole("searchbox").fill("Don Julio 1942");
  await searchDialog
    .getByRole("link", { name: /Don Julio 1942/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/prodotto\/don-julio-1942$/, {
    timeout: 60_000,
  });

  searchDialog = await openSearch(page);
  await searchDialog.getByRole("searchbox").fill("termine impossibile 987654");
  await searchDialog.getByRole("searchbox").press("Enter");
  await expect(page).toHaveURL(/\/cerca\?q=termine(?:%20|\+)impossibile/, {
    timeout: 60_000,
  });
  await expect(
    page.getByRole("heading", {
      name: "Nessun risultato per “termine impossibile 987654”",
    }),
  ).toBeVisible();
});

test("la ricerca parte dal menu mobile", async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 375, height: 812 });
  await enterSite(page);

  await page.getByRole("button", { name: "Apri menu" }).click();
  const mobileMenu = page.getByRole("dialog", { name: "Menu principale" });
  await mobileMenu.getByRole("button", { name: "Cerca nel catalogo" }).click();

  const searchDialog = page.getByRole("dialog", {
    name: "Cerca nella selezione",
  });
  await expect(searchDialog).toBeVisible();
  await searchDialog.getByRole("searchbox").fill("Absolut");
  await searchDialog.getByRole("searchbox").press("Enter");

  await expect(page).toHaveURL(/\/cerca\?q=Absolut$/, { timeout: 60_000 });
  await expect(page.locator("article.product-card").first()).toBeVisible();
});
