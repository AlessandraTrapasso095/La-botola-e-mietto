import { expect, test, type Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

import { getLocalSupabaseEnvironment } from "@/server/catalog-import/local-supabase";
import type { Database } from "@/types/database.generated";

const enabled =
  process.env.AUTH_SERVICE === "supabase" &&
  process.env.CATALOG_REPOSITORY === "supabase";
const email = `phase2-wishlist-e2e-${Date.now()}@example.test`;
const password = "LocalWishlist42!Secure";
const environment = enabled ? getLocalSupabaseEnvironment() : null;
const admin = environment
  ? createClient<Database>(environment.API_URL, environment.SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null;

test.describe.configure({ mode: "serial" });
test.beforeEach(() => {
  test.skip(
    !enabled,
    "Richiede AUTH_SERVICE=supabase, CATALOG_REPOSITORY=supabase e Supabase locale.",
  );
});

async function deleteTechnicalUser() {
  if (!admin) return;
  const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  for (const user of data.users.filter(
    (candidate) => candidate.email === email,
  )) {
    await admin.auth.admin.deleteUser(user.id);
  }
}

async function enterSite(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 120_000 });
  const ageGate = page.getByRole("button", {
    name: "Sì, ho almeno 18 anni",
  });
  const ageGateVisible = await ageGate
    .waitFor({ state: "visible", timeout: 15_000 })
    .then(() => true)
    .catch(() => false);
  if (ageGateVisible) await ageGate.click();
  const cookieChoice = page.getByRole("button", {
    name: "Rifiuta non necessari",
  });
  if (await cookieChoice.isVisible()) await cookieChoice.click();
}

async function login(page: Page) {
  await page.goto("/accedi");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Accedi" }).click();
  await expect(page).toHaveURL(/\/account$/, { timeout: 30_000 });
}

test.beforeAll(async () => {
  if (!enabled || !admin) return;
  await deleteTechnicalUser();
  const created = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name: "Livia", last_name: "Conti" },
  });
  expect(created.error).toBeNull();
});

test.afterAll(async () => {
  if (!enabled || !admin) return;
  await deleteTechnicalUser();
  const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  expect(data.users.some((candidate) => candidate.email === email)).toBe(false);
});

test("unisce, persiste e rimuove i preferiti tra sessione anonima e account", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await enterSite(page);

  await page.goto("/prodotto/caprisius");
  await page.getByRole("button", { name: "Aggiungi ai preferiti" }).click();
  await expect(
    page.getByRole("button", { name: "Nei preferiti" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Apri wishlist" }).locator("span"),
  ).toHaveText("1");

  await login(page);
  await page.goto("/preferiti");
  await expect(
    page.getByRole("heading", { name: "Caprisius", level: 3 }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const value = window.localStorage.getItem("lbm-demo-commerce");
        return value ? JSON.parse(value).wishlist : null;
      }),
    )
    .toEqual([]);

  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Caprisius", level: 3 }),
  ).toBeVisible();

  await page.goto("/prodotto/glen-grant-12yo-0-70-2-bicchieri");
  await page.getByRole("button", { name: "Aggiungi ai preferiti" }).click();
  await expect(
    page.getByRole("button", { name: "Apri wishlist" }).locator("span"),
  ).toHaveText("2");

  await page.goto("/account/impostazioni");
  await page.getByRole("button", { name: "Esci dall’account" }).click();
  await login(page);
  await page.goto("/account/preferiti");
  await expect(page.locator("article.product-card")).toHaveCount(2);

  await page
    .getByRole("button", { name: "Rimuovi Caprisius dai preferiti" })
    .click();
  await expect(page.locator("article.product-card")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Apri wishlist" }).locator("span"),
  ).toHaveText("1");
  await page.reload();
  await expect(page.locator("article.product-card")).toHaveCount(1);
  await expect(
    page.getByRole("heading", {
      name: "Glen Grant 12YO 0.70 +2 Bicchieri",
      level: 3,
    }),
  ).toBeVisible();
});
