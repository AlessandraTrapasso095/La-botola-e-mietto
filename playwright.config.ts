import { defineConfig, devices } from "@playwright/test";

const e2eAuthService =
  process.env.AUTH_SERVICE === "supabase" ? "supabase" : "demo";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `AUTH_SERVICE=${e2eAuthService} npm run dev -- --webpack --hostname 127.0.0.1`,
    url: "http://127.0.0.1:3000/favicon.ico",
    reuseExistingServer: false,
    timeout: 300_000,
  },
});
