import { expect, test } from "@playwright/test";

const viewports = [
  { width: 375, height: 812, columns: 2 },
  { width: 390, height: 844, columns: 2 },
  { width: 430, height: 932, columns: 2 },
  { width: 768, height: 1024, columns: 3 },
  { width: 1024, height: 768, columns: 4 },
  { width: 1440, height: 1000, columns: 4 },
] as const;

test("i nomi dei marchi restano dentro le rispettive celle", async ({
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

  const brandGrid = page.locator("[data-featured-brand-grid]");
  const brandCells = brandGrid.locator("[data-featured-brand-cell]");
  await expect(brandCells).toHaveCount(8);

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await brandGrid.scrollIntoViewIfNeeded();
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );

    const renderedColumns = await brandGrid.evaluate(
      (element) =>
        getComputedStyle(element).gridTemplateColumns.split(" ").filter(Boolean)
          .length,
    );
    expect(renderedColumns).toBe(viewport.columns);

    for (let index = 0; index < (await brandCells.count()); index += 1) {
      const brandCell = brandCells.nth(index);
      const brandName = brandCell.locator("[data-featured-brand-name]");
      const cellBox = await brandCell.boundingBox();
      const nameBox = await brandName.boundingBox();

      expect(cellBox).not.toBeNull();
      expect(nameBox).not.toBeNull();
      if (!cellBox || !nameBox) continue;

      const tolerance = 0.5;
      expect(nameBox.x).toBeGreaterThanOrEqual(cellBox.x - tolerance);
      expect(nameBox.y).toBeGreaterThanOrEqual(cellBox.y - tolerance);
      expect(nameBox.x + nameBox.width).toBeLessThanOrEqual(
        cellBox.x + cellBox.width + tolerance,
      );
      expect(nameBox.y + nameBox.height).toBeLessThanOrEqual(
        cellBox.y + cellBox.height + tolerance,
      );

      const visibleLineCount = await brandName.evaluate((element) => {
        const styles = getComputedStyle(element);
        const lineHeight = Number.parseFloat(styles.lineHeight);

        return Math.round(element.getBoundingClientRect().height / lineHeight);
      });
      expect(visibleLineCount).toBeLessThanOrEqual(2);
    }

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  }
});
