import { expect, test } from "@playwright/test";

test("age gate, persistenza, tastiera e viewport mobile", async ({
  context,
  page,
}) => {
  await context.clearCookies();
  await page.goto("/");

  const dialog = page.getByRole("dialog", {
    name: /Per accedere a La Botola e Mietto/i,
  });
  const confirmButton = page.getByRole("button", {
    name: "Sì, ho almeno 18 anni",
  });
  const exitButton = page.getByRole("button", { name: "No, esci dal sito" });

  await expect(dialog).toBeVisible();
  await expect(confirmButton).toBeFocused();
  await expect(page.locator("#site-shell")).toHaveAttribute("inert", "");

  await page.keyboard.press("Tab");
  await expect(exitButton).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeVisible();

  await confirmButton.click();
  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("heading", { name: /Curatela, carattere/i }),
  ).toBeVisible();

  await page.reload();
  await expect(dialog).toBeHidden();

  await page.setViewportSize({ width: 375, height: 812 });
  await page.reload();
  await expect(page.getByRole("banner")).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  await page.emulateMedia({ reducedMotion: "reduce" });
  const reveal = page.locator("[data-reveal]").first();
  await expect(reveal).toBeVisible();

  const reducedMotionStyles = await reveal.evaluate((element) => {
    const styles = window.getComputedStyle(element);

    return {
      opacity: styles.opacity,
      transform: styles.transform,
      transitionDuration: styles.transitionDuration,
    };
  });

  expect(reducedMotionStyles).toMatchObject({
    opacity: "1",
    transform: "none",
    transitionDuration: "0.001s",
  });
});
