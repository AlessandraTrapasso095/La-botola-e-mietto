import { expect, test } from "@playwright/test";

test("catalogo mobile, filtri, prodotto, carrello, wishlist e ricerca", async ({
  context,
  page,
}) => {
  const consoleProblems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      consoleProblems.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => consoleProblems.push(error.message));

  await context.clearCookies();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "Sì, ho almeno 18 anni" }).click();

  const cookieChoice = page.getByRole("button", {
    name: "Rifiuta non necessari",
  });
  if (await cookieChoice.isVisible()) await cookieChoice.click();

  await page.getByRole("button", { name: "Apri carrello" }).click();
  const initialCart = page.getByRole("dialog", { name: "Il tuo carrello" });
  await expect(initialCart).toBeVisible();
  await initialCart
    .getByRole("button", {
      name: "Rimuovi The Macallan 12 Double Cask",
    })
    .click();
  await page.keyboard.press("Escape");
  await expect(initialCart).toBeHidden();

  await page
    .getByRole("link", { name: "Catalogo", exact: true })
    .last()
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Bottiglie scelte per essere ricordate.",
    }),
  ).toBeVisible();

  const filterTrigger = page.getByRole("button", { name: "Filtri" });
  await filterTrigger.click();
  const filtersDialog = page.getByRole("dialog", { name: "Filtri" });
  await expect(filtersDialog).toBeVisible();
  await filtersDialog.getByLabel("Caprisius").check();
  const applyFilters = filtersDialog.getByRole("button", {
    name: "Applica filtri",
  });
  await applyFilters.focus();
  await page.keyboard.press("Enter");
  await expect(filtersDialog).toBeHidden();
  await expect(filterTrigger).toBeFocused();
  await expect(filterTrigger).toHaveAccessibleName("Filtri (1)");

  await page.getByRole("link", { name: "Scopri Caprisius 43 Gin" }).click();
  await expect(
    page.getByRole("heading", { name: "Caprisius 43 Gin", level: 1 }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Aggiungi al carrello" }).click();
  const cartDrawer = page.getByRole("dialog", { name: "Il tuo carrello" });
  await expect(cartDrawer).toBeVisible();
  await expect(cartDrawer.getByText(/Aggiungi 21,08.*per/)).toBeVisible();
  await cartDrawer.getByLabel("Quantità di Caprisius 43 Gin").selectOption("2");
  await expect(
    cartDrawer.getByText("Hai ottenuto la spedizione gratuita in Italia."),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(cartDrawer).toBeHidden();

  await page
    .getByRole("button", {
      name: "Aggiungi ai preferiti",
    })
    .click();
  await expect(
    page.getByRole("button", { name: "Nei preferiti" }),
  ).toBeVisible();

  await page.reload();
  await expect(
    page.getByRole("button", { name: "Nei preferiti" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Apri carrello" }).click();
  await expect(
    cartDrawer.getByLabel("Quantità di Caprisius 43 Gin"),
  ).toHaveValue("2");
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Nei preferiti" }).click();
  await expect(
    page.getByRole("button", { name: "Aggiungi ai preferiti" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Cerca nel catalogo" }).click();
  const searchDialog = page.getByRole("dialog", {
    name: "Cerca nella selezione",
  });
  await expect(searchDialog).toBeVisible();
  await searchDialog
    .getByRole("searchbox", {
      name: "Cerca prodotti, marchi e categorie",
    })
    .fill("Yamazaki");
  await expect(
    searchDialog.getByRole("link", { name: /Yamazaki 18 Years Old/ }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(searchDialog).toBeHidden();

  const menuButton = page.getByRole("button", { name: "Apri menu" });
  await menuButton.click();
  const mobileMenu = page.getByRole("dialog", { name: "Menu principale" });
  await expect(mobileMenu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(mobileMenu).toBeHidden();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
  expect(consoleProblems).toEqual([]);
});

test("le route sconosciute restituiscono 404", async ({ page }) => {
  const response = await page.goto("/route-inesistente-milestone-1a");
  expect(response?.status()).toBe(404);
});
