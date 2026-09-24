import { expect, test } from "@playwright/test";

test("catalogo mobile, filtri, prodotto, carrello, wishlist e ricerca", async ({
  context,
  page,
}) => {
  test.setTimeout(120_000);
  const consoleProblems: string[] = [];
  page.on("console", (message) => {
    const messageType = message.type();
    const messageText = message.text();
    const isUnusedFontPreloadWarning =
      messageType === "warning" &&
      messageText.includes(
        "was preloaded using link preload but not used within a few seconds",
      );

    if (
      !isUnusedFontPreloadWarning &&
      (messageType === "error" || messageType === "warning")
    ) {
      consoleProblems.push(`${messageType}: ${messageText}`);
    }
  });
  page.on("pageerror", (error) => consoleProblems.push(error.message));

  await context.clearCookies();
  await page.addInitScript(() => {
    if (window.sessionStorage.getItem("lbm-e2e-started")) return;
    window.localStorage.clear();
    window.sessionStorage.setItem("lbm-e2e-started", "true");
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`/?catalog-e2e=${Date.now()}`);
  await page.waitForLoadState("networkidle");
  await page
    .getByRole("button", { name: "Sì, ho almeno 18 anni" })
    .click({ timeout: 60_000 });

  const promotionClose = page.getByRole("button", {
    name: "Chiudi promozione",
  });
  const promotionVisible = await promotionClose
    .waitFor({ state: "visible", timeout: 5_000 })
    .then(() => true)
    .catch(() => false);

  if (promotionVisible) {
    await promotionClose.click();
    await expect(promotionClose).toBeHidden();
  }

  const cookieChoice = page.getByRole("button", {
    name: "Rifiuta non necessari",
  });
  if (await cookieChoice.isVisible()) {
    await cookieChoice.click();
    await expect(cookieChoice).toBeHidden();
  }

  await page.getByRole("button", { name: "Apri carrello" }).click();
  const initialCart = page.getByRole("dialog", { name: "Il tuo carrello" });
  await expect(initialCart).toBeVisible();
  await expect(initialCart.getByText("Inizia la tua selezione")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(initialCart).toBeHidden();

  await page.goto("/catalogo");
  await expect(page).toHaveURL(/\/catalogo$/, { timeout: 60_000 });
  await expect(
    page.getByRole("heading", {
      name: "Bottiglie scelte per essere ricordate.",
    }),
  ).toBeVisible({ timeout: 60_000 });

  const filterTrigger = page.getByRole("button", { name: "Filtri" });
  await filterTrigger.click();
  const filtersDialog = page.getByRole("dialog", { name: "Filtri" });
  await expect(filtersDialog).toBeVisible();
  await filtersDialog
    .getByRole("searchbox", { name: "Cerca una marca" })
    .fill("Caprisius");
  await filtersDialog.getByLabel("Caprisius").check();
  const applyFilters = filtersDialog.getByRole("button", {
    name: "Applica filtri",
  });
  await applyFilters.focus();
  await page.keyboard.press("Enter");
  await expect(filtersDialog).toBeHidden();
  await expect(filterTrigger).toBeFocused();
  await expect(filterTrigger).toHaveAccessibleName("Filtri (1)");

  const caprisiusCard = page
    .locator("article.product-card")
    .filter({ hasText: "Caprisius – 700 ml – 43.0% vol." })
    .first();

  await expect(caprisiusCard).toBeVisible({ timeout: 60_000 });

  const caprisiusLink = caprisiusCard.getByRole("link", {
    name: "Scopri Caprisius – 700 ml – 43.0% vol.",
    exact: true,
  });

  const caprisiusHref = await caprisiusLink.getAttribute("href");

  expect(caprisiusHref).toMatch(/^\/prodotto\/caprisius-/);

  await caprisiusLink.click();

  await expect(page).toHaveURL(new RegExp(`${caprisiusHref}$`), {
    timeout: 60_000,
  });

  await expect(
    page.getByRole("heading", {
      name: "Caprisius – 700 ml – 43.0% vol.",
      level: 1,
    }),
  ).toBeVisible({ timeout: 60_000 });

  await page.getByRole("button", { name: "Aggiungi al carrello" }).click();
  const cartDrawer = page.getByRole("dialog", { name: "Il tuo carrello" });
  await expect(cartDrawer).toBeVisible();
  await expect(
    cartDrawer.getByText(/Aggiungi.+spedizione gratuita\./),
  ).toBeVisible();
  await cartDrawer.getByLabel("Quantità di Caprisius").selectOption("3");
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
  if (!caprisiusHref) {
    throw new Error("Href prodotto Caprisius non disponibile.");
  }

  const caprisiusSlug = caprisiusHref.replace("/prodotto/", "");

  await expect
    .poll(() =>
      page.evaluate((slug) => {
        const value = window.localStorage.getItem("lbm-demo-commerce");
        if (!value) return false;
        const parsed = JSON.parse(value) as { wishlist?: string[] };
        return parsed.wishlist?.includes(slug) ?? false;
      }, caprisiusSlug),
    )
    .toBe(true);

  await page.reload();
  await expect(
    page.getByRole("button", { name: "Nei preferiti" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Apri carrello" }).click();
  await expect(cartDrawer.getByLabel("Quantità di Caprisius")).toHaveValue("3");
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
    .fill("Caprisius");

  await expect(
    searchDialog.getByRole("link", {
      name: /Caprisius – 700 ml – 43\.0% vol\./,
    }),
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
