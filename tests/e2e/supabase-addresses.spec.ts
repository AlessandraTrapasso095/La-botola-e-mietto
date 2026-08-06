import { expect, test, type Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

import { getLocalSupabaseEnvironment } from "@/server/catalog-import/local-supabase";
import type { Database } from "@/types/database.generated";

const enabled = process.env.AUTH_SERVICE === "supabase";
const email = `phase2-address-e2e-${Date.now()}@example.test`;
const password = "LocalAddress42!Secure";
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
  test.skip(!enabled, "Richiede AUTH_SERVICE=supabase e Supabase locale.");
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
  const ageGate = page.getByRole("button", { name: "Sì, ho almeno 18 anni" });
  await ageGate.waitFor({ state: "visible" });
  await ageGate.click();
  const cookieChoice = page.getByRole("button", {
    name: "Rifiuta non necessari",
  });
  if (await cookieChoice.isVisible()) await cookieChoice.click();
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

test("crea, modifica e rimuove un indirizzo anche da mobile", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await enterSite(page);
  await page.goto("/accedi");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Accedi" }).click();
  await expect(page).toHaveURL(/\/account$/, { timeout: 30_000 });
  await page.goto("/account/indirizzi");
  await expect(page.getByText("Nessun indirizzo salvato")).toBeVisible();

  await page.getByRole("button", { name: "Aggiungi indirizzo" }).click();
  await page.getByLabel("Etichetta").fill("Casa");
  await page.getByLabel("Nome", { exact: true }).fill("Livia");
  await page.getByLabel("Cognome").fill("Conti");
  await page.getByLabel("Telefono").fill("+39 340 000 0000");
  await page.getByLabel("Indirizzo").fill("Via Roma");
  await page.getByLabel("Numero civico").fill("12/A");
  await page.getByLabel("CAP").fill("35100");
  await page.getByLabel("Città").fill("Padova");
  await page.getByLabel("Provincia").fill("pd");
  await page.getByLabel("Predefinito per la spedizione").check();
  await page.getByLabel("Predefinito per la fatturazione").check();
  await page.getByRole("button", { name: "Salva indirizzo" }).click();
  await expect(page.getByText("Indirizzo salvato.")).toBeVisible();
  await expect(page.getByText("Spedizione predefinita")).toBeVisible();
  await expect(page.getByText("Fatturazione predefinita")).toBeVisible();

  await page.reload();
  await expect(page.getByText("Via Roma 12/A")).toBeVisible();
  await page.getByRole("button", { name: "Modifica" }).click();
  await page.getByLabel("Città").fill("Abano Terme");
  await page.getByRole("button", { name: "Salva indirizzo" }).click();
  await expect(page.getByText(/35100 Abano Terme/)).toBeVisible();

  await page.getByRole("button", { name: "Elimina" }).click();
  await expect(
    page.getByRole("heading", { name: "Eliminare l’indirizzo?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Elimina indirizzo" }).click();
  await expect(page.getByText("Nessun indirizzo salvato")).toBeVisible();
});
