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
      name: "Scopri Glen Grant 12YO 0.70 +2 Bicchieri",
    })
    .click();
  await expect(page).toHaveURL(/\/prodotto\/glen-grant-12yo-0-70-2-bicchieri$/);
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
