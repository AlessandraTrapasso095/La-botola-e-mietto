import { expect, test } from "@playwright/test";

test("marchio canonico e scheda prodotto funzionano anche su mobile", async ({
  context,
  page,
}) => {
  test.setTimeout(120_000);
  await context.clearCookies();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/marchio/the-glen-grant", {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });

  await page.getByRole("button", { name: "Sì, ho almeno 18 anni" }).click();

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
  if (await cookieChoice.isVisible()) await cookieChoice.click();

  await expect(
    page.getByRole("heading", { name: "The Glen Grant", level: 1 }),
  ).toBeVisible();
  await expect(page.locator("article.product-card")).toHaveCount(4);

  await page
    .getByRole("link", {
      name: "Scopri Scotch Whisky Glen Grant 12YO +2 Bicchieri – Set Regalo – 700 ml + 2 bicchieri",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(
    /\/prodotto\/scotch-whisky-glen-grant-12yo-2-bicchieri-set-regalo-700-ml-2-bicchieri-ab1170$/,
    { timeout: 120_000 },
  );
  await expect(
    page
      .getByRole("navigation", { name: "Breadcrumb" })
      .getByRole("link", { name: "The Glen Grant", exact: true }),
  ).toHaveAttribute("href", "/marchio/the-glen-grant");
});

test("gli URL pubblicati delle varianti ortografiche confluiscono nel canonico", async ({
  page,
}) => {
  const response = await page.goto("/marchio/ballantine-s", {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });

  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/marchio\/ballantines$/);
});

test("il marchio generico The non è pubblico e le referenze restano separate", async ({
  page,
}) => {
  test.setTimeout(120_000);
  const invalidBrandResponse = await page.goto("/marchio/the", {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  expect(invalidBrandResponse?.status()).toBe(200);
  await expect(page).toHaveURL(/\/marchi$/);
  await page.getByRole("button", { name: "Sì, ho almeno 18 anni" }).click();

  const expectedBrands = [
    ["the-standard", "The Standard", "The Standard 1894"],
    ["the-botanicals", "The Botanical’s", "The Botanical's"],
    ["the-botanist", "The Botanist", "The Botanist Islay"],
  ] as const;

  for (const [slug, brandName, productName] of expectedBrands) {
    await page.goto(`/marchio/${slug}`, {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });
    await expect(
      page.getByRole("heading", { name: brandName, level: 1 }),
    ).toBeVisible({ timeout: 120_000 });
    await expect(
      page
        .locator("article.product-card")
        .filter({ hasText: productName })
        .first(),
    ).toBeVisible({ timeout: 120_000 });
  }
});
