import { expect, test } from "@playwright/test";

const viewports = [
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
] as const;

test("testo e CTA delle categorie non si intersecano", async ({
  context,
  page,
}) => {
  test.setTimeout(120_000);
  await context.clearCookies();
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await page.getByRole("button", { name: "Sì, ho almeno 18 anni" }).click();
  const rejectCookies = page.getByRole("button", {
    name: "Rifiuta non necessari",
  });
  if (await rejectCookies.isVisible()) await rejectCookies.click();

  const categoryCards = page.locator("#categorie a.image-hover");
  await expect(categoryCards).toHaveCount(6);

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await categoryCards.first().scrollIntoViewIfNeeded();
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );

    for (let index = 0; index < (await categoryCards.count()); index += 1) {
      const categoryCard = categoryCards.nth(index);
      const cardBox = await categoryCard.boundingBox();
      const textBox = await categoryCard
        .locator("[data-category-card-text]")
        .boundingBox();
      const ctaBox = await categoryCard
        .locator("[data-category-card-cta]")
        .boundingBox();

      expect(cardBox).not.toBeNull();
      expect(textBox).not.toBeNull();
      expect(ctaBox).not.toBeNull();
      if (!cardBox || !textBox || !ctaBox) continue;

      const horizontalIntersection =
        textBox.x < ctaBox.x + ctaBox.width &&
        textBox.x + textBox.width > ctaBox.x;
      const verticalIntersection =
        textBox.y < ctaBox.y + ctaBox.height &&
        textBox.y + textBox.height > ctaBox.y;

      expect(horizontalIntersection && verticalIntersection).toBe(false);
      expect(Math.round(ctaBox.width)).toBeGreaterThanOrEqual(44);
      expect(Math.round(ctaBox.height)).toBeGreaterThanOrEqual(44);
      expect(ctaBox.x).toBeGreaterThanOrEqual(cardBox.x);
      expect(ctaBox.x + ctaBox.width).toBeLessThanOrEqual(
        cardBox.x + cardBox.width,
      );
      if (viewport.width < 768) {
        expect(textBox.width).toBeGreaterThanOrEqual(200);
      }
    }

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  }
});
